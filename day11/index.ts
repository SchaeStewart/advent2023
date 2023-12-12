import { readInput } from "../readInput.ts";

// const input = new URL(".", import.meta.url).pathname + "/sampleInput.txt";
const input = new URL(".", import.meta.url).pathname + "/input.txt";

const toString = (data: string[][]) =>
  data.map((line) => line.join("")).join("\n");

// const repeat = (fn: () => void, count: number) => {
//   for (let i = 0; i < count; i++) fn();
// };
// const expandUniverse = (data: string[], size = 0): string[][] => {
//   const tempUniverse: string[][] = [];
//   for (const line of data) {
//     const space = line.split("");
//     tempUniverse.push([...space]);
//     if (space.every((s) => s === ".")) {
//       repeat(() => tempUniverse.push([...space]), size);
//     }
//   }
//   const universe: string[][] = [];
//   const allZerosCols = new Set<number>();
//   for (let col = 0; col < tempUniverse[0].length; col++) {
//     let isAllZeros = true;
//     for (let row = 0; row < tempUniverse.length; row++) {
//       if (tempUniverse[row][col] !== ".") {
//         isAllZeros = false;
//       }
//     }
//     if (isAllZeros) allZerosCols.add(col);
//   }
//   for (let r = 0; r < tempUniverse.length; r++) {
//     universe[r] = [];
//     for (let c = 0; c < tempUniverse[r].length; c++) {
//       universe[r].push(tempUniverse[r][c]);
//       if (allZerosCols.has(c)) repeat(() => universe[r].push("."), size);
//     }
//   }

//   return universe;
// };
type Loc = { row: number; col: number };

const key = (l: Loc) => `${l.col}:${l.row}`;
const pairKey = (l1: Loc, l2: Loc) => key(l1) + "-" + key(l2);
const has = (map: Map<string, [Loc, Loc]>) => (l1: Loc, l2: Loc): boolean =>
  map.has(pairKey(l1, l2)) || map.has(pairKey(l2, l1));
const add = (map: Map<string, [Loc, Loc]>) => (l1: Loc, l2: Loc) =>
  map.set(pairKey(l1, l2), [l1, l2]);

const isBetween = (target: number, x1: number, x2: number) =>
  (target > x1 && target < x2) || (target > x2 && target < x1);

const distance = (l1: Loc, l2: Loc): number =>
  Math.abs(l1.col - l2.col) + Math.abs(l1.row - l2.row);

const findGalaxies = (universe: string[][]): Loc[] => {
  const galaxies: Loc[] = [];
  for (let row = 0; row < universe.length; row++) {
    for (let col = 0; col < universe[row].length; col++) {
      if (universe[row][col] === "#") {
        galaxies.push({ row, col });
      }
    }
  }
  return galaxies;
};

const findPairs = (galaxies: Loc[]) => {
  const pairs = new Map<string, [Loc, Loc]>();
  const pairsHas = has(pairs);
  const pairsAdd = add(pairs);
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = 0; j < galaxies.length; j++) {
      if (j == i) continue;
      if (!pairsHas(galaxies[i], galaxies[j])) {
        pairsAdd(galaxies[i], galaxies[j]);
      }
    }
  }
  return { pairsAdd, pairsHas, pairs };
};

const getExpandedUniverseRanges = (data: string[][]) => {
  const emptyRows = new Set<number>();
  for (let row = 0; row < data.length; row++) {
    if (data[row].every((s) => s === ".")) emptyRows.add(row);
  }
  const emptyCols = new Set<number>();
  for (let col = 0; col < data[0].length; col++) {
    let isEmpty = true;
    for (let row = 0; row < data[0].length; row++) {
      if (data[row][col] !== ".") {
        isEmpty = false;
      }
    }
    if (isEmpty) emptyCols.add(col);
  }
  return { emptyRows: Array.from(emptyRows), emptyCols: Array.from(emptyCols) };
};
const distanceWithExpansion = (
  { emptyCols, emptyRows, loc1, loc2, multiplier }: {
    emptyRows: Array<number>;
    emptyCols: Array<number>;
    loc1: Loc;
    loc2: Loc;
    multiplier: number;
  },
) => {
  let colMod =
    emptyCols.filter((col) => isBetween(col, loc1.col, loc2.col)).length;
  colMod = colMod * (multiplier - 1);
  let rowMod =
    emptyRows.filter((row) => isBetween(row, loc1.row, loc2.row)).length;
  rowMod = rowMod * (multiplier - 1);

  const dist = distance(loc1, loc2) + rowMod + colMod;
  return dist;
};

const sumOfPairs = (
  { universe, multiplier }: { universe: string[][]; multiplier: number },
) => {
  const { emptyCols, emptyRows } = getExpandedUniverseRanges(universe);
  const galaxies = findGalaxies(universe);
  let sum = 0;
  const { pairs } = findPairs(galaxies);
  for (const [_, [loc1, loc2]] of pairs) {
    sum += distanceWithExpansion({
      loc1,
      loc2,
      emptyCols,
      emptyRows,
      multiplier,
    });
  }
  return sum;
};

const part1 = async () => {
  const universe = (await readInput(input)).map((row) => row.split(""));
  const sum = sumOfPairs({ universe, multiplier: 2 });
  console.log("Part 1", { sum });
};

const part2 = async () => {
  const universe = (await readInput(input)).map((line) => line.split(""));
  const sum = sumOfPairs({ universe, multiplier: 1_000_000 });
  console.log("Part 2", { sum });
};

await part1();
await part2();

// Part 1 { sum: 9684228 }
// Part 2 { sum: 483844716556 }
