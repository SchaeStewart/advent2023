import { readInput } from "../readInput.ts";

const input = new URL(".", import.meta.url).pathname + "/sampleInput.txt";
// const input = new URL(".", import.meta.url).pathname + "/input.txt";

// | is a vertical pipe connecting north and south.
// - is a horizontal pipe connecting east and west.
// L is a 90-degree bend connecting north and east.
// J is a 90-degree bend connecting north and west.
// 7 is a 90-degree bend connecting south and west.
// F is a 90-degree bend connecting south and east.
// . is ground; there is no pipe in this tile.
// S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.

type Cardinal = "N" | "S" | "E" | "W";
type Pipe = "|" | "-" | "L" | "J" | "7" | "F"; //  | "." | "S";
type PipeToCardinal = Record<Pipe, Set<Cardinal>>;
const PIPE_TO_CARDINAL: PipeToCardinal = {
  "|": new Set(["N", "S"]),
  "-": new Set(["E", "W"]),
  "L": new Set(["N", "E"]),
  "J": new Set(["N", "W"]),
  "7": new Set(["S", "W"]),
  "F": new Set(["S", "E"]),
};

const PIPES: Set<Pipe> = new Set(["|", "-", "L", "J", "7", "F"]);

const isPipe = (s: unknown): s is Pipe => PIPES.has(s as Pipe);

const pipeToCardinal = (s: Pipe): Set<Cardinal> => PIPE_TO_CARDINAL[s];

const cardinalsToPipes = (c1: Cardinal, c2: Cardinal): Pipe => {
  if (c1 === c2) {
    throw new Error("Cardinals must be different: " + c1 + " " + c2);
  }
  const matches = Object.entries(PIPE_TO_CARDINAL).filter(([_, [c3, c4]]) =>
    (c3 === c1 && c4 === c2) || (c3 === c2 && c4 === c1)
  );
  if (matches.length !== 1) throw new Error("only 1 match expected");
  return matches[0][0] as Pipe;
};

const inverseCardinal = (c: Cardinal): Cardinal =>
  c === "N" ? "S" : c === "S" ? "N" : c === "E" ? "W" : "E";

type Loc = { row: number; col: number };

const identifyStartingPipe = (loc: Loc, data: string[][]): Pipe => {
  const locs: { col: number; row: number; cardinal: Cardinal }[] = [
    { row: -1, col: 0, cardinal: "S" },
    { row: 1, col: 0, cardinal: "N" },
    { row: 0, col: -1, cardinal: "E" },
    { row: 0, col: 1, cardinal: "W" },
  ].map((item) => ({
    cardinal: item.cardinal as Cardinal,
    col: item.col + loc.col,
    row: item.row + loc.row,
  }));
  const cardinals: Cardinal[] = [];
  for (const { row, col, cardinal } of locs) {
    if (row < 0 || row >= data.length || col < 0 || col >= data[row].length) {
      continue;
    }
    const pipe = data[row][col];
    if (!isPipe(pipe)) continue;
    if (pipeToCardinal(pipe).has(cardinal)) cardinals.push(cardinal);
  }

  if (cardinals.length !== 2) {
    throw new Error(
      "directions should have two items: " + JSON.stringify(cardinals),
    );
  }

  return cardinalsToPipes(
    inverseCardinal(cardinals[0]),
    inverseCardinal(cardinals[1]),
  );
};

const findStart = (data: string[][]): Loc => {
  for (let r = 0; r < data.length; r++) {
    for (let c = 0; c < data.length; c++) {
      if (data[r][c] === "S") return { "col": c, row: r };
    }
  }
  return { row: -1, col: -1 };
};

const move = (
  loc: Loc,
  c: Cardinal,
  data: string[][],
): { loc: Loc; pipe: Pipe; nextCardinal: Cardinal } => {
  const m: Record<Cardinal, Loc> = {
    N: { row: -1, col: 0 },
    S: { row: 1, col: 0 },
    W: { row: 0, col: -1 },
    E: { row: 0, col: 1 },
  };
  const newLoc = { row: loc.row + m[c].row, col: loc.col + m[c].col };
  const pipe = data[newLoc.row][newLoc.col];
  if (!isPipe(pipe)) throw new Error("Is not a pipe: " + pipe);
  let nextCardinal: Cardinal | undefined;
  // exclude inverse of current cardinal
  const possibleDirections = pipeToCardinal(pipe);
  for (const d of possibleDirections) {
    if (inverseCardinal(d) !== c) {
      nextCardinal = d;
    }
  }
  if (!nextCardinal) throw new Error("nextDirection is undefined");
  return ({
    loc: newLoc,
    pipe,
    nextCardinal,
  });
};

