// to run:
// deno run --allow-write --allow-net newDay.ts 02
// or:
// advent-pass && deno run --allow-write --allow-net newDay.ts 02
const TEMPLATE = `import { readInput } from "../readInput.ts";

const input = new URL(".", import.meta.url).pathname + "/sampleInput.txt";
// const input = new URL(".", import.meta.url).pathname + "/input.txt";

const part1 = async () => {
  const data = await readInput(input);
  console.log("Part 1", {});
};

const part2 = async () => {
  const data = await readInput(input);

  console.log("Part 2", {});
};

await part1();
await part2();
`;

// const getTokenFromStdin = async () => {
//   const decoder = new TextDecoder();
//   let token = "";
//   for await (const chunk of Deno.stdin.readable) {
//     const text = decoder.decode(chunk);
//     token += text;
//   }
//   return token.trim().replaceAll('"', "");
// };
// const sessionToken = await getTokenFromStdin();
// if (!sessionToken) {
//   throw new Error("session token must be provided");
// }

const sessionToken = prompt("please provide a session token:\n");
if (!sessionToken) {
  throw new Error("session token must be provided");
}
const day = parseInt(Deno.args[0]);
if (isNaN(day)) {
  throw new Error("Must provide day as a number as the first argument");
}
const dir = `day${day < 10 ? "0" + day.toString() : day}`; // Pad the day with a zero for 1-9
await Deno.mkdir(`./${dir}`); // Will error if directory exists.

await Deno.writeTextFile(`./${dir}/sampleInput.txt`, "");
const puzzleInput = await fetch(
  `https://adventofcode.com/2023/day/${day}/input`,
  {
    headers: new Headers({ Cookie: `session=${sessionToken}` }),
  }
)
  .then((res) => res.text())
  .then((text) => text.trim());
await Deno.writeTextFile(`./${dir}/input.txt`, puzzleInput);
await Deno.writeTextFile(`./${dir}/index.ts`, TEMPLATE);
