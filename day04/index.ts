import { readInput } from "../readInput.ts";

// const input = new URL(".", import.meta.url).pathname + "/sampleInput.txt";
const input = new URL(".", import.meta.url).pathname + "/input.txt";

type Card = {
  id: number;
  winningNumbers: Set<number>;
  numbersIHave: Set<number>;
};

const parseInput = (data: string[]): Card[] => {
  const cards: Card[] = [];
  for (const line of data) {
    const [id, rest] = line.split(": ");
    const [winningNumbers, numbersIHave] = rest.split(" | ");
    cards.push({
      id: parseInt(id.replace("Card ", "")),
      winningNumbers: new Set(
        winningNumbers
          .split(" ")
          .filter((n) => n.trim() !== "")
          .map((n) => parseInt(n.trim()))
      ),
      numbersIHave: new Set(
        numbersIHave
          .split(" ")
          .filter((n) => n.trim() !== "")
          .map((n) => parseInt(n.trim()))
      ),
    });
  }
  return cards;
};

const intersection = <T>(n1: Set<T>, n2: Set<T>): Set<T> => {
  const intersect = new Set<T>();
  for (const val of n1) {
    if (n2.has(val)) {
      intersect.add(val);
    }
  }
  return intersect;
};

const calculatePileWorth = (cards: Card[]): number => {
  let total = 0;
  for (const card of cards) {
    const ins = intersection(card.winningNumbers, card.numbersIHave);
    if (ins.size === 0) continue;
    const score = ins.size === 1 ? 1 : 2 ** (ins.size - 1);
    total += score;
  }

  return total;
};

const processPile = (cards: Card[]): number => {
  let totalCards = 0;
  const queue: Card[] = [...cards];
  // k: cardId, v: cards below
  const cache = new Map<number, number>();
  while (queue.length) {
    const card = queue.shift();
    if (!card) throw new Error("there is not a card.");
    totalCards++;
    let id = card.id;
    let size = -Infinity;
    const c = cache.get(id);
    if (c) {
      size = c;
    } else {
      const ins = intersection(card.winningNumbers, card.numbersIHave);
      if (ins.size === 0) continue;
      size = ins.size;
      cache.set(id, size);
    }
    queue.push(...cards.slice(id, id + size));
  }
  return totalCards;
};

const part1 = async () => {
  const cards = parseInput(await readInput(input));
  const total = calculatePileWorth(cards);
  console.log("Part 1", { total });
};

const part2 = async () => {
  const cards = parseInput(await readInput(input));
  const totalCards = processPile(cards);
  console.log("Part 2", { totalCards });
};

await part1();
await part2();
