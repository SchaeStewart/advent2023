export const readInput = async (path: string): Promise<string[]> => {
  const decoder = new TextDecoder("utf-8");
  const bytes = await Deno.readFile(path);
  const data = decoder.decode(bytes);
  return data.split("\n");
};

export const readRawInput = async (path: string): Promise<string> => {
  const data = await Deno.readTextFile(path);
  return data;
};
