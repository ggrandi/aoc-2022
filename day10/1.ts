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

let signalStrength = 0;

for (let tick = 1; tick <= 220; tick++) {
	if ([20, 60, 100, 140, 180, 220].indexOf(tick) !== -1) {
    const strength = tick * X;
    console.log(`---- ${tick}: strength: ${strength}, X: ${X}`);

    signalStrength += strength;
  }
  curr.ticksLeft--;

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
	
  console.log({ X, i, curr });
}

console.log(signalStrength);
