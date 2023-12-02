import { readInput } from "../readInput.ts";

// const input = `${new URL(".", import.meta.url).pathname}/sampleInput.txt`;
const input = `${new URL(".", import.meta.url).pathname}/input.txt`;
type Pull = {
  red: number;
  green: number;
  blue: number;
};
type GameRecord = {
  id: string;
  pulls: Pull[];
};

const parseInput = (lines: string[]): GameRecord[] => {
  const records: GameRecord[] = [];
  for (const line of lines) {
    let [id, rest] = line.split(":");
    id = id.replace("Game ", "");
    let pulls: string[][] = rest
      .split(";")
      .map((pull) => pull.trim().split(", "));
    const record: GameRecord = {
      id,
      pulls: [],
    };
    for (const pull of pulls) {
      let p: Pull = { red: 0, blue: 0, green: 0 };
      for (const item of pull) {
        const [n, color] = item.split(" ");
        if (["red", "blue", "green"].includes(color)) {
          p[color as keyof Pull] = parseInt(n);
        }
      }
      record.pulls.push(p);
    }
    records.push(record);
  }
  return records;
};

const part1 = async () => {
  const games = parseInput(await readInput(input));
  const LIMIT: Pull = {
    red: 12,
    green: 13,
    blue: 14,
  };
  const validGames = games.filter((game) =>
    game.pulls.every(
      (pull) =>
        pull.red <= LIMIT.red &&
        pull.green <= LIMIT.green &&
        pull.blue <= LIMIT.blue
    )
  );
  const sum = validGames.reduce((acc, val) => acc + parseInt(val.id), 0);

  console.log("Part 1", { sum });
};

const part2 = async () => {
  const games = parseInput(await readInput(input));
  const sum = games
    .map((game) =>
      game.pulls.reduce(
        (acc, val) => ({
          red: Math.max(acc.red, val.red),
          green: Math.max(acc.green, val.green),
          blue: Math.max(acc.blue, val.blue),
        }),
        {
          red: -Infinity,
          blue: -Infinity,
          green: -Infinity,
        }
      )
    )
    .map(({ red, green, blue }) => red * green * blue)
    .reduce((acc, val) => acc + val, 0);

  console.log("Part 2", { sum });
};

await part1();
await part2();
// Part 1 { sum: 2416 }
// Part 2 { sum: 63307 }
