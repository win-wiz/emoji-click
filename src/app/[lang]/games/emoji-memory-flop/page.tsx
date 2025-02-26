// import GameCarousel from "@/components/games/game-carousel";
import GamePageLayout from "@/components/games/game-page-layout";
import { AVAILABLE_LOCALES } from "@/locales/config";
import { fetchEmojiGame, fetchEmojiGameForMeta } from "@/server/games/index";
import { GameItemResponse } from "@/types/memoryGame";
import { Metadata } from "next";

interface GamesPageProps {
  params: {
    lang: AVAILABLE_LOCALES;
  };
}

const defaultGameData: GameItemResponse = {
  name: 'Emoji Memory Flop',
  code: 'emoji-memory-flop',
  coverImageUrl: null,
  iframeUrl: null,
  starting: null,
  briefDesc: null,
  detailDesc: null,
  basicRule: null,
  advancedRule: null,
  tips: null,
  faq: null
};

export async function generateMetadata({ params }: { params: { lang: AVAILABLE_LOCALES } }): Promise<Metadata> {
  const result = await fetchEmojiGameForMeta(params.lang, 'emoji-memory-flop');
  const gameObj = result.success && result.data?.[0] ? result.data[0] : defaultGameData;

  return {
    title: `EmojiClick | ${gameObj.name ?? 'Memory Game'}`,
    description: gameObj.briefDesc ?? 'An engaging emoji memory game',
    keywords: `emoji search, AI-powered emoji, EmojiClick, smart emoji tool, contextual emoji, emoji discovery, chat enhancement, emoji recommendation engine`,
  }
}

export default async function GamesPage({ params }: GamesPageProps) {
  const { lang } = params;
  const result = await fetchEmojiGame(lang, 'emoji-memory-flop');

  if (!result.success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <h2 className="text-xl font-semibold text-red-600">Failed to fetch emoji game</h2>
        </div>
      </div>
    );
  }

  const gameObj = result.success && result.data?.[0] ? result.data[0] : defaultGameData;

  return (
    <GamePageLayout 
      gameObj={gameObj as GameItemResponse} 
      iframeSrc={`https://memory-game.emojis.click/${lang}`} 
    />
  );
}