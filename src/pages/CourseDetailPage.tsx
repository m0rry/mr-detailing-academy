import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, BarChart3, Star, Users, Lock, PlayCircle, CheckCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useI18n } from '@/i18n/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { getCourseBySlug, getCourseTitle, getCourseDescription, getModuleTitle, getLessonTitle } from '@/data/courses';

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, locale } = useI18n();
  const { user, isAuthenticated, enrollCourse } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum'>('overview');
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  const course = getCourseBySlug(slug || '');
  if (!course) return <div className="p-6 text-center text-muted-foreground">{t('common.noResults')}</div>;

  const isEnrolled = user?.enrolledCourses.includes(course.id);
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);

  const toggleModule = (id: string) => {
    setExpandedModules(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const handleEnroll = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!course.isFree && user?.subscription === 'free') { navigate('/pricing'); return; }
    enrollCourse(course.id);
  };

  const completedInCourse = user?.completedLessons.filter(
    lid => course.modules.some(m => m.lessons.some(l => l.id === lid))
  ).length || 0;

  const progressPct = totalLessons > 0 ? Math.round((completedInCourse / totalLessons) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header image */}
      <div className="relative h-56 w-full">
        <img src={course.image} alt={getCourseTitle(course, locale)} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <button onClick={() => navigate('/courses')} className="absolute top-4 start-4 p-2 rounded-full glass text-foreground">
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="px-4 -mt-12 relative">
        <div className="flex gap-2 mb-3">
          <span className="px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase rounded">
            {course.level}
          </span>
          {course.isFree && (
            <span className="px-2 py-1 bg-success text-primary-foreground text-[10px] font-bold uppercase rounded">
              {t('courses.free')}
            </span>
          )}
          {!course.isFree && (
            <span className="px-2 py-1 bg-warning text-primary-foreground text-[10px] font-bold uppercase rounded">
              {t('courses.premium')}
            </span>
          )}
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">{getCourseTitle(course, locale)}</h1>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1"><Clock size={12} /> {course.totalDuration}</span>
          <span className="flex items-center gap-1"><BarChart3 size={12} /> {totalLessons} {t('courses.lessons')}</span>
          <span className="flex items-center gap-1"><Star size={12} /> {course.rating}</span>
          <span className="flex items-center gap-1"><Users size={12} /> {course.studentsCount.toLocaleString()}</span>
        </div>

        {/* Progress bar if enrolled */}
        {isEnrolled && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{t('courses.progress')}</span>
              <span>{progressPct}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        )}

        {/* Enroll / Continue button */}
        {!isEnrolled ? (
          <button onClick={handleEnroll} className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-brand-dark transition-all mb-6">
            {t('courses.enroll')}
          </button>
        ) : (
          <button
            onClick={() => {
              const firstIncomplete = course.modules.flatMap(m => m.lessons).find(l => !user?.completedLessons.includes(l.id));
              if (firstIncomplete) navigate(`/courses/${course.slug}/lesson/${firstIncomplete.id}`);
            }}
            className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-brand-dark transition-all mb-6"
          >
            {t('courses.continue')}
          </button>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-secondary rounded-xl p-1">
          {(['overview', 'curriculum'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
              }`}
            >
              {t(`courses.${tab}`)}
            </button>
          ))}
        </div>

        {activeTab === 'overview' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-8">
            <p className="text-sm text-muted-foreground leading-relaxed">{getCourseDescription(course, locale)}</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-8 space-y-3">
            {course.modules.map(mod => (
              <div key={mod.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="w-full p-4 flex items-center justify-between text-start"
                >
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{getModuleTitle(mod, locale)}</h3>
                    <p className="text-xs text-muted-foreground">{mod.lessons.length} {t('courses.lessons')}</p>
                  </div>
                  {expandedModules.includes(mod.id) ? <ChevronDown size={16} className="text-muted-foreground" /> : <ChevronRight size={16} className="text-muted-foreground" />}
                </button>
                {expandedModules.includes(mod.id) && (
                  <div className="border-t border-border">
                    {mod.lessons.map(lesson => {
                      const isCompleted = user?.completedLessons.includes(lesson.id);
                      const canAccess = isEnrolled || lesson.isPreview;
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => canAccess && navigate(`/courses/${course.slug}/lesson/${lesson.id}`)}
                          disabled={!canAccess}
                          className={`w-full p-4 flex items-center gap-3 text-start border-t border-border first:border-t-0 transition-colors ${
                            canAccess ? 'hover:bg-secondary' : 'opacity-50'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle size={18} className="text-success flex-shrink-0" />
                          ) : canAccess ? (
                            <PlayCircle size={18} className="text-primary flex-shrink-0" />
                          ) : (
                            <Lock size={18} className="text-muted-foreground flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{getLessonTitle(lesson, locale)}</p>
                            <p className="text-xs text-muted-foreground">{lesson.durationMinutes} min</p>
                          </div>
                          {lesson.isPreview && !isEnrolled && (
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-medium rounded">{t('courses.free')}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
