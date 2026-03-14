import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { wikiArticles, getArticleTitle, getArticleBody } from '@/data/wiki';

export default function WikiArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, locale } = useI18n();
  const navigate = useNavigate();

  const article = wikiArticles.find(a => a.slug === slug);
  if (!article) return <div className="p-6 text-center text-muted-foreground">{t('common.noResults')}</div>;

  const body = getArticleBody(article, locale);
  const related = wikiArticles.filter(a => a.id !== article.id && a.category === article.category).slice(0, 3);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <button onClick={() => navigate('/wiki')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm">
        <ArrowLeft size={16} /> {t('common.back')}
      </button>

      {article.image && (
        <img src={article.image} alt={getArticleTitle(article, locale)} className="w-full h-48 object-cover rounded-2xl mb-6" />
      )}

      <h1 className="text-2xl font-bold text-foreground mb-4">{getArticleTitle(article, locale)}</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {article.tags.map(tag => (
          <span key={tag} className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-full">{tag}</span>
        ))}
      </div>

      {/* Render markdown-like content */}
      <div className="space-y-4 mb-8">
        {body.split('\n').map((line, i) => {
          if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold text-foreground mt-6 mb-2">{line.replace('## ', '')}</h2>;
          if (line.startsWith('- **')) {
            const match = line.match(/- \*\*(.+?)\*\*:?\s*(.*)/);
            if (match) return <p key={i} className="text-sm text-muted-foreground"><strong className="text-foreground">{match[1]}</strong>{match[2] ? ': ' + match[2] : ''}</p>;
          }
          if (line.startsWith('- ')) return <p key={i} className="text-sm text-muted-foreground ps-4">• {line.slice(2)}</p>;
          if (line.match(/^\d+\./)) return <p key={i} className="text-sm text-muted-foreground ps-4">{line}</p>;
          if (line.trim()) return <p key={i} className="text-sm text-muted-foreground leading-relaxed">{line}</p>;
          return null;
        })}
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">{t('wiki.related')}</h2>
          <div className="grid gap-3">
            {related.map(a => (
              <button
                key={a.id}
                onClick={() => navigate(`/wiki/${a.slug}`)}
                className="text-start p-4 bg-card border border-border rounded-xl hover:border-primary/30 transition-colors"
              >
                <h3 className="text-sm font-medium text-foreground">{getArticleTitle(a, locale)}</h3>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
