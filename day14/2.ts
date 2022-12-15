export {};

// Map<y-pos, Set<x-pos>>
const blocked = new Map<number, Set<number>>();
const isBlocked = (x: number, y: number) => y >= floor ? true : blocked.get(y)?.has(x) ?? false;
const setBlocked = (x: number, y: number) => {
  if (blocked.has(y)) {
    blocked.get(y)!.add(x);
  } else {
    blocked.set(y, new Set([x]));
  }
};

const pointsBetween = (a: [number, number], b: [number, number]) => {
  const points: [number, number][] = [];

  if (a[1] === b[1]) {
    const difference = b[0] - a[0];
    const dx = Math.sign(difference);

    for (let i = 0; i <= Math.abs(difference); i++) {
      points.push([a[0] + i * dx, a[1]]);
    }
  } else if (a[0] === b[0]) {
    const difference = b[1] - a[1];
    const dx = Math.sign(difference);

    for (let i = 0; i <= Math.abs(difference); i++) {
      points.push([a[0], a[1] + i * dx]);
    }
  }

  return points;
};

// const input =
(await Deno.readTextFile(`./day14/input.txt`)).split("\n").forEach((l) => {
  const line = l.split(" -> ").map((n) => n.split(",").map(Number) as [number, number]);

  for (let i = 1; i < line.length; i++) {
    pointsBetween(line[i - 1], line[i]).map((p) => setBlocked(...p));
  }
});

const lowestY = Math.max(...blocked.keys());

const floor = lowestY + 2;

for (let i = 0; true; i++) {
  let x = 500;
  let y = 0;

  while (true) {
    if (!isBlocked(x, y + 1)) {
      y += 1;
    } else if (!isBlocked(x - 1, y + 1)) {
      x -= 1;
      y += 1;
    } else if (!isBlocked(x + 1, y + 1)) {
      x += 1;
      y += 1;
    } else {
      break;
    }
  }

	setBlocked(x, y);

  if (x === 500 && y === 0) {
    console.log(i + 1);
    break;
  }
}

// console.log(Array.from(blocked.entries()).map(([k,v]) => [k, v.size]))