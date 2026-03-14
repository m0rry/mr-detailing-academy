export type Locale = 'en' | 'ru' | 'he';

export const localeConfig: Record<Locale, { dir: 'ltr' | 'rtl'; label: string; flag: string }> = {
  en: { dir: 'ltr', label: 'English', flag: '🇬🇧' },
  ru: { dir: 'ltr', label: 'Русский', flag: '🇷🇺' },
  he: { dir: 'rtl', label: 'עברית', flag: '🇮🇱' },
};

type TranslationKeys = {
  // Nav
  'nav.home': string;
  'nav.academy': string;
  'nav.wiki': string;
  'nav.account': string;
  'nav.admin': string;
  'nav.pricing': string;
  // Common
  'common.save': string;
  'common.cancel': string;
  'common.loading': string;
  'common.search': string;
  'common.back': string;
  'common.next': string;
  'common.previous': string;
  'common.seeAll': string;
  'common.learnMore': string;
  'common.getStarted': string;
  'common.signIn': string;
  'common.signUp': string;
  'common.signOut': string;
  'common.email': string;
  'common.password': string;
  'common.name': string;
  'common.submit': string;
  'common.edit': string;
  'common.delete': string;
  'common.publish': string;
  'common.unpublish': string;
  'common.noResults': string;
  'common.error': string;
  'common.success': string;
  'common.tryAgain': string;
  // Home
  'home.hero.title': string;
  'home.hero.subtitle': string;
  'home.hero.cta': string;
  'home.features.title': string;
  'home.features.courses': string;
  'home.features.coursesDesc': string;
  'home.features.wiki': string;
  'home.features.wikiDesc': string;
  'home.features.community': string;
  'home.features.communityDesc': string;
  'home.features.certificate': string;
  'home.features.certificateDesc': string;
  'home.popular.title': string;
  'home.stats.students': string;
  'home.stats.courses': string;
  'home.stats.lessons': string;
  'home.stats.countries': string;
  'home.faq.title': string;
  'home.testimonials.title': string;
  // Auth
  'auth.login.title': string;
  'auth.login.subtitle': string;
  'auth.register.title': string;
  'auth.register.subtitle': string;
  'auth.forgotPassword': string;
  'auth.resetPassword': string;
  'auth.resetPassword.subtitle': string;
  'auth.noAccount': string;
  'auth.hasAccount': string;
  'auth.resetSent': string;
  // Courses
  'courses.title': string;
  'courses.subtitle': string;
  'courses.enroll': string;
  'courses.continue': string;
  'courses.modules': string;
  'courses.lessons': string;
  'courses.duration': string;
  'courses.level': string;
  'courses.beginner': string;
  'courses.intermediate': string;
  'courses.advanced': string;
  'courses.progress': string;
  'courses.completed': string;
  'courses.markComplete': string;
  'courses.nextLesson': string;
  'courses.prevLesson': string;
  'courses.materials': string;
  'courses.overview': string;
  'courses.curriculum': string;
  'courses.locked': string;
  'courses.free': string;
  'courses.premium': string;
  'courses.search': string;
  'courses.filter': string;
  'courses.allLevels': string;
  'courses.noCoursesFound': string;
  // Wiki
  'wiki.title': string;
  'wiki.subtitle': string;
  'wiki.search': string;
  'wiki.categories': string;
  'wiki.articles': string;
  'wiki.popular': string;
  'wiki.related': string;
  'wiki.readMore': string;
  'wiki.noArticles': string;
  // Dashboard
  'dashboard.title': string;
  'dashboard.welcome': string;
  'dashboard.myCourses': string;
  'dashboard.progress': string;
  'dashboard.subscription': string;
  'dashboard.settings': string;
  'dashboard.notifications': string;
  'dashboard.favorites': string;
  'dashboard.billing': string;
  'dashboard.support': string;
  'dashboard.language': string;
  'dashboard.profile': string;
  'dashboard.editProfile': string;
  'dashboard.completedLessons': string;
  'dashboard.activeCourses': string;
  'dashboard.hoursLearned': string;
  'dashboard.continueWhere': string;
  'dashboard.noCourses': string;
  'dashboard.noNotifications': string;
  // Pricing
  'pricing.title': string;
  'pricing.subtitle': string;
  'pricing.monthly': string;
  'pricing.yearly': string;
  'pricing.free': string;
  'pricing.pro': string;
  'pricing.enterprise': string;
  'pricing.freePlan.price': string;
  'pricing.proPlan.price': string;
  'pricing.enterprisePlan.price': string;
  'pricing.freePlan.desc': string;
  'pricing.proPlan.desc': string;
  'pricing.enterprisePlan.desc': string;
  'pricing.feature.basicCourses': string;
  'pricing.feature.allCourses': string;
  'pricing.feature.wikiAccess': string;
  'pricing.feature.certificates': string;
  'pricing.feature.prioritySupport': string;
  'pricing.feature.teamAccess': string;
  'pricing.feature.customBranding': string;
  'pricing.feature.apiAccess': string;
  'pricing.currentPlan': string;
  'pricing.upgrade': string;
  'pricing.choosePlan': string;
  'pricing.perMonth': string;
  'pricing.perYear': string;
  'pricing.popular': string;
  // Admin
  'admin.title': string;
  'admin.dashboard': string;
  'admin.users': string;
  'admin.courses': string;
  'admin.wiki': string;
  'admin.subscriptions': string;
  'admin.analytics': string;
  'admin.support': string;
  'admin.totalStudents': string;
  'admin.totalRevenue': string;
  'admin.activeSubs': string;
  'admin.courseCompletion': string;
  'admin.newCourse': string;
  'admin.newArticle': string;
  'admin.manage': string;
  // Support
  'support.title': string;
  'support.subtitle': string;
  'support.faq': string;
  'support.contact': string;
  'support.message': string;
  'support.send': string;
  'support.sent': string;
};

