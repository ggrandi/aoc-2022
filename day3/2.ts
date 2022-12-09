import { groupIn } from "../utils.ts";

const input = groupIn(
  (await Deno.readTextFile(`./day3/input.txt`)).split("\n").map(
    (i) => new Set(i.split("")),
  ),
  3,
);

const output: number[] = [];

const getPriority = (c: string) => c > "a" ? c.charCodeAt(0) - 96 : c.charCodeAt(0) - 38;

for (const [first, second, third] of input) {
  for (const val of first) {
    if (second.has(val) && third.has(val)) {
      output.push(getPriority(val));
    }
  }
}

console.log(output.reduce((a, b) => a + b, 0));
