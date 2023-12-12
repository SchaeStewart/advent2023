import { readInput } from "../readInput.ts";

// const input = `${new URL(".", import.meta.url).pathname}/sampleInput.txt`;
const input = `${new URL(".", import.meta.url).pathname}/input.txt`;

const part1 = async () => {
  const data = await readInput(input);
  let sum = 0;

  for (const line of data) {
    let first: null | number = null;
    let last: null | number = null;
    for (const c of line) {
      const n = parseInt(c);
      if (isNaN(n)) continue;
      if (first === null) {
        first = n;
      }
      last = n;
    }
    if (first !== null && last !== null) {
      sum += first * 10 + last;
    }
  }

  console.log("Part 1", { sum });
};

const part2 = async () => {
  const data = await readInput(input);
  let sum = 0;
  const strToNumber: Record<string, number> = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
  };

  const finder = (
    indexOfFn: "indexOf" | "lastIndexOf",
    shouldUpdate: (prevIdx: number, currIdx: number) => boolean,
  ) =>
  ({
    line,
    search,
    currIdx,
    currVal,
  }: {
    line: string;
    search: string;
    currIdx: number;
    currVal: number;
  }) => {
    let idx = line[indexOfFn](search);
    if (idx > -1 && shouldUpdate(currIdx, idx)) {
      return [idx, strToNumber[search]];
    }
    return [currIdx, currVal];
  };

  const findFirst = finder("indexOf", (prevIdx, currIdx) => currIdx < prevIdx);
  const findLast = finder(
    "lastIndexOf",
    (prevIdx, currIdx) => currIdx > prevIdx,
  );

  for (const line of data) {
    let firstIdx = Infinity;
    let lastIdx = -Infinity;
    let first = -Infinity;
    let last = -Infinity;
    for (const search of Object.keys(strToNumber)) {
      [firstIdx, first] = findFirst({
        line,
        search,
        currIdx: firstIdx,
        currVal: first,
      });
      [lastIdx, last] = findLast({
        line,
        search,
        currIdx: lastIdx,
        currVal: last,
      });
    }
    sum += first * 10 + last;
  }

  console.log("Part 2", { sum });
};

await part1();
await part2();
