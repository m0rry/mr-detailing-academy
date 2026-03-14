export interface WikiArticle {
  id: string;
  slug: string;
  category: string;
  titleEn: string;
  titleRu: string;
  titleHe: string;
  bodyEn: string;
  bodyRu: string;
  bodyHe: string;
  image?: string;
  tags: string[];
  popular: boolean;
}

export interface WikiCategory {
  id: string;
  slug: string;
  titleEn: string;
  titleRu: string;
  titleHe: string;
  icon: string;
  count: number;
}

export const wikiCategories: WikiCategory[] = [
  { id: 'wc1', slug: 'chemicals', titleEn: 'Chemicals', titleRu: 'Химия', titleHe: 'כימיקלים', icon: '🧪', count: 24 },
  { id: 'wc2', slug: 'polishing', titleEn: 'Polishing', titleRu: 'Полировка', titleHe: 'ליטוש', icon: '💿', count: 18 },
  { id: 'wc3', slug: 'interior', titleEn: 'Interior', titleRu: 'Интерьер', titleHe: 'פנים', icon: '💺', count: 12 },
  { id: 'wc4', slug: 'protection', titleEn: 'Protection', titleRu: 'Защита', titleHe: 'הגנה', icon: '🛡️', count: 31 },
  { id: 'wc5', slug: 'washing', titleEn: 'Washing', titleRu: 'Мойка', titleHe: 'שטיפה', icon: '🚿', count: 15 },
  { id: 'wc6', slug: 'tools', titleEn: 'Tools & Equipment', titleRu: 'Инструменты', titleHe: 'כלים וציוד', icon: '🔧', count: 22 },
  { id: 'wc7', slug: 'business', titleEn: 'Business', titleRu: 'Бизнес', titleHe: 'עסקים', icon: '💼', count: 9 },
  { id: 'wc8', slug: 'defects', titleEn: 'Paint Defects', titleRu: 'Дефекты ЛКП', titleHe: 'פגמי צבע', icon: '🔍', count: 16 },
];

