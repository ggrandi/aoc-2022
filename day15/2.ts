export {};

const sensors = new Array<{ x: number; y: number; distance: number }>();

const sensorRegex =
  /Sensor at x=(?<sx>-?\d+), y=(?<sy>-?\d+): closest beacon is at x=(?<bx>-?\d+), y=(?<by>-?\d+)/;

function distance(x1: number, y1: number, x2: number, y2: number) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function* valuesOutside(s: typeof sensors[number], n = 1) {
  const distance = s.distance + n;

  yield [s.x, s.y - distance];
  yield [s.x, s.y + distance];

  for (let d = distance - 1; d > 0; d--) {
    yield [s.x - d, s.y - distance + d];
    yield [s.x + d, s.y - distance + d];
    yield [s.x - d, s.y + distance - d];
    yield [s.x + d, s.y + distance - d];
  }

  yield [s.x - distance, s.y];
  yield [s.x + distance, s.y];
}

(await Deno.readTextFile(`./day15/input.txt`)).split("\n").forEach((l) => {
  const [sx, sy, bx, by] = l.match(sensorRegex)?.slice(1).map(Number) as [
    sx: number,
    sy: number,
    bx: number,
    by: number,
  ];

  sensors.push({ x: sx, y: sy, distance: distance(sx, sy, bx, by) });
});

// console.log(Array.from(valuesOutside({ x: 0, y: 0, distance: 2 })));

const minX = 0;
const maxX = 4_000_000;
const minY = 0;
const maxY = 4_000_000;

search:
for (let i = 0; i < sensors.length; i++) {
  value:
  for (const [x, y] of valuesOutside(sensors[i])) {
    if (!(minX <= x && x <= maxX && minY <= y && y <= maxY)) continue;

    for (const sensor of sensors) {
      if (distance(sensor.x, sensor.y, x, y) <= sensor.distance) {
        continue value;
      }
    }

    console.log(x * 4_000_000 + y);

    break search;
  }
}
