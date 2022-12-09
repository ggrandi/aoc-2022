const input = (await Deno.readTextFile(`./day8/input.txt`)).split("\n").map((l) =>
  l.split("").map(Number)
);

console.log(input.map(
  (k, i) =>
    k.map((h, j) => {
      let down = 0;
      for (let di = i + 1; di < input.length; di++) {
        down++;
        if (input[di][j] >= h) {
          break;
        }
      }

      let up = 0;
      for (let di = i - 1; di >= 0; di--) {
        up++;
        if (input[di][j] >= h) {
          break;
        }
      }

      let left = 0;
      for (let dj = j + 1; dj < input[0].length; dj++) {
        left++;
        if (input[i][dj] >= h) {
          break;
        }
      }

      let right = 0;
      for (let dj = j - 1; dj >= 0; dj--) {
        right++;
        if (input[i][dj] >= h) {
          break;
        }
      }

      return down*up*left*right;
    }),
).reduce((a,b) => Math.max(a, ...b), 0));
