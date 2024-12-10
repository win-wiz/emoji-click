import { EmojiItem } from "./emoji";

export interface EmojiType {
  id: string;
  name: React.ReactNode;
  type: number;
  icon?: string;
  language: string;
  createdAt: string;
  emojis: EmojiItem[];
}