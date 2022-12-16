import { PriorityQueue } from "../priorityQueue.ts";

export {};

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

const calcHeuristic = (
  s: NonNullable<typeof states.front>,
  ticksUsed: number,
  additionalFlowRate: number,
) => s.pressure * 1_000 + 4 * additionalFlowRate - 9 * ticksUsed;

const states = new PriorityQueue((a, b) => b.heuristic - a.heuristic, {
  current: first,
  pressure: 0,
  heuristic: 0,
  path: [first],
  ticksRemaining: 30,
  openValves: new Set(),
});

// const finalPressures = new PriorityQueue<number>((a,b) => b-a);
let finalPressure = -Infinity;

for (const s of states) {
  const curr = valves.get(s.current)!;

  let added = false;

  for (const [n, t] of curr.connected) {
    const ticksUsed = t + 1;

    if (n === first || ticksUsed > s.ticksRemaining || s.openValves.has(n)) continue;

    added = true;

    const next = valves.get(n)!;

    const heuristic = calcHeuristic(s, ticksUsed, next.rate);

    const ticksRemaining = s.ticksRemaining - ticksUsed;

    const pressure = s.pressure + next.rate * ticksRemaining;

    const nextState = {
      current: n,
      pressure,
      heuristic,
      openValves: copyAndAdd(s.openValves, n),
      path: [...s.path, n],
      ticksRemaining,
    };

    states.enqueue(nextState);

    // console.log("===")
    // console.log(nextState, next)
  }

  if (!added) {
    if (s.pressure > finalPressure) {
      finalPressure = s.pressure;
    }
  }
}

console.log(finalPressure);
