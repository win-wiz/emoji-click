export interface EmojiItem {
  id: number;
  code: string;
  fullCode: string;
  baseCode: string;
  diversity: number;
  skinCode: string;
  type: number;
  sort: number;
  related: string;
  hot: number;
  emotion: number;
  createdAt: string;
}

export interface EmojiType {
  fullCode: string
  code: string
  name: string
  hot: number
  type: string
  typeName: string
}