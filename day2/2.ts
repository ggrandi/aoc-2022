const input = (await Deno.readTextFile(`./input.txt`)).split("\n") as (keyof typeof matchups)[];

/**
 * r = 1
 * p = 2
 * s = 3
 */


const matchups = {
  "A X": 3 + 0,
  "A Y": 1 + 3,
  "A Z": 2 + 6,
  "B X": 1 + 0,
  "B Y": 2 + 3,
  "B Z": 3 + 6,
  "C X": 2 + 0,
  "C Y": 3 + 3,
  "C Z": 1 + 6,
};

console.log(input.map((l) => matchups[l] ?? 0).reduce((a, b) => a + b, 0));
