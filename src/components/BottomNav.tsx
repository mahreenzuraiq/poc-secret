'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wrench, MessageCircle, User } from 'lucide-react';

const NAV_TABS = [
  { href: '/',               label: 'Home',     icon: Home          },
  { href: '/raise-complaint',label: 'Services', icon: Wrench        },
  { href: '/contact',        label: 'Chat',     icon: MessageCircle },
  { href: '/profile',        label: 'Profile',  icon: User          },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Don't show on login page
  if (pathname === '/login') return null;

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {NAV_TABS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`bottom-nav-tab${isActive ? ' active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon
              className="w-6 h-6 relative z-10"
              strokeWidth={isActive ? 2.5 : 1.75}
              aria-hidden="true"
            />
            <span className="relative z-10">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
