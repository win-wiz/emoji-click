import { I18nLocales } from "@/hooks/useI18nLocale";
import { getLocaleFlag } from "@/utils";
import Link from "next/link";
import { memo, useMemo } from "react";

interface LanguageDropdownProps {
  locales: I18nLocales;
  pathname: string;
}

// 提取单个语言项组件并使用memo
const LocaleItem = memo(({ locale, href }: { 
  locale: I18nLocales[0], 
  href: string 
}) => (
  <li>
    <Link href={href}>
      {getLocaleFlag(locale.key)} {locale.name}
    </Link>
  </li>
));

LocaleItem.displayName = 'LocaleItem';

function LanguageDropdown({ locales, pathname }: LanguageDropdownProps) {
  // 缓存URL计算逻辑
  const getLocaleUrl = useMemo(() => {
    const pathSegments = pathname.split('/').slice(2).join('/');
    return (localeKey: string) => `/${localeKey}/${pathSegments}`;
  }, [pathname]);

  // 缓存整个列表渲染
  const localeItems = useMemo(() => 
    locales.map(locale => (
      <LocaleItem
        key={locale.key}
        locale={locale}
        href={getLocaleUrl(locale.key)}
      />
    )),
    [locales, getLocaleUrl]
  );

  return (
    <ul 
      tabIndex={0} 
      className="dropdown-content menu bg-base-100 border flex flex-col rounded-lg z-[1] w-[480px] p-2 shadow"
      role="menu"
      aria-orientation="vertical"
    >
      {localeItems}
    </ul>
  );
}

// 使用memo包装整个组件
export default memo(LanguageDropdown); 