export const wikiArticles: WikiArticle[] = [
  {
    id: 'a1', slug: 'iron-fallout-removers', category: 'chemicals',
    titleEn: 'Iron Fallout Removers: Complete Guide',
    titleRu: 'Средства для удаления металлических вкраплений: полное руководство',
    titleHe: 'מסירי משקעי ברזל: מדריך מלא',
    bodyEn: 'Iron fallout removers are pH-neutral or slightly acidic chemical solutions designed to dissolve ferrous (iron-containing) particles embedded in automotive surfaces. These particles originate from brake dust, rail dust, and industrial fallout.\n\n## How They Work\n\nThe active ingredient, typically ammonium thioglycolate, reacts with iron particles through a chelation process. The reaction produces a visible purple/red color change, indicating the iron is being dissolved and lifted from the surface.\n\n## Application Best Practices\n\n1. Always apply to cool, dry surfaces\n2. Spray liberally and ensure full coverage\n3. Allow 3-5 minutes dwell time\n4. Do not allow the product to dry on the surface\n5. Rinse thoroughly with pressure washer\n6. Follow with a pH-neutral car wash\n\n## Safety Considerations\n\nIron removers have a strong sulfur smell. Work in well-ventilated areas. Avoid contact with skin and eyes. Some formulations may stain bare metal or chrome if left too long.',
    bodyRu: 'Средства для удаления металлических вкраплений — это pH-нейтральные или слегка кислотные химические растворы, предназначенные для растворения железосодержащих частиц.\n\n## Как они работают\n\nАктивный ингредиент реагирует с частицами железа через процесс хелатирования. Реакция производит видимое пурпурное/красное изменение цвета.\n\n## Лучшие практики применения\n\n1. Всегда наносите на холодную, сухую поверхность\n2. Распыляйте обильно\n3. Время выдержки 3-5 минут\n4. Не допускайте высыхания на поверхности\n5. Тщательно промойте\n6. Продолжите pH-нейтральной мойкой',
    bodyHe: 'מסירי משקעי ברזל הם תמיסות כימיות pH-נייטרליות שמיועדות להמיס חלקיקי ברזל המשובצים במשטחי הרכב.\n\n## איך הם עובדים\n\nהמרכיב הפעיל מגיב עם חלקיקי ברזל בתהליך כילוט. התגובה מייצרת שינוי צבע סגול/אדום נראה לעין.\n\n## שיטות יישום מומלצות\n\n1. תמיד יישמו על משטח קריר ויבש\n2. רססו בנדיבות\n3. זמן השהייה 3-5 דקות\n4. אל תתנו למוצר להתייבש\n5. שטפו ביסודיות',
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=800',
    tags: ['decontamination', 'chemicals', 'iron', 'fallout'],
    popular: true,
  },
  {
    id: 'a2', slug: 'ceramic-vs-wax', category: 'protection',
    titleEn: 'Ceramic Coating vs Wax: Which is Better?',
    titleRu: 'Керамика vs воск: что лучше?',
    titleHe: 'ציפוי קרמי מול שעווה: מה עדיף?',
    bodyEn: 'The age-old debate in detailing: ceramic coatings or traditional wax? Both serve the purpose of protecting paint, but they differ dramatically in durability, cost, application difficulty, and performance.\n\n## Carnauba Wax\n\nCarnauba wax is a natural product derived from Brazilian palm trees. It provides a warm, deep gloss that many enthusiasts prefer. However, it typically lasts only 4-8 weeks and offers limited chemical resistance.\n\n## Ceramic Coatings\n\nCeramic coatings (SiO2-based) create a semi-permanent bond with the paint surface. They offer 2-5+ years of protection, superior chemical resistance, extreme hydrophobicity, and reduced maintenance. However, they require more skill to apply and cost significantly more.\n\n## The Verdict\n\nFor professionals, ceramic coatings are the clear winner for long-term protection. For enthusiasts who enjoy the process of waxing, carnauba still has its place.',
    bodyRu: 'Вечный спор в детейлинге: керамические покрытия или традиционный воск? Оба защищают ЛКП, но кардинально различаются по долговечности, стоимости и характеристикам.\n\n## Карнаубский воск\n\nНатуральный продукт из бразильской пальмы. Даёт тёплый, глубокий блеск, но держится лишь 4-8 недель.\n\n## Керамические покрытия\n\nСоздают полупостоянную связь с поверхностью. Защита 2-5+ лет, превосходная химическая стойкость.',
    bodyHe: 'הדיון הנצחי בדיטיילינג: ציפוי קרמי או שעווה מסורתית? שניהם מגנים על הצבע אך שונים דרמטית.\n\n## שעוות קרנאובה\n\nמוצר טבעי מעצי דקל ברזילאיים. נותן ברק עמוק וחם, אך מחזיק רק 4-8 שבועות.\n\n## ציפוי קרמי\n\nיוצר קשר חצי-קבוע עם הצבע. הגנה של 2-5+ שנים, עמידות כימית מעולה.',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=800',
    tags: ['protection', 'ceramic', 'wax', 'comparison'],
    popular: true,
  },
  {
    id: 'a3', slug: 'swirl-marks-guide', category: 'defects',
    titleEn: 'Understanding Swirl Marks',
    titleRu: 'Понимание голограмм и круговых царапин',
    titleHe: 'הבנת סימני סחרור',
    bodyEn: 'Swirl marks are fine circular scratches on the paint surface caused by improper washing and drying techniques. They are most visible on dark-colored vehicles under direct sunlight or artificial lighting.\n\n## Causes\n\n- Automatic car washes with dirty brushes\n- Using a single dirty bucket\n- Wiping with dry towels\n- Using bath towels or chamois\n- Applying wax with dirty applicators\n\n## Prevention\n\n- Use the two-bucket wash method\n- Use high-quality microfiber wash mitts\n- Use proper drying towels (high GSM microfiber)\n- Pre-rinse and foam before contact washing\n- Never wipe dry, dusty paint',
    bodyRu: 'Голограммы — это мелкие круговые царапины на поверхности ЛКП, вызванные неправильной мойкой и сушкой.\n\n## Причины\n\n- Автоматические мойки с грязными щётками\n- Мойка одним ведром\n- Протирание сухими полотенцами\n\n## Профилактика\n\n- Метод двух вёдер\n- Качественные микрофибровые рукавицы\n- Правильные полотенца для сушки',
    bodyHe: 'סימני סחרור הם שריטות עגולות דקות על משטח הצבע שנגרמות מטכניקות שטיפה וייבוש לא נכונות.\n\n## גורמים\n\n- שטיפות אוטומטיות עם מברשות מלוכלכות\n- שימוש בדלי בודד\n- ניגוב עם מגבות יבשות\n\n## מניעה\n\n- שיטת שני הדליים\n- כפפות שטיפה ממיקרופייבר איכותי',
    image: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&q=80&w=800',
    tags: ['defects', 'swirl marks', 'paint care'],
    popular: true,
  },
  {
    id: 'a4', slug: 'clay-bar-treatment', category: 'washing',
    titleEn: 'Clay Bar Treatment: Step by Step',
    titleRu: 'Обработка глиной: пошаговое руководство',
    titleHe: 'טיפול בגלילת חימר: שלב אחר שלב',
    bodyEn: 'Clay bar treatment removes bonded surface contaminants that washing alone cannot remove. This includes tree sap residue, overspray, rail dust, and industrial fallout.\n\n## Steps\n\n1. Wash the vehicle thoroughly\n2. Spray clay lubricant on a small section\n3. Gently glide the clay bar across the surface\n4. You will feel resistance where contaminants are present\n5. Once the surface feels smooth, wipe clean\n6. Repeat section by section\n7. Re-wash the vehicle after claying',
    bodyRu: 'Обработка глиной удаляет связанные загрязнения, которые не удаляются обычной мойкой.\n\n## Шаги\n\n1. Тщательно вымойте автомобиль\n2. Нанесите смазку на небольшой участок\n3. Аккуратно проведите глиной по поверхности\n4. Вы почувствуете сопротивление там, где есть загрязнения\n5. Когда поверхность станет гладкой, протрите\n6. Повторите на каждом участке',
    bodyHe: 'טיפול בגלילת חימר מסיר מזהמים קשורים שלא ניתן להסיר בשטיפה בלבד.\n\n## שלבים\n\n1. שטפו את הרכב ביסודיות\n2. רססו חומר סיכה על אזור קטן\n3. החליקו בעדינות את גלילת החימר\n4. תרגישו התנגדות במקומות מזוהמים\n5. כשהמשטח חלק, נגבו\n6. חזרו על התהליך',
    tags: ['washing', 'decontamination', 'clay bar'],
    popular: true,
  },
  {
    id: 'a5', slug: 'da-polisher-guide', category: 'polishing',
    titleEn: 'Dual-Action Polisher: Complete Guide',
    titleRu: 'Эксцентриковая полировальная машинка: полное руководство',
    titleHe: 'מלטשת כפולת פעולה: מדריך מלא',
    bodyEn: 'A dual-action (DA) polisher is the most versatile and safest machine polisher for beginners and professionals alike. Its random orbital motion prevents burn-through while still providing effective correction.\n\n## Key Features\n\n- Random orbital motion (eccentric + spinning)\n- Variable speed control (typically 1-6)\n- Various throw sizes (8mm, 12mm, 15mm, 21mm)\n- Compatible with different pad sizes\n\n## Technique Tips\n\n- Start at speed 3, work up to 5\n- Apply 4 pea-sized dots of compound\n- Work in 2x2 ft sections\n- Maintain medium pressure\n- 4-6 passes per section\n- Keep the pad flat on the surface',
    bodyRu: 'Эксцентриковая (DA) полировальная машинка — самый универсальный и безопасный инструмент для полировки.\n\n## Ключевые особенности\n\n- Случайное орбитальное движение\n- Регулируемая скорость (1-6)\n- Различные размеры орбиты\n\n## Советы по технике\n\n- Начните на скорости 3\n- 4 капли пасты\n- Работайте секциями 60x60 см\n- Среднее давление\n- 4-6 проходов на секцию',
    bodyHe: 'מלטשת כפולת פעולה (DA) היא הכלי הבטוח והמגוון ביותר לליטוש.\n\n## תכונות עיקריות\n\n- תנועה אורביטלית אקראית\n- בקרת מהירות משתנה (1-6)\n- גדלי הטלה שונים\n\n## טיפים\n\n- התחילו במהירות 3\n- 4 נקודות תרכובת\n- עבדו באזורים של 60x60 ס"מ',
    tags: ['polishing', 'machine', 'DA', 'tools'],
    popular: true,
  },
  {
    id: 'a6', slug: 'leather-cleaning', category: 'interior',
    titleEn: 'Professional Leather Cleaning',
    titleRu: 'Профессиональная чистка кожи',
    titleHe: 'ניקוי עור מקצועי',
    bodyEn: 'Professional leather cleaning involves understanding the type of leather, selecting appropriate products, and using proper techniques to clean without damaging the material.\n\n## Steps\n\n1. Vacuum loose debris\n2. Apply leather cleaner with a soft brush\n3. Agitate gently in circular motions\n4. Wipe with a clean microfiber towel\n5. Apply leather conditioner\n6. Buff to an even finish\n\n## Common Mistakes\n\n- Using harsh chemicals (all-purpose cleaners at high dilution)\n- Scrubbing too aggressively\n- Not conditioning after cleaning\n- Using silicone-based dressings',
    bodyRu: 'Профессиональная чистка кожи предполагает понимание типа кожи, выбор правильных средств и правильную технику.\n\n## Шаги\n\n1. Пропылесосьте рыхлый мусор\n2. Нанесите очиститель кожи мягкой щёткой\n3. Аккуратно обработайте круговыми движениями\n4. Протрите чистой микрофиброй\n5. Нанесите кондиционер для кожи',
    bodyHe: 'ניקוי עור מקצועי כולל הבנת סוג העור, בחירת מוצרים מתאימים וטכניקות נכונות.\n\n## שלבים\n\n1. שאבו פסולת רופפת\n2. יישמו מנקה עור עם מברשת רכה\n3. עבדו בעדינות בתנועות מעגליות\n4. נגבו עם מגבת מיקרופייבר\n5. יישמו מרכך עור',
    tags: ['interior', 'leather', 'cleaning'],
    popular: false,
  },
  {
    id: 'a7', slug: 'ppf-basics', category: 'protection',
    titleEn: 'PPF (Paint Protection Film) Explained',
    titleRu: 'PPF (защитная плёнка): объяснение',
    titleHe: 'PPF (ציפוי הגנה לצבע) בהסבר',
    bodyEn: 'Paint Protection Film (PPF) is a thermoplastic urethane film applied to the painted surfaces of a vehicle. It provides physical protection against stone chips, scratches, bug acids, and environmental damage.\n\n## Types\n\n- **Clear PPF**: Invisible protection maintaining the original color\n- **Matte PPF**: Converts gloss paint to a satin/matte finish\n- **Colored PPF**: Changes the vehicle color while protecting\n\n## Benefits\n\n- Self-healing properties (minor scratches disappear with heat)\n- Stone chip protection\n- UV protection preventing paint fade\n- Easy maintenance\n- Removable without paint damage',
    bodyRu: 'Защитная плёнка (PPF) — термопластичная уретановая плёнка, наносимая на окрашенные поверхности автомобиля.\n\n## Типы\n\n- **Прозрачная PPF**: невидимая защита\n- **Матовая PPF**: превращает глянец в матовый финиш\n- **Цветная PPF**: меняет цвет автомобиля',
    bodyHe: 'ציפוי הגנה לצבע (PPF) הוא סרט יורטן תרמופלסטי שמוחל על משטחים צבועים.\n\n## סוגים\n\n- **PPF שקוף**: הגנה בלתי נראית\n- **PPF מט**: הופך צבע מבריק לגימור מט\n- **PPF צבעוני**: משנה את צבע הרכב',
    tags: ['protection', 'PPF', 'film'],
    popular: true,
  },
  {
    id: 'a8', slug: 'pricing-services', category: 'business',
    titleEn: 'How to Price Detailing Services',
    titleRu: 'Как формировать цены на услуги детейлинга',
    titleHe: 'איך לתמחר שירותי דיטיילינג',
    bodyEn: 'Pricing detailing services correctly is crucial for profitability. Consider your costs, time, market rates, and value proposition.\n\n## Pricing Models\n\n- **Hourly Rate**: Charge per hour of work\n- **Vehicle Size Tiers**: Small/Medium/Large/XL\n- **Package Based**: Bundle services at a set price\n- **Value Based**: Price based on results and expertise\n\n## Cost Calculation\n\n1. Product costs per job\n2. Equipment depreciation\n3. Facility costs (rent, utilities)\n4. Your time (target hourly rate)\n5. Insurance and business costs\n6. Profit margin (15-30%)',
    bodyRu: 'Правильное ценообразование — ключ к прибыльности.\n\n## Модели ценообразования\n\n- **Почасовая ставка**\n- **По размеру автомобиля**\n- **Пакетные предложения**\n- **На основе ценности**',
    bodyHe: 'תמחור נכון של שירותי דיטיילינג הוא קריטי לרווחיות.\n\n## מודלי תמחור\n\n- **תעריף שעתי**\n- **לפי גודל רכב**\n- **חבילות שירות**\n- **על בסיס ערך**',
    tags: ['business', 'pricing', 'management'],
    popular: false,
  },
];

export function getArticleTitle(article: WikiArticle, locale: string): string {
  if (locale === 'ru') return article.titleRu;
  if (locale === 'he') return article.titleHe;
  return article.titleEn;
}

export function getArticleBody(article: WikiArticle, locale: string): string {
  if (locale === 'ru') return article.bodyRu;
  if (locale === 'he') return article.bodyHe;
  return article.bodyEn;
}

export function getCategoryTitle(cat: WikiCategory, locale: string): string {
  if (locale === 'ru') return cat.titleRu;
  if (locale === 'he') return cat.titleHe;
  return cat.titleEn;
}
