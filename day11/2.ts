export {};
import { enumerate } from "../utils.ts";

const monkeyRegex =
  /Monkey \d+:\s+Starting items: (?<items>(\d+(, )?)+)\s+Operation: new = (?<op>[^\n]+)\s+Test: divisible by (?<div>\d+)\s+If true: throw to monkey (?<true>\d+)\s+If false: throw to monkey (?<false>\d+)/m;

const input = (await Deno.readTextFile(`./day11/input.txt`)).split("\n\n").map((l, i) => {
  const { items, op, div, ...m } = l.match(monkeyRegex)?.groups as Record<
    "items" | "op" | "div" | "true" | "false",
    string
  >;

  if (!m) throw `oops @ monkey ${i}`;

  return {
    items: items.split(", ").map(Number),
    op: new Function("old", `return ${op}`) as (old: number) => number,
    div: Number(div),
    true: Number(m.true),
    false: Number(m.false),
  };
});

const divisor = input.map(({ div }) => div).reduce((a, b) => a * b, 1);

function* shiftItems<T>(arr: T[]): Generator<T, void, undefined> {
  for (let next = arr.shift(); next !== undefined; next = arr.shift()) {
    yield next;
  }
}

const totals = Array.from(input, () => 0);

for (let round = 0; round < 10000; round++) {
  for (const [i, monkey] of enumerate(input)) {
    totals[i] += monkey.items.length;
    for (const item of shiftItems(monkey.items)) {
      const nextItem = monkey.op(item) % divisor;

			const nextMonkey = monkey[`${nextItem % monkey.div === 0}`]

			input[nextMonkey].items.push(nextItem);
    }
  }
}

console.log(totals.sort((a, b) => b - a).slice(0, 2).reduce((a, b) => a * b, 1));
