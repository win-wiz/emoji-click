'use client';

import { AVAILABLE_LOCALES } from '@/locales/config';
import { Trans, t } from '@lingui/macro';
import Link from 'next/link';
import { memo, useMemo } from 'react';

// 提取Logo组件并使用memo
const Logo = memo(() => (
  <Link href="/" className="mb-6 flex items-center gap-2">
    <span className="text-2xl">🤖</span>
    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
      Emoji Ai Finder
    </h1>
  </Link>
));

Logo.displayName = 'Logo';

// 提取导航链接组件
const NavLinks = memo(({ lang }: { lang: AVAILABLE_LOCALES }) => {
  const links = useMemo(() => [
    // { href: "/", label: t`博客` },
    { href: `/${lang}/terms-of-service`, label: t`服务条款` },
    { href: `/${lang}/privacy-policy`, label: t`隐私政策` }
  ], [lang]);

  return (
    <ul className="space-y-3">
      {links.map(({ href, label }) => (
        <li key={href}>
          <Link href={href} className="hover:text-violet-600 transition-colors">
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
});

NavLinks.displayName = 'NavLinks';

const FriendLinks = memo(() => (
  <ul className="space-y-3">
    <li>
      <Link target="_blank" href="https://subrise.co" className="hover:text-violet-600 transition-colors">
        Subrise
      </Link>
    </li>
    <li>
      <Link target="_blank" href="https://wordless.online" className="hover:text-violet-600 transition-colors">
        Wordless
      </Link>
    </li>
  </ul>
));

FriendLinks.displayName = 'FriendLinks';

// 提取联系信息组件
const ContactInfo = memo(() => (
  <div className="mt-8">
    <h4 className="text-violet-600 font-medium mb-2 flex items-center gap-2">
      <span>💌</span>
      <Trans>联系我们</Trans>
    </h4>
    <a href="mailto:support@emojis.click" className="hover:text-violet-600 transition-colors">
      support@emojis.click
    </a>
  </div>
));

ContactInfo.displayName = 'ContactInfo';

function Footer({ lang }: { lang: AVAILABLE_LOCALES }) {
  return (
    <footer className="bg-white border-t border-zinc-200 text-zinc-600 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <Logo />
            <p className="mb-6">
              <Trans>用AI魔法创造富有表现力的表情 🤖</Trans>
            </p>
            <ContactInfo />
          </div>

          <div className="col-span-2 flex justify-end gap-32">
            <div>
              <h3 className="text-violet-600 text-xl font-medium mb-4 flex items-center gap-2">
                <Trans>导航</Trans>
              </h3> 
              <NavLinks lang={lang} />
            </div>
             <div>
              <h3 className="text-violet-600 text-xl font-medium mb-4 flex items-center gap-2">
                <Trans>友情链接</Trans>
              </h3> 
              <FriendLinks />
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center">
          <p><Trans>版权所有 © 2024 EmojiAiFinder 保留所有权利</Trans></p>
        </div>
      </div>
    </footer>
  );
}

// 使用memo包装整个Footer组件
export default memo(Footer);