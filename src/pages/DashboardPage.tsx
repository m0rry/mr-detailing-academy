import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BookOpen, Award, Settings, CreditCard, Heart, Bell, HelpCircle, Globe, LogOut, ChevronRight, Clock, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '@/i18n/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { Locale, localeConfig } from '@/i18n/translations';
import { courses, getCourseTitle } from '@/data/courses';

export default function DashboardPage() {
  const { t, locale, setLocale } = useI18n();
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [showLangPicker, setShowLangPicker] = useState(false);

  if (!user) return null;

  const enrolledCourseData = courses.filter(c => user.enrolledCourses.includes(c.id));
  const completedCount = user.completedLessons.length;
  const totalLessons = enrolledCourseData.reduce((sum, c) => sum + c.modules.reduce((s, m) => s + m.lessons.length, 0), 0);

  const stats = [
    { icon: BookOpen, label: t('dashboard.activeCourses'), value: enrolledCourseData.length.toString() },
    { icon: Award, label: t('dashboard.completedLessons'), value: completedCount.toString() },
    { icon: Clock, label: t('dashboard.hoursLearned'), value: Math.round(completedCount * 0.5).toString() },
  ];

  const menuItems = [
    { icon: User, label: t('dashboard.editProfile'), action: () => navigate('/dashboard/profile') },
    { icon: CreditCard, label: t('dashboard.subscription'), action: () => navigate('/pricing') },
    { icon: Heart, label: t('dashboard.favorites'), action: () => {} },
    { icon: Bell, label: t('dashboard.notifications'), action: () => {} },
    { icon: HelpCircle, label: t('dashboard.support'), action: () => navigate('/support') },
  ];

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      {/* Profile header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-brand-glow p-0.5">
          <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-xl font-bold text-foreground">
            {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">{user.name}</h1>
          <p className="text-primary text-sm font-medium capitalize">{user.subscription} {t('dashboard.subscription')}</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border rounded-2xl p-4 text-center"
          >
            <stat.icon size={18} className="text-primary mx-auto mb-2" />
            <div className="text-xl font-bold text-foreground font-mono">{stat.value}</div>
            <div className="text-[10px] text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Continue learning */}
      {enrolledCourseData.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-foreground mb-3">{t('dashboard.continueWhere')}</h2>
          <div className="grid gap-3">
            {enrolledCourseData.slice(0, 2).map(course => {
              const allLessons = course.modules.flatMap(m => m.lessons);
              const completed = user.completedLessons.filter(lid => allLessons.some(l => l.id === lid)).length;
              const pct = Math.round((completed / allLessons.length) * 100);
              return (
                <button
                  key={course.id}
                  onClick={() => navigate(`/courses/${course.slug}`)}
                  className="text-start flex gap-3 p-3 bg-card border border-border rounded-2xl hover:border-primary/30 transition-colors"
                >
                  <img src={course.image} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-foreground truncate">{getCourseTitle(course, locale)}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{pct}%</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {enrolledCourseData.length === 0 && (
        <div className="mb-8 p-6 bg-card border border-border rounded-2xl text-center">
          <BookOpen size={32} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">{t('dashboard.noCourses')}</p>
          <button onClick={() => navigate('/courses')} className="mt-3 px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium">
            {t('courses.title')}
          </button>
        </div>
      )}

      {/* Menu */}
      <div className="space-y-1 mb-6">
        {menuItems.map((item, i) => (
          <button
            key={i}
            onClick={item.action}
            className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:bg-secondary transition-colors"
          >
            <span className="flex items-center gap-3">
              <item.icon size={18} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{item.label}</span>
            </span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        ))}

        {/* Language */}
        <div className="relative">
          <button
            onClick={() => setShowLangPicker(!showLangPicker)}
            className="w-full flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:bg-secondary transition-colors"
          >
            <span className="flex items-center gap-3">
              <Globe size={18} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{t('dashboard.language')}</span>
            </span>
            <span className="text-sm text-muted-foreground">{localeConfig[locale].flag} {localeConfig[locale].label}</span>
          </button>
          {showLangPicker && (
            <div className="mt-1 bg-card border border-border rounded-xl overflow-hidden">
              {(Object.keys(localeConfig) as Locale[]).map(loc => (
                <button
                  key={loc}
                  onClick={() => { setLocale(loc); updateProfile({ language: loc }); setShowLangPicker(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                    locale === loc ? 'bg-primary/10 text-primary' : 'hover:bg-secondary text-foreground'
                  }`}
                >
                  <span>{localeConfig[loc].flag}</span>
                  <span>{localeConfig[loc].label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sign out */}
      <button
        onClick={() => { logout(); navigate('/'); }}
        className="w-full flex items-center gap-3 p-4 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
      >
        <LogOut size={18} />
        <span className="font-medium text-sm">{t('common.signOut')}</span>
      </button>
    </div>
  );
}
