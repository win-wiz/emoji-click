import { t } from "@lingui/macro";

const STYLES = {
  container: {
    wrapper: "min-h-[60vh] flex items-center justify-center",
    content: "text-center space-y-4 p-8 max-w-md"
  },
  icon: "text-8xl animate-bounce",
  title: "text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent",
  description: "text-gray-600 text-sm leading-relaxed"
} as const;

export default function EmojiMergePage() {
  return (
    <div className={STYLES.container.wrapper}>
      <div className={STYLES.container.content}>
        <div className={STYLES.icon}>
          🚧
        </div>
        <h1 className={STYLES.title}>
          {t`游戏开发中`}
        </h1>
        <p className={STYLES.description}>
          {t`我们正在努力开发这个有趣的游戏，敬请期待！`}
        </p>
      </div>
    </div>
  );
}