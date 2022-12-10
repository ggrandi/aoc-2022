export {};

const input = (await Deno.readTextFile(`./day10/input.txt`)).split("\n").map((l, i) => {
  const [opcode, operand] = l.split(" ") as [string, string?];

  if (opcode === "noop") {
    return { code: opcode as "noop", ticksLeft: 1 };
  } else if (opcode === "addx") {
    return { code: opcode as "addx", ticksLeft: 2, add: Number(operand) };
  } else {
    throw new Error(`Unrecognized opcode: ${opcode} @ ./day10/input.txt:${i + 1}`);
  }
});

// console.log(input);

let X = 1;
let curr = input[0];
let i = 0;

let screen = "\u2588" + "\u2580".repeat(82) + "\u2588\n\u2588 ";

for (let tick = 0; tick < 240; tick++) {
  curr.ticksLeft--;

  const next = X - 1 <= (tick % 40) && (tick % 40) <= X + 1 ? "\u2588\u2588" : "  ";

  if ((tick + 1) % 40 === 0 && tick !== 239) {
    screen += `${next} \u2588\n\u2588 `;
  } else {
    screen += next;
  }

  if (curr.ticksLeft === 0) {
    switch (curr.code) {
      case "noop":
        break;
      case "addx":
        X += curr.add;
        break;
      default:
        throw "oops";
    }

    curr = input[++i] || { code: "noop", ticksLeft: Infinity };
  }
}
screen += " \u2588\n\u2588" + "\u2584".repeat(82) + "\u2588";

console.log(screen);
