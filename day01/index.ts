const readInput = async (path: string): Promise<string[]> => {
  const decoder = new TextDecoder("utf-8");
  const bytes = await Deno.readFile(path);
  const data = decoder.decode(bytes);
  return data.split("\n");
};

const part1 = async () => {
  const calories = await readInput("./input.txt");
  const result = calories
    .reduce(
      ({ results, curr }: { results: number[]; curr: number }, val) =>
        val === ""
          ? { results: [...results, curr], curr: 0 }
          : { results: [...results], curr: curr + parseInt(val) },
      { results: [], curr: 0 }
    )
    .results.sort((a, b) => b - a)
    .slice(0, 1)[0];
  console.log("Part 1", result);
};

const part2 = async () => {
  const calories = await readInput("./input.txt");
  // const calories = await readInput('./sampleInput.txt')
  const results = [];
  let acc = 0;
  for (const cal of calories) {
    if (cal === "") {
      results.push(acc);
      acc = 0;
    } else {
      const num = parseInt(cal);
      acc += num;
    }
  }
  console.log(
    "Part 2",
    results
      .sort((a, b) => b - a)
      .slice(0, 3)
      .reduce((acc, val) => acc + val, 0)
  );
};

await part1();
await part2();
