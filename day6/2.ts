const input = (await Deno.readTextFile(`./day6/input.txt`));

const len = 14;

const lastChars = input.slice(0, len).split("");

for (let i = len; i < input.length; i++) {
  if (Array.from(new Set(lastChars)).length === len) {
    console.log(i);
    break;
  } else {
    lastChars.shift();
    lastChars.push(input[i]);
  }
}
