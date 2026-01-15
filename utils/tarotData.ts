import { TarotCardData } from '../types';

export const MAJOR_ARCANA: TarotCardData[] = [
  { id: 0, name: "愚者 (The Fool)", nameEn: "The Fool", image: "https://picsum.photos/seed/tarot0/300/500" },
  { id: 1, name: "魔术师 (The Magician)", nameEn: "The Magician", image: "https://picsum.photos/seed/tarot1/300/500" },
  { id: 2, name: "女祭司 (The High Priestess)", nameEn: "The High Priestess", image: "https://picsum.photos/seed/tarot2/300/500" },
  { id: 3, name: "女皇 (The Empress)", nameEn: "The Empress", image: "https://picsum.photos/seed/tarot3/300/500" },
  { id: 4, name: "皇帝 (The Emperor)", nameEn: "The Emperor", image: "https://picsum.photos/seed/tarot4/300/500" },
  { id: 5, name: "教皇 (The Hierophant)", nameEn: "The Hierophant", image: "https://picsum.photos/seed/tarot5/300/500" },
  { id: 6, name: "恋人 (The Lovers)", nameEn: "The Lovers", image: "https://picsum.photos/seed/tarot6/300/500" },
  { id: 7, name: "战车 (The Chariot)", nameEn: "The Chariot", image: "https://picsum.photos/seed/tarot7/300/500" },
  { id: 8, name: "力量 (Strength)", nameEn: "Strength", image: "https://picsum.photos/seed/tarot8/300/500" },
  { id: 9, name: "隐士 (The Hermit)", nameEn: "The Hermit", image: "https://picsum.photos/seed/tarot9/300/500" },
  { id: 10, name: "命运之轮 (Wheel of Fortune)", nameEn: "Wheel of Fortune", image: "https://picsum.photos/seed/tarot10/300/500" },
  { id: 11, name: "正义 (Justice)", nameEn: "Justice", image: "https://picsum.photos/seed/tarot11/300/500" },
  { id: 12, name: "倒吊人 (The Hanged Man)", nameEn: "The Hanged Man", image: "https://picsum.photos/seed/tarot12/300/500" },
  { id: 13, name: "死神 (Death)", nameEn: "Death", image: "https://picsum.photos/seed/tarot13/300/500" },
  { id: 14, name: "节制 (Temperance)", nameEn: "Temperance", image: "https://picsum.photos/seed/tarot14/300/500" },
  { id: 15, name: "恶魔 (The Devil)", nameEn: "The Devil", image: "https://picsum.photos/seed/tarot15/300/500" },
  { id: 16, name: "高塔 (The Tower)", nameEn: "The Tower", image: "https://picsum.photos/seed/tarot16/300/500" },
  { id: 17, name: "星星 (The Star)", nameEn: "The Star", image: "https://picsum.photos/seed/tarot17/300/500" },
  { id: 18, name: "月亮 (The Moon)", nameEn: "The Moon", image: "https://picsum.photos/seed/tarot18/300/500" },
  { id: 19, name: "太阳 (The Sun)", nameEn: "The Sun", image: "https://picsum.photos/seed/tarot19/300/500" },
  { id: 20, name: "审判 (Judgement)", nameEn: "Judgement", image: "https://picsum.photos/seed/tarot20/300/500" },
  { id: 21, name: "世界 (The World)", nameEn: "The World", image: "https://picsum.photos/seed/tarot21/300/500" }
];

// Fisher-Yates Shuffle
export const shuffleDeck = (deck: TarotCardData[]): TarotCardData[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};
