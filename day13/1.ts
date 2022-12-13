export {};
type Packet = (Packet | number)[];

const parsePacket = (p: string): Packet => {
  return (new Function(`return ${p}`))();
};

const input = (await Deno.readTextFile(`./day13/input.txt`)).split("\n\n").map((l) =>
  l.split("\n").map(parsePacket) as [Packet, Packet]
);

const comparePackets = (p1: Packet, p2: Packet): boolean | null => {
  for (let i = 0;; i++) {
    if (p1.length === i && p2.length === i) {
      return null;
    }
    if (p1.length === i) {
      return true;
    }
    if (p2.length === i) {
      return false;
    }

    if (typeof p1[i] === "number" && typeof p2[i] === "number") {
      if (p1[i] !== p2[i]) {
        return p1[i] < p2[i];
      }
    } else {
      const res = comparePackets(
        typeof p1[i] === "number" ? [p1[i]] : p1[i] as never,
        typeof p2[i] === "number" ? [p2[i]] : p2[i] as never,
      );

      if (res !== null) {
        return res;
      }
    }
  }
};

console.log(input.map((l, i) => comparePackets(...l) ? i + 1 : 0).reduce((a, b) => a + b, 0));