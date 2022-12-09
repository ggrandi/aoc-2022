const input = (await Deno.readTextFile(`./day4/input.txt`)).split("\n").map(
  (l) =>
    l.split(",").map((r) => r.split("-").map(Number) as [number, number]) as [
      [number, number],
      [number, number],
    ],
);

const matches = input.filter(([r1, r2]) => {
	return r2[0] <= r1[0] && r1[0] <= r2[1]
	    || r2[0] <= r1[1] && r1[1] <= r2[1]
	    || r1[0] <= r2[0] && r2[0] <= r1[1]
	    || r1[0] <= r2[1] && r2[1] <= r1[1];
});

console.log(matches.length);
