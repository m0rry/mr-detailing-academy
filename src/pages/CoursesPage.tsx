import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, BarChart3, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '@/i18n/I18nContext';
import { courses, getCourseTitle, getCourseDescription } from '@/data/courses';

export default function CoursesPage() {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');

  const filtered = courses.filter(c => {
    const title = getCourseTitle(c, locale).toLowerCase();
    const matchesSearch = !search || title.includes(search.toLowerCase());
    const matchesLevel = levelFilter === 'all' || c.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const levels = ['all', 'beginner', 'intermediate', 'advanced'] as const;
  const levelLabels: Record<string, string> = {
    all: t('courses.allLevels'),
    beginner: t('courses.beginner'),
    intermediate: t('courses.intermediate'),
    advanced: t('courses.advanced'),
  };

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('courses.title')}</h1>
        <p className="text-muted-foreground text-sm">{t('courses.subtitle')}</p>
      </header>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder={t('courses.search')}
          className="w-full ps-11 pe-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
        />
      </div>

      {/* Level filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {levels.map(level => (
          <button
            key={level}
            onClick={() => setLevelFilter(level)}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              levelFilter === level
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {levelLabels[level]}
          </button>
        ))}
      </div>

      {/* Courses grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">{t('courses.noCoursesFound')}</div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((course, i) => (
            <motion.button
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/courses/${course.slug}`)}
              className="text-start bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all group"
            >
              <div className="relative h-44 w-full">
                <img src={course.image} alt={getCourseTitle(course, locale)} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                <div className="absolute bottom-3 start-3 flex gap-2">
                  <span className="px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase rounded">
                    {levelLabels[course.level]}
                  </span>
                  {course.isFree && (
                    <span className="px-2 py-1 bg-success text-primary-foreground text-[10px] font-bold uppercase rounded">
                      {t('courses.free')}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">{getCourseTitle(course, locale)}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{getCourseDescription(course, locale)}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock size={12} /> {course.totalDuration}</span>
                  <span className="flex items-center gap-1"><BarChart3 size={12} /> {course.modules.length} {t('courses.modules')}</span>
                  <span className="flex items-center gap-1"><Star size={12} /> {course.rating}</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
