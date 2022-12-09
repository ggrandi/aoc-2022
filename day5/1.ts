import { enumerate } from "../utils.ts";

const [towers, instructions] = (await Deno.readTextFile(`./day5/input.txt`)).split("\n\n").map(
  (l) => l.split("\n"),
);

const towersArray = towers.map((l) => {
  const line = [];

  for (let i = 0; i < l.length; i += 4) {
    line.push(l.at(i + 1)!);
  }

  return line;
});

const towersMap = Object.fromEntries(
  towersArray[towers.length - 1].map((k) => [k as string, [] as string[]] as const),
);

for (let i = towersArray.length - 2; i >= 0; i--) {
  for (const [j, v] of enumerate(towersArray[i])) {
    if (v !== " ") {
      towersMap[towersArray[towers.length - 1][j]].push(v);
    }
  }
}

const r = /^move (\d+) from (\d+) to (\d+)$/;

const passes = instructions.map((i) => {
  const [n, f, t] = i.match(r)!.slice(1);

  return [Number(n), f, t] as const;
});

for (const [n, f, t] of passes) {
  for (let _ = 0; _ < n; _++) {
    towersMap[t].push(
      towersMap[f].pop() ?? (() => {
        throw "help";
      })(),
    );
  }
}


console.log(towersArray[towers.length - 1].map(a => towersMap[a].at(-1)).join(""));