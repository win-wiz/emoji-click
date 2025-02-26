import { Trans } from "@lingui/macro";
import { Gamepad2, ChevronDown } from "lucide-react";
import Link from "next/link";
import { AVAILABLE_LOCALES } from "@/locales/config";
import { memo } from "react";
import NavItem from "./nav-item";

const GameDropdown = memo(function GameDropdown({
  lang,
  isGamesRoute
}: {
  lang: AVAILABLE_LOCALES;
  isGamesRoute: boolean;
}) {
  if (isGamesRoute) return null;

  return (
    <div className="group dropdown dropdown-end">
      <NavItem>
        <button className="text-purple-600 hover:text-purple-800 transition-colors inline-flex items-center gap-1.5 relative group">
          <Gamepad2 className="w-4 h-4" />
          <Trans>游戏</Trans>
          <ChevronDown className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-2.5 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"></span>
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] delay-300"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-r from-red-500 to-rose-400 group-hover:from-red-600 group-hover:to-rose-500 transition-colors duration-200 shadow-sm"></span>
          </span>
        </button>
      </NavItem>
      
      <ul className="dropdown-content menu bg-white border rounded-lg z-[1] p-2 w-[230px] shadow-lg mt-2">
        <li>
          <Link href={`/${lang}/games/emoji-memory-flop`} className="flex outline-none items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200">
            <span className="text-lg">🧠</span>
            <span>Emoji Memory Game</span>
          </Link>
        </li>
        <li>
          <Link href={`/${lang}/games/emoji-kitchen`} className="flex outline-none items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200">
            <span className="text-lg">👨‍🍳</span>
            <span>Emoji Kitchen Game</span>
          </Link>
        </li>
      </ul>
    </div>
  );
});

GameDropdown.displayName = "GameDropdown";

export default GameDropdown; 