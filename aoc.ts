const [day] = Deno.args;

try {
  Deno.readDir(`./${day}`);
} catch {
  throw "cannot find the directory";
}
await Deno.run({ cmd: ["deno", "run", "--allow-all", `./${day}/1.ts`] }).status();
await Deno.run({ cmd: ["deno", "run", "--allow-all", `./${day}/2.ts`] }).status();
