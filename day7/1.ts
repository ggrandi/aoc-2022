const input = (await Deno.readTextFile(`./day7/input.txt`));

type Dir = {
  type: 0;
  parent?: Dir;
  size: number;
  name: string;
  children: (Dir | File)[];
};

type File = {
  type: 1;
  name: string;
  size: number;
};

const thro = (t: unknown) => {
  throw t;
};

const cdRegex = /^\$ cd ([^\s]+)\n\$ ls\n/m;
const lsRegex = /^(dir|[0-9]+) ([^\s]+)(\n)?/m;

let i = 0;

let root: Dir;

let curr: Partial<Dir> | undefined;

while (i < input.length) {
  if (input.slice(i).startsWith("$ cd ..\n")) {
    curr!.parent!.size += curr!.size!;

    curr = curr!.parent;

    i += 8;
    continue;
  }

  const CDAndLS = input.slice(i).match(cdRegex);

  if (CDAndLS) {
    const next: Dir = curr
      ? curr.children!.find((c): c is Dir => c.name === CDAndLS[1]) ?? thro("unexpected empty")
      : root = {
        type: 0,
        parent: curr as never,
        name: CDAndLS.at(1)!,
        children: [],
        size: 0,
      };

    i += CDAndLS[0].length;

    while (i < input.length) {
      const f = input.slice(i).match(lsRegex);

      if (!Array.isArray(f) || f?.index !== 0) {
        break;
      }

      if (f[1] === "dir") {
        next.children.push({
          type: 0,
          parent: next,
          name: f[2],
          children: [],
          size: 0,
        });
      } else {
        const size = parseInt(f[1], 10);

        next.size += size;

        next.children.push({
          type: 1,
          name: f[2],
          size,
        });
      }

      i += f[0].length;
    }

    curr = next;
  } else {
    thro("?xw");
  }
}

while ((curr?.parent) !== undefined) {
  curr!.parent!.size += curr!.size!;

  curr = curr!.parent;
}

const _logDir = (curr: Dir | File, indentLevel = 0) => {
  console.log(`${"  ".repeat(indentLevel)}- ${curr.name} (${curr.size})`);

  if (curr.type === 0) {
    for (const c of curr.children) {
      _logDir(c, indentLevel + 1);
    }
  }
};

root = root!;

// logDir(root);

const saveableSpace = (root: Dir, space = 0) => {
	
	for (const child of root.children) {
		if (child.type === 0) {
			space += saveableSpace(child);
		}
	}

	return space + (root.size <= 100_000 ? root.size : 0);
}

console.log(saveableSpace(root));