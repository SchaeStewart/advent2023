import { readRawInput } from "../readInput.ts";

// const input = new URL('.', import.meta.url).pathname + '/sampleInput.txt';
const input = new URL(".", import.meta.url).pathname + "/input.txt";

type SeedMap = { source: number; dest: number; range: number }[];
const inputToMaps = (data: string): { seeds: number[]; maps: SeedMap[] } => {
  const [seedRaw, ...maps] = data.split("\n\n");

  return {
    seeds: seedRaw
      .slice("seeds: ".length)
      .split(" ")
      .map((s) => parseInt(s.trim())),
    maps: maps.map((map) => {
      return map
        .split(":\n")[1]
        .split("\n")
        .map((line) => line.split(" ").map((n) => parseInt(n.trim())))
        .map(([dest, source, range]) => ({ dest, source, range }));
    }),
  };
};

const findDest = (source: number, map: SeedMap): number => {
  for (const line of map) {
    if (source >= line.source && source < line.source + line.range) {
      const offset = line.dest - line.source;
      return source + offset;
    }
  }
  return source;
};

const walkMaps = (seed: number, maps: SeedMap[]) => {
  let src = seed;
  for (const map of maps) {
    src = findDest(src, map);
  }
  return src;
};

const part1 = async () => {
  const { seeds, maps } = inputToMaps(await readRawInput(input));
  const min = Math.min(...seeds.map((seed) => walkMaps(seed, maps)));
  console.log("Part 1", { min });
};

const seedsToRanges = (seeds: number[]): { start: number; range: number }[] => {
  const result = [];
  for (let i = 0; i < seeds.length - 1; i += 2) {
    result.push({ start: seeds[i], range: seeds[i + 1] });
  }
  return result;
};

const part2 = async () => {
  const { seeds, maps } = inputToMaps(await readRawInput(input));
  const seedRanges = seedsToRanges(seeds);
  let min = Infinity;
  for (const rangeSet of seedRanges) {
    for (
      let seed = rangeSet.start;
      seed < rangeSet.start + rangeSet.range;
      seed++
    ) {
      min = Math.min(walkMaps(seed, maps), min);
    }
  }

  console.log("Part 2", { min });
};

await part1();
await part2();
