export {};

const input = (await Deno.readTextFile(`./day9/input.txt`)).split("\n").map((l) => {
  const [dir, u] = l.split(" ");

  return [dir as "R" | "L" | "U" | "D", Number(u)] as const;
});

class Vec2 {
  constructor(public x: number, public y: number) {}

  move(dir: typeof input[number][0]) {
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
  }

  add(x: number, y: number): this {
    this.x += x;
    this.y += y;

    return this;
  }

  diff({ x, y }: Pick<Vec2, "x" | "y">): Vec2 {
    return new Vec2(this.x - x, this.y - y);
  }

	toString() {
		return `Vec2(${this.x},${this.y})`
	}
}

const head = new Vec2(0, 0);
const tail = new Vec2(0, 0);
const positions = new Set<string>();

for (const [dir, len] of input) {
  // console.log(">", { head, tail });
  for (let i = 0; i < len; i++) {
		// console.log("  ", { head, tail });
    head.move(dir);
    const { x: dx, y: dy } = head.diff(tail);

		if (Math.abs(dx) >= 2) {
			tail.add(dx - Math.sign(dx), dy)
		} else if (Math.abs(dy) >= 2) {
			tail.add(dx, dy - Math.sign(dy))
		}

		positions.add(tail.toString());
  }
}
console.log(positions.size);
