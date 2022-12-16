export class PriorityQueue<T> implements Iterable<T> {
  items: T[] = [];

  constructor(private comparator: (a: T, b: T) => number, first?: T) {
		if (first) {
			this.items.push(first);
		}

    this[Symbol.iterator] = this[Symbol.iterator].bind(this);
  }

  enqueue(element: T): void {
    const i = this.items.findIndex((el) => this.comparator(element, el) < 0);

    if (i === -1) {
      this.items.push(element);
    } else {
      this.items.splice(i, 0, element);
    }
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  get front(): T | undefined {
    return this.items[0];
  }

  get size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }

  toString(): string {
    return `PriorityQueue(${this.items.join(", ")})`;
  }

  [Symbol.iterator] = function* (this: PriorityQueue<T>) {
    for (let next = this.dequeue(); next !== undefined; next = this.dequeue()) {
      yield next;
    }
  };
}
