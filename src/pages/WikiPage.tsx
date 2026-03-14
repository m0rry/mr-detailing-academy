import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '@/i18n/I18nContext';
import { wikiCategories, wikiArticles, getCategoryTitle, getArticleTitle, getArticleBody } from '@/data/wiki';

export default function WikiPage() {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filtered = wikiArticles.filter(a => {
    const matchSearch = !search || getArticleTitle(a, locale).toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    const matchCat = !selectedCategory || a.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const popular = wikiArticles.filter(a => a.popular);

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('wiki.title')}</h1>
        <p className="text-muted-foreground text-sm">{t('wiki.subtitle')}</p>
      </header>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder={t('wiki.search')}
          className="w-full ps-11 pe-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
        />
      </div>

      {/* Categories */}
      {!search && !selectedCategory && (
        <>
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">{t('wiki.categories')}</h2>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {wikiCategories.map((cat, i) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedCategory(cat.slug)}
                className="bg-card border border-border p-4 rounded-2xl text-start hover:border-primary/30 transition-colors"
              >
                <span className="text-2xl mb-2 block">{cat.icon}</span>
                <h3 className="font-semibold text-foreground text-sm">{getCategoryTitle(cat, locale)}</h3>
                <p className="text-xs text-muted-foreground">{cat.count} {t('wiki.articles')}</p>
              </motion.button>
            ))}
          </div>
        </>
      )}

      {/* Category header */}
      {selectedCategory && !search && (
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setSelectedCategory(null)} className="text-primary text-sm hover:underline">{t('common.back')}</button>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground text-sm font-medium">
            {getCategoryTitle(wikiCategories.find(c => c.slug === selectedCategory)!, locale)}
          </span>
        </div>
      )}

      {/* Popular (when no filter) */}
      {!search && !selectedCategory && (
        <>
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">{t('wiki.popular')}</h2>
        </>
      )}

      {/* Articles */}
      <div className="grid gap-3">
        {(search || selectedCategory ? filtered : popular).map((article, i) => (
          <motion.button
            key={article.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(`/wiki/${article.slug}`)}
            className="text-start bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-colors"
          >
            {article.image && (
              <img src={article.image} alt={getArticleTitle(article, locale)} className="w-full h-32 object-cover" loading="lazy" />
            )}
            <div className="p-4">
              <h3 className="font-semibold text-foreground text-sm mb-1">{getArticleTitle(article, locale)}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{getArticleBody(article, locale).slice(0, 120)}...</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                {article.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-secondary text-secondary-foreground text-[10px] rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          </motion.button>
        ))}
        {filtered.length === 0 && search && (
          <div className="text-center py-8 text-muted-foreground text-sm">{t('wiki.noArticles')}</div>
        )}
      </div>
    </div>
  );
}
