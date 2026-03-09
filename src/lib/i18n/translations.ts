export type Locale = 'en' | 'ar'

export const translations = {
  en: {
    // Navbar
    nav: {
      howItWorks: 'How it Works',
      features: 'Features',
      pricing: 'Pricing',
      signIn: 'Sign In',
      getStarted: 'Get Started',
      dashboard: 'Dashboard',
    },

    // Hero
    hero: {
      badge: 'AI-Powered Creative Testing',
      headlinePre: 'Stop Burning ',
      headlineAccent: 'Ad Budget',
      headlinePost: 'on Untested Creatives',
      subheading: 'Test your ad creatives with synthetic AI personas before spending a single dollar. Get scores, feedback, and fix-it suggestions in seconds.',
      ctaDashboard: 'Go to Dashboard',
      ctaStart: 'Start Testing Free',
      ctaHow: 'See How It Works',
      // Product card
      cardTitle: 'Creative Analysis',
      cardFile: 'summer-sale-v2.png',
      cardStatus: 'Ship It',
      scoreHook: 'Hook Strength',
      scoreVisual: 'Visual Clarity',
      scoreCta: 'CTA Power',
      fixItLabel: 'Fix-It',
      fixItText: 'Headline could be 40% shorter. Try: ',
      fixItSuggestion: '"50% Off — Today Only"',
      verdictLabel: 'Verdict',
      verdictText: 'Strong creative with ',
      verdictHighlight: 'minor copy tweaks',
      verdictEnd: ' needed',
      personasLabel: 'Personas',
      personasMore: '+4 more',
    },

    // How It Works
    howItWorks: {
      badge: 'How It Works',
      headlinePre: 'Three Steps to ',
      headlineAccent: 'Validated Creatives',
      description: 'No more guessing. No more wasted ad spend. Get AI-powered feedback before you hit publish.',
      steps: [
        {
          title: 'Upload Creative',
          description: 'Drop in your ad image, video, carousel, or landing page. We handle all formats.',
        },
        {
          title: 'AI Personas Evaluate',
          description: '8+ synthetic personas score your creative on hook strength, clarity, CTA power, and more.',
        },
        {
          title: 'Get Actionable Results',
          description: 'Scores, agent debates, attention heatmaps, and specific "fix-it" rewrites — in seconds.',
        },
      ],
    },

    // Features
    features: {
      badge: 'Features',
      headlinePre: 'Everything You Need to ',
      headlineAccent: 'Ship Winning Ads',
      description: 'A complete toolkit for creative testing — no focus groups, no wasted spend, no guesswork.',
      items: [
        {
          title: 'Persona Scoring',
          description: 'Score creatives against diverse synthetic personas — from Gen Z impulse buyers to skeptical enterprise CTOs.',
        },
        {
          title: 'Agent Debate',
          description: 'Watch a Buyer Agent and Skeptic Agent debate your creative in real time. See both sides before you spend.',
        },
        {
          title: 'Fix-It Engine',
          description: 'Get specific copy and visual rewrites with predicted impact scores. Not just "make it better" — actual alternatives.',
        },
        {
          title: 'Attention Heatmaps',
          description: 'See where eyes land first, what gets ignored, and how visual hierarchy performs across your creative.',
        },
        {
          title: 'Funnel Check',
          description: 'Validate creative-to-landing page consistency. Catch message mismatches before they tank your conversion rate.',
        },
        {
          title: 'Competitive Benchmarks',
          description: 'Compare your scores against industry averages and top performers in your vertical.',
        },
      ],
    },

    // Demo Preview
    demo: {
      badge: 'Live Demo',
      headlinePre: 'See It in ',
      headlineAccent: 'Action',
      tabs: ['Persona Scoring', 'Agent Debate', 'Attention Map'],
      personas: [
        { name: 'Sarah K.', role: 'Impulse Buyer, 24', comment: 'Love the urgency! The countdown timer and bold CTA really pull me in.' },
        { name: 'Marcus D.', role: 'Enterprise CTO, 42', comment: 'Too flashy. Where are the specs? I need ROI data, not hype.' },
        { name: 'Priya L.', role: 'Budget-Conscious Mom, 35', comment: 'Good value proposition, but the fine print is hard to read on mobile.' },
      ],
      debate: [
        { agent: 'Buyer Agent', text: 'The hook is strong — "50% Off" immediately communicates value. The social proof badges add credibility.' },
        { agent: 'Skeptic Agent', text: 'But the discount feels generic. Every brand does 50% off. Where\'s the differentiation? And the small text undermines trust.' },
        { agent: 'Buyer Agent', text: 'Fair point on differentiation, but the CTA placement is excellent. Above the fold, high contrast, action-oriented verb.' },
        { agent: 'Verdict', text: '7.2/10 — Ship with tweaks: add unique value prop above the fold, increase fine print font size by 2px.' },
      ],
      heatmapZones: [
        { label: 'Headline' },
        { label: 'Hero Image' },
        { label: 'CTA Button' },
        { label: 'Fine Print' },
        { label: 'Footer' },
      ],
    },

    // Social Proof
    socialProof: {
      badge: 'Proof',
      headlinePre: 'Teams That ',
      headlineAccent: 'Stopped Guessing',
      testimonials: [
        {
          quote: 'We cut our wasted ad spend by 60% in the first month. The agent debate feature alone is worth the subscription.',
          name: 'Emily Chen',
          role: 'Head of Growth, Revo',
          metric: '$42K saved',
        },
        {
          quote: 'Finally, a tool that gives me real feedback — not just "looks good." The fix-it suggestions are incredibly specific.',
          name: 'James Okafor',
          role: 'Creative Director, PixelForge',
          metric: '3x ROAS',
        },
        {
          quote: 'We test every creative before launch now. Our CTR improved 40% since adopting 0spend across all campaigns.',
          name: 'Ana Rivera',
          role: 'Performance Marketing, Scalebound',
          metric: '40% CTR lift',
        },
      ],
    },

    // Pricing
    pricing: {
      badge: 'Pricing',
      headlinePre: 'Simple, ',
      headlineAccent: 'Transparent',
      headlinePost: ' Pricing',
      description: "Start free. Scale when you're ready. Cancel anytime.",
      mostPopular: 'Most Popular',
      perMonth: '/mo',
      ctaDashboard: 'Go to Dashboard',
      tiers: [
        {
          name: 'Starter',
          description: 'For solo marketers testing the waters.',
          features: [
            '25 creative tests/month',
            '5 AI personas',
            'Basic score breakdown',
            'Fix-It suggestions',
            'Email support',
          ],
          cta: 'Start Free Trial',
        },
        {
          name: 'Pro',
          description: 'For growing teams shipping creatives weekly.',
          features: [
            '200 creative tests/month',
            '25 AI personas + custom builder',
            'Agent Debate analysis',
            'Attention heatmaps',
            'Competitive benchmarks',
            'Priority support',
          ],
          cta: 'Start Free Trial',
        },
        {
          name: 'Agency',
          description: 'For agencies managing multiple brands.',
          features: [
            'Unlimited creative tests',
            'Unlimited personas',
            'White-label reports',
            'Team collaboration',
            'API access',
            'Dedicated account manager',
          ],
          cta: 'Contact Sales',
        },
      ],
    },

    // CTA
    cta: {
      headlinePre: 'Stop Spending. ',
      headlineAccent: 'Start Testing.',
      description: 'Join thousands of marketers who validate every creative before it touches real budget.',
      ctaDashboard: 'Go to Dashboard',
      ctaStart: 'Get Started Free',
      noCreditCard: 'No credit card required. 14-day free trial.',
    },

    // Footer
    footer: {
      tagline: 'AI-powered creative testing. Stop burning ad budget on untested creatives.',
      columns: [
        {
          title: 'Product',
          links: ['Features', 'Pricing', 'How It Works', 'Changelog'],
        },
        {
          title: 'Company',
          links: ['About', 'Blog', 'Careers', 'Contact'],
        },
        {
          title: 'Resources',
          links: ['Documentation', 'API Reference', 'Support', 'Status'],
        },
        {
          title: 'Legal',
          links: ['Privacy', 'Terms', 'Security'],
        },
      ],
      copyright: '0spend. All rights reserved.',
    },
  },

  ar: {
    // Navbar
    nav: {
      howItWorks: 'كيف يعمل',
      features: 'المميزات',
      pricing: 'الأسعار',
      signIn: 'تسجيل الدخول',
      getStarted: 'ابدأ الآن',
      dashboard: 'لوحة التحكم',
    },

    // Hero
    hero: {
      badge: 'اختبار إبداعي مدعوم بالذكاء الاصطناعي',
      headlinePre: 'توقف عن حرق ',
      headlineAccent: 'ميزانية الإعلانات',
      headlinePost: 'على إبداعات غير مختبرة',
      subheading: 'اختبر إبداعاتك الإعلانية مع شخصيات ذكاء اصطناعي قبل إنفاق دولار واحد. احصل على تقييمات وملاحظات واقتراحات تحسين في ثوانٍ.',
      ctaDashboard: 'الذهاب إلى لوحة التحكم',
      ctaStart: 'ابدأ الاختبار مجاناً',
      ctaHow: 'شاهد كيف يعمل',
      // Product card
      cardTitle: 'تحليل الإبداع',
      cardFile: 'summer-sale-v2.png',
      cardStatus: 'جاهز للنشر',
      scoreHook: 'قوة الجذب',
      scoreVisual: 'الوضوح البصري',
      scoreCta: 'قوة الـ CTA',
      fixItLabel: 'إصلاح',
      fixItText: 'يمكن تقصير العنوان بنسبة 40%. جرّب: ',
      fixItSuggestion: '"خصم 50% — اليوم فقط"',
      verdictLabel: 'الحكم',
      verdictText: 'إبداع قوي مع ',
      verdictHighlight: 'تعديلات نصية بسيطة',
      verdictEnd: ' مطلوبة',
      personasLabel: 'الشخصيات',
      personasMore: '+4 المزيد',
    },

    // How It Works
    howItWorks: {
      badge: 'كيف يعمل',
      headlinePre: 'ثلاث خطوات نحو ',
      headlineAccent: 'إبداعات موثّقة',
      description: 'لا مزيد من التخمين. لا مزيد من هدر الإعلانات. احصل على ملاحظات الذكاء الاصطناعي قبل النشر.',
      steps: [
        {
          title: 'ارفع إبداعك',
          description: 'أضف صورة إعلانك أو فيديو أو سلسلة صور أو صفحة هبوط. ندعم جميع الصيغ.',
        },
        {
          title: 'شخصيات الذكاء الاصطناعي تُقيّم',
          description: 'أكثر من 8 شخصيات اصطناعية تُقيّم إبداعك على قوة الجذب والوضوح وقوة الـ CTA والمزيد.',
        },
        {
          title: 'احصل على نتائج عملية',
          description: 'تقييمات، نقاشات، خرائط انتباه، وإعادة كتابة محددة — في ثوانٍ.',
        },
      ],
    },

    // Features
    features: {
      badge: 'المميزات',
      headlinePre: 'كل ما تحتاجه لـ',
      headlineAccent: 'إعلانات ناجحة',
      description: 'مجموعة أدوات متكاملة لاختبار الإبداعات — بدون مجموعات تركيز، بدون هدر، بدون تخمين.',
      items: [
        {
          title: 'تقييم الشخصيات',
          description: 'قيّم إبداعاتك مقابل شخصيات اصطناعية متنوعة — من مشتري الجيل Z الاندفاعيين إلى مدراء التقنية المتشككين.',
        },
        {
          title: 'نقاش الوكلاء',
          description: 'شاهد وكيل المشتري ووكيل المتشكك يتناقشان حول إبداعك في الوقت الفعلي. اطلع على كلا الجانبين قبل الإنفاق.',
        },
        {
          title: 'محرك الإصلاح',
          description: 'احصل على إعادة كتابة محددة للنصوص والمرئيات مع درجات تأثير متوقعة. ليس فقط "اجعلها أفضل" — بدائل حقيقية.',
        },
        {
          title: 'خرائط الانتباه',
          description: 'شاهد أين تقع العيون أولاً، وما يتم تجاهله، وكيف يعمل التسلسل البصري عبر إبداعك.',
        },
        {
          title: 'فحص القمع',
          description: 'تحقق من تناسق الإبداع مع صفحة الهبوط. اكتشف عدم تطابق الرسائل قبل أن يؤثر على معدل التحويل.',
        },
        {
          title: 'المقاييس التنافسية',
          description: 'قارن درجاتك مع متوسطات الصناعة والأداء الأفضل في مجالك.',
        },
      ],
    },

    // Demo Preview
    demo: {
      badge: 'عرض مباشر',
      headlinePre: 'شاهده ',
      headlineAccent: 'أثناء العمل',
      tabs: ['تقييم الشخصيات', 'نقاش الوكلاء', 'خريطة الانتباه'],
      personas: [
        { name: 'سارة ك.', role: 'مشترية اندفاعية، 24', comment: 'أحب الإلحاح! المؤقت التنازلي وزر الـ CTA الجريء يجذباني فعلاً.' },
        { name: 'ماركوس د.', role: 'مدير تقني، 42', comment: 'مبهرج جداً. أين المواصفات؟ أحتاج بيانات العائد على الاستثمار، ليس الضجة.' },
        { name: 'بريا ل.', role: 'أم حريصة على الميزانية، 35', comment: 'عرض قيمة جيد، لكن الخط الصغير صعب القراءة على الهاتف.' },
      ],
      debate: [
        { agent: 'وكيل المشتري', text: 'الجذب قوي — "خصم 50%" يوصل القيمة فوراً. شارات الإثبات الاجتماعي تضيف مصداقية.' },
        { agent: 'وكيل المتشكك', text: 'لكن الخصم يبدو عامًا. كل علامة تجارية تقدم 50%. أين التميز؟ والنص الصغير يقلل الثقة.' },
        { agent: 'وكيل المشتري', text: 'نقطة جيدة عن التميز، لكن موقع الـ CTA ممتاز. فوق الطية، تباين عالي، فعل موجه نحو العمل.' },
        { agent: 'الحكم', text: '7.2/10 — انشر مع تعديلات: أضف عرض قيمة فريد فوق الطية، زد حجم الخط الصغير بمقدار 2 بكسل.' },
      ],
      heatmapZones: [
        { label: 'العنوان' },
        { label: 'الصورة الرئيسية' },
        { label: 'زر الإجراء' },
        { label: 'الخط الصغير' },
        { label: 'التذييل' },
      ],
    },

    // Social Proof
    socialProof: {
      badge: 'إثبات',
      headlinePre: 'فرق ',
      headlineAccent: 'توقفت عن التخمين',
      testimonials: [
        {
          quote: 'خفضنا هدر الإعلانات بنسبة 60% في الشهر الأول. ميزة نقاش الوكلاء وحدها تستحق الاشتراك.',
          name: 'إيميلي تشين',
          role: 'رئيسة النمو، Revo',
          metric: 'وفّرنا $42K',
        },
        {
          quote: 'أخيراً، أداة تعطيني ملاحظات حقيقية — وليس فقط "يبدو جيداً." اقتراحات الإصلاح دقيقة بشكل مذهل.',
          name: 'جيمس أوكافور',
          role: 'المدير الإبداعي، PixelForge',
          metric: '3x ROAS',
        },
        {
          quote: 'نختبر كل إبداع قبل الإطلاق الآن. تحسن معدل النقر بنسبة 40% منذ اعتماد 0spend في جميع حملاتنا.',
          name: 'آنا ريفيرا',
          role: 'تسويق الأداء، Scalebound',
          metric: 'ارتفاع 40% CTR',
        },
      ],
    },

    // Pricing
    pricing: {
      badge: 'الأسعار',
      headlinePre: 'أسعار ',
      headlineAccent: 'شفافة',
      headlinePost: ' وبسيطة',
      description: 'ابدأ مجاناً. توسّع عندما تكون جاهزاً. ألغِ في أي وقت.',
      mostPopular: 'الأكثر شعبية',
      perMonth: '/شهر',
      ctaDashboard: 'الذهاب إلى لوحة التحكم',
      tiers: [
        {
          name: 'المبتدئ',
          description: 'للمسوقين المستقلين الذين يستكشفون.',
          features: [
            '25 اختبار إبداعي/شهر',
            '5 شخصيات ذكاء اصطناعي',
            'تحليل أساسي للدرجات',
            'اقتراحات الإصلاح',
            'دعم بالبريد الإلكتروني',
          ],
          cta: 'ابدأ التجربة المجانية',
        },
        {
          name: 'احترافي',
          description: 'للفرق المتنامية التي تنشر إبداعات أسبوعياً.',
          features: [
            '200 اختبار إبداعي/شهر',
            '25 شخصية + بناء مخصص',
            'تحليل نقاش الوكلاء',
            'خرائط الانتباه',
            'مقاييس تنافسية',
            'دعم ذو أولوية',
          ],
          cta: 'ابدأ التجربة المجانية',
        },
        {
          name: 'وكالات',
          description: 'للوكالات التي تدير علامات تجارية متعددة.',
          features: [
            'اختبارات إبداعية غير محدودة',
            'شخصيات غير محدودة',
            'تقارير بعلامتك التجارية',
            'تعاون الفريق',
            'وصول API',
            'مدير حساب مخصص',
          ],
          cta: 'تواصل مع المبيعات',
        },
      ],
    },

    // CTA
    cta: {
      headlinePre: 'توقف عن الإنفاق. ',
      headlineAccent: 'ابدأ الاختبار.',
      description: 'انضم إلى آلاف المسوقين الذين يتحققون من كل إبداع قبل أن يمس الميزانية الحقيقية.',
      ctaDashboard: 'الذهاب إلى لوحة التحكم',
      ctaStart: 'ابدأ مجاناً',
      noCreditCard: 'لا حاجة لبطاقة ائتمان. تجربة مجانية لمدة 14 يوماً.',
    },

    // Footer
    footer: {
      tagline: 'اختبار إبداعي مدعوم بالذكاء الاصطناعي. توقف عن حرق ميزانية الإعلانات على إبداعات غير مختبرة.',
      columns: [
        {
          title: 'المنتج',
          links: ['المميزات', 'الأسعار', 'كيف يعمل', 'سجل التغييرات'],
        },
        {
          title: 'الشركة',
          links: ['من نحن', 'المدونة', 'الوظائف', 'تواصل معنا'],
        },
        {
          title: 'الموارد',
          links: ['التوثيق', 'مرجع API', 'الدعم', 'الحالة'],
        },
        {
          title: 'قانوني',
          links: ['الخصوصية', 'الشروط', 'الأمان'],
        },
      ],
      copyright: '0spend. جميع الحقوق محفوظة.',
    },
  },
} as const

export type Translations = typeof translations.en
