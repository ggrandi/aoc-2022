const input = (await Deno.readTextFile(`./day8/input.txt`)).split("\n").map((l) =>
  l.split("").map(Number)
);

const inner = Array.from(input.slice(1, -1), (v) => v.slice(1, -1).map((_) => false));

const outer = 4 * (input.length - 1);

// from top
for (let j = 1; j < input[0].length - 1; j++) {
  let highest = input[0][j];
  for (let i = 1; i < input.length - 1; i++) {
    if (highest < input[i][j]) {
      inner[i - 1][j - 1] = true;
      highest = input[i][j];
    }
  }
}

// from bottom
for (let j = 1; j < input[0].length - 1; j++) {
  let highest = input[input.length - 1][j];
  for (let i = input.length - 2; i >= 1; i--) {
    if (highest < input[i][j]) {
      inner[i - 1][j - 1] = true;
      highest = input[i][j];
    }
  }
}

// from left
for (let i = 1; i < input.length - 1; i++) {
  let highest = input[i][0];
  for (let j = 1; j < input[0].length - 1; j++) {
    if (highest < input[i][j]) {
      inner[i - 1][j - 1] = true;
      highest = input[i][j];
    }
  }
}

// from right
for (let i = 1; i < input.length - 1; i++) {
  let highest = input[i][input[0].length - 1];
  for (let j = input.length - 2; j >= 1; j--) {
    if (highest < input[i][j]) {
      inner[i - 1][j - 1] = true;
      highest = input[i][j];
    }
  }
}

console.log(outer + inner.reduce((a, b) => a + b.reduce((c, d) => c + +(d), 0), 0));
