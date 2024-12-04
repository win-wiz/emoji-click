import { EmojiItem } from "./emoji";

export interface Category {
  id: string;
  name: React.ReactNode;
  icon: string;
  emojis: EmojiItem[];
}