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
  // key: card.id, val: number of cards won
  const cardToNewCards = new Map<number, number>();
  for (const card of cards) {
    cardToNewCards.set(
      card.id,
      intersection(card.winningNumbers, card.numbersIHave).size
    );
  }

  const cardCopies = new Map<number, number>();
  for (const card of cards) {
    cardCopies.set(card.id, 1);
  }

  for (const card of cards) {
    const copyCountOfCurrentCard = cardCopies.get(card.id)!;
    const numberOfNewCards = cardToNewCards.get(card.id)!;
    for (let id = card.id + 1; id < card.id + 1 + numberOfNewCards; id++) {
      cardCopies.set(id, cardCopies.get(id)! + copyCountOfCurrentCard);
    }
  }
  let totalCards = 0;
  for (const [_, val] of cardCopies) {
    totalCards += val;
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
