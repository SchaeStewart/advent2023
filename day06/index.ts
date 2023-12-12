import { readInput } from "../readInput.ts";

// const input = new URL('.', import.meta.url).pathname + '/sampleInput.txt';
const input = new URL(".", import.meta.url).pathname + "/input.txt";

const parseInput = (data: string[]): { time: number; distance: number }[] => {
  const parseLine = (skipLen: number, line: string) =>
    line
      .slice(skipLen)
      .trim()
      .split(" ")
      .filter((el) => el.trim() !== "")
      .map((n) => parseInt(n.trim()));
  const times = parseLine("Time:".length, data[0]);
  const distance = parseLine("Distance:".length, data[1]);
  const result: { time: number; distance: number }[] = [];
  for (let i = 0; i < times.length; i++) {
    result.push({ time: times[i], distance: distance[i] });
  }
  return result;
};

const distance = (holdTime: number, maxTime: number) =>
  holdTime * (maxTime - holdTime);

const countWinningDistances = (maxTime: number, distanceToBeat: number) => {
  let winners = 0;
  for (let i = 0; i < maxTime; i++) {
    if (distance(i, maxTime) > distanceToBeat) {
      winners++;
    }
  }
  return winners;
};

const part1 = async () => {
  const races = parseInput(await readInput(input));
  const marginOfErr = races
    .map(({ time, distance }) => countWinningDistances(time, distance))
    .reduce((acc, val) => acc * val, 1);
  console.log("Part 1", { marginOfErr });
};

const part2 = async () => {
  const races = parseInput(await readInput(input));
  const correctedInput = races.reduce(
    (acc, { time, distance }) => ({
      distance: parseInt(`${acc.distance}${distance}`),
      time: parseInt(`${acc.time}${time}`),
    }),
    {
      distance: 0,
      time: 0,
    },
  );
  const winningDistanceCount = countWinningDistances(
    correctedInput.time,
    correctedInput.distance,
  );

  console.log("Part 2", { winningDistanceCount });
};

await part1();
await part2();
