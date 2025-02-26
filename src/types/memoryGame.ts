export interface GameItem {
  name: string;
  code: string;
  coverImageUrl: string;
  iframeUrl: string;
  starting: string;
  briefDesc: string;
  detailDesc: string;
  basicRule: string;
  advancedRule: string;
  tips: string;
  faq: string;
}

// 创建一个新的类型，用于处理可能为空的字段
export type GameItemResponse = {
  [K in keyof GameItem]: GameItem[K] | null;
};