import { GameItemResponse } from "@/types/memoryGame";
import { memo } from 'react';
import GameAutoScroll from "./game-auto-scroll";
import GameName from "./game-name";
import GameDetail from "./game-details";
import GameIframe from "./game-iframe";

interface GamePageLayoutProps {
  gameObj: GameItemResponse;
  iframeSrc: string;
}

// 静态背景组件
const BackgroundGradient = memo(() => (
  <div className="absolute inset-0 bg-gradient-to-br from-purple-50/40 via-white/30 to-purple-50/40 backdrop-blur-[1px]" />
));

// 静态装饰线组件
const DecorativeLine = memo(() => (
  <div className="absolute left-4 -top-2 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-purple-300/30 to-transparent" />
));

DecorativeLine.displayName = 'DecorativeLine';

BackgroundGradient.displayName = 'BackgroundGradient';

const GamePageLayout = memo(({ gameObj, iframeSrc }: GamePageLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <GameAutoScroll />
      
      {/* 游戏名称 */}
      <div className="w-full bg-gradient-to-r from-purple-50/50 to-white/50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <GameName name={gameObj?.name ?? ''} />

          {/* 游戏描述信息 */}
          <div className="mt-12">
            <div className="relative">
              {/* 文本内容 */}
              <div className="relative pl-[52px]">
                <p className="text-lg leading-[1.8] tracking-wide text-gray-500/90">
                  {gameObj.starting ?? ''}
                </p>
                <DecorativeLine />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 游戏Iframe */}
      <div id="game-section" className="relative w-full py-8">
        <BackgroundGradient />
        
        <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <GameIframe src={iframeSrc} />
        </div>
      </div>

      {/* 游戏详情 */}
      <div className="w-full">
        <GameDetail gameItem={gameObj} />
      </div>
    </div>
  );
});

GamePageLayout.displayName = 'GamePageLayout';

export default GamePageLayout; 