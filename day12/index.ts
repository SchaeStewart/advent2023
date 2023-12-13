import { readInput } from "../readInput.ts";

const input = new URL(".", import.meta.url).pathname + "/sampleInput.txt";
// const input = new URL(".", import.meta.url).pathname + "/input.txt";

export const getPossibleSprings = (
  springs: string,
  groups: number[],
): string[] => {
  return [];
};

const part1 = async () => {
  const data = await readInput(input);
  console.log("Part 1", {});
};

const part2 = async () => {
  const data = await readInput(input);

  console.log("Part 2", {});
};

await part1();
await part2();
