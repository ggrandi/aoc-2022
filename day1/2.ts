const input = (await Deno.readTextFile(`./day1/input.txt`)).split("\n\n").map((e) =>
  e.split("\n").reduce((a, c) => a + Number(c), 0)
);

console.log(input.slice().sort((a, b) => b - a).slice(0, 3).reduce((a, c) => a + c, 0));
