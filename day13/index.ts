import { readInput, readRawInput } from "../readInput.ts";

// const input = new URL(".", import.meta.url).pathname + "/sampleInput.txt";
const input = new URL(".", import.meta.url).pathname + "/input.txt";

const parseInput = (data: string): string[][] => {
  return data.split("\n\n").map((l) => l.split("\n"));
};

const isHorizontallyMirrored = (idx: number, pattern: string[]) => {
  if (idx === -1) return false;
  let [l, r] = [idx, idx + 1];
  while (l >= 0 && r < pattern.length) {
    if (pattern[l] !== pattern[r]) return false;
    l--;
    r++;
  }
  return true;
};

const findMirrorIndices = (pattern: string[]): number[] => {
  const indices: number[] = [];
  for (let i = 0; i < pattern.length - 1; i++) {
    if (pattern[i] === pattern[i + 1]) {
      indices.push(i);
    }
  }
  return indices;
};

const findVerticalMirrorIndices = (pattern: string[]): number[] => {
  const indices = [];
  for (let c = 0; c < pattern[0].length; c++) {
    let allMatch = true;
    for (let row = 0; row < pattern.length; row++) {
      if (pattern[row][c] !== pattern[row][c + 1]) {
        allMatch = false;
      }
    }
    if (allMatch) indices.push(c);
  }
  return indices;
};

const isVerticallyMirrored = (idx: number, pattern: string[]) => {
  let l = idx;
  let r = idx + 1;
  while (l >= 0 && r < pattern[0].length) {
    for (let row = 0; row < pattern.length; row++) {
      if (pattern[row][l] !== pattern[row][r]) {
        return false;
      }
    }
    l--;
    r++;
  }
  return true;
};

// const rotatePattern = (pattern: string[]) => {
//   const rotated: string[] = [];
//   for (let col = 0; col < pattern.length; col++) {
//     let line = "";
//     for (let row = 0; row < pattern.length; row++) {
//       line += pattern[row][col];
//     }
//     rotated.push(line);
//   }
//   return rotated;
// };

const summarizePatterns = (patterns: string[][]) => {
  return patterns.map((
    p,
    i,
  ) => {
    const hIdx = findMirrorIndices(p).find((idx) =>
      isHorizontallyMirrored(idx, p)
    );
    if (hIdx !== undefined) return (hIdx + 1) * 100;

    const vIdxs = findVerticalMirrorIndices(p);
    const vIdx = vIdxs.find((i) => isVerticallyMirrored(i, p));
    return vIdx! + 1;
  }).reduce((acc, val) => acc + val, 0);
};

const part1 = async () => {
  const patterns = parseInput(await readRawInput(input));
  const sum = summarizePatterns(patterns);
  console.log("Part 1", { sum });
};

console.log(
  isVerticallyMirrored(
    6,
    [
      "##..#...#.#..#.",
      "##.###...###..#",
      "...#.#####....#",
      "..##.#####....#",
      "##.###...###..#",
      "##..#...#.#..#.",
      "..#..###.#####.",
    ],
  ),
);

const part2 = async () => {
  const data = await readInput(input);

  console.log("Part 2", {});
};

// Too high: 37633
// wrong 34513
// wrong 35183
// 35232
// Too low: 21582
// Too low: 8039
// Wrong: 21606

await part1();
await part2();
