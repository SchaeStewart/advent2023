const sessionToken = prompt("please provide a session token:\n");
if (!sessionToken) {
  throw new Error("session token must be provided");
}
const day = parseInt(Deno.args[0]);
if (isNaN(day)) {
  throw new Error("Must provide day as a number as the first argument");
}
const dir = `day${day < 10 ? "0" + day.toString() : day}`; // Pad the day with a zero for 1-9
const puzzleInput = await fetch(
  `https://adventofcode.com/2023/day/${day}/input`,
  {
    headers: new Headers({ Cookie: `session=${sessionToken}` }),
  },
)
  .then((res) => res.text())
  .then((text) => text.trim());
// const puzzleInput = "";
await Deno.writeTextFile(`./${dir}/input.txt`, puzzleInput);
