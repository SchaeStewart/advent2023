import { readInput } from "../readInput.ts";

const input = new URL(".", import.meta.url).pathname + "/sampleInput.txt";
// const input = new URL(".", import.meta.url).pathname + "/input.txt";

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

const reduceSequence = (nums: number[]): number => {
  const diffs = getDifferences(nums);
  if (diffs.every((d) => d === 0)) {
    return nums.at(-1)! - diffs.at(-1)!;
  }
  const n = reduceSequence(diffs);
  return nums.at(-1)! + n;
};

const reduceSequenceBackward = (nums: number[]): number => {
  const diffs = getDifferences(nums);
  if (diffs.every((d) => d === 0)) {
    return nums.at(0)! - diffs.at(0)!;
  }
  const n = reduceSequence(diffs);
  return n - nums.at(0)!;
};

const part1 = async () => {
  const data = parseInput(await readInput(input));
  const diffs = data.map(reduceSequence);
  const sum = diffs.reduce((acc, val) => acc + val, 0);
  console.log("Part 1", { sum });
};

const part2 = async () => {
  const data = parseInput(await readInput(input));
  const diffs = data.map(reduceSequenceBackward);
  console.log({ diffs });
  const sum = diffs.reduce((acc, val) => acc + val, 0);

  console.log("Part 2", { sum });
};

// 1877825482 - too high
// 1882162116 - wrong
// 1877823008 - wrong
// 1877825184 -
await part1();
await part2();
