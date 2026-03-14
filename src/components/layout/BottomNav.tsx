import React from 'react';
import { Home, BookOpen, Search, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nContext';

const navItems = [
  { icon: Home, labelKey: 'nav.home' as const, path: '/' },
  { icon: BookOpen, labelKey: 'nav.academy' as const, path: '/courses' },
  { icon: Search, labelKey: 'nav.wiki' as const, path: '/wiki' },
  { icon: User, labelKey: 'nav.account' as const, path: '/dashboard' },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 glass border-t border-border flex items-center justify-around px-6 z-50 pb-safe">
      {navItems.map(item => {
        const isActive = location.pathname === item.path || 
          (item.path !== '/' && location.pathname.startsWith(item.path));
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium uppercase tracking-wider">{t(item.labelKey)}</span>
          </button>
        );
      })}
    </nav>
  );
}
