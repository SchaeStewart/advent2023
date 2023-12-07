import { readInput } from "../readInput.ts";

// const input = new URL(".", import.meta.url).pathname + "/sampleInput.txt";
const input = new URL(".", import.meta.url).pathname + "/input.txt";

enum HandType {
  HighCard = 0,
  OnePair = 1,
  TwoPair = 2,
  ThreeOfAKind = 3,
  FullHouse = 4,
  FourOfAKind = 5,
  FiveOfAKind = 6,
}

type Hand = {
  cards: string;
  type: HandType;
  bid: number;
};

const getHandType = (cards: string): HandType => {
  const frequency = new Map();
  for (const c of cards) {
    const v = frequency.get(c) || 0;
    frequency.set(c, v + 1);
  }
  let foundThree = false;
  let foundTwo = false;
  let twoCount = 0;
  for (const [_, v] of frequency) {
    if (v === 5) {
      return HandType.FiveOfAKind;
    } else if (v === 4) {
      return HandType.FourOfAKind;
    } else if (v === 3) {
      foundThree = true;
    }
    if (v === 2) {
      foundTwo = true;
      twoCount++;
    }
  }

  if (foundThree && foundTwo) return HandType.FullHouse;
  if (foundThree && !foundTwo) return HandType.ThreeOfAKind;
  if (foundTwo && twoCount === 2) return HandType.TwoPair;
  if (foundTwo && twoCount === 1) return HandType.OnePair;
  return HandType.HighCard;
};

const getHandTypeWithJokers = (cards: string): HandType => {
  const frequency = new Map();
  let jokerCount = 0;
  for (const c of cards) {
    if (c === "J") {
      jokerCount++;
    } else {
      const v = frequency.get(c) || 0;
      frequency.set(c, v + 1);
    }
  }

  // account for jokers
  for (const [k, v] of frequency) {
    frequency.set(k, Math.min(v + jokerCount, 5));
  }
  let foundThree = false;
  let foundTwo = false;
  let twoCount = 0;
  for (const [_, v] of frequency) {
    if (v === 5) {
      return HandType.FiveOfAKind;
    } else if (v === 4) {
      return HandType.FourOfAKind;
    } else if (v === 3) {
      foundThree = true;
    }
    if (v === 2) {
      foundTwo = true;
      twoCount++;
    }
  }

  if (foundThree && foundTwo) return HandType.FullHouse;
  if (foundThree && !foundTwo) return HandType.ThreeOfAKind;
  if (foundTwo && twoCount === 2) return HandType.TwoPair;
  if (foundTwo && twoCount === 1) return HandType.OnePair;
  return HandType.HighCard;
};

const parseInput = (data: string[]): Hand[] => {
  const hands: Hand[] = [];
  for (const line of data) {
    const [h, bid] = line.split(" ");
    hands.push({
      cards: h,
      type: getHandType(h),
      bid: parseInt(bid),
    });
  }
  return hands;
};
const compare =
  (cardValues: Record<string, number>) =>
  (h1: Hand, h2: Hand): -1 | 0 | 1 => {
    const compareCards = (c1: string, c2: string): -1 | 0 | 1 => {
      // > 0 	sort a after b, e.g. [b, a]
      // < 0 	sort a before b, e.g. [a, b]

      if (!c1 || !c2) return 0;
      if (c1[0] === c2[0]) return compareCards(c1.slice(1), c2.slice(1));
      if (cardValues[c1[0]] < cardValues[c2[0]]) {
        return 1;
      }
      return -1;
    };
    if (h1.type > h2.type) {
      return 1;
    } else if (h1.type < h2.type) {
      return -1;
    } else {
      return compareCards(h1.cards, h2.cards);
    }
  };

const part1 = async () => {
  const games = parseInput(await readInput(input));
  const values: Record<string, number> = {
    A: 0,
    K: 1,
    Q: 2,
    J: 3,
    T: 4,
    "9": 5,
    "8": 6,
    "7": 7,
    "6": 8,
    "5": 9,
    "4": 10,
    "3": 11,
    "2": 12,
  };
  const winnings = games
    .sort(compare(values))
    .map((g, i) => g.bid * (i + 1))
    .reduce((acc, val) => acc + val, 0);
  console.log("Part 1", { winnings });
};

const part2 = async () => {
  const games = parseInput(await readInput(input));
  const values: Record<string, number> = {
    A: 0,
    K: 1,
    Q: 2,
    T: 3,
    "9": 4,
    "8": 5,
    "7": 6,
    "6": 7,
    "5": 8,
    "4": 9,
    "3": 10,
    "2": 11,
    J: 12,
  };
  const winnings = games
    .map((g) => ({ ...g, type: getHandTypeWithJokers(g.cards) }))
    .sort(compare(values))
    .map((g, i) => g.bid * (i + 1))
    .reduce((acc, val) => acc + val, 0);

  console.log("Part 2", { winnings });
};

await part1();
await part2();
