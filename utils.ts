export const gcf = (a: number, b: number) => {
  let m = Math.min(a, b);

  while (m > 1) {
    if (a % m === 0 && b % m === 0) return m;

    m -= 1;
  }

  return 1;
};

export function* enumerate<T>(
  a: T[]
): Generator<[i: number, val: T], void, undefined> {
  for (let i = 0; i < a.length; i++) {
    yield [i, a[i]];
  }
}

export const countVal = <T>(val: T, arr: T[]) => {
  let total = 0;
  for (const v of arr) {
    if (v === val) {
      total++;
    }
  }

  return total;
};

export const splitArr = <T>(arr: T[], valChecker: (val: T) => boolean) => {
	const newArr: T[][] = [[]]
	
	for (const v of arr) {
		if (valChecker(v)) {
			newArr.push([])
		} else {
			newArr.at(-1)?.push(v)
		}
	}

	return newArr;
}

export const groupIn = <T>(arr: T[], num: number) => {
	const output: T[][] = [[]]

	for (const val of arr) {
		if (output.at(-1)?.length === num) {
			output.push([])
		}

		output.at(-1)?.push(val);
	}

	return output
}