const en: TranslationKeys = {
  'nav.home': 'Home',
  'nav.academy': 'Academy',
  'nav.wiki': 'Wiki',
  'nav.account': 'Account',
  'nav.admin': 'Admin',
  'nav.pricing': 'Pricing',
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.loading': 'Loading...',
  'common.search': 'Search',
  'common.back': 'Back',
  'common.next': 'Next',
  'common.previous': 'Previous',
  'common.seeAll': 'See All',
  'common.learnMore': 'Learn More',
  'common.getStarted': 'Get Started',
  'common.signIn': 'Sign In',
  'common.signUp': 'Sign Up',
  'common.signOut': 'Sign Out',
  'common.email': 'Email',
  'common.password': 'Password',
  'common.name': 'Full Name',
  'common.submit': 'Submit',
  'common.edit': 'Edit',
  'common.delete': 'Delete',
  'common.publish': 'Publish',
  'common.unpublish': 'Unpublish',
  'common.noResults': 'No results found',
  'common.error': 'Something went wrong',
  'common.success': 'Success!',
  'common.tryAgain': 'Try Again',
  'home.hero.title': 'Master the Art of Detailing',
  'home.hero.subtitle': 'World-class education platform for professional auto detailing. Learn from industry experts, earn certificates, and elevate your craft.',
  'home.hero.cta': 'Start Learning',
  'home.features.title': 'Why GLOSS Academy',
  'home.features.courses': 'Expert Courses',
  'home.features.coursesDesc': 'Structured learning paths crafted by industry veterans with decades of experience.',
  'home.features.wiki': 'Knowledge Base',
  'home.features.wikiDesc': 'Comprehensive detailing encyclopedia covering every technique, product, and methodology.',
  'home.features.community': 'Pro Community',
  'home.features.communityDesc': 'Connect with thousands of professionals worldwide. Share, learn, and grow together.',
  'home.features.certificate': 'Certification',
  'home.features.certificateDesc': 'Earn recognized certificates that prove your expertise to clients and employers.',
  'home.popular.title': 'Popular Courses',
  'home.stats.students': 'Active Students',
  'home.stats.courses': 'Courses',
  'home.stats.lessons': 'Video Lessons',
  'home.stats.countries': 'Countries',
  'home.faq.title': 'Frequently Asked Questions',
  'home.testimonials.title': 'What Our Students Say',
  'auth.login.title': 'Welcome Back',
  'auth.login.subtitle': 'Sign in to continue your learning journey',
  'auth.register.title': 'Join GLOSS Academy',
  'auth.register.subtitle': 'Create your account and start learning today',
  'auth.forgotPassword': 'Forgot Password?',
  'auth.resetPassword': 'Reset Password',
  'auth.resetPassword.subtitle': 'Enter your email to receive a reset link',
  'auth.noAccount': "Don't have an account?",
  'auth.hasAccount': 'Already have an account?',
  'auth.resetSent': 'Reset link sent! Check your email.',
  'courses.title': 'Academy',
  'courses.subtitle': 'Professional detailing education from world experts.',
  'courses.enroll': 'Enroll Now',
  'courses.continue': 'Continue Learning',
  'courses.modules': 'Modules',
  'courses.lessons': 'Lessons',
  'courses.duration': 'Duration',
  'courses.level': 'Level',
  'courses.beginner': 'Beginner',
  'courses.intermediate': 'Intermediate',
  'courses.advanced': 'Advanced',
  'courses.progress': 'Progress',
  'courses.completed': 'Completed',
  'courses.markComplete': 'Mark as Complete',
  'courses.nextLesson': 'Next Lesson',
  'courses.prevLesson': 'Previous Lesson',
  'courses.materials': 'Materials',
  'courses.overview': 'Overview',
  'courses.curriculum': 'Curriculum',
  'courses.locked': 'Locked — Upgrade to access',
  'courses.free': 'Free',
  'courses.premium': 'Premium',
  'courses.search': 'Search courses...',
  'courses.filter': 'Filter',
  'courses.allLevels': 'All Levels',
  'courses.noCoursesFound': 'No courses match your filters.',
  'wiki.title': 'Knowledge Base',
  'wiki.subtitle': 'Your comprehensive detailing encyclopedia.',
  'wiki.search': 'Search articles...',
  'wiki.categories': 'Categories',
  'wiki.articles': 'Articles',
  'wiki.popular': 'Popular Articles',
  'wiki.related': 'Related Articles',
  'wiki.readMore': 'Read More',
  'wiki.noArticles': 'No articles found.',
  'dashboard.title': 'Dashboard',
  'dashboard.welcome': 'Welcome back',
  'dashboard.myCourses': 'My Courses',
  'dashboard.progress': 'My Progress',
  'dashboard.subscription': 'Subscription',
  'dashboard.settings': 'Settings',
  'dashboard.notifications': 'Notifications',
  'dashboard.favorites': 'Favorites',
  'dashboard.billing': 'Billing',
  'dashboard.support': 'Help & Support',
  'dashboard.language': 'Language',
  'dashboard.profile': 'Profile',
  'dashboard.editProfile': 'Edit Profile',
  'dashboard.completedLessons': 'Completed Lessons',
  'dashboard.activeCourses': 'Active Courses',
  'dashboard.hoursLearned': 'Hours Learned',
  'dashboard.continueWhere': 'Continue Where You Left Off',
  'dashboard.noCourses': 'You haven\'t enrolled in any courses yet.',
  'dashboard.noNotifications': 'No new notifications.',
  'pricing.title': 'Choose Your Plan',
  'pricing.subtitle': 'Invest in your craft. Choose the plan that fits your goals.',
  'pricing.monthly': 'Monthly',
  'pricing.yearly': 'Yearly',
  'pricing.free': 'Free',
  'pricing.pro': 'Pro',
  'pricing.enterprise': 'Enterprise',
  'pricing.freePlan.price': '$0',
  'pricing.proPlan.price': '$29',
  'pricing.enterprisePlan.price': '$99',
  'pricing.freePlan.desc': 'Perfect for getting started',
  'pricing.proPlan.desc': 'For serious professionals',
  'pricing.enterprisePlan.desc': 'For teams and businesses',
  'pricing.feature.basicCourses': 'Access to 3 free courses',
  'pricing.feature.allCourses': 'Access to all courses',
  'pricing.feature.wikiAccess': 'Full wiki access',
  'pricing.feature.certificates': 'Completion certificates',
  'pricing.feature.prioritySupport': 'Priority support',
  'pricing.feature.teamAccess': 'Team management',
  'pricing.feature.customBranding': 'Custom branding',
  'pricing.feature.apiAccess': 'API access',
  'pricing.currentPlan': 'Current Plan',
  'pricing.upgrade': 'Upgrade',
  'pricing.choosePlan': 'Choose Plan',
  'pricing.perMonth': '/month',
  'pricing.perYear': '/year',
  'pricing.popular': 'Most Popular',
  'admin.title': 'Command Center',
  'admin.dashboard': 'Dashboard',
  'admin.users': 'Users',
  'admin.courses': 'Courses',
  'admin.wiki': 'Wiki',
  'admin.subscriptions': 'Subscriptions',
  'admin.analytics': 'Analytics',
  'admin.support': 'Support',
  'admin.totalStudents': 'Total Students',
  'admin.totalRevenue': 'Revenue (MTD)',
  'admin.activeSubs': 'Active Subscriptions',
  'admin.courseCompletion': 'Completion Rate',
  'admin.newCourse': 'New Course',
  'admin.newArticle': 'New Article',
  'admin.manage': 'Manage',
  'support.title': 'Help & Support',
  'support.subtitle': 'We\'re here to help you succeed.',
  'support.faq': 'FAQ',
  'support.contact': 'Contact Us',
  'support.message': 'Your message',
  'support.send': 'Send Message',
  'support.sent': 'Message sent! We\'ll get back to you soon.',
};

const ru: TranslationKeys = {
  'nav.home': 'Главная',
  'nav.academy': 'Академия',
  'nav.wiki': 'Вики',
  'nav.account': 'Аккаунт',
  'nav.admin': 'Админ',
  'nav.pricing': 'Тарифы',
  'common.save': 'Сохранить',
  'common.cancel': 'Отмена',
  'common.loading': 'Загрузка...',
  'common.search': 'Поиск',
  'common.back': 'Назад',
  'common.next': 'Далее',
  'common.previous': 'Назад',
  'common.seeAll': 'Смотреть все',
  'common.learnMore': 'Подробнее',
  'common.getStarted': 'Начать',
  'common.signIn': 'Войти',
  'common.signUp': 'Регистрация',
  'common.signOut': 'Выйти',
  'common.email': 'Email',
  'common.password': 'Пароль',
  'common.name': 'Полное имя',
  'common.submit': 'Отправить',
  'common.edit': 'Редактировать',
  'common.delete': 'Удалить',
  'common.publish': 'Опубликовать',
  'common.unpublish': 'Снять с публикации',
  'common.noResults': 'Ничего не найдено',
  'common.error': 'Что-то пошло не так',
  'common.success': 'Успешно!',
  'common.tryAgain': 'Попробовать снова',
  'home.hero.title': 'Мастерство детейлинга',
  'home.hero.subtitle': 'Мировая образовательная платформа для профессионального авто-детейлинга. Учитесь у экспертов индустрии, получайте сертификаты и развивайте своё мастерство.',
  'home.hero.cta': 'Начать обучение',
  'home.features.title': 'Почему GLOSS Academy',
  'home.features.courses': 'Экспертные курсы',
  'home.features.coursesDesc': 'Структурированные программы обучения от ветеранов индустрии с десятилетним опытом.',
  'home.features.wiki': 'База знаний',
  'home.features.wikiDesc': 'Полная энциклопедия детейлинга: техники, продукты и методологии.',
  'home.features.community': 'Сообщество',
  'home.features.communityDesc': 'Общайтесь с тысячами профессионалов по всему миру.',
  'home.features.certificate': 'Сертификация',
  'home.features.certificateDesc': 'Получайте признанные сертификаты, подтверждающие вашу экспертизу.',
  'home.popular.title': 'Популярные курсы',
  'home.stats.students': 'Активных студентов',
  'home.stats.courses': 'Курсов',
  'home.stats.lessons': 'Видео-уроков',
  'home.stats.countries': 'Стран',
  'home.faq.title': 'Часто задаваемые вопросы',
  'home.testimonials.title': 'Отзывы студентов',
  'auth.login.title': 'С возвращением',
  'auth.login.subtitle': 'Войдите, чтобы продолжить обучение',
  'auth.register.title': 'Присоединяйтесь к GLOSS',
  'auth.register.subtitle': 'Создайте аккаунт и начните учиться',
  'auth.forgotPassword': 'Забыли пароль?',
  'auth.resetPassword': 'Сбросить пароль',
  'auth.resetPassword.subtitle': 'Введите email для получения ссылки на сброс',
  'auth.noAccount': 'Нет аккаунта?',
  'auth.hasAccount': 'Уже есть аккаунт?',
  'auth.resetSent': 'Ссылка для сброса отправлена! Проверьте почту.',
  'courses.title': 'Академия',
  'courses.subtitle': 'Профессиональное обучение детейлингу от мировых экспертов.',
  'courses.enroll': 'Записаться',
  'courses.continue': 'Продолжить',
  'courses.modules': 'Модули',
  'courses.lessons': 'Уроки',
  'courses.duration': 'Длительность',
  'courses.level': 'Уровень',
  'courses.beginner': 'Начинающий',
  'courses.intermediate': 'Средний',
  'courses.advanced': 'Продвинутый',
  'courses.progress': 'Прогресс',
  'courses.completed': 'Завершено',
  'courses.markComplete': 'Отметить как пройденное',
  'courses.nextLesson': 'Следующий урок',
  'courses.prevLesson': 'Предыдущий урок',
  'courses.materials': 'Материалы',
  'courses.overview': 'Обзор',
  'courses.curriculum': 'Программа',
  'courses.locked': 'Заблокировано — Улучшите план',
  'courses.free': 'Бесплатно',
  'courses.premium': 'Премиум',
  'courses.search': 'Искать курсы...',
  'courses.filter': 'Фильтр',
  'courses.allLevels': 'Все уровни',
  'courses.noCoursesFound': 'Курсы не найдены.',
  'wiki.title': 'База знаний',
  'wiki.subtitle': 'Полная энциклопедия детейлинга.',
  'wiki.search': 'Искать статьи...',
  'wiki.categories': 'Категории',
  'wiki.articles': 'Статьи',
  'wiki.popular': 'Популярные статьи',
  'wiki.related': 'Похожие статьи',
  'wiki.readMore': 'Читать далее',
  'wiki.noArticles': 'Статьи не найдены.',
  'dashboard.title': 'Кабинет',
  'dashboard.welcome': 'С возвращением',
  'dashboard.myCourses': 'Мои курсы',
  'dashboard.progress': 'Мой прогресс',
  'dashboard.subscription': 'Подписка',
  'dashboard.settings': 'Настройки',
  'dashboard.notifications': 'Уведомления',
  'dashboard.favorites': 'Избранное',
  'dashboard.billing': 'Оплата',
  'dashboard.support': 'Поддержка',
  'dashboard.language': 'Язык',
  'dashboard.profile': 'Профиль',
  'dashboard.editProfile': 'Редактировать профиль',
  'dashboard.completedLessons': 'Пройдено уроков',
  'dashboard.activeCourses': 'Активных курсов',
  'dashboard.hoursLearned': 'Часов обучения',
  'dashboard.continueWhere': 'Продолжить обучение',
  'dashboard.noCourses': 'Вы ещё не записаны на курсы.',
  'dashboard.noNotifications': 'Нет новых уведомлений.',
  'pricing.title': 'Выберите план',
  'pricing.subtitle': 'Инвестируйте в своё мастерство. Выберите подходящий тариф.',
  'pricing.monthly': 'Ежемесячно',
  'pricing.yearly': 'Ежегодно',
  'pricing.free': 'Бесплатный',
  'pricing.pro': 'Про',
  'pricing.enterprise': 'Бизнес',
  'pricing.freePlan.price': '$0',
  'pricing.proPlan.price': '$29',
  'pricing.enterprisePlan.price': '$99',
  'pricing.freePlan.desc': 'Идеально для начала',
  'pricing.proPlan.desc': 'Для серьёзных профессионалов',
  'pricing.enterprisePlan.desc': 'Для команд и бизнеса',
  'pricing.feature.basicCourses': 'Доступ к 3 бесплатным курсам',
  'pricing.feature.allCourses': 'Доступ ко всем курсам',
  'pricing.feature.wikiAccess': 'Полный доступ к вики',
  'pricing.feature.certificates': 'Сертификаты об окончании',
  'pricing.feature.prioritySupport': 'Приоритетная поддержка',
  'pricing.feature.teamAccess': 'Управление командой',
  'pricing.feature.customBranding': 'Персональный брендинг',
  'pricing.feature.apiAccess': 'Доступ к API',
  'pricing.currentPlan': 'Текущий план',
  'pricing.upgrade': 'Улучшить',
  'pricing.choosePlan': 'Выбрать план',
  'pricing.perMonth': '/месяц',
  'pricing.perYear': '/год',
  'pricing.popular': 'Самый популярный',
  'admin.title': 'Центр управления',
  'admin.dashboard': 'Панель',
  'admin.users': 'Пользователи',
  'admin.courses': 'Курсы',
  'admin.wiki': 'Вики',
  'admin.subscriptions': 'Подписки',
  'admin.analytics': 'Аналитика',
  'admin.support': 'Поддержка',
  'admin.totalStudents': 'Всего студентов',
  'admin.totalRevenue': 'Доход (MTD)',
  'admin.activeSubs': 'Активных подписок',
  'admin.courseCompletion': 'Завершённость курсов',
  'admin.newCourse': 'Новый курс',
  'admin.newArticle': 'Новая статья',
  'admin.manage': 'Управление',
  'support.title': 'Помощь и поддержка',
  'support.subtitle': 'Мы здесь, чтобы помочь вам.',
  'support.faq': 'Частые вопросы',
  'support.contact': 'Связаться с нами',
  'support.message': 'Ваше сообщение',
  'support.send': 'Отправить',
  'support.sent': 'Сообщение отправлено! Мы скоро ответим.',
};

const he: TranslationKeys = {
  'nav.home': 'בית',
  'nav.academy': 'אקדמיה',
  'nav.wiki': 'ויקי',
  'nav.account': 'חשבון',
  'nav.admin': 'ניהול',
  'nav.pricing': 'תמחור',
  'common.save': 'שמור',
  'common.cancel': 'ביטול',
  'common.loading': 'טוען...',
  'common.search': 'חיפוש',
  'common.back': 'חזור',
  'common.next': 'הבא',
  'common.previous': 'הקודם',
  'common.seeAll': 'הצג הכל',
  'common.learnMore': 'למידע נוסף',
  'common.getStarted': 'התחל עכשיו',
  'common.signIn': 'התחברות',
  'common.signUp': 'הרשמה',
  'common.signOut': 'התנתקות',
  'common.email': 'אימייל',
  'common.password': 'סיסמה',
  'common.name': 'שם מלא',
  'common.submit': 'שלח',
  'common.edit': 'ערוך',
  'common.delete': 'מחק',
  'common.publish': 'פרסם',
  'common.unpublish': 'הסר פרסום',
  'common.noResults': 'לא נמצאו תוצאות',
  'common.error': 'משהו השתבש',
  'common.success': 'הצלחה!',
  'common.tryAgain': 'נסה שוב',
  'home.hero.title': 'שלטו באמנות הדיטיילינג',
  'home.hero.subtitle': 'פלטפורמת חינוך ברמה עולמית לדיטיילינג מקצועי. למדו ממומחי התעשייה, קבלו תעודות ושפרו את המיומנות שלכם.',
  'home.hero.cta': 'התחל ללמוד',
  'home.features.title': 'למה GLOSS Academy',
  'home.features.courses': 'קורסים מקצועיים',
  'home.features.coursesDesc': 'מסלולי לימוד מובנים שנוצרו על ידי ותיקי התעשייה עם עשרות שנות ניסיון.',
  'home.features.wiki': 'בסיס ידע',
  'home.features.wikiDesc': 'אנציקלופדיית דיטיילינג מקיפה המכסה כל טכניקה, מוצר ומתודולוגיה.',
  'home.features.community': 'קהילה מקצועית',
  'home.features.communityDesc': 'התחברו עם אלפי מקצוענים ברחבי העולם.',
  'home.features.certificate': 'הסמכה',
  'home.features.certificateDesc': 'קבלו תעודות מוכרות שמוכיחות את המומחיות שלכם.',
  'home.popular.title': 'קורסים פופולריים',
  'home.stats.students': 'סטודנטים פעילים',
  'home.stats.courses': 'קורסים',
  'home.stats.lessons': 'שיעורי וידאו',
  'home.stats.countries': 'מדינות',
  'home.faq.title': 'שאלות נפוצות',
  'home.testimonials.title': 'מה אומרים הסטודנטים שלנו',
  'auth.login.title': 'ברוכים השבים',
  'auth.login.subtitle': 'התחברו כדי להמשיך את מסע הלמידה',
  'auth.register.title': 'הצטרפו ל-GLOSS Academy',
  'auth.register.subtitle': 'צרו חשבון והתחילו ללמוד היום',
  'auth.forgotPassword': 'שכחת סיסמה?',
  'auth.resetPassword': 'איפוס סיסמה',
  'auth.resetPassword.subtitle': 'הזינו אימייל לקבלת קישור לאיפוס',
  'auth.noAccount': 'אין לכם חשבון?',
  'auth.hasAccount': 'כבר יש לכם חשבון?',
  'auth.resetSent': 'קישור האיפוס נשלח! בדקו את האימייל.',
  'courses.title': 'אקדמיה',
  'courses.subtitle': 'חינוך דיטיילינג מקצועי ממומחים עולמיים.',
  'courses.enroll': 'הרשם עכשיו',
  'courses.continue': 'המשך ללמוד',
  'courses.modules': 'מודולים',
  'courses.lessons': 'שיעורים',
  'courses.duration': 'משך',
  'courses.level': 'רמה',
  'courses.beginner': 'מתחיל',
  'courses.intermediate': 'בינוני',
  'courses.advanced': 'מתקדם',
  'courses.progress': 'התקדמות',
  'courses.completed': 'הושלם',
  'courses.markComplete': 'סמן כהושלם',
  'courses.nextLesson': 'השיעור הבא',
  'courses.prevLesson': 'השיעור הקודם',
  'courses.materials': 'חומרים',
  'courses.overview': 'סקירה',
  'courses.curriculum': 'תוכנית לימודים',
  'courses.locked': 'נעול — שדרגו לגישה',
  'courses.free': 'חינם',
  'courses.premium': 'פרימיום',
  'courses.search': 'חפש קורסים...',
  'courses.filter': 'סנן',
  'courses.allLevels': 'כל הרמות',
  'courses.noCoursesFound': 'לא נמצאו קורסים.',
  'wiki.title': 'בסיס ידע',
  'wiki.subtitle': 'האנציקלופדיה המקיפה שלכם לדיטיילינג.',
  'wiki.search': 'חפש מאמרים...',
  'wiki.categories': 'קטגוריות',
  'wiki.articles': 'מאמרים',
  'wiki.popular': 'מאמרים פופולריים',
  'wiki.related': 'מאמרים קשורים',
  'wiki.readMore': 'קרא עוד',
  'wiki.noArticles': 'לא נמצאו מאמרים.',
  'dashboard.title': 'לוח בקרה',
  'dashboard.welcome': 'ברוכים השבים',
  'dashboard.myCourses': 'הקורסים שלי',
  'dashboard.progress': 'ההתקדמות שלי',
  'dashboard.subscription': 'מנוי',
  'dashboard.settings': 'הגדרות',
  'dashboard.notifications': 'התראות',
  'dashboard.favorites': 'מועדפים',
  'dashboard.billing': 'חיוב',
  'dashboard.support': 'עזרה ותמיכה',
  'dashboard.language': 'שפה',
  'dashboard.profile': 'פרופיל',
  'dashboard.editProfile': 'ערוך פרופיל',
  'dashboard.completedLessons': 'שיעורים שהושלמו',
  'dashboard.activeCourses': 'קורסים פעילים',
  'dashboard.hoursLearned': 'שעות למידה',
  'dashboard.continueWhere': 'המשך מאיפה שהפסקת',
  'dashboard.noCourses': 'טרם נרשמתם לקורסים.',
  'dashboard.noNotifications': 'אין התראות חדשות.',
  'pricing.title': 'בחרו את התוכנית שלכם',
  'pricing.subtitle': 'השקיעו במיומנות שלכם. בחרו את התוכנית המתאימה.',
  'pricing.monthly': 'חודשי',
  'pricing.yearly': 'שנתי',
  'pricing.free': 'חינם',
  'pricing.pro': 'מקצועי',
  'pricing.enterprise': 'עסקי',
  'pricing.freePlan.price': '$0',
  'pricing.proPlan.price': '$29',
  'pricing.enterprisePlan.price': '$99',
  'pricing.freePlan.desc': 'מושלם להתחלה',
  'pricing.proPlan.desc': 'למקצוענים רציניים',
  'pricing.enterprisePlan.desc': 'לצוותות ועסקים',
  'pricing.feature.basicCourses': 'גישה ל-3 קורסים חינמיים',
  'pricing.feature.allCourses': 'גישה לכל הקורסים',
  'pricing.feature.wikiAccess': 'גישה מלאה לויקי',
  'pricing.feature.certificates': 'תעודות סיום',
  'pricing.feature.prioritySupport': 'תמיכה מועדפת',
  'pricing.feature.teamAccess': 'ניהול צוות',
  'pricing.feature.customBranding': 'מיתוג מותאם',
  'pricing.feature.apiAccess': 'גישת API',
  'pricing.currentPlan': 'תוכנית נוכחית',
  'pricing.upgrade': 'שדרג',
  'pricing.choosePlan': 'בחר תוכנית',
  'pricing.perMonth': '/חודש',
  'pricing.perYear': '/שנה',
  'pricing.popular': 'הכי פופולרי',
  'admin.title': 'מרכז שליטה',
  'admin.dashboard': 'לוח בקרה',
  'admin.users': 'משתמשים',
  'admin.courses': 'קורסים',
  'admin.wiki': 'ויקי',
  'admin.subscriptions': 'מנויים',
  'admin.analytics': 'אנליטיקס',
  'admin.support': 'תמיכה',
  'admin.totalStudents': 'סה"כ סטודנטים',
  'admin.totalRevenue': 'הכנסות (חודשי)',
  'admin.activeSubs': 'מנויים פעילים',
  'admin.courseCompletion': 'שיעור השלמה',
  'admin.newCourse': 'קורס חדש',
  'admin.newArticle': 'מאמר חדש',
  'admin.manage': 'ניהול',
  'support.title': 'עזרה ותמיכה',
  'support.subtitle': 'אנחנו כאן כדי לעזור לכם.',
  'support.faq': 'שאלות נפוצות',
  'support.contact': 'צרו קשר',
  'support.message': 'ההודעה שלכם',
  'support.send': 'שלח הודעה',
  'support.sent': 'ההודעה נשלחה! נחזור אליכם בקרוב.',
};

export const translations: Record<Locale, TranslationKeys> = { en, ru, he };
