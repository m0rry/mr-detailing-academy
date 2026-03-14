import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Users, Award, ArrowRight, Star, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nContext';
import { courses, getCourseTitle, getCourseDescription } from '@/data/courses';
import { useAuth } from '@/contexts/AuthContext';

const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

export default function HomePage() {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    { icon: BookOpen, title: t('home.features.courses'), desc: t('home.features.coursesDesc') },
    { icon: Search, title: t('home.features.wiki'), desc: t('home.features.wikiDesc') },
    { icon: Users, title: t('home.features.community'), desc: t('home.features.communityDesc') },
    { icon: Award, title: t('home.features.certificate'), desc: t('home.features.certificateDesc') },
  ];

  const stats = [
    { value: '12,500+', label: t('home.stats.students') },
    { value: '45+', label: t('home.stats.courses') },
    { value: '380+', label: t('home.stats.lessons') },
    { value: '28', label: t('home.stats.countries') },
  ];

  const faqs = [
    {
      q: locale === 'ru' ? 'Как начать обучение?' : locale === 'he' ? 'איך להתחיל ללמוד?' : 'How do I get started?',
      a: locale === 'ru' ? 'Зарегистрируйтесь бесплатно, выберите курс и начните учиться. Базовые курсы доступны бесплатно.' : locale === 'he' ? 'הירשמו בחינם, בחרו קורס והתחילו ללמוד. קורסים בסיסיים זמינים בחינם.' : 'Sign up for free, choose a course, and start learning. Basic courses are available at no cost.',
    },
    {
      q: locale === 'ru' ? 'Получу ли я сертификат?' : locale === 'he' ? 'האם אקבל תעודה?' : 'Will I receive a certificate?',
      a: locale === 'ru' ? 'Да! По завершении каждого курса вы получите сертификат GLOSS Academy.' : locale === 'he' ? 'כן! בסיום כל קורס תקבלו תעודת GLOSS Academy.' : 'Yes! Upon completing each course, you\'ll receive a GLOSS Academy certificate.',
    },
    {
      q: locale === 'ru' ? 'Могу ли я учиться на телефоне?' : locale === 'he' ? 'אפשר ללמוד מהטלפון?' : 'Can I learn on my phone?',
      a: locale === 'ru' ? 'Абсолютно! Платформа полностью оптимизирована для мобильных устройств.' : locale === 'he' ? 'בהחלט! הפלטפורמה מותאמת לחלוטין למובייל.' : 'Absolutely! The platform is fully optimized for mobile devices.',
    },
  ];

  const popularCourses = courses.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <motion.section {...fadeIn} className="relative px-6 pt-12 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="relative max-w-lg mx-auto text-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6"
          >
            <Star size={12} /> PREMIUM DETAILING EDUCATION
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground leading-tight">
            {t('home.hero.title')}
          </h1>
          <p className="text-muted-foreground text-base md:text-lg mb-8 leading-relaxed">
            {t('home.hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(isAuthenticated ? '/courses' : '/register')}
              className="px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-brand-dark transition-all shadow-brand-glow"
            >
              {t('home.hero.cta')}
            </button>
            <button
              onClick={() => navigate('/courses')}
              className="px-8 py-3.5 bg-secondary text-secondary-foreground rounded-xl font-semibold hover:bg-secondary/80 transition-all"
            >
              {t('courses.overview')}
            </button>
          </div>
        </div>
      </motion.section>

      {/* Stats */}
      <section className="px-6 pb-12">
        <div className="max-w-lg mx-auto grid grid-cols-2 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="bg-card border border-border rounded-2xl p-5 text-center"
            >
              <div className="text-2xl font-bold text-foreground font-mono">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-12">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-foreground">{t('home.features.title')}</h2>
          <div className="grid gap-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 * i }}
                className="flex gap-4 p-5 bg-card border border-border rounded-2xl"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <f.icon size={22} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="px-6 pb-12">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">{t('home.popular.title')}</h2>
            <button onClick={() => navigate('/courses')} className="text-primary text-sm font-medium flex items-center gap-1">
              {t('common.seeAll')} <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid gap-4">
            {popularCourses.map(course => (
              <button
                key={course.id}
                onClick={() => navigate(`/courses/${course.slug}`)}
                className="text-start bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-colors"
              >
                <div className="relative h-40 w-full">
                  <img src={course.image} alt={getCourseTitle(course, locale)} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  <div className="absolute bottom-3 start-3">
                    <span className="px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase rounded">
                      {course.level}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-1">{getCourseTitle(course, locale)}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{getCourseDescription(course, locale)}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                    <span>{course.totalDuration}</span>
                    <span>⭐ {course.rating}</span>
                    <span>{course.studentsCount.toLocaleString()} {t('home.stats.students').toLowerCase()}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 pb-12">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-foreground">{t('home.faq.title')}</h2>
          <div className="grid gap-3">
            {faqs.map((faq, i) => (
              <details key={i} className="bg-card border border-border rounded-2xl group">
                <summary className="p-4 cursor-pointer font-medium text-foreground flex items-center justify-between list-none">
                  {faq.q}
                  <ChevronRight size={16} className="text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-16">
        <div className="max-w-lg mx-auto bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">{t('home.hero.cta')}</h2>
          <p className="text-muted-foreground mb-6 text-sm">{t('home.hero.subtitle')}</p>
          <button
            onClick={() => navigate(isAuthenticated ? '/courses' : '/register')}
            className="px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-brand-dark transition-all inline-flex items-center gap-2"
          >
            {t('common.getStarted')} <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
