const input = (await Deno.readTextFile(`./input.txt`)).split("\n") as (keyof typeof matchups)[];

const matchups = {
  "A X": 1 + 3,
  "A Y": 2 + 6,
  "A Z": 3 + 0,
  "B X": 1 + 0,
  "B Y": 2 + 3,
  "B Z": 3 + 6,
  "C X": 1 + 6,
  "C Y": 2 + 0,
  "C Z": 3 + 3,
};

console.log(input.map((l) => matchups[l]).reduce((a, b) => a + b, 0));
