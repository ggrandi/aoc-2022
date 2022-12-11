const input = (await Deno.readTextFile(`./day7/input.txt`)).split("\n");

const sizes = new Array<number>();
const finalSizes = new Array<number>();

for (let i = 0; i < input.length; i++) {
  if (input[i].startsWith("$ cd ")) {
    const dir = input[i].slice(5);
    if (dir === "..") {
      const size = sizes.pop();

      if (size === undefined) throw "no size";

      finalSizes.push(size);
      sizes[sizes.length - 1] += size;
    } else {
      sizes.push(0);
    }
  } else if (input[i].startsWith("$ ls")) {
    for (i += 1; i < input.length && !input[i]?.startsWith("$"); i++) {
			if (input[i].startsWith("dir")) {
				continue;
      }

      sizes[sizes.length - 1] += parseInt(input[i].split(" ")[0], 10);
    }

		i--;
  }
}

for (let next = sizes.pop(); next !== undefined; next = sizes.pop()) {
	sizes[sizes.length - 1] += next;
	finalSizes.push(next);
}

console.log(finalSizes.reduce((a,b) => a + (b < 100_000 ? b : 0), 0));