import { readInput } from "../readInput.ts";

// const input = new URL(".", import.meta.url).pathname + "/sampleInput.txt";
const input = new URL(".", import.meta.url).pathname + "/input.txt";

type Location = { left: string; right: string };

type LeftRightMap = {
  instructions: string;
  network: Map<string, Location>;
  startingPositions: string[];
};

const parseInput = (data: string[]): LeftRightMap => {
  const instructions = data[0];
  const network = new Map<string, Location>();
  const startingPositions = [];
  for (const line of data.slice(2)) {
    const [start, lr] = line.split(" = ");
    const [left, right] = lr.slice(1, lr.length - 1).split(", "); // removes the wrapping parenthesis
    network.set(start, { left, right });
    if (start.endsWith("A")) {
      startingPositions.push(start);
    }
  }
  return { instructions, network, startingPositions };
};

const navigateMap = (
  map: LeftRightMap,
  startingLoc: string = "AAA",
  terminalCondition = (currLoc: string) => currLoc !== "ZZZ",
) => {
  let steps = 0;
  let ptr = 0;
  let currLoc = startingLoc;
  while (terminalCondition(currLoc)) {
    const { left, right } = map.network.get(currLoc)!;
    if (map.instructions[ptr] === "L") {
      currLoc = left;
    } else {
      currLoc = right;
    }
    steps++;
    ptr++;
    ptr = ptr === map.instructions.length ? 0 : ptr;
  }
  return steps;
};

// Naive solution to part2
// const ghostNavigate = (map: LeftRightMap) => {
//   let steps = 0;
//   let ptr = 0;
//   const currLocs = [...map.startingPositions];
//   console.log({ currLocs });
//   const endWithZs = (arr: string[]) => arr.every((x) => x.endsWith("Z"));
//   while (!endWithZs(currLocs)) {
//     for (let i = 0; i < currLocs.length; i++) {
//       const currLoc = currLocs[i];
//       const { left, right } = map.network.get(currLoc)!;
//       if (map.instructions[ptr] === "L") {
//         currLocs[i] = left;
//       } else {
//         currLocs[i] = right;
//       }
//     }
//     steps++;
//     ptr++;
//     ptr = ptr === map.instructions.length ? 0 : ptr;
//   }
//   return steps;
// };

const part1 = async () => {
  const map = parseInput(await readInput(input));
  const steps = navigateMap(map);
  console.log("Part 1", { steps });
};

const part2 = async () => {
  const map = parseInput(await readInput(input));
  const insCount = map.instructions.length;
  const steps = map.startingPositions
    .map((loc) =>
      navigateMap(map, loc, (currLoc: string) => !currLoc.endsWith("Z"))
    )
    .reduce((acc, val) => (acc * val) / insCount, insCount);
  console.log("Part 2", { steps });
};

await part1();
await part2();
