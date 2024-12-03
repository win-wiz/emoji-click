import { Send, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';


export default function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-200 text-zinc-600 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link href="/" className="mb-6 flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
                Ai Emoji
              </h1>
            </Link>
            <p className="mb-6">Create expressive emojis with AI magic ✨</p>
            <div className="relative group">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-zinc-50 rounded-lg py-3 px-6 text-zinc-900 placeholder:text-zinc-400 border border-zinc-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-violet-600 rounded-md flex items-center justify-center text-white hover:bg-violet-500 transition-all">
                ✉️
              </button>
            </div>
            <div className="mt-8">
              <h4 className="text-violet-600 font-medium mb-2 flex items-center gap-2">
                <span>💌</span> EMAIL US
              </h4>
              <a href="mailto:support@aiemoji.co" className="hover:text-violet-600 transition-colors">
                support@aiemoji.co
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-zinc-900 text-xl font-medium mb-4 flex items-center gap-2">
              <span>⚡️</span> Features
            </h3>
            <ul className="space-y-3">
              <li><Link href="/create" className="hover:text-violet-600 transition-colors">Create Emoji</Link></li>
              <li><Link href="/customize" className="hover:text-violet-600 transition-colors">Customize</Link></li>
              <li><Link href="/collections" className="hover:text-violet-600 transition-colors">Collections</Link></li>
              <li><Link href="/trending" className="hover:text-violet-600 transition-colors">Trending</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-purple-400 text-xl font-medium mb-4 flex items-center gap-2">
              <span>💫</span> Resources
            </h3>
            <ul className="space-y-3">
              <li><Link href="/tutorials" className="hover:text-purple-400 transition-colors">Tutorials</Link></li>
              <li><Link href="/gallery" className="hover:text-purple-400 transition-colors">Gallery</Link></li>
              <li><Link href="/community" className="hover:text-purple-400 transition-colors">Community</Link></li>
              <li><Link href="/faq" className="hover:text-purple-400 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-pink-400 text-xl font-medium mb-4 flex items-center gap-2">
              <span>🌟</span> Company
            </h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="hover:text-pink-400 transition-colors">About</Link></li>
              <li><Link href="/blog" className="hover:text-pink-400 transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-pink-400 transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-pink-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center">
          <p>© 2024 Ai Emoji. Express yourself with AI-powered emojis ✨</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <Link href="/terms" className="hover:text-violet-600 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-violet-600 transition-colors">Privacy</Link>
            <Link href="/cookies" className="hover:text-violet-600 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}