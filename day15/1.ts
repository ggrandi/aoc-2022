export {};

// Map<y, Map<x, distance>>
const sensors = new Map<number, Map<number, number>>();
// Map<y, Set<x>>
const beacons = new Map<number, Set<number>>();

const height = 2000000;

const sensorRegex =
  /Sensor at x=(?<sx>-?\d+), y=(?<sy>-?\d+): closest beacon is at x=(?<bx>-?\d+), y=(?<by>-?\d+)/;

(await Deno.readTextFile(`./day15/input.txt`)).split("\n").forEach((l) => {
  const [sx, sy, bx, by] = l.match(sensorRegex)?.slice(1).map(Number) as [
    sx: number,
    sy: number,
    bx: number,
    by: number,
  ];

  if (beacons.has(by)) {
    beacons.get(by)!.add(bx);
  } else {
    beacons.set(by, new Set([bx]));
  }

  const distance = Math.abs(bx - sx) + Math.abs(by - sy);

  if (sensors.has(sy)) {
    sensors.get(sy)!.set(sx, distance);
  } else {
    sensors.set(sy, new Map([[sx, distance]]));
  }
});

const invalidPositions = new Set<number>();

for (const [y, xMap] of sensors.entries()) {
  const yDistance = Math.abs(height - y);

  for (const [x, maxDistance] of xMap.entries()) {
    if (maxDistance < yDistance) {
      continue;
    }

    for (let dx = -(maxDistance - yDistance); dx <= (maxDistance - yDistance); dx++) {
      invalidPositions.add(x + dx);
    }
  }
}

console.log(invalidPositions.size - (beacons.get(height)?.size ?? 0));
