import { PriorityQueue } from "../priorityQueue.ts";

export {};

let finalPressure = -Infinity;

// Deno.addSignalListener("SIGINT", () => {
//   console.log(finalPressure);

//   Deno.exit();
// });

const valves = new Map<string, { rate: number; connected: Map<string, number> }>();
const first = "AA";

const valveRegex =
  /Valve (?<name>\w+) has flow rate=(?<rate>\d+); tunnels? leads? to valves? (?<connected>(\w+(, )?)+)/;

(await Deno.readTextFile(`./day16/input.txt`)).split("\n").forEach((l) => {
  const { name, rate, connected } = l.match(valveRegex)?.groups as Record<
    "name" | "rate" | "connected",
    string
  >;

  valves.set(name, {
    rate: Number(rate),
    connected: new Map(connected.split(", ").map((c) => [c, 1] as const)),
  });
});

function* filter<T>(i: Iterable<T>, predicate: (v: T) => boolean) {
  for (const val of i) {
    if (predicate(val)) {
      yield val;
    }
  }
}

// console.log(
//   "strict graph {",
// );
// console.log(
//   "subgraph initial {\n  " +
//     Array.from(valves.entries()).map(([a, { rate, connected }]) =>
//       `${a}[label="${a}: ${rate}"]\n  ${
//         Array.from(connected.entries()).map(([b, d]) => `${a} -- ${b} [label="${d}"]`).join("\n  ")
//       }`
//     ).join(
//       "\n  ",
//     ) +
//     "\n}",
// );

reset:
do {
  for (const [n, v] of filter(valves, ([n]) => n !== first)) {
    if (v.rate === 0) {
      const cns = Array.from(v.connected.entries());

      for (const a of cns) {
        valves.get(a[0])!.connected.delete(n);

        for (const b of filter(cns, (n) => n !== a && !valves.get(a[0])?.connected.has(n[0]))) {
          valves.get(a[0])!.connected.set(b[0], a[1] + b[1]);
        }
      }

      valves.delete(n);

      continue reset;
    }
  }

  break;
} while (true);

const copyAndAdd = <T>(s: Set<T>, val: T) => {
  const n = new Set(s);

  n.add(val);

  return n;
};

// console.log(
//   "subgraph partial {\n  " +
//     Array.from(valves.entries()).map(([a, { rate, connected }]) =>
//       `${a}[label="${a}: ${rate}"]\n  ${
//         Array.from(connected.entries()).map(([b, d]) => `${a} -- ${b} [label="${d}"]`).join("\n  ")
//       }`
//     ).join(
//       "\n  ",
//     ) +
//     "\n}",
// );

for (const [a, aData] of valves) {
  for (
    const [b, bData] of filter(valves, ([n]) => n !== a && !aData.connected.has(n))
  ) {
    const p = new PriorityQueue(
      (a, b) => (b.visited.size - a.visited.size) + (b.distance - a.distance),
      {
        curr: a,
        distance: 0,
        visited: new Set<string>([a]),
      },
    );

    let lowest = Infinity;
    let i = 0;

    // search:
    for (const s of p) {
      // if (s.visited.size > 8) continue;

      for (const [c, d] of filter(valves.get(s.curr)!.connected, ([n]) => !s.visited.has(n))) {
        const distance = d + s.distance;

        if (c === b) {
          if (distance < lowest) {
            lowest = distance;
          }

          if (++i > 10_000) break;

          break;
        }

        const index = p.items.findIndex((v) => v.curr === c);

        if (index !== -1) {
          if (p.items[index].distance < distance) {
            continue;
          } else {
            p.items.splice(index, 1);
          }
        }

        p.enqueue({
          curr: c,
          distance,
          visited: copyAndAdd(s.visited, c),
        });
      }
    }

    aData.connected.set(b, lowest);
    bData.connected.set(a, lowest);
  }
}

// console.log(
//   "subgraph completed {\n  " +
//     Array.from(valves.entries()).map(([a, { rate, connected }]) =>
//       `${a}[label="${a}: ${rate}"]\n  ${
//         Array.from(connected.entries()).map(([b, d]) => `${a} -- ${b} [label="${d}"]`).join("\n  ")
//       }`
//     ).join(
//       "\n  ",
//     ) +
//     "\n}",
// );

// console.log("}");

// console.log(valves);
const states = new PriorityQueue(
  (a, b) =>
    1000 * (b.pressure - a.pressure) +
    (b.currentRate * (b.ticksRemaining + b.eticksRemaining) / 2 -
      a.currentRate * (a.ticksRemaining + a.eticksRemaining) / 2),
  {
    current: first,
    ticksRemaining: 26,
    ecurrent: first,
    eticksRemaining: 26,
    currentRate: 0,
    pressure: 0,
    openValves: new Array<string>(),
  },
);

// let checked = [] as string[][];

console.log(Date.now())


for (const s of states) {
  let added = false;

  if (s.ticksRemaining >= s.eticksRemaining) {
    const curr = valves.get(s.current)!;
    for (const [n, t] of curr.connected) {
      const ticksUsed = t + 1;

      if (n === first || ticksUsed > s.ticksRemaining || s.openValves.indexOf(n) !== -1) continue;

      added = true;

      const next = valves.get(n)!;

      const ticksRemaining = s.ticksRemaining - ticksUsed;

      const pressure = s.pressure + next.rate * ticksRemaining;

      states.enqueue({
        current: n,
        ecurrent: s.ecurrent,
        eticksRemaining: s.eticksRemaining,
        currentRate: s.currentRate + curr.rate,
        pressure,
        openValves: [...s.openValves, n],
        ticksRemaining,
      });
    }
  } else {
    const curr = valves.get(s.ecurrent)!;
    for (const [n, t] of curr.connected) {
      const ticksUsed = t + 1;

      if (n === first || ticksUsed > s.eticksRemaining || s.openValves.indexOf(n) !== -1) continue;

      added = true;

      const next = valves.get(n)!;

      const eticksRemaining = s.eticksRemaining - ticksUsed;

      const pressure = s.pressure + next.rate * eticksRemaining;

      states.enqueue({
        ecurrent: n,
        eticksRemaining,
        current: s.current,
        ticksRemaining: s.ticksRemaining,
        currentRate: s.currentRate + curr.rate,
        pressure,
        openValves: [...s.openValves, n],
      });
    }
  }

  if (!added) {
    if (s.pressure > finalPressure) {
      finalPressure = s.pressure;
    }

		console.log(states.size)
  }
}

console.log(finalPressure);
console.log(Date.now())
