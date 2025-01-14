'use client';

import { memo, ReactNode, useMemo } from "react";
import { Trans } from "@lingui/macro";

// 抽离样式常量避免重复创建
const CONTAINER_STYLES = "flex items-center gap-4 mb-8";
const ICON_CONTAINER_BASE_STYLES = "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0";
const ICON_BASE_STYLES = "w-8 h-8";
const TITLE_STYLES = "text-xl font-bold text-gray-900";
const DESCRIPTION_STYLES = "text-sm text-gray-500 mt-1";

type MessageType = string | { id: string; message: string };

interface SectionHeaderProps {
  icon: ReactNode;
  title: MessageType;
  description?: MessageType;
  iconBgColor?: string;
  iconColor?: string;
}

const renderMessage = (message: MessageType) => {
  if (typeof message === 'string') {
    return <Trans>{message}</Trans>;
  }
  return <Trans id={message.id}>{message.message}</Trans>;
};

export const SectionHeader = memo(({ 
  icon, 
  title, 
  description,
  iconBgColor = 'bg-rose-50',
  iconColor = 'text-rose-500'
}: SectionHeaderProps) => {
  // 使用 useMemo 缓存文本内容的渲染
  const titleContent = useMemo(() => renderMessage(title), [title]);
  const descriptionContent = useMemo(
    () => description && renderMessage(description),
    [description]
  );

  // 使用 useMemo 缓存样式组合
  const iconContainerStyles = useMemo(
    () => `${ICON_CONTAINER_BASE_STYLES} ${iconBgColor}`,
    [iconBgColor]
  );
  
  const iconStyles = useMemo(
    () => `${ICON_BASE_STYLES} ${iconColor}`,
    [iconColor]
  );

  return (
    <div className={CONTAINER_STYLES}>
      <div className={iconContainerStyles}>
        <div className={iconStyles}>
          {icon}
        </div>
      </div>

      <div>
        <h3 className={TITLE_STYLES}>
          {titleContent}
        </h3>
        {description && (
          <p className={DESCRIPTION_STYLES}>
            {descriptionContent}
          </p>
        )}
      </div>
    </div>
  );
});

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader; 