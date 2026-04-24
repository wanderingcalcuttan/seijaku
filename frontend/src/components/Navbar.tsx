"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { canonicalShopRoutes } from "@/src/lib/shop-routes";

import HomeDiscoveryRail from "./HomeDiscoveryRail";
import MenuSlider from "./MenuSlider";
import SearchOverlay from "./SearchOverlay";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isHome = pathname === "/";

  return (
    <>
      <header className="fixed top-0 z-50 w-full">
        <div className="brand-surface border-b border-white/8">
          <div className="mx-auto grid h-[72px] w-full max-w-[1480px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 sm:h-[76px] sm:px-8 md:px-10 lg:px-14 xl:px-[72px]">
            <div className="flex items-center justify-start pl-1 text-[#e0c98a] sm:pl-2 lg:pl-0">
              <button
                type="button"
                aria-label="Open menu"
                aria-expanded={isMenuOpen}
                aria-controls="seijaku-drawer"
                onClick={() => setIsMenuOpen(true)}
                className="opacity-90 transition-opacity duration-200 hover:opacity-100"
              >
                <Menu size={18} strokeWidth={1.9} className="sm:h-5 sm:w-5" />
              </button>
            </div>

            <Link href="/" aria-label="Go to home page" className="inline-flex items-center justify-center">
              <Image
                src="/images/seijaku-emblem-g.png"
                alt="Seijaku emblem"
                width={48}
                height={48}
                className="h-auto w-[40px] sm:w-[44px] md:w-[48px]"
                priority
              />
            </Link>

            <div className="flex items-center justify-end gap-4 pr-1 text-[#e0c98a] sm:gap-5 sm:pr-2 lg:pr-0">
              <button
                type="button"
                aria-label="Search"
                onClick={() => setIsSearchOpen(true)}
                className="opacity-90 transition-opacity duration-200 hover:opacity-100"
              >
                <Search size={18} strokeWidth={1.9} className="sm:h-5 sm:w-5" />
              </button>

              <Link
                href="/admin/login"
                aria-label="Admin sign in"
                className="inline-flex opacity-90 transition-opacity duration-200 hover:opacity-100"
              >
                <User size={18} strokeWidth={1.9} className="sm:h-5 sm:w-5" />
              </Link>

              <Link
                href={canonicalShopRoutes.collection}
                aria-label="Open collection"
                className="inline-flex opacity-90 transition-opacity duration-200 hover:opacity-100"
              >
                <ShoppingBag size={18} strokeWidth={1.9} className="sm:h-5 sm:w-5" />
              </Link>
            </div>
          </div>
        </div>

        {isHome && <HomeDiscoveryRail />}
      </header>

      <MenuSlider isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <SearchOverlay open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
