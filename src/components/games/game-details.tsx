import { GameItem } from "@/types/memoryGame";
import GameTips from "./game-tips";
import GameSummer from "./game-summer";
import GameDescription from "./game-description";
import GameRules from "./game-rules";
import GameAdvanceTips from "./game-advance-tips";
import GameBenefit from "./game-benefit";
import GameFeature from "./game-feature";
import GameDifficultLevel from "./game-difficult-level";
import GamePlaySecret from "./game-play-secret";
import GameFaq from "./game-faq";

export const runtime = 'edge';

// 预定义样式常量
const STYLES = {
  container: {
    wrapper: "w-full space-y-0",
    section: "w-full py-12",
    inner: "container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
  },
  gradient: {
    tips: "bg-gradient-to-r from-pink-50/10 via-purple-50/15 to-pink-50/10",
    summer: "bg-gradient-to-r from-purple-50/10 via-pink-50/15 to-purple-50/10",
    description: "bg-gradient-to-r from-pink-50/15 via-purple-50/20 to-pink-50/15",
    rules: "bg-gradient-to-r from-purple-50/15 via-pink-50/20 to-purple-50/15",
    advanceTips: "bg-gradient-to-r from-pink-50/10 via-purple-50/15 to-pink-50/10",
    benefit: "bg-gradient-to-r from-purple-50/10 via-pink-50/15 to-purple-50/10",
    feature: "bg-gradient-to-r from-pink-50/15 via-purple-50/20 to-pink-50/15",
    level: "bg-gradient-to-r from-purple-50/15 via-pink-50/20 to-purple-50/15",
    secret: "bg-gradient-to-r from-pink-50/10 via-purple-50/15 to-pink-50/10",
    faq: "bg-gradient-to-r from-purple-50/10 via-pink-50/15 to-purple-50/10"
  }
} as const;

// 游戏详情部分组件 - 纯展示
function GameSection({ 
  children, 
  gradient 
}: { 
  children: React.ReactNode; 
  gradient: keyof typeof STYLES.gradient;
}) {
  return (
    <section className={`${STYLES.container.section} ${STYLES.gradient[gradient]}`}>
      <div className={STYLES.container.inner}>
        {children}
      </div>
    </section>
  );
}

// 主组件
export function GameDetail({ gameItem }: { gameItem: Partial<GameItem> }) {
  return (
    <div className={STYLES.container.wrapper}>
      <GameSection gradient="tips">
        <GameTips starting={gameItem.starting ?? ''} />
      </GameSection>

      <GameSection gradient="summer">
        <GameSummer gameSummer={gameItem.briefDesc ?? ''} />
      </GameSection>

      <GameSection gradient="description">
        <GameDescription detailDesc={gameItem.detailDesc ?? ''} />
      </GameSection>

      <GameSection gradient="rules">
        <GameRules gameRules={gameItem.basicRule ?? ''} />
      </GameSection>

      <GameSection gradient="advanceTips">
        <GameAdvanceTips advanceTips={gameItem.advancedSkills ?? ''} />
      </GameSection>

      <GameSection gradient="benefit">
        <GameBenefit benefits={gameItem.benefits ?? ''} />
      </GameSection>

      <GameSection gradient="feature">
        <GameFeature features={gameItem.features ?? ''} />
      </GameSection>

      <GameSection gradient="level">
        <GameDifficultLevel levelDesc={gameItem.levelDesc ?? ''} />
      </GameSection>

      <GameSection gradient="secret">
        <GamePlaySecret gameSecret={gameItem.gameSecret ?? ''} />
      </GameSection>

      <GameSection gradient="faq">
        <GameFaq faqs={gameItem.faq ?? ''} />
      </GameSection>
    </div>
  );
}

export default GameDetail;