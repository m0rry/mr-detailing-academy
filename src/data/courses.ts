export interface Lesson {
  id: string;
  titleEn: string;
  titleRu: string;
  titleHe: string;
  contentEn: string;
  contentRu: string;
  contentHe: string;
  videoUrl?: string;
  durationMinutes: number;
  isPreview: boolean;
  order: number;
}

export interface CourseModule {
  id: string;
  titleEn: string;
  titleRu: string;
  titleHe: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  slug: string;
  titleEn: string;
  titleRu: string;
  titleHe: string;
  descriptionEn: string;
  descriptionRu: string;
  descriptionHe: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  isFree: boolean;
  image: string;
  modules: CourseModule[];
  totalDuration: string;
  studentsCount: number;
  rating: number;
}

export const courses: Course[] = [
  {
    id: 'c1',
    slug: 'paint-correction-mastery',
    titleEn: 'Paint Correction Mastery',
    titleRu: 'Мастерство коррекции ЛКП',
    titleHe: 'שליטה בתיקון צבע',
    descriptionEn: 'Master the art of paint correction from basic swirl removal to advanced multi-stage compounding. Learn pad selection, compound chemistry, and machine techniques used by world champions.',
    descriptionRu: 'Освойте искусство коррекции лакокрасочного покрытия от базового удаления голограмм до продвинутой многоэтапной полировки. Изучите выбор кругов, химию паст и техники работы.',
    descriptionHe: 'שלטו באמנות תיקון הצבע מהסרת סחרורים בסיסית ועד ליטוש רב-שלבי מתקדם. למדו בחירת פדים, כימיה של תרכובות וטכניקות מכונה.',
    level: 'advanced',
    isFree: false,
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=800',
    totalDuration: '12h 30m',
    studentsCount: 2847,
    rating: 4.9,
    modules: [
      {
        id: 'm1',
        titleEn: 'Foundation & Theory',
        titleRu: 'Основы и теория',
        titleHe: 'יסודות ותיאוריה',
        lessons: [
          { id: 'l1', titleEn: 'Understanding Paint Systems', titleRu: 'Понимание лакокрасочных систем', titleHe: 'הבנת מערכות צבע', contentEn: 'Modern automotive paint systems consist of multiple layers: electrocoat (e-coat), primer, basecoat, and clearcoat. Understanding these layers is fundamental to safe paint correction. The clearcoat, typically 40-60 microns thick, is where all correction work takes place. Using a paint depth gauge before starting any work is essential to determine how much material is available for removal.', contentRu: 'Современные автомобильные лакокрасочные системы состоят из нескольких слоёв: электрофорезный грунт, праймер, базовый слой и лак. Понимание этих слоёв — основа безопасной коррекции.', contentHe: 'מערכות צבע אוטומוטיביות מודרניות מורכבות ממספר שכבות. הבנת שכבות אלו היא בסיסית לתיקון צבע בטוח.', durationMinutes: 25, isPreview: true, order: 1 },
          { id: 'l2', titleEn: 'Types of Paint Defects', titleRu: 'Типы дефектов ЛКП', titleHe: 'סוגי פגמי צבע', contentEn: 'Paint defects range from light swirl marks and water spots to deep scratches, oxidation, and orange peel. Each defect type requires a specific approach. Swirl marks are the most common defect and appear as fine circular scratches visible under direct light. Random deep marring (RDM) requires more aggressive correction. Bird etchings and water spots may require wet sanding in extreme cases.', contentRu: 'Дефекты ЛКП варьируются от лёгких голограмм и водяных пятен до глубоких царапин и оксидации. Каждый тип требует специфического подхода.', contentHe: 'פגמי צבע נעים מסימני סחרור קלים ועד שריטות עמוקות. כל סוג פגם דורש גישה ספציפית.', durationMinutes: 30, isPreview: true, order: 2 },
          { id: 'l3', titleEn: 'Machine Selection Guide', titleRu: 'Выбор полировальной машинки', titleHe: 'מדריך בחירת מכונה', contentEn: 'Dual-action (DA) polishers are the safest choice for beginners due to their random orbital motion that prevents burn-through. Rotary polishers offer more cutting power but require greater skill. Forced rotation machines like the Rupes BigFoot combine the safety of DA with the cutting power closer to rotary. Consider throw (orbit size), weight, ergonomics, and speed range when selecting.', contentRu: 'Эксцентриковые (DA) полировальные машинки — самый безопасный выбор для начинающих благодаря случайному орбитальному движению.', contentHe: 'מלטשות כפולות פעולה (DA) הן הבחירה הבטוחה ביותר למתחילים.', durationMinutes: 20, isPreview: false, order: 3 },
        ]
      },
      {
        id: 'm2',
        titleEn: 'Practical Techniques',
        titleRu: 'Практические техники',
        titleHe: 'טכניקות מעשיות',
        lessons: [
          { id: 'l4', titleEn: 'Single-Stage Correction', titleRu: 'Одноэтапная коррекция', titleHe: 'תיקון חד-שלבי', contentEn: 'Single-stage correction uses one compound and pad combination to both cut and finish the paint. Modern all-in-one compounds have evolved significantly and can produce stunning results when paired with the right pad. This lesson covers arm speed, pressure, section size, and pass count for optimal results.', contentRu: 'Одноэтапная коррекция использует одну комбинацию пасты и круга для одновременной абразивной обработки и финишной полировки.', contentHe: 'תיקון חד-שלבי משתמש בשילוב אחד של תרכובת ופד.', durationMinutes: 35, isPreview: false, order: 4 },
          { id: 'l5', titleEn: 'Multi-Stage Correction', titleRu: 'Многоэтапная коррекция', titleHe: 'תיקון רב-שלבי', contentEn: 'Multi-stage correction involves separate cutting, polishing, and finishing stages. The cutting stage removes defects, the polishing stage refines the finish, and the finishing stage achieves maximum gloss and clarity. Panel wipe between stages to evaluate true results.', contentRu: 'Многоэтапная коррекция включает отдельные этапы: резка, полировка и финиш.', contentHe: 'תיקון רב-שלבי כולל שלבי חיתוך, ליטוש וגימור נפרדים.', durationMinutes: 45, isPreview: false, order: 5 },
        ]
      }
    ]
  },
  {
    id: 'c2',
    slug: 'ceramic-coating-professional',
    titleEn: 'Ceramic Coating Professional',
    titleRu: 'Профессиональное керамическое покрытие',
    titleHe: 'ציפוי קרמי מקצועי',
    descriptionEn: 'Complete certification course on ceramic coating application. From surface preparation to multi-layer application and aftercare protocols. Includes SiO2, SiC, and graphene-based coating technologies.',
    descriptionRu: 'Полный сертификационный курс по нанесению керамических покрытий. От подготовки поверхности до многослойного нанесения.',
    descriptionHe: 'קורס הסמכה מלא ביישום ציפוי קרמי. מהכנת משטח ועד יישום רב-שכבתי.',
    level: 'intermediate',
    isFree: false,
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=800',
    totalDuration: '8h 15m',
    studentsCount: 1923,
    rating: 4.8,
    modules: [
      {
        id: 'm3',
        titleEn: 'Surface Preparation',
        titleRu: 'Подготовка поверхности',
        titleHe: 'הכנת משטח',
        lessons: [
          { id: 'l6', titleEn: 'Decontamination Process', titleRu: 'Процесс деконтаминации', titleHe: 'תהליך ניקוי עומק', contentEn: 'Before applying any coating, the paint surface must be completely free of contaminants. This includes iron fallout removal, tar removal, clay bar treatment, and chemical decontamination. Use a panel wipe (IPA or dedicated solution) as the final step before coating application.', contentRu: 'Перед нанесением любого покрытия поверхность должна быть полностью очищена от загрязнений.', contentHe: 'לפני יישום כל ציפוי, משטח הצבע חייב להיות נקי לחלוטין ממזהמים.', durationMinutes: 30, isPreview: true, order: 1 },
          { id: 'l7', titleEn: 'Paint Inspection & Correction', titleRu: 'Инспекция и коррекция ЛКП', titleHe: 'בדיקת ותיקון צבע', contentEn: 'Use proper lighting (LED or halogen) to inspect the paint thoroughly. Any defects left uncorrected will be locked under the coating for years. Document defects, measure paint thickness, and create a correction plan.', contentRu: 'Используйте правильное освещение для тщательной инспекции ЛКП.', contentHe: 'השתמשו בתאורה מתאימה לבדיקת הצבע ביסודיות.', durationMinutes: 25, isPreview: false, order: 2 },
        ]
      },
      {
        id: 'm4',
        titleEn: 'Application Techniques',
        titleRu: 'Техники нанесения',
        titleHe: 'טכניקות יישום',
        lessons: [
          { id: 'l8', titleEn: 'Single Layer Application', titleRu: 'Нанесение одного слоя', titleHe: 'יישום שכבה אחת', contentEn: 'Apply the coating using the provided applicator in cross-hatch pattern. Work in 60x60cm sections. Allow the coating to flash (rainbow effect appears) before leveling with a clean microfiber towel. Maintain consistent pressure and overlap passes by 50%.', contentRu: 'Нанесите покрытие с помощью аппликатора перекрёстными движениями. Работайте секциями 60x60см.', contentHe: 'יישמו את הציפוי באמצעות האפליקטור בתבנית שתי וערב.', durationMinutes: 40, isPreview: false, order: 3 },
        ]
      }
    ]
  },
  {
    id: 'c3',
    slug: 'safe-wash-fundamentals',
    titleEn: 'Safe Wash Fundamentals',
    titleRu: 'Основы безопасной мойки',
    titleHe: 'יסודות שטיפה בטוחה',
    descriptionEn: 'Learn the correct washing techniques that prevent paint damage. Two-bucket method, foam cannon usage, drying techniques, and waterless wash alternatives.',
    descriptionRu: 'Изучите правильные техники мойки, предотвращающие повреждение ЛКП.',
    descriptionHe: 'למדו טכניקות שטיפה נכונות שמונעות נזק לצבע.',
    level: 'beginner',
    isFree: true,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&q=80&w=800',
    totalDuration: '3h 45m',
    studentsCount: 5120,
    rating: 4.7,
    modules: [
      {
        id: 'm5',
        titleEn: 'Wash Basics',
        titleRu: 'Основы мойки',
        titleHe: 'יסודות שטיפה',
        lessons: [
          { id: 'l9', titleEn: 'Why Proper Washing Matters', titleRu: 'Почему правильная мойка важна', titleHe: 'למה שטיפה נכונה חשובה', contentEn: 'Improper washing is the #1 cause of paint defects. Automatic car washes, dirty sponges, and dish soap all contribute to swirl marks and scratches. This lesson establishes the mindset and principles behind paint-safe washing.', contentRu: 'Неправильная мойка — причина №1 дефектов ЛКП.', contentHe: 'שטיפה לא נכונה היא הגורם מספר 1 לפגמי צבע.', durationMinutes: 15, isPreview: true, order: 1 },
          { id: 'l10', titleEn: 'Two-Bucket Method', titleRu: 'Метод двух вёдер', titleHe: 'שיטת שני הדליים', contentEn: 'The two-bucket method uses a wash bucket and a rinse bucket, each with a grit guard at the bottom. Dip your wash mitt in the wash bucket, clean a section of the car, then rinse the mitt in the rinse bucket before reloading with fresh solution. This prevents dirt from being reintroduced to the paint.', contentRu: 'Метод двух вёдер использует ведро для мойки и ведро для ополаскивания.', contentHe: 'שיטת שני הדליים משתמשת בדלי שטיפה ודלי שטיפת כפפה.', durationMinutes: 20, isPreview: true, order: 2 },
        ]
      }
    ]
  },
  {
    id: 'c4',
    slug: 'interior-detailing-complete',
    titleEn: 'Complete Interior Detailing',
    titleRu: 'Полный детейлинг интерьера',
    titleHe: 'דיטיילינג פנים מלא',
    descriptionEn: 'Professional interior detailing from basic cleaning to leather restoration, fabric protection, and odor elimination. Covers all surface types and materials.',
    descriptionRu: 'Профессиональный детейлинг интерьера от базовой чистки до реставрации кожи.',
    descriptionHe: 'דיטיילינג פנים מקצועי מניקיון בסיסי ועד שיקום עור.',
    level: 'intermediate',
    isFree: false,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
    totalDuration: '6h 20m',
    studentsCount: 1456,
    rating: 4.8,
    modules: [
      {
        id: 'm6',
        titleEn: 'Leather Care',
        titleRu: 'Уход за кожей',
        titleHe: 'טיפול בעור',
        lessons: [
          { id: 'l11', titleEn: 'Identifying Leather Types', titleRu: 'Определение типов кожи', titleHe: 'זיהוי סוגי עור', contentEn: 'Automotive leather comes in several types: aniline (uncoated, rare), semi-aniline (lightly coated), and protected/pigmented (most common). The water drop test helps identify the type. Protected leather can handle more aggressive cleaning, while aniline requires extreme care.', contentRu: 'Автомобильная кожа бывает нескольких типов: анилиновая, полуанилиновая и пигментированная.', contentHe: 'עור רכב מגיע בכמה סוגים: אנילין, חצי-אנילין ומוגן.', durationMinutes: 20, isPreview: true, order: 1 },
        ]
      }
    ]
  },
  {
    id: 'c5',
    slug: 'ppf-installation',
    titleEn: 'PPF Installation Fundamentals',
    titleRu: 'Основы установки PPF',
    titleHe: 'יסודות התקנת PPF',
    descriptionEn: 'Learn paint protection film installation from kit cutting to full custom wraps. Covers software, tools, techniques, and troubleshooting.',
    descriptionRu: 'Изучите установку защитной плёнки от нарезки комплектов до полной оклейки.',
    descriptionHe: 'למדו התקנת ציפוי הגנה מחיתוך ערכות ועד עטיפות מותאמות.',
    level: 'advanced',
    isFree: false,
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800',
    totalDuration: '15h 00m',
    studentsCount: 892,
    rating: 4.9,
    modules: [
      {
        id: 'm7',
        titleEn: 'PPF Basics',
        titleRu: 'Основы PPF',
        titleHe: 'יסודות PPF',
        lessons: [
          { id: 'l12', titleEn: 'Understanding Film Types', titleRu: 'Типы плёнок', titleHe: 'הבנת סוגי פילם', contentEn: 'Paint protection films vary in thickness (6-10 mil), self-healing properties, gloss levels, and durability. Premium films like XPEL Ultimate Plus, SunTek Ultra, and 3M Pro Series each have unique characteristics. Understanding these differences helps you recommend the right product.', contentRu: 'Защитные плёнки различаются по толщине, самовосстановлению, глянцу и долговечности.', contentHe: 'סרטי הגנה שונים בעובי, תכונות ריפוי עצמי ועמידות.', durationMinutes: 25, isPreview: true, order: 1 },
        ]
      }
    ]
  },
  {
    id: 'c6',
    slug: 'detailing-business',
    titleEn: 'Building a Detailing Business',
    titleRu: 'Построение бизнеса детейлинга',
    titleHe: 'בניית עסק דיטיילינג',
    descriptionEn: 'From garage to professional studio. Learn pricing, marketing, client management, and scaling your detailing business.',
    descriptionRu: 'От гаража до профессиональной студии. Ценообразование, маркетинг, управление клиентами.',
    descriptionHe: 'ממוסך לסטודיו מקצועי. למדו תמחור, שיווק וניהול לקוחות.',
    level: 'beginner',
    isFree: false,
    image: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&q=80&w=800',
    totalDuration: '4h 30m',
    studentsCount: 3210,
    rating: 4.6,
    modules: [
      {
        id: 'm8',
        titleEn: 'Getting Started',
        titleRu: 'Начало работы',
        titleHe: 'תחילת העבודה',
        lessons: [
          { id: 'l13', titleEn: 'Setting Up Your Workspace', titleRu: 'Организация рабочего пространства', titleHe: 'הקמת חלל העבודה', contentEn: 'Your workspace needs proper lighting (5000K+ LED panels), ventilation, climate control, and clean water supply. A minimum of 400 sq ft is recommended for single-vehicle work. Invest in quality LED inspection lights, a lift or jack system, and organized tool storage.', contentRu: 'Рабочее пространство должно иметь правильное освещение, вентиляцию и подачу чистой воды.', contentHe: 'חלל העבודה שלכם צריך תאורה נכונה, אוורור ואספקת מים נקיים.', durationMinutes: 30, isPreview: true, order: 1 },
        ]
      }
    ]
  },
  {
    id: 'c7',
    slug: 'wheel-tire-detailing',
    titleEn: 'Wheel & Tire Detailing',
    titleRu: 'Детейлинг колёс и шин',
    titleHe: 'דיטיילינג גלגלים וצמיגים',
    descriptionEn: 'Deep dive into wheel decontamination, barrel cleaning, tire dressing, and wheel coating application.',
    descriptionRu: 'Глубокое погружение в деконтаминацию колёс, чистку бочек, обработку шин.',
    descriptionHe: 'צלילה עמוקה בניקוי עומק לגלגלים, ניקוי חביות וציפוי גלגלים.',
    level: 'beginner',
    isFree: true,
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800',
    totalDuration: '2h 15m',
    studentsCount: 4380,
    rating: 4.5,
    modules: [
      {
        id: 'm9',
        titleEn: 'Wheel Cleaning',
        titleRu: 'Чистка колёс',
        titleHe: 'ניקוי גלגלים',
        lessons: [
          { id: 'l14', titleEn: 'Iron Decontamination for Wheels', titleRu: 'Деконтаминация железа на колёсах', titleHe: 'ניקוי ברזל מגלגלים', contentEn: 'Brake dust contains metallic particles that bond to wheel surfaces. Iron removers (pH-neutral formulas) chemically dissolve these particles, turning purple/red on contact. Always apply to cool, dry wheels and allow adequate dwell time.', contentRu: 'Тормозная пыль содержит металлические частицы, которые связываются с поверхностью колёс.', contentHe: 'אבק בלמים מכיל חלקיקים מתכתיים שנקשרים למשטחי הגלגלים.', durationMinutes: 20, isPreview: true, order: 1 },
        ]
      }
    ]
  },
  {
    id: 'c8',
    slug: 'wet-sanding-advanced',
    titleEn: 'Advanced Wet Sanding',
    titleRu: 'Продвинутое мокрое шлифование',
    titleHe: 'שיוף רטוב מתקדם',
    descriptionEn: 'Master wet sanding techniques for orange peel removal, deep scratch repair, and headlight restoration.',
    descriptionRu: 'Мастерство мокрого шлифования для удаления шагрени и глубоких царапин.',
    descriptionHe: 'שלטו בטכניקות שיוף רטוב להסרת קליפת תפוז ותיקון שריטות.',
    level: 'advanced',
    isFree: false,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800',
    totalDuration: '5h 00m',
    studentsCount: 678,
    rating: 4.9,
    modules: [
      {
        id: 'm10',
        titleEn: 'Sanding Fundamentals',
        titleRu: 'Основы шлифования',
        titleHe: 'יסודות שיוף',
        lessons: [
          { id: 'l15', titleEn: 'Grit Selection & Progression', titleRu: 'Выбор и последовательность зернистости', titleHe: 'בחירת גריט והתקדמות', contentEn: 'Wet sanding grits range from 1000 to 5000. Start with the least aggressive grit that will remove the defect. A typical progression: 1500 → 2000 → 3000 → compound → polish. Each subsequent grit removes the scratch pattern from the previous one.', contentRu: 'Зернистость для мокрого шлифования варьируется от 1000 до 5000.', contentHe: 'גריט שיוף רטוב נע מ-1000 עד 5000.', durationMinutes: 30, isPreview: true, order: 1 },
        ]
      }
    ]
  },
];

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find(c => c.slug === slug);
}

export function getCourseTitle(course: Course, locale: string): string {
  if (locale === 'ru') return course.titleRu;
  if (locale === 'he') return course.titleHe;
  return course.titleEn;
}

export function getCourseDescription(course: Course, locale: string): string {
  if (locale === 'ru') return course.descriptionRu;
  if (locale === 'he') return course.descriptionHe;
  return course.descriptionEn;
}

export function getModuleTitle(mod: CourseModule, locale: string): string {
  if (locale === 'ru') return mod.titleRu;
  if (locale === 'he') return mod.titleHe;
  return mod.titleEn;
}

export function getLessonTitle(lesson: Lesson, locale: string): string {
  if (locale === 'ru') return lesson.titleRu;
  if (locale === 'he') return lesson.titleHe;
  return lesson.titleEn;
}

export function getLessonContent(lesson: Lesson, locale: string): string {
  if (locale === 'ru') return lesson.contentRu;
  if (locale === 'he') return lesson.contentHe;
  return lesson.contentEn;
}
