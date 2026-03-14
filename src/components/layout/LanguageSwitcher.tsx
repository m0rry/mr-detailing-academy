import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { Locale, localeConfig } from '@/i18n/translations';

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm"
      >
        <Globe size={16} />
        <span>{localeConfig[locale].flag}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-2 end-0 bg-card border border-border rounded-xl shadow-premium z-50 overflow-hidden min-w-[160px]">
            {(Object.keys(localeConfig) as Locale[]).map(loc => (
              <button
                key={loc}
                onClick={() => { setLocale(loc); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  locale === loc ? 'bg-primary/10 text-primary' : 'hover:bg-secondary text-foreground'
                }`}
              >
                <span>{localeConfig[loc].flag}</span>
                <span>{localeConfig[loc].label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
