import { GameName } from "@/components/games/game-name";
import { AVAILABLE_LOCALES } from "@/locales/config";
import { loadTranslationMessagesOnServerSide } from "@/locales/messagesLoader";
import { cn } from "@/utils";
import { msg } from "@lingui/macro";
import { setupI18n } from "@lingui/core";
import Link from "next/link";

// 统一的样式常量定义
const STYLES = {
  page: {
    wrapper: "relative min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-pink-50/30 py-12 overflow-hidden selection:bg-purple-200/40",
    container: "container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 relative z-10",
    decorations: {
      wrapper: "absolute inset-0 overflow-hidden pointer-events-none",
      topLeft: "absolute -top-24 -left-24 w-[600px] h-[600px] bg-gradient-to-br from-purple-100/30 via-blue-100/20 to-transparent rounded-full blur-3xl",
      bottomRight: "absolute -bottom-24 -right-24 w-[600px] h-[600px] bg-gradient-to-br from-pink-100/30 via-rose-100/20 to-transparent rounded-full blur-3xl",
      center: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-br from-blue-50/10 via-purple-50/10 to-transparent rounded-full blur-3xl"
    },
    grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative"
  },
  card: {
    base: "group bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-purple-100/50 hover:bg-white/80 hover:border-purple-200/60 hover:shadow-xl transition-all duration-500",
    image: "relative w-full h-48 mb-4 rounded-xl overflow-hidden shadow-inner",
    emoji: "relative z-20 w-full h-full flex items-center justify-center text-6xl opacity-90 group-hover:opacity-100 transition-all duration-500 drop-shadow-lg transform group-hover:scale-110 group-hover:-rotate-6",
    content: "space-y-2 max-w-full",
    title: "text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300 truncate",
    description: "text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300 line-clamp-2"
  }
} as const;

// 优化渐变背景定义
const GAME_BACKGROUNDS = {
  'emoji-memory-flop': {
    base: 'bg-gradient-to-br from-indigo-500 to-purple-500',
    hover: 'group-hover:from-indigo-600 group-hover:to-purple-600'
  },
  'emoji-merge': {
    base: 'bg-gradient-to-br from-pink-500 to-orange-500',
    hover: 'group-hover:from-pink-600 group-hover:to-orange-600'
  }
} as const;

const GAME_MESSAGES = {
  'emoji-memory-flop': {
    title: msg`表情记忆翻牌`,
    description: msg`考验记忆力的趣味游戏，通过翻牌匹配相同的表情来提升记忆能力。`
  },
  'emoji-merge': {
    title: msg`表情合并`,
    description: msg`将两个表情合并成一个表情，创造出有趣的新表情。`
  }
} as const;

const GAMES = [
  {
    id: 'emoji-memory-flop',
    emoji: '🎭'
  },
  {
    id: 'emoji-merge',
    emoji: '🎨'
  }
] as const;

export default async function GamesPage({ params: { lang } }: { params: { lang: AVAILABLE_LOCALES } }) {
  const messages = await loadTranslationMessagesOnServerSide(lang);
  const i18n = setupI18n();
  i18n.load(lang, messages);
  i18n.activate(lang);

  return (
    <div className={STYLES.page.wrapper}>
      {/* 静态装饰元素 */}
      <div className={STYLES.page.decorations.wrapper}>
        <div className={STYLES.page.decorations.topLeft} />
        <div className={STYLES.page.decorations.bottomRight} />
        <div className={STYLES.page.decorations.center} />
      </div>
      
      <div className={STYLES.page.container}>
        <GameName name={i18n._(msg`趣味游戏集`)} />

        <div className={STYLES.page.grid}>
          {GAMES.map(game => {
            const bg = GAME_BACKGROUNDS[game.id as keyof typeof GAME_BACKGROUNDS];
            const gameMessages = GAME_MESSAGES[game.id as keyof typeof GAME_MESSAGES];
            return (
              <Link
                key={game.id}
                href={`/${lang}/games/${game.id}`} 
                className={STYLES.card.base}
              >
                <div className={cn(
                  STYLES.card.image,
                  bg.base,
                  bg.hover,
                  "transition-colors duration-500"
                )}>
                  <div className={STYLES.card.emoji}>
                    {game.emoji}
                  </div>
                </div>
                <div className={STYLES.card.content}>
                  <h2 className={STYLES.card.title}>
                    {i18n._(gameMessages.title)}
                  </h2>
                  <p className={STYLES.card.description}>
                    {i18n._(gameMessages.description)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}