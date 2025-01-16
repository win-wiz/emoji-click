'use client';

import { Trans } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { memo, ReactNode } from "react";

// 抽离样式常量避免重复创建
const CONTAINER_STYLES = "flex items-center gap-4 mb-8";
const ICON_CONTAINER_BASE_STYLES = "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0";
const ICON_BASE_STYLES = "w-8 h-8";
const TITLE_STYLES = "text-xl font-bold text-gray-900";
const DESCRIPTION_STYLES = "text-sm text-gray-500 mt-1";

interface SectionHeaderProps {
  icon: ReactNode;
  title: string;
  description?: string;
  iconBgColor?: string;
  iconColor?: string;
}

const GAME_TRANSLATIONSMAP: Record<string, ReactNode> = {
  'game.tips.title': <Trans key='game.tips.title' id="game.tips.title">游戏提示</Trans> ,
  'game.tips.description': <Trans key='game.tips.description' id="game.tips.description">开始游戏前的重要提示</Trans>,
  'game.rules.title': <Trans key='game.rules.title' id="game.rules.title">游戏规则</Trans>,
  'game.rules.description': <Trans key='game.rules.description' id="game.rules.description">掌握这些规则开始游戏</Trans>,
  'game.difficulty.title': <Trans key='game.difficulty.title' id="game.difficulty.title">难度级别</Trans>,
  'game.difficulty.description': <Trans key='game.difficulty.description' id="game.difficulty.description">选择适合你的难度</Trans>,
  'game.features.title': <Trans key='game.features.title' id="game.features.title">游戏特色</Trans>,
  'game.features.description': <Trans key='game.features.description' id="game.features.description">独特的游戏特色</Trans>,
  'game.benefits.title': <Trans key='game.benefits.title' id="game.benefits.title">游戏益处</Trans>,
  'game.benefits.description': <Trans key='game.benefits.description' id="game.benefits.description">玩游戏的好处</Trans>,
  'game.secrets.title': <Trans key='game.secrets.title' id="game.secrets.title">游戏秘籍</Trans>,
  'game.secrets.description': <Trans key='game.secrets.description' id="game.secrets.description">游戏进阶秘籍</Trans>,
  'game.summer.title': <Trans key='game.summer.title' id="game.summer.title">游戏总结</Trans>,
  'game.summer.description': <Trans key='game.summer.description' id="game.summer.description">查看您的游戏表现</Trans>,
  'game.loading.title': <Trans key='game.loading.title' id="game.loading.title">游戏加载</Trans>,
  'game.loading.description': <Trans key='game.loading.description' id="game.loading.description">请稍候，游戏正在加载中</Trans>,
  'game.advance-tips.title': <Trans key='game.advance-tips.title' id="game.advance-tips.title">高级技巧</Trans>,
  'game.advance-tips.description': <Trans key='game.advance-tips.description' id="game.advance-tips.description">掌握这些技巧提升游戏水平</Trans>,
  'game.description.title': <Trans key='game.description.title' id="game.description.title">游戏简介</Trans>,
  'game.description.description': <Trans key='game.description.description' id="game.description.description">游戏简要介绍</Trans>,
  'game.faq.title': <Trans key='game.faq.title' id="game.faq.title">常见问题</Trans>,
  'game.faq.description': <Trans key='game.faq.description' id="game.faq.description">常见问题解答</Trans>
}

export const SectionHeader = memo(({ 
  icon, 
  title, 
  description,
  iconBgColor = 'bg-rose-50',
  iconColor = 'text-rose-500'
}: SectionHeaderProps) => {
  const { i18n } = useLingui();
  const iconContainerStyles = `${ICON_CONTAINER_BASE_STYLES} ${iconBgColor}`;
  const iconStyles = `${ICON_BASE_STYLES} ${iconColor}`;

  // console.log(i18n._(title));
  return (
    <div className={CONTAINER_STYLES}>
      <div className={iconContainerStyles}>
        <div className={iconStyles}>
          {icon}
        </div>
      </div>

      <div>
        <h3 className={TITLE_STYLES}>
          {i18n._(title)}
        </h3>
        {description && (
          <p className={DESCRIPTION_STYLES}>
            {i18n._(description)}
          </p>
        )}
      </div>
    </div>
  );
});

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader; 