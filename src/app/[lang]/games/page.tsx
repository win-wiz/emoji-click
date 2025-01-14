// import GameCarousel from "@/components/games/game-carousel";
import GameDetail from "@/components/games/game-details";
import GameIframe from "@/components/games/game-iframe";
import GameName from "@/components/games/game-name";
import { AVAILABLE_LOCALES } from "@/locales/config";
import { fetchEmojiMemberGame } from "@/server/games/member";
import { GameItem } from "@/types/memoryGame";

interface GamesPageProps {
  params: {
    lang: AVAILABLE_LOCALES;
  };
}

export default async function GamesPage({ params }: GamesPageProps) {
  const { lang } = params;
  const result = await fetchEmojiMemberGame(lang);

  if (!result.success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <h2 className="text-xl font-semibold text-red-600">Failed to fetch emoji game</h2>
        </div>
      </div>
    );
  }

  const gameObj = result.data![0] ?? {} as GameItem;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 游戏名称 */}
      <div className="w-full bg-gradient-to-r from-gray-50/50 to-white/50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <GameName name={gameObj?.name!} />
        </div>
      </div>

      {/* 游戏Iframe */}
      <div className="relative w-full">
        {/* 背景遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 via-white/30 to-indigo-50/40 backdrop-blur-[1px]" />
        
        <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <GameIframe src={`https://memory-game.emojis.click/${lang}`} />
        </div>
      </div>

      {/* 游戏详情 */}
      <div className="w-full">
        <GameDetail gameItem={gameObj as Partial<GameItem>} />
      </div>
    </div>
  );
}