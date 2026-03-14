import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { courses, getLessonTitle, getLessonContent } from '@/data/courses';

export default function LessonPage() {
  const { slug, lessonId } = useParams<{ slug: string; lessonId: string }>();
  const { t, locale, isRtl } = useI18n();
  const { user, completeLesson } = useAuth();
  const navigate = useNavigate();

  const course = courses.find(c => c.slug === slug);
  if (!course) return null;

  const allLessons = course.modules.flatMap(m => m.lessons);
  const currentIdx = allLessons.findIndex(l => l.id === lessonId);
  const lesson = allLessons[currentIdx];
  if (!lesson) return null;

  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;
  const isCompleted = user?.completedLessons.includes(lesson.id);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <button onClick={() => navigate(`/courses/${slug}`)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm">
        <ArrowLeft size={16} /> {t('common.back')}
      </button>

      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-1">{t('courses.lessons')} {currentIdx + 1}/{allLessons.length}</p>
        <h1 className="text-2xl font-bold text-foreground">{getLessonTitle(lesson, locale)}</h1>
        <p className="text-xs text-muted-foreground mt-1">{lesson.durationMinutes} min</p>
      </div>

      {/* Video placeholder */}
      {lesson.videoUrl && (
        <div className="aspect-video bg-card border border-border rounded-2xl mb-6 flex items-center justify-center text-muted-foreground">
          Video Player
        </div>
      )}

      {/* Content */}
      <div className="prose prose-invert max-w-none mb-8">
        {getLessonContent(lesson, locale).split('\n\n').map((para, i) => (
          <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-4">{para}</p>
        ))}
      </div>

      {/* Mark complete */}
      <button
        onClick={() => completeLesson(lesson.id)}
        disabled={isCompleted}
        className={`w-full py-3.5 rounded-xl font-semibold transition-all mb-6 ${
          isCompleted
            ? 'bg-success/20 text-success'
            : 'bg-primary text-primary-foreground hover:bg-brand-dark'
        }`}
      >
        <span className="flex items-center justify-center gap-2">
          <CheckCircle size={18} />
          {isCompleted ? t('courses.completed') : t('courses.markComplete')}
        </span>
      </button>

      {/* Navigation */}
      <div className="flex gap-3">
        {prevLesson && (
          <button
            onClick={() => navigate(`/courses/${slug}/lesson/${prevLesson.id}`)}
            className="flex-1 py-3 bg-secondary text-secondary-foreground rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors"
          >
            {isRtl ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {t('courses.prevLesson')}
          </button>
        )}
        {nextLesson && (
          <button
            onClick={() => navigate(`/courses/${slug}/lesson/${nextLesson.id}`)}
            className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-brand-dark transition-colors"
          >
            {t('courses.nextLesson')}
            {isRtl ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}
