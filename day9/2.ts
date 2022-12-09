export {};

const input = (await Deno.readTextFile(`./day9/input.txt`)).split("\n").map((l) => {
  const [dir, u] = l.split(" ");

  return [dir as "R" | "L" | "U" | "D", Number(u)] as const;
});

class Vec2 {
  constructor(public x: number, public y: number) {}

  move(dir: typeof input[number][0]): this {
    switch (dir) {
      case "R":
        this.x += 1;
        break;
      case "L":
        this.x -= 1;
        break;
      case "D":
        this.y -= 1;
        break;
      case "U":
        this.y += 1;
        break;
    }

    return this;
  }

  add(x: number, y: number): this {
    this.x += x;
    this.y += y;

    return this;
  }

  diff({ x, y }: Vec2): Vec2 {
    return new Vec2(this.x - x, this.y - y);
  }

  toString(): `${number},${number}` {
    return `${this.x},${this.y}`;
  }
}

const solve = (bridgeLen: number) => {
  const bridge = Array.from({ length: bridgeLen }, () => new Vec2(0, 0));
  const positions = new Set<ReturnType<Vec2["toString"]>>();

  // console.log(bridge.map((v) => v.toString()).join("|"));
  for (const [dir, len] of input) {
    // console.log(`--- ${dir} ${len}`);
    for (let i = 0; i < len; i++) {
      // move head
      bridge[0].move(dir);

      for (let i = 1; i < bridgeLen; i++) {
        const next = bridge[i];

        const { x: dx, y: dy } = bridge[i - 1].diff(next);

        if (Math.abs(dx) >= 2 || Math.abs(dy) >= 2) {
          next.add(Math.sign(dx), Math.sign(dy));
        }
      }

      positions.add(bridge[bridgeLen - 1].toString());
      // console.log(bridge.map((v) => v.toString()).join("|"));
    }
  }

  return positions.size;
};

console.log("part1:", solve(2));
console.log("part2:", solve(10));
