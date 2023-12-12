import { readInput } from "../readInput.ts";

// const input = new URL(".", import.meta.url).pathname + "/sampleInput.txt";
const input = new URL(".", import.meta.url).pathname + "/input.txt";

const isSymbol = (c: string) => c !== "." && isNaN(parseInt(c));
const isNumber = (c: string) => !isNaN(parseInt(c));
const getSymbolLocations = (
  data: string[],
  filter?: string[],
): [row: number, col: number][] => {
  const locs: [row: number, col: number][] = [];
  for (let r = 0; r < data.length; r++) {
    for (let c = 0; c < data[r].length; c++) {
      if (isSymbol(data[r][c]) && (!filter || filter.includes(data[r][c]))) {
        locs.push([r, c]);
      }
    }
  }
  return locs;
};

const key = (r: number, c: number) => `${r}-${c}`;
const searchLeft = ({
  row,
  col,
  data,
  visited,
}: {
  row: number;
  col: number;
  data: string[];
  visited: Set<string>;
}) => {
  if (!isNumber(data[row][col])) return [];
  let result: string[] = [];
  while (col >= 0 && !visited.has(key(row, col)) && isNumber(data[row][col])) {
    result = [data[row][col], ...result];
    visited.add(key(row, col));
    col--;
  }
  return result;
};

const searchRight = ({
  row,
  col,
  data,
  visited,
}: {
  row: number;
  col: number;
  data: string[];
  visited: Set<string>;
}) => {
  if (!isNumber(data[row][col])) return [];
  let result: string[] = [];
  if (row === 2 && col === 6) {
    console.log({ d: data[row][col], visited, row, col });
  }
  while (
    col < data[row].length &&
    !visited.has(key(row, col)) &&
    isNumber(data[row][col])
  ) {
    result = [...result, data[row][col]];
    visited.add(key(row, col));
    col++;
  }
  return result;
};
const getSearchLocs = (row: number, col: number) => [
  [row, col - 1], // left
  [row, col + 1], // right
  [row - 1, col], // up
  [row + 1, col], // down
  [row + 1, col + 1], // down-right
  [row + 1, col - 1], // down-left
  [row - 1, col + 1], // up-right
  [row - 1, col - 1], // up-left
];

const findNumbers = (locs: [number, number][], data: string[]): number[] => {
  const visited = new Set<string>();
  const numbers: number[] = [];
  for (const [row, col] of locs) {
    const searchLocs = getSearchLocs(row, col);
    for (const [r, c] of searchLocs) {
      if (!isNumber(data[r][c]) || visited.has(key(r, c))) continue;
      const ln = searchLeft({ row: r, col: c - 1, data, visited });
      const rn = searchRight({ row: r, col: c + 1, data, visited });
      const x = [...ln, data[r][c], ...rn].join("");
      visited.add(key(r, c));
      if (x.length) numbers.push(parseInt(x));
    }
  }
  return numbers;
};

const findGearRatios = (locs: [number, number][], data: string[]): number[] => {
  const visited = new Set<string>();
  const numbers: number[] = [];
  let gearNums = [];
  for (const [row, col] of locs) {
    const searchLocs = getSearchLocs(row, col);
    for (const [r, c] of searchLocs) {
      if (!isNumber(data[r][c]) || visited.has(key(r, c))) continue;
      const ln = searchLeft({ row: r, col: c - 1, data, visited });
      const rn = searchRight({ row: r, col: c + 1, data, visited });
      const x = [...ln, data[r][c], ...rn].join("");
      visited.add(key(r, c));
      if (x.length) gearNums.push(parseInt(x));
    }
    if (gearNums.length === 2) {
      numbers.push(gearNums[0] * gearNums[1]);
    }
    gearNums = [];
  }
  return numbers;
};

const part1 = async () => {
  const data = await readInput(input);
  const locs = getSymbolLocations(data);
  const partNumbers = findNumbers(locs, data);
  const sum = partNumbers.reduce((acc, sum) => acc + sum, 0);
  console.log("Part 1", { sum });
};

const part2 = async () => {
  const data = await readInput(input);
  const locs = getSymbolLocations(data, ["*"]);
  const gearRatios = findGearRatios(locs, data);
  const sum = gearRatios.reduce((acc, sum) => acc + sum, 0);

  console.log("Part 2", { sum });
};

await part1();
await part2();
