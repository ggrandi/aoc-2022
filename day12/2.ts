export {};

let end = undefined as [number, number] | undefined;

const input = (await Deno.readTextFile(`./day12/input.txt`)).split("\n").map((line, i) => {
  return line.split("").map((letter, j) => {
    if (letter === "S") {
      return 0;
    } else if (letter === "E") {
      end = [i, j];
      return 25;
    } else {
      return letter.charCodeAt(0) - 97;
    }
  });
});

if (end === undefined) {
  throw "missing start and end";
}

type Node = {
  i: number;
  j: number;
  cost: number;
  heuristic: number;
  prev: string;
};

end = end as [number, number];

function* adjacencies(i: number, j: number) {
  if (i > 0) {
    if (input[i][j] + 1 >= input[i - 1][j]) {
      yield [i - 1, j] as const;
    }
  }

  if (i + 1 < input.length) {
    if (input[i][j] + 1 >= input[i + 1][j]) {
      yield [i + 1, j] as const;
    }
  }

  if (j > 0) {
    if (input[i][j] + 1 >= input[i][j - 1]) {
      yield [i, j - 1] as const;
    }
  }

  if (j + 1 < input[i].length) {
    if (input[i][j] + 1 >= input[i][j + 1]) {
      yield [i, j + 1] as const;
    }
  }
}

function* shiftItems<T>(arr: T[]): Generator<T, void, undefined> {
  for (let next = arr.shift(); next !== undefined; next = arr.shift()) {
    yield next;
  }
}

const stringify = (i: number, j: number) => `${i},${j}` as const;
const calcHeuristic = (i: number, j: number, cost: number) =>
  (Math.abs(end![0] - i) + Math.abs(end![1] - j)) + cost;

const endString = stringify(...end!);

const pathFind = (...start: [number, number]): number => {
  const nextNodes = [stringify(...start)];
  const nodes = new Map<string, Node>([
    [stringify(...start), {
      i: start[0],
      j: start[1],
      cost: 0,
      prev: "",
      heuristic: calcHeuristic(...start, 0),
    }],
  ]);

  for (const nextNode of shiftItems(nextNodes)) {
    // console.log(nodes.size, nextNodes.length);
    const n = nodes.get(nextNode) ?? { prev: null };

    if (n.prev === null) {
      throw "";
    }

    for (const [i, j] of adjacencies(n.i, n.j)) {
      const next: Node = {
        i,
        j,
        cost: n.cost + 1,
        prev: nextNode,
        heuristic: calcHeuristic(i, j, n.cost + 1),
      };

      const nextName = stringify(i, j);

      if (nodes.has(nextName)) {
        if (nodes.get(nextName)!.heuristic < next.heuristic) {
          continue;
        }
      }

      const prevIndex = nextNodes.indexOf(stringify(i, j));

      if (prevIndex !== -1) {
        nextNodes.splice(prevIndex, 1);
      }

      const nextIndex = nextNodes.findIndex((v) => nodes.get(v)!.cost > next.cost);

      nextNodes.splice(nextIndex, 0, nextName);

      nodes.set(nextName, next);
    }

    if (n.i === end![0] && n.j === end![1]) {
      break;
    }
  }

  return nodes.get(endString)?.cost ?? Infinity;
};

console.log(Math.min(...input.map((row, i) => {
  return Math.min(...row.map((val, j) => {
    if (val === 0) {
      // console.log("checking", i, j);
      return pathFind(i, j);
    }

    return Infinity;
  }));
})));
