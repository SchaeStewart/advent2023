import { slidingWindows } from "https://deno.land/std@0.208.0/collections/sliding_windows.ts";
import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";

const tests: [string, number[], number][] = [
  ["?", [1], 1],
  ["?.?", [1], 2],
  ["???", [2], 2],
  //   ["???.###", [1, 1, 3], 1],
  //   [".??..??...?##.", [1, 1, 3], 1],
  // ?#?#?#?#?#?#?#? 1,3,1,6
  // ????.#...#... 4,1,1
  // ????.######..#####. 1,6,5
  // ?###???????? 3,2,1
];

// problems:
// - identify all contiguous groups that fits a given number

const countPossibleSprings = (springs: string): number =>
  springs.split("").filter((s) => ["?", "#"].includes(s)).length;

const groups = (springs: string, size: number) => {
  const groups = [];
  for (let i = 0; i < springs.length; i++) {
    const window = springs.slice(i, i + 2);
    if (countPossibleSprings(window) === window.length) {
      groups.push([i, window]);
    }
  }
};

export const getPossibleSprings = (
  springs: string,
  groups: number[],
): string[] => {
};

for (const [springs, groups, expected] of tests) {
  Deno.test("handles easy test", () => {
    assertEquals(getPossibleSprings(springs, groups).length, expected);
  });
}
