import { splitArr } from "../utils.ts";

const input = splitArr((await Deno.readTextFile(`./day1/input.txt`)).split("\n").map(Number), (val) => isNaN(val))
  .map((elf) => elf.reduce((a, c) => a + c, 0));

console.log(Math.max(...input));

input.slice().sort((a, b) => b - a).slice(0, 3).reduce((a, c) => a + c, 0);