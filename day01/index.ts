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
  const toNumber = (s?: string): number => {
    if (!s) return -Infinity;
    const map: Record<string, number> = {
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
    return map[s] || -Infinity;
  };
  const data = await readInput(input);
  let sum = 0;

  const searchSpace: Array<string> = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ];
  for (const line of data) {
    let firstIdx = Infinity;
    let lastIdx = -Infinity;
    let first = -Infinity;
    let last = -Infinity;
    for (const search of searchSpace) {
      let idx = line.indexOf(search);
      if (idx > -1 && idx < firstIdx) {
        firstIdx = idx;
        first = toNumber(search);
      }
      idx = line.lastIndexOf(search);
      if (idx > -1 && idx > lastIdx) {
        lastIdx = idx;
        last = toNumber(search);
      }
    }
    sum += first * 10 + last;
  }

  console.log("Part 2", { sum });
};

await part1();
await part2();