const key = (loc: Loc) => `${loc.row}:${loc.col}`;
const keyToLoc = (s: string) => {
  const [row, col] = s.split(":").map((n) => parseInt(n));
  return { row, col };
};
const walk = (startingLoc: Loc, data: string[][]): [number, Set<string>] => {
  const startingDirections = Array.from(pipeToCardinal(
    identifyStartingPipe(startingLoc, data),
  ));
  let p1 = move(startingLoc, startingDirections[0], data);
  let p2 = move(startingLoc, startingDirections[1], data);

  let count = 1;
  const locations = new Set<string>();
  locations.add(key(p1.loc));
  locations.add(key(p2.loc));
  while (p1.loc.row !== p2.loc.row || p1.loc.col !== p2.loc.col) {
    count++;
    p1 = move(p1.loc, p1.nextCardinal, data);
    p2 = move(p2.loc, p2.nextCardinal, data);
    locations.add(key(p1.loc));
    locations.add(key(p2.loc));
  }
  return [count, locations];
};

const part1 = async () => {
  const data = (await readInput(input)).map((line) => line.split(""));
  const startingLoc = findStart(data);
  const [steps] = walk(startingLoc, data);

  console.log("Part 1", { steps });
};

const getEdges = (locations: Set<string>) => {
  const horizontalGreatestMap = new Map<number, number>(); // key: col, val: row
  const horizontalLeastMap = new Map<number, number>();
  const verticalGreatestMap = new Map<number, number>(); // key: col, val: row
  const verticalLeastMap = new Map<number, number>();
  for (const loc of locations) {
    const { row, col } = keyToLoc(loc);
    // Horizontal
    const cG = horizontalGreatestMap.get(row) || -Infinity;
    horizontalGreatestMap.set(row, Math.max(cG, col));
    const cL = horizontalLeastMap.get(row) || Infinity;
    horizontalLeastMap.set(row, Math.min(cL, col));
    // Vertical
    const rG = verticalGreatestMap.get(col) || -Infinity;
    verticalGreatestMap.set(col, Math.max(rG, row));
    const rL = verticalLeastMap.get(col) || Infinity;
    verticalLeastMap.set(col, Math.min(rL, row));
  }
  const edges = new Set<string>();
  for (
    const [r, c] of [
      ...horizontalGreatestMap,
      ...horizontalLeastMap,
    ]
  ) {
    edges.add(key({ row: r, col: c }));
  }
  for (
    const [c, r] of [
      ...verticalGreatestMap,
      ...verticalLeastMap,
    ]
  ) {
    edges.add(key({ row: r, col: c }));
  }
  return edges;
};

const part2 = async () => {
  const data = (await readInput(input)).map((line) => line.split(""));
  const startingLoc = findStart(data);
  const [_, locations] = walk(startingLoc, data);
  const edges = getEdges(locations);
  console.log({ edges });
  for (const l of edges) {
    const loc = keyToLoc(l);
    data[loc.row][loc.col] = "0";
  }
  // const tiles = new Set<string>();
  // for (const l of locations) {
  //   const loc = keyToLoc(l);
  //   const locs = [
  //     { row: -1, col: 0 },
  //     { row: 1, col: 0 },
  //     { row: 0, col: 1 },
  //     { row: 0, col: -1 },
  //   ].map((l) => ({ col: loc.col + l.col, row: loc.row + l.row }))
  //     .filter(({ row, col }) =>
  //       row >= 0 && row < data.length && col >= 0 && col < data[row].length
  //     );
  //   for (const item of locs) {
  //     if (locations.has(key(item))) continue;
  //     if (data[item.row][item.col] === ".") tiles.add(key(item));
  //   }
  // }

  // console.log({ tiles, size: tiles.size });
  // for (const l of locations) {
  //   const loc = keyToLoc(l);
  //   data[loc.row][loc.col] = "0";
  // }
  // for (const t of tiles) {
  //   const loc = keyToLoc(t);
  //   data[loc.row][loc.col] = "I";
  // }
  await Deno.writeTextFile(
    "./sampletmp.txt",
    data.map((line) => line.join("")).join("\n"),
  );

  console.log("Part 2", {});
};

await part1();
await part2();
