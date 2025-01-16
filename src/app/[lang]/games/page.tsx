// import GameCarousel from "@/components/games/game-carousel";
import GameDetail from "@/components/games/game-details";
import GameIframe from "@/components/games/game-iframe";
import GameName from "@/components/games/game-name";
import GameAutoScroll from "@/components/games/game-auto-scroll";
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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <GameAutoScroll />
      
      {/* 游戏名称 */}
      <div className="w-full bg-gradient-to-r from-purple-50/50 to-white/50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <GameName name={gameObj?.name!} />

          {/* 游戏描述信息 */}
          <div className="mt-12">
            <div className="relative">
              {/* 文本内容 */}
              <div className="relative pl-[52px]">
                <p className="text-lg leading-[1.8] tracking-wide text-gray-500/90">
                  {gameObj.starting}
                </p>
                
                {/* 装饰线 */}
                <div className="absolute left-4 -top-2 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-purple-300/30 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 游戏Iframe */}
      <div id="game-section" className="relative w-full py-8">
        {/* 背景遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/40 via-white/30 to-purple-50/40 backdrop-blur-[1px]" />
        
        <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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