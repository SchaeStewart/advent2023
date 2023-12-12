import { readInput } from "../readInput.ts";

// const input = `${new URL(".", import.meta.url).pathname}/sampleInput.txt`;
const input = `${new URL(".", import.meta.url).pathname}/input.txt`;
type Pull = {
  red: number;
  green: number;
  blue: number;
};
type GameRecord = {
  id: number;
  pulls: Pull[];
};

const parseInput = (lines: string[]): GameRecord[] => {
  const records: GameRecord[] = [];
  for (const line of lines) {
    // Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
    // id = Game 1, rest = 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
    let [id, rest] = line.split(": ");
    let pulls: Pull[] = rest
      .split(";") // ["3 blue, 4 red", "1 red, 2 green" "6 blue; 2 green"]
      .map((pull) => pull.trim().split(", ")) // [ ["3 blue", "4 red"], [ "1 red", "2 green", ], ["6 blue", "2 green"]]
      .map((pulls) =>
        pulls.map((pull) => {
          const [n, color] = pull.split(" ");
          return [parseInt(n), color as keyof Pull];
        })
      ) // [ [ [3, "blue"], [4, "red"] ], [ [1, "red"], [2, "green"] ], [ [6, "blue", [2, "green"] ] ]
      .map((pull) =>
        pull.reduce((acc, [n, color]) => ({ ...acc, [color]: n }), {
          red: 0,
          blue: 0,
          green: 0,
        })
      ); // Pull {red: n, green: n, blue: n}
    records.push({
      id: parseInt(id.replace("Game ", "")),
      pulls,
    });
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
        pull.blue <= LIMIT.blue,
    )
  );
  const sum = validGames.reduce((acc, val) => acc + val.id, 0);

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
        },
      )
    )
    .map(({ red, green, blue }) => red * green * blue)
    .reduce((acc, val) => acc + val, 0);

  console.log("Part 2", { sum });
};

await part1(); // Part 1 { sum: 2416 }
await part2(); // Part 2 { sum: 63307 }
