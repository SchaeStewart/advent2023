import { readInput } from "../readInput.ts";

// const input = new URL(".", import.meta.url).pathname + "/sampleInput.txt";
const input = new URL(".", import.meta.url).pathname + "/input.txt";

const parseInput = (data: string[]): number[][] => {
  const results: number[][] = [];
  for (const line of data) {
    results.push(line.split(" ").map((n) => parseInt(n)));
  }
  return results;
};

const getDifferences = (nums: number[]) => {
  const result: number[] = [];
  for (let i = 0; i < nums.length - 1; i++) {
    result.push(nums[i + 1] - nums[i]);
  }
  return result;
};

const reduceSequence =
  (dir: -1 | 0, op: (a: number, b: number) => number) =>
  (nums: number[]): number => {
    const diffs = getDifferences(nums);
    if (diffs.every((d) => d === 0)) {
      return nums.at(dir)! - diffs.at(dir)!;
    }
    const n = reduceSequence(dir, op)(diffs);
    return op(nums.at(dir)!, n);
  };

const part1 = async () => {
  const data = parseInput(await readInput(input));
  const diffs = data.map(reduceSequence(-1, (a, b) => a + b));
  const sum = diffs.reduce((acc, val) => acc + val, 0);
  console.log("Part 1", { sum });
};

const part2 = async () => {
  const data = parseInput(await readInput(input));
  const diffs = data.map(reduceSequence(0, (a, b) => a - b));
  const sum = diffs.reduce((acc, val) => acc + val, 0);

  console.log("Part 2", { sum });
};

await part1();
await part2();
// 1877825184
// 1108
