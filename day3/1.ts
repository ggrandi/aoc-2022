const input = (await Deno.readTextFile(`./day3/input.txt`)).split("\n").map(
  (i) => [new Set(i.slice(0, i.length / 2).split("")), new Set(i.slice(i.length / 2))],
);

const output: number[] = [];

const getPriority = (c: string) => c > "a" ? c.charCodeAt(0) - 96 : c.charCodeAt(0) - 38;

for (const [first, second] of input) {
  for (const val of first) {
    if (second.has(val)) {
      output.push(getPriority(val));
    }
  }
}

console.log(output.reduce((a, b) => a + b, 0));
