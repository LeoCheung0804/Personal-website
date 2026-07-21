'use strict';

const siteProfile = {
  name: "Leo Cheung",
  siteUrl: "https://leocml.com",
  role: {
    en: "Construction Robotics Engineer",
    zhHant: "建築機械人工程師"
  },
  location: {
    en: "Hong Kong",
    zhHant: "香港"
  },
  contacts: [
    {
      id: "email",
      labelKey: "contact.email",
      value: "leocheung0804@gmail.com",
      href: "mailto:leocheung0804@gmail.com"
    },
    {
      id: "location",
      labelKey: "contact.location"
    },
    {
      id: "employer",
      labelKey: "contact.employer",
      value: "C3 Construction Robotics Limited",
      href: "https://www.c3robotics.com.hk"
    },
    {
      id: "organization",
      labelKey: "contact.organization",
      value: "C3 Robotics Lab",
      href: "https://c3robolab.mae.cuhk.edu.hk/"
    },
    {
      id: "github",
      label: "GitHub",
      value: "LeoCheung0804",
      href: "https://github.com/LeoCheung0804"
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      value: "leocheung0804",
      href: "https://www.linkedin.com/in/leocheung0804"
    },
    {
      id: "orcid",
      label: "ORCID",
      value: "0009-0003-1691-6603",
      href: "https://orcid.org/0009-0003-1691-6603"
    }
  ],
  seo: {
    title: "Leo Cheung | Construction Robotics Engineer",
    schemaName: "Leo Cheung Construction Robotics Portfolio",
    description: "Portfolio of Leo Cheung, a Hong Kong robotics engineer building cable-driven construction robots, facade inspection systems, autonomous painting platforms, and embedded mechatronics.",
    schemaDescription: "A field-focused robotics engineering portfolio spanning construction automation, cable-driven robots, facade inspection, autonomous painting, embedded systems, and mechanical design.",
    keywords: "construction robotics engineer, robotics engineer Hong Kong, construction automation, cable-driven robots, facade inspection robot, ROS, mechatronics",
    ogDescription: "Field-focused construction robotics, facade inspection, autonomous painting, and embedded mechatronics projects by Leo Cheung.",
    twitterDescription: "Construction robotics and mechatronics projects taken from early prototypes to real-world deployment.",
    image: "/assets/images/profile.jpg",
    knowsAbout: [
      "construction robotics",
      "cable-driven parallel robots",
      "facade inspection robots",
      "robot automation",
      "ROS",
      "embedded systems",
      "mechanical design",
      "robot control"
    ]
  },
  copyrightYear: 2026
};

const siteProjects = {
  tapper: {
    file: "tapper.html",
    title: {
      en: "Robo-Tapper: Robotic Facade Inspection",
      zhHant: "Robo-Tapper 外牆檢測機械人"
    },
    cardTitle: {
      en: "Robo-Tapper: Robotic Facade Inspection",
      zhHant: "Robo-Tapper 外牆檢測機械人"
    },
    previewTitle: {
      en: "Automated facade inspection",
      zhHant: "自動化外牆檢測"
    },
    seo: {
      description: "Robo-Tapper is a cable-driven robotic system for automated high-rise facade hammer testing, combining autonomous positioning with AI-assisted impact-signal analysis.",
      ogDescription: "A field-deployed cable robot for consistent facade hammer testing, autonomous positioning, and AI-assisted defect analysis.",
      twitterDescription: "Field-deployed robotic facade inspection with automated hammer testing and AI-assisted signal analysis.",
      image: "/assets/images/Robotapper_cropped.jpeg",
      structuredDescription: "Field-deployed cable-driven robot for automated facade hammer testing, LiDAR navigation, and AI-assisted impact-signal analysis.",
      keywords: "Robo-Tapper, facade inspection robot, cable-driven robot, hammer testing robot, AI defect detection, LiDAR navigation, construction robotics, Hong Kong robotics",
      lastmod: "2026-05-05"
    }
  },
  cuBrick: {
    file: "yes.html",
    title: {
      en: "CU-Brick: Cable-Driven Bricklaying Robot",
      zhHant: "CU-Brick：纜索驅動砌磚機械人"
    },
    cardTitle: {
      en: "CU-Brick: Cable-Driven Bricklaying Robot",
      zhHant: "CU-Brick：纜索驅動砌磚機械人"
    },
    previewTitle: {
      en: "5,800-brick pavilion build",
      zhHant: "建造逾 5,800 塊磚的展亭"
    },
    seo: {
      description: "CU-Brick is a cable-driven parallel robot that built a 40-layer YES Pavilion structure from more than 5,800 bricks across a 13 m by 9 m site.",
      ogDescription: "CU-Brick combines fiducial localization, 3D scanning, and elevation control for automated bricklaying at architectural scale.",
      twitterDescription: "A cable-driven robot that built a 40-layer pavilion structure from more than 5,800 bricks.",
      image: "/assets/images/YES_full.jpg",
      structuredDescription: "Architectural-scale cable-driven parallel robot for automated bricklaying, fiducial localization, 3D scanning, and construction automation.",
      keywords: "CU-Brick, bricklaying robot, cable-driven parallel robot, CDPR, construction automation, fiducial markers, 3D scanning, YES Pavilion, Hong Kong robotics",
      lastmod: "2026-05-05"
    }
  },
  spray: {
    file: "spray.html",
    title: {
      en: "Autonomous Wall Spraying Robot",
      zhHant: "自主牆面噴塗機械人"
    },
    cardTitle: {
      en: "Autonomous Wall Spraying Robot",
      zhHant: "自主牆身噴塗機械人"
    },
    previewTitle: {
      en: "Automated paint application",
      zhHant: "自動化牆面噴塗"
    },
    seo: {
      description: "An autonomous wall spraying prototype integrating AGV motion, IMU sensing, a linear rail, cameras, and ROS-based control for automated paint application.",
      ogDescription: "A ROS-based wall spraying platform coordinating AGV motion, sensing, linear positioning, and paint application.",
      twitterDescription: "Autonomous wall spraying with AGV motion, sensor feedback, linear positioning, and ROS control.",
      image: "/assets/images/Spray_robot.JPG",
      structuredDescription: "Autonomous wall painting prototype with AGV motion, IMU sensing, cameras, linear rail positioning, and ROS control.",
      keywords: "autonomous wall spraying robot, wall painting robot, ROS robot, AGV, IMU, machine vision, linear rail, construction robotics, industrial painting automation",
      lastmod: "2026-05-05"
    }
  },
  knowTouch: {
    file: "knowtouch.html",
    title: {
      en: "kNOw Touch: Touchless Lift Interface",
      zhHant: "kNOw Touch：免觸式升降機介面"
    },
    cardTitle: {
      en: "kNOw Touch: Touchless Lift Interface",
      zhHant: "kNOw Touch：免觸式升降機介面"
    },
    previewTitle: {
      en: "1,200+ units deployed",
      zhHant: "部署逾 1,200 套"
    },
    seo: {
      description: "kNOw Touch is an infrared touchless lift interface deployed in more than 1,200 Hong Kong units within one year.",
      ogDescription: "An infrared gesture interface designed for existing lift panels and delivered through a large-scale Hong Kong deployment.",
      twitterDescription: "Infrared touchless lift interface deployed in more than 1,200 Hong Kong units within one year.",
      image: "/assets/images/knowtouch_1.jpg",
      structuredDescription: "Infrared gesture interface for touchless lift controls, retrofit installation, and large-scale Hong Kong deployment.",
      keywords: "kNOw Touch, touchless lift button, elevator sensor, infrared gesture sensor, lift call bar, contactless interface, Hong Kong elevators, embedded hardware",
      lastmod: "2026-05-05"
    }
  },
  exoskeleton: {
    file: "exoskeleton.html",
    title: {
      en: "ME4: Exoskeleton-Controlled Humanoid Robot",
      zhHant: "ME4：外骨骼控制人形機械人"
    },
    cardTitle: {
      en: "ME4: Exoskeleton-Controlled Humanoid Robot",
      zhHant: "ME4：外骨骼控制人形機械人"
    },
    previewTitle: {
      en: "Wearable humanoid control",
      zhHant: "穿戴式人形機械人控制"
    },
    seo: {
      description: "ME4 pairs a wearable exoskeleton controller with a humanoid robot, combining haptic feedback, wireless communication, and 48 V BLDC motor control.",
      ogDescription: "A wearable control system for natural humanoid-robot motion with haptic feedback and wireless BLDC control.",
      twitterDescription: "Wearable exoskeleton control for a humanoid robot with haptic feedback and wireless BLDC control.",
      image: "/assets/images/Exoskeleton_robot.jpg",
      structuredDescription: "Humanoid robot and wearable exoskeleton controller with haptic feedback, 48 V BLDC control, and wireless communication.",
      keywords: "exoskeleton control, humanoid robot, haptic feedback, BLDC motor control, wireless robot control, LiDAR, mechatronics, robotics engineering",
      lastmod: "2026-05-05"
    }
  },
  borderless: {
    file: "borderless.html",
    title: {
      en: "Borderless Lab 365: Remote STEM Laboratory",
      zhHant: "Borderless Lab 365：STEM 遙距實驗室"
    },
    cardTitle: {
      en: "Borderless Lab 365: Remote STEM Laboratory",
      zhHant: "Borderless Lab 365：STEM 遙距實驗室"
    },
    seo: {
      description: "Borderless Lab 365 is a browser-based PolyU platform that lets secondary students control real STEM experiments and monitor live sensor data remotely.",
      ogDescription: "A remote STEM laboratory combining browser controls, livestream monitoring, Raspberry Pi, Arduino, and real-time sensor data.",
      twitterDescription: "Browser-based STEM experiments with live video, remote controls, and real-time sensor data.",
      image: "/assets/images/Borderless_lab.jpg",
      structuredDescription: "Browser-based remote STEM laboratory using Raspberry Pi, Arduino, livestream monitoring, and real-time sensor data.",
      keywords: "Borderless Lab 365, remote STEM laboratory, web-based lab platform, Raspberry Pi, Arduino, livestream experiments, real-time sensor data, STEM education",
      lastmod: "2026-05-05"
    }
  },
  microwave: {
    file: "microwave.html",
    title: {
      en: "Microwave Heating for Construction Materials",
      zhHant: "建築材料微波加熱研究"
    },
    cardTitle: {
      en: "Microwave Heating for Construction Materials",
      zhHant: "建築材料微波加熱研究"
    },
    seo: {
      description: "An experimental study of how concrete, cement, and metal compositions respond to microwave heating, supported by CAD-designed molds and prototypes.",
      ogDescription: "Construction-material microwave heating experiments using CAD-built prototypes, material testing, and a low-cost laboratory setup.",
      twitterDescription: "CAD-led prototype and material tests exploring microwave heating for concrete and cement compositions.",
      image: "/assets/images/Microwave.jpeg",
      structuredDescription: "Experimental microwave heating research for concrete, cement, and metal compositions using CAD-designed molds and prototypes.",
      keywords: "microwave heating system, concrete heating, cement materials, sustainable construction, CAD prototype, SolidWorks, AutoCAD, material testing",
      lastmod: "2026-05-05"
    }
  },
  retractable: {
    file: "retractable.html",
    title: {
      en: "Retractable Tapper & Thruster Module",
      zhHant: "可伸縮敲擊與推進模組"
    },
    cardTitle: {
      en: "Retractable Tapper & Thruster Module",
      zhHant: "可伸縮敲擊與推進模組"
    },
    seo: {
      description: "A compact retractable tapper and thruster module designed to protect impact-testing hardware while a facade inspection robot is moving.",
      ogDescription: "A modular impact-testing tool that deploys at an inspection point and retracts during robot travel.",
      twitterDescription: "Compact retractable impact-testing hardware for cable-driven facade inspection robots.",
      image: "/assets/images/v2.0.png",
      structuredDescription: "Modular retractable tapper and thruster concept for robotic facade hammer testing and protected tool transport.",
      keywords: "retractable tapper, facade inspection robot, robotic hammer testing, thruster module, modular robot tool, construction inspection, robotics hardware design",
      lastmod: "2026-05-05"
    }
  },
  footController: {
    file: "footcontroller.html",
    title: {
      en: "SuperLimb Wireless Motorized Foot Controller",
      zhHant: "SuperLimb 無線電動腳踏控制器"
    },
    cardTitle: {
      en: "SuperLimb Wireless Motorized Foot Controller",
      zhHant: "SuperLimb 無線電動腳踏控制器"
    },
    seo: {
      description: "A wearable motorized foot controller for SuperLimb, combining multi-axis input, wireless communication, embedded electronics, and haptic feedback.",
      ogDescription: "A hands-free SuperLimb control prototype built around motorized pedals, wireless telemetry, and ergonomic multi-axis input.",
      twitterDescription: "Wearable motorized foot control for SuperLimb with wireless multi-axis input and haptic feedback.",
      image: "/assets/images/footcontroler.jpg",
      structuredDescription: "Wearable wireless foot controller for SuperLimb with motorized pedals, haptic feedback, embedded electronics, and multi-axis input.",
      keywords: "wireless foot controller, SuperLimb, motorized pedal, wearable robot controller, haptic feedback, embedded electronics, multi-axis control, robotics hardware",
      lastmod: "2026-05-05"
    }
  }
};

const translations = {
  en: {
    "profile.title": siteProfile.role.en,
    "sidebar.showContacts": "Show Contacts",
    "sidebar.hideContacts": "Hide Contacts",
    "accessibility.skipToContent": "Skip to main content",
    "contact.email": "Email",
    "contact.location": "Location",
    "contact.hongKong": siteProfile.location.en,
    "contact.employer": "Employer",
    "contact.organization": "Organization",
    "nav.about": "About",
    "nav.resume": "Resume",
    "nav.projects": "Projects",
    "nav.publications": "Research",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    "nav.primary": "Primary navigation",
    "nav.menu": "Menu",
    "nav.closeMenu": "Close menu",
    "nav.preferences": "Language and appearance",
    "language.toggle": "Switch language",
    "language.switchToZhHant": "Switch to Traditional Chinese",
    "language.switchToEnglish": "Switch to English",
    "theme.toggle": "Toggle theme",
    "theme.switchToLight": "Switch to light theme",
    "theme.switchToDark": "Switch to dark theme",
    "about.title": "About me",
    "about.paragraph1": "I'm a mechanical engineer specializing in construction robotics. My work spans mechanical design, embedded electronics, ROS software, sensing, system integration, and field validation—taking machines from the first CAD model to reliable operation on site.",
    "about.paragraph2": "At C3 Construction Robotics, I develop cable-driven and autonomous systems for construction and facade inspection. Highlights include CU-Brick building a 40-layer YES Pavilion structure from more than 5,800 bricks, Robo-Tapper progressing into commercial facade inspections, and presenting the CU-Brick paper at CableCon 2025. I focus on precise engineering, practical safety, and systems that solve real constraints outside the lab.",
    "service.title": "What i'm doing",
    "service.software.title": "Software development",
    "service.software.text": "Build ROS-based control, navigation, signal-processing, UI, motor-control, and wireless communication software that connects cleanly to real hardware.",
    "service.hardware.title": "Hardware design",
    "service.hardware.text": "Design robot mechanisms, electrical layouts, and testable prototypes using CAD, 3D printing, CNC machining, sensors, and embedded electronics.",
    "service.management.title": "Project management",
    "service.management.text": "Turn open-ended requirements into coordinated engineering work spanning scope, suppliers, integration, field tests, milestones, and safety documentation.",
    "service.research.title": "Research and Publishing",
    "service.research.text": "Translate experiments into engineering evidence and clear technical communication, including peer-reviewed work and conference presentations.",
    "projectPreview.title": "Selected work",
    "projectPreview.pause": "Pause selected work auto-scroll",
    "projectPreview.resume": "Resume selected work auto-scroll",
    "projectPreview.tapper": siteProjects.tapper.previewTitle.en,
    "projectPreview.cuBrick": siteProjects.cuBrick.previewTitle.en,
    "projectPreview.spray": siteProjects.spray.previewTitle.en,
    "projectPreview.knowTouch": siteProjects.knowTouch.previewTitle.en,
    "projectPreview.exoskeleton": siteProjects.exoskeleton.previewTitle.en,
    "resume.title": "Resume",
    "resume.education": "Education",
    "resume.msc.title": "MSc in Mechanical and Automation Engineering",
    "resume.msc.project": "MSc project: SuperLimb Wireless Motorized Foot Controller",
    "resume.bsc.title": "BSc (Hons) in Engineering Physics",
    "resume.bsc.project": "Final-year project: Artificial Lighting for Basil Growth",
    "resume.experience": "Experience",
    "resume.mechanicalEngineer": "Mechanical Engineer",
    "resume.mechanicalEngineer.projects": "Robo-Tapper: Robotic Facade Inspection<br>Autonomous Wall Spraying Robot<br>CU-Brick: Cable-Driven Bricklaying Robot<br>Retractable Tapper & Thruster Module",
    "resume.projectEngineer": "Project Engineer",
    "resume.projectEngineer.projects": "kNOw Touch: Touchless Lift Interface<br>ME4: Exoskeleton-Controlled Humanoid Robot",
    "resume.graduateExecutive": "Graduate Executive",
    "resume.graduateExecutive.project": "Borderless Lab 365: Remote STEM Laboratory",
    "resume.summerInternship": "Summer Internship",
    "resume.summerInternship.project": "Microwave Heating for Construction Materials",
    "projects.title": "Selected Projects",
    "filters.all": "All",
    "filters.software": "Software & controls",
    "filters.hardware": "Hardware & prototyping",
    "filters.management": "Systems engineering",
    "filters.selectCategory": "Select category",
    "project.tapper.title": siteProjects.tapper.cardTitle.en,
    "project.cuBrick.title": siteProjects.cuBrick.cardTitle.en,
    "project.spray.title": siteProjects.spray.cardTitle.en,
    "project.knowTouch.title": siteProjects.knowTouch.cardTitle.en,
    "project.exoskeleton.title": siteProjects.exoskeleton.cardTitle.en,
    "project.borderless.title": siteProjects.borderless.cardTitle.en,
    "project.microwave.title": siteProjects.microwave.cardTitle.en,
    "project.retractable.title": siteProjects.retractable.cardTitle.en,
    "project.footController.title": siteProjects.footController.cardTitle.en,
    "publications.title": "Research & Publications",
    "publications.filters.conference": "Conference papers",
    "publications.filters.journal": "Journal papers",
    "publications.cuBrick.title": "Development of CU-Brick Brick Laying Cable-Driven Robot for a Real-World Construction Project",
    "publications.cuBrick.info": "Presented at CableCon 2025, the 7th International Conference on Cable-Driven Parallel Robots, July 2025",
    "publications.cuBrick.abstract": "This paper presents CU-Brick, a cable-driven parallel robot developed for automated bricklaying and demonstrated through construction of the Yard for Environmental Sustainability (YES) Pavilion. Across a 13 m x 9 m work area, the system built a 2.5 m-high structure with 40 layers and more than 5,800 bricks.",
    "blog.title": "Blog",
    "blog.backToBlog": "Back to Blog",
    "blog.loadError": "Could not load the blog post. Please try again later.",
    "contact.title": "Contact",
    "contact.formTitle": "Contact Form",
    "contact.fullName": "Full name",
    "contact.emailAddress": "Email address",
    "contact.message": "Your Message",
    "contact.sendMessage": "Send Message",
    "contact.sending": "Sending...",
    "contact.success": "Thanks for your message! I will get back to you soon.",
    "contact.error": "Oops! There was a problem submitting your form. Please try again.",
    "contact.recaptchaIntro": "This site is protected by reCAPTCHA and the Google",
    "contact.privacyPolicy": "Privacy Policy",
    "contact.and": "and",
    "contact.terms": "Terms of Service",
    "contact.apply": "apply.",
    "blog.failed": "Failed to load posts.",
    "footer.backToTop": "Back to Top"
  },
  zhHant: {
    "profile.title": siteProfile.role.zhHant,
    "sidebar.showContacts": "顯示聯絡資料",
    "sidebar.hideContacts": "隱藏聯絡資料",
    "accessibility.skipToContent": "跳至主要內容",
    "contact.email": "電郵",
    "contact.location": "地點",
    "contact.hongKong": siteProfile.location.zhHant,
    "contact.employer": "僱主",
    "contact.organization": "機構",
    "nav.about": "關於",
    "nav.resume": "履歷",
    "nav.projects": "項目",
    "nav.publications": "研究",
    "nav.blog": "網誌",
    "nav.contact": "聯絡",
    "nav.primary": "主要導覽",
    "nav.menu": "選單",
    "nav.closeMenu": "關閉選單",
    "nav.preferences": "語言與外觀",
    "language.toggle": "切換語言",
    "language.switchToZhHant": "切換至繁體中文",
    "language.switchToEnglish": "切換至英文",
    "theme.toggle": "切換主題",
    "theme.switchToLight": "切換至淺色主題",
    "theme.switchToDark": "切換至深色主題",
    "about.title": "關於我",
    "about.paragraph1": "我是一名專注建築機械人的機械工程師，工作涵蓋機械設計、嵌入式電子、ROS 軟件、感測、系統整合與現場驗證，把機械人由首個 CAD 模型推進至工地上的可靠運作。",
    "about.paragraph2": "我現於 C3 Construction Robotics 開發纜索驅動及自主建築系統。代表工作包括 CU-Brick 以超過 5,800 塊磚建成 40 層的 YES Pavilion 結構、推動 Robo-Tapper 進入商業外牆檢測，以及在 CableCon 2025 發表 CU-Brick 論文。我重視精準工程、實際安全，以及真正能處理實驗室以外限制的系統。",
    "service.title": "我的工作",
    "service.software.title": "軟件開發",
    "service.software.text": "開發 ROS 控制、自主導航、訊號處理、操作介面、馬達控制及無線通訊軟件，讓軟硬件可靠整合。",
    "service.hardware.title": "硬件設計",
    "service.hardware.text": "運用 CAD、3D 打印、CNC 加工、感測器及嵌入式電子，設計機械結構、電氣配置與可測試原型。",
    "service.management.title": "項目管理",
    "service.management.text": "把開放式需求轉化為清晰的工程工作，涵蓋範疇、供應商協調、系統整合、現場測試、里程碑及安全文件。",
    "service.research.title": "研究與出版",
    "service.research.text": "把實驗整理成可驗證的工程證據，並透過同行評審成果與會議簡報清晰傳達技術內容。",
    "projectPreview.title": "精選工作",
    "projectPreview.pause": "暫停精選作品自動捲動",
    "projectPreview.resume": "繼續精選作品自動捲動",
    "projectPreview.tapper": siteProjects.tapper.previewTitle.zhHant,
    "projectPreview.cuBrick": siteProjects.cuBrick.previewTitle.zhHant,
    "projectPreview.spray": siteProjects.spray.previewTitle.zhHant,
    "projectPreview.knowTouch": siteProjects.knowTouch.previewTitle.zhHant,
    "projectPreview.exoskeleton": siteProjects.exoskeleton.previewTitle.zhHant,
    "resume.title": "履歷",
    "resume.education": "教育",
    "resume.msc.title": "機械與自動化工程理學碩士",
    "resume.msc.project": "碩士項目：SuperLimb 無線電動腳踏控制器",
    "resume.bsc.title": "工程物理學榮譽理學士",
    "resume.bsc.project": "畢業項目：羅勒生長人工照明",
    "resume.experience": "工作經驗",
    "resume.mechanicalEngineer": "機械工程師",
    "resume.mechanicalEngineer.projects": "Robo-Tapper 外牆檢測機械人<br>自主牆面噴塗機械人<br>CU-Brick 纜索驅動砌磚機械人<br>可伸縮敲擊與推進模組",
    "resume.projectEngineer": "項目工程師",
    "resume.projectEngineer.projects": "kNOw Touch 免觸式升降機介面<br>ME4 外骨骼操控人形機械人",
    "resume.graduateExecutive": "畢業行政人員",
    "resume.graduateExecutive.project": "Borderless Lab 365 STEM 遙距實驗室",
    "resume.summerInternship": "暑期實習",
    "resume.summerInternship.project": "建築材料微波加熱研究",
    "projects.title": "精選項目",
    "filters.all": "全部",
    "filters.software": "軟件與控制",
    "filters.hardware": "硬件與原型",
    "filters.management": "系統工程",
    "filters.selectCategory": "選擇分類",
    "project.tapper.title": siteProjects.tapper.cardTitle.zhHant,
    "project.cuBrick.title": siteProjects.cuBrick.cardTitle.zhHant,
    "project.spray.title": siteProjects.spray.cardTitle.zhHant,
    "project.knowTouch.title": siteProjects.knowTouch.cardTitle.zhHant,
    "project.exoskeleton.title": siteProjects.exoskeleton.cardTitle.zhHant,
    "project.borderless.title": siteProjects.borderless.cardTitle.zhHant,
    "project.microwave.title": siteProjects.microwave.cardTitle.zhHant,
    "project.retractable.title": siteProjects.retractable.cardTitle.zhHant,
    "project.footController.title": siteProjects.footController.cardTitle.zhHant,
    "publications.title": "研究與論文",
    "publications.filters.conference": "會議論文",
    "publications.filters.journal": "期刊論文",
    "publications.cuBrick.title": "Development of CU-Brick Brick Laying Cable-Driven Robot for a Real-World Construction Project",
    "publications.cuBrick.info": "於 2025 年 7 月在第 7 屆纜索驅動並聯機械人國際會議 CableCon 2025 發表",
    "publications.cuBrick.abstract": "本文介紹 CU-Brick，一套為自動砌磚而開發的纜索驅動並聯機械人，並透過建造 Yard for Environmental Sustainability (YES) Pavilion 作實際驗證。系統在 13 m × 9 m 的工作範圍內，建成高 2.5 m、共 40 層、使用超過 5,800 塊磚的結構。",
    "blog.title": "網誌",
    "blog.backToBlog": "返回網誌",
    "blog.loadError": "無法載入網誌文章，請稍後再試。",
    "contact.title": "聯絡",
    "contact.formTitle": "聯絡表格",
    "contact.fullName": "姓名",
    "contact.emailAddress": "電郵地址",
    "contact.message": "你的訊息",
    "contact.sendMessage": "發送訊息",
    "contact.sending": "發送中...",
    "contact.success": "謝謝你的訊息！我會盡快回覆。",
    "contact.error": "提交表格時發生問題，請稍後再試。",
    "contact.recaptchaIntro": "本網站受 reCAPTCHA 保護，並適用 Google",
    "contact.privacyPolicy": "私隱政策",
    "contact.and": "及",
    "contact.terms": "服務條款",
    "contact.apply": "。",
    "blog.failed": "無法載入文章。",
    "footer.backToTop": "返回頂部"
  }
};

Object.assign(translations.en, {
  "projects.back": "Back to Projects",
  "project.overview": "Project Overview",
  "project.responsibilities": "Selected Contributions",
  "project.bookNow": "Open Remote Lab"
});

Object.assign(translations.zhHant, {
  "projects.back": "返回項目",
  "project.overview": "項目概覽",
  "project.responsibilities": "主要貢獻",
  "project.bookNow": "開啟遙距實驗室"
});

const projectPageFiles = Object.fromEntries(
  Object.entries(siteProjects).map(([key, project]) => [key, project.file])
);

const projectPageAliases = Object.fromEntries(
  Object.entries(projectPageFiles).map(([key, file]) => [file.replace(/\.html$/i, ""), key])
);

const projectPageTranslations = {
  tapper: {
    en: {
      title: siteProjects.tapper.title.en,
      content: `
        <p>Robo-Tapper is a cable-driven robot for high-rise facade inspection. It automates hammer testing and combines autonomous positioning with AI-assisted impact-signal analysis, creating a more consistent workflow for identifying facade defects.</p>
        <figure>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/5DXR3lMrMCk?si=djfk2KVHWyjRYlTt" title="Robo-Tapper project video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </figure>
        <h3>${translations.en["project.responsibilities"]}</h3>
        <ul>
          <li>Led the mechanical and systems development of the autonomous facade inspection platform.</li>
          <li>Moved the system through field testing and into more than 12 commercial facade inspections within one year.</li>
          <li>Reduced structural weight while improving stability, then designed and manufactured the electrical and control boxes.</li>
          <li>Developed C++ and Python ROS nodes and APIs for the operator interface, navigation, and signal-processing workflow.</li>
          <li>Integrated laser sensors, IMU, LiDAR, and computer vision for positioning and defect analysis.</li>
          <li>Supported industrial safety compliance, including Form 5 certification work with a Registered Professional Engineer.</li>
        </ul>`
    },
    zhHant: {
      title: siteProjects.tapper.title.zhHant,
      content: `
        <p>Robo-Tapper 是用於高樓外牆檢測的纜索驅動機械人。系統把敲擊測試自動化，並結合自主定位與 AI 輔助撞擊訊號分析，建立更一致的外牆缺陷識別流程。</p>
        <figure>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/5DXR3lMrMCk?si=djfk2KVHWyjRYlTt" title="Robo-Tapper 項目影片" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </figure>
        <h3>${translations.zhHant["project.responsibilities"]}</h3>
        <ul>
          <li>主導自主外牆檢測平台的機械與系統開發。</li>
          <li>推動系統通過現場測試，並於一年內完成超過 12 個商業外牆檢測項目。</li>
          <li>在減輕結構重量的同時提升穩定性，並設計及製作電氣箱與控制箱。</li>
          <li>使用 C++ 與 Python 開發 ROS 節點及 API，支援操作介面、導航與訊號處理流程。</li>
          <li>整合激光感應器、IMU、LiDAR 與電腦視覺，用於定位及缺陷分析。</li>
          <li>支援工業安全合規工作，包括與註冊專業工程師合作處理 Form 5 認證。</li>
        </ul>`
    }
  },
  cuBrick: {
    en: {
      title: siteProjects.cuBrick.title.en,
      content: `
        <p>CU-Brick is a cable-driven parallel robot built for automated bricklaying. At the Yard for Environmental Sustainability (YES) Pavilion, it constructed a permeable brick structure across a 13 m by 9 m work area, reaching 2.5 m in height with 40 layers and more than 5,800 bricks.</p>
        <p>Fiducial-marker localization and 3D scanning support real-time calibration, while an elevation system shifts the robot's workspace to build taller structures without cable interference.</p>
        <figure>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/DkltJm3nhyI?si=xpFi4j9ImTA5RzOU" title="CU-Brick project video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </figure>
        <p><a href="https://news.tvb.com/tc/local/67e04c434fe65d6c2b35ddcd?utm_source=newswebshare&utm_medium=referral" target="_blank" rel="noopener">TVB News: CU-Brick media coverage</a><br><a href="https://news.now.com/home/local/player?newsId=597899" target="_blank" rel="noopener">Now News: CU-Brick media coverage</a><br><a href="https://www.i-cable.com/%E6%96%B0%E8%81%9E%E8%B3%87%E8%A8%8A/331104/%E4%B8%AD%E5%A4%A7%E7%A0%94%E7%99%BC%E7%A0%8C%E7%A3%9A%E6%A9%9F%E6%A2%B0%E4%BA%BA-%E4%BB%A5%E7%B7%9A%E7%BA%9C%E9%A9%85%E5%8B%95-%E8%87%AA%E5%8B%95%E4%BF%AE%E6%AD%A3%E8%B7%AF%E7%B7%9A" target="_blank" rel="noopener">i-CABLE News: CU-Brick media coverage</a><br><a href="https://news.rthk.hk/rthk/ch/component/k2/1797064-20250324.htm" target="_blank" rel="noopener">RTHK News: CU-Brick media coverage</a></p>
        <h3>${translations.en["project.responsibilities"]}</h3>
        <ul>
          <li>Designed and implemented the cable-driven robot for a full-scale construction project.</li>
          <li>Delivered autonomous construction of a 2.5 m-high, 40-layer structure using more than 5,800 bricks.</li>
          <li>Integrated fiducial markers and high-resolution 3D spatial data for calibration and localization.</li>
          <li>Designed and manufactured the robot's electrical and control boxes.</li>
          <li>Co-authored and presented the CU-Brick paper at CableCon 2025.</li>
          <li>Supported public demonstrations and coverage by TVB News, Now News, i-CABLE News, and RTHK.</li>
          <li>Helped prepare the project for YPEC 2025, where it was named second runner-up in the Open Section, and for the 2026 OSH Innovation and Technology Award, where it received an Open Category Merit Award.</li>
        </ul>`
    },
    zhHant: {
      title: siteProjects.cuBrick.title.zhHant,
      content: `
        <p>CU-Brick 是為自動砌磚而設計的纜索驅動並聯機械人。系統在 Yard for Environmental Sustainability (YES) Pavilion 的實際建造項目中，於 13 米乘 9 米的工作範圍內建成高 2.5 米、共 40 層、使用超過 5,800 塊磚的透水磚結構。</p>
        <p>基準標記定位與 3D 掃描支援即時校準，升降系統則調整機械人的工作空間，讓系統在避免纜索互相干涉的情況下建造更高結構。</p>
        <figure>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/DkltJm3nhyI?si=xpFi4j9ImTA5RzOU" title="CU-Brick 項目影片" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </figure>
        <p><a href="https://news.tvb.com/tc/local/67e04c434fe65d6c2b35ddcd?utm_source=newswebshare&utm_medium=referral" target="_blank" rel="noopener">無綫新聞：CU-Brick 媒體報導</a><br><a href="https://news.now.com/home/local/player?newsId=597899" target="_blank" rel="noopener">Now 新聞：CU-Brick 媒體報導</a><br><a href="https://www.i-cable.com/%E6%96%B0%E8%81%9E%E8%B3%87%E8%A8%8A/331104/%E4%B8%AD%E5%A4%A7%E7%A0%94%E7%99%BC%E7%A0%8C%E7%A3%9A%E6%A9%9F%E6%A2%B0%E4%BA%BA-%E4%BB%A5%E7%B7%9A%E7%BA%9C%E9%A9%85%E5%8B%95-%E8%87%AA%E5%8B%95%E4%BF%AE%E6%AD%A3%E8%B7%AF%E7%B7%9A" target="_blank" rel="noopener">有線新聞：CU-Brick 媒體報導</a><br><a href="https://news.rthk.hk/rthk/ch/component/k2/1797064-20250324.htm" target="_blank" rel="noopener">香港電台：CU-Brick 媒體報導</a></p>
        <h3>${translations.zhHant["project.responsibilities"]}</h3>
        <ul>
          <li>設計並實作應用於全尺寸建造項目的砌磚纜索驅動機械人。</li>
          <li>完成高 2.5 米、共 40 層、使用超過 5,800 塊磚的自主建造工作。</li>
          <li>整合基準標記與高解像度 3D 空間數據，支援校準及定位。</li>
          <li>設計並製作機械人的電氣箱及控制箱。</li>
          <li>共同撰寫 CU-Brick 論文，並於 CableCon 2025 發表。</li>
          <li>支援公開示範，以及無綫新聞、Now 新聞、有線新聞和香港電台的媒體報道。</li>
          <li>協助項目參與 YPEC 2025 並獲公開組季軍，其後再於 2026 年職安健創科大獎公開組獲得嘉許獎。</li>
        </ul>`
    }
  },
  spray: {
    en: {
      title: siteProjects.spray.title.en,
      content: `
        <p>This autonomous wall spraying prototype coordinates an AGV platform, IMU, cameras, linear-rail motion, and a motorized sprayer through ROS. The system was developed to automate navigation and paint application while improving repeatability across large surfaces.</p>
        <figure><img src="./assets/images/Spray_robot.JPG" alt="Autonomous wall spraying robot" width="600"><figcaption>Autonomous wall spraying robot</figcaption></figure>
        <h3>${translations.en["project.responsibilities"]}</h3>
        <ul>
          <li>Guided a master's student project from early concept through integrated robot development.</li>
          <li>Improved the mechanical architecture with a four-bar linkage and structural design reviews.</li>
          <li>Integrated AGV motion, IMU sensing, linear positioning, and the motorized sprayer through ROS.</li>
          <li>Developed a follow-on opportunity with Towngas Hong Kong for production-plant tank spraying.</li>
        </ul>`
    },
    zhHant: {
      title: siteProjects.spray.title.zhHant,
      content: `
        <p>自主牆面噴塗原型透過 ROS 協調 AGV 平台、IMU、相機、線性滑軌與電動噴塗器。系統旨在把導航和噴塗工序自動化，並提升大面積施工的重複一致性。</p>
        <figure><img src="./assets/images/Spray_robot.JPG" alt="自主牆面噴塗機械人" width="600"><figcaption>自主牆面噴塗機械人</figcaption></figure>
        <h3>${translations.zhHant["project.responsibilities"]}</h3>
        <ul>
          <li>指導碩士生項目由早期概念推進至完整機械人整合。</li>
          <li>透過結構設計檢討及四連桿機構改良機械架構。</li>
          <li>以 ROS 整合 AGV 移動、IMU 感測、線性定位及電動噴塗器。</li>
          <li>促成與香港中華煤氣研究生產廠房儲罐噴塗的後續合作機會。</li>
        </ul>`
    }
  },
  knowTouch: {
    en: {
      title: siteProjects.knowTouch.title.en,
      content: `
        <p>kNOw Touch is an infrared gesture interface that lets users activate lift controls without physical contact. Designed for new or existing control panels, the sensor bar was deployed across more than 1,200 units in Hong Kong within one year.</p>
        <figure><iframe width="560" height="315" src="https://www.youtube.com/embed/H5CbdbJ4yW0?si=d9xhUFhmYV5AYOlU" title="kNOw Touch project video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></figure>
        <h3>${translations.en["project.responsibilities"]}</h3>
        <ul>
          <li>Coordinated delivery and installation of more than 1,200 units, including deployments at Hong Kong International Airport and Pacific Place.</li>
          <li>Worked with suppliers on mechanical design, material selection, and microprocessor procurement.</li>
          <li>Resolved manufacturing, installation, and software issues during production and rollout.</li>
          <li>Performed quality inspections and performance evaluations across more than 150 deployment processes.</li>
        </ul>`
    },
    zhHant: {
      title: siteProjects.knowTouch.title.zhHant,
      content: `
        <p>kNOw Touch 是紅外線手勢感應介面，讓使用者無需接觸即可啟動升降機控制。感應條可安裝於新造或現有控制面板，並於一年內在香港部署超過 1,200 套。</p>
        <figure><iframe width="560" height="315" src="https://www.youtube.com/embed/H5CbdbJ4yW0?si=d9xhUFhmYV5AYOlU" title="kNOw Touch 項目影片" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></figure>
        <h3>${translations.zhHant["project.responsibilities"]}</h3>
        <ul>
          <li>協調超過 1,200 套設備的交付與安裝，包括香港國際機場及太古廣場的部署。</li>
          <li>與供應商協調機械設計、物料選擇及微處理器採購。</li>
          <li>在生產及推出期間解決製造、安裝與軟件問題。</li>
          <li>為超過 150 次部署流程進行品質檢查及性能評估。</li>
        </ul>`
    }
  },
  exoskeleton: {
    en: {
      title: siteProjects.exoskeleton.title.en,
      content: `
        <p>ME4 pairs a wearable exoskeleton controller with a humanoid robot to explore more natural human-to-robot control. The system brings together custom mechanics, electronics, sensors, actuators, haptic feedback, and control software in one integrated interface.</p>
        <figure><iframe width="560" height="315" src="https://www.youtube.com/embed/14kadLLVMPQ?si=MYOS6TnPgDZjG4YG" title="Exoskeleton project video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></figure>
        <h3>${translations.en["project.responsibilities"]}</h3>
        <ul>
          <li>Designed the mechanical structure and electrical layout for both the wearable controller and humanoid robot.</li>
          <li>Implemented haptic feedback and tuned the mechanism to reduce vibration.</li>
          <li>Developed Linux software for 48 V high-torque BLDC control and wireless communication.</li>
          <li>Maintained the robotic platform, including repairs to 5G communication transmitters and LiDAR modules.</li>
        </ul>`
    },
    zhHant: {
      title: siteProjects.exoskeleton.title.zhHant,
      content: `
        <p>ME4 把穿戴式外骨骼控制器與人形機械人結合，探索更自然的人機操控方式。系統在同一介面中整合訂製機械結構、電子系統、感測器、致動器、觸覺回饋及控制軟件。</p>
        <figure><iframe width="560" height="315" src="https://www.youtube.com/embed/14kadLLVMPQ?si=MYOS6TnPgDZjG4YG" title="外骨骼項目影片" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></figure>
        <h3>${translations.zhHant["project.responsibilities"]}</h3>
        <ul>
          <li>設計穿戴式控制器與人形機械人的機械結構及電氣佈局。</li>
          <li>實作觸覺回饋，並調整機構以減少震動。</li>
          <li>於 Linux 平台開發 48 V 高扭矩 BLDC 控制及無線通訊軟件。</li>
          <li>維護機械人平台，包括維修 5G 通訊發射器及 LiDAR 模組。</li>
        </ul>`
    }
  },
  borderless: {
    en: {
      title: siteProjects.borderless.title.en,
      content: `
        <p>Borderless Lab 365 is a browser-based remote laboratory that lets secondary students control real STEM experiments from anywhere. The physical setups are hosted and maintained by PolyU's Department of Applied Physics.</p>
        <p>The platform relays user commands to laboratory hardware through PolyU's server, then returns live video and sensor data so students can observe each experiment as it runs.</p>
        <a href="https://stem-ap.polyu.edu.hk/remotelab/home.html" class="btn btn-primary">${translations.en["project.bookNow"]}</a>
        <figure><iframe width="560" height="315" loading="lazy" src="https://www.youtube.com/embed/aAXATNk18v4" title="Borderless Lab project video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></figure>
        <h3>${translations.en["project.responsibilities"]}</h3>
        <ul>
          <li>Developed real-time, browser-controlled laboratory setups for secondary school students.</li>
          <li>Led four undergraduate students across the experiment-development work.</li>
          <li>Designed and built STEM experiment prototypes using SolidWorks and 3D printing.</li>
          <li>Supported Raspberry Pi and Arduino controls, livestream monitoring, and the web control interface.</li>
        </ul>`
    },
    zhHant: {
      title: siteProjects.borderless.title.zhHant,
      content: `
        <p>Borderless Lab 365 是網頁式遙距實驗室，讓中學生可在任何地方操控真實 STEM 實驗。實體裝置設於理工大學應用物理學系，並由大學團隊維護。</p>
        <p>平台透過理工大學伺服器把使用者指令傳送至實驗硬件，再回傳即時影像與感測器數據，讓學生同步觀察實驗過程。</p>
        <a href="https://stem-ap.polyu.edu.hk/remotelab/home.html" class="btn btn-primary">${translations.zhHant["project.bookNow"]}</a>
        <figure><iframe width="560" height="315" loading="lazy" src="https://www.youtube.com/embed/aAXATNk18v4" title="Borderless Lab 項目影片" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></figure>
        <h3>${translations.zhHant["project.responsibilities"]}</h3>
        <ul>
          <li>為中學生開發可透過網頁即時操控的遙距實驗裝置。</li>
          <li>帶領四名本科生參與實驗開發工作。</li>
          <li>使用 SolidWorks 與 3D 打印設計及製作 STEM 實驗原型。</li>
          <li>支援 Raspberry Pi 與 Arduino 控制、直播監察及網頁操作介面。</li>
        </ul>`
    }
  },
  microwave: {
    en: {
      title: siteProjects.microwave.title.en,
      content: `
        <p>This project investigated how concrete, cement, and metal compositions respond to microwave heating, building on research from the Universitat Politècnica de València. Material tests, CAD-designed molds, and prototypes were used to evaluate a low-cost household-microwave setup for construction materials.</p>
        <p>The study compared the heating response of different mixtures and structural forms, and reached the final eight of a local innovation competition.</p>
        <div style="display: flex; gap: 1rem"><figure style="flex: 1; position: relative; padding-top: 25%"><a href="https://fablabvalencia.com/proyectos/"><img src="./assets/images/microwave_cad_1.jpeg" alt="Microwave heating CAD concept" style="position: absolute; top: 0; width: 100%; height: 100%; object-fit: cover"></a></figure><figure style="flex: 1; position: relative; padding-top: 25%"><a href="https://fablabvalencia.com/proyectos/"><img src="./assets/images/microwave_cad_2.jpeg" alt="Microwave heating CAD concept" style="position: absolute; top: 0; width: 100%; height: 100%; object-fit: cover"></a></figure></div>
        <h3>${translations.en["project.responsibilities"]}</h3>
        <ul>
          <li>Designed the experimental molds and system prototypes in SolidWorks and AutoCAD.</li>
          <li>Planned and performed microwave-heating tests on concrete, cement, and metal compositions.</li>
          <li>Coordinated material selection, sourcing, and transport with suppliers.</li>
        </ul>`
    },
    zhHant: {
      title: siteProjects.microwave.title.zhHant,
      content: `
        <p>此項目建基於 Universitat Politècnica de València 的相關研究，分析混凝土、水泥與金屬配方在微波加熱下的反應。研究透過材料測試、CAD 模具及原型，評估以低成本家用微波裝置加熱建築材料的可行性。</p>
        <p>項目比較不同混合比例與結構形式的升溫反應，並入選本地創新比賽最後八強。</p>
        <div style="display: flex; gap: 1rem"><figure style="flex: 1; position: relative; padding-top: 25%"><a href="https://fablabvalencia.com/proyectos/"><img src="./assets/images/microwave_cad_1.jpeg" alt="微波加熱 CAD 概念" style="position: absolute; top: 0; width: 100%; height: 100%; object-fit: cover"></a></figure><figure style="flex: 1; position: relative; padding-top: 25%"><a href="https://fablabvalencia.com/proyectos/"><img src="./assets/images/microwave_cad_2.jpeg" alt="微波加熱 CAD 概念" style="position: absolute; top: 0; width: 100%; height: 100%; object-fit: cover"></a></figure></div>
        <h3>${translations.zhHant["project.responsibilities"]}</h3>
        <ul>
          <li>使用 SolidWorks 與 AutoCAD 設計實驗模具及系統原型。</li>
          <li>規劃並執行混凝土、水泥與金屬配方的微波加熱測試。</li>
          <li>與供應商協調物料選擇、採購及運輸。</li>
        </ul>`
    }
  },
  retractable: {
    en: {
      title: siteProjects.retractable.title.en,
      content: `
        <p>This concept adds a compact retractable tapper and thruster module to cable-driven facade inspection robots. The impact tool extends only at an inspection point and retracts during travel, protecting the mechanism between tests.</p>
        <p>The design focuses on compact mechanical packaging, modular integration, and reliable deployment for high-rise hammer-testing workflows.</p>
        <figure><img src="./assets/images/v2.0.png" alt="Retractable tapper and thruster module for facade inspection robot" width="600" loading="lazy"><figcaption>Retractable tapper and thruster module concept</figcaption></figure>
        <h3>${translations.en["project.responsibilities"]}</h3>
        <ul>
          <li>Designed a modular retractable tapping mechanism for robotic facade hammer testing.</li>
          <li>Developed packaging and interface concepts that protect the tool while fitting a cable-driven inspection robot.</li>
          <li>Evaluated tapper and thruster layouts for stable contact at high-rise inspection points.</li>
        </ul>`
    },
    zhHant: {
      title: siteProjects.retractable.title.zhHant,
      content: `
        <p>此概念為纜索驅動外牆檢測機械人加入緊湊的可伸縮敲擊與推進模組。撞擊工具只在到達檢測位置時伸出，移動期間則收回，以保護機構。</p>
        <p>設計重點包括緊湊機械封裝、模組化整合，以及高樓敲擊測試流程中的可靠部署。</p>
        <figure><img src="./assets/images/v2.0.png" alt="外牆檢測機械人的可伸縮敲擊器與推進器模組" width="600" loading="lazy"><figcaption>可伸縮敲擊器與推進器模組概念</figcaption></figure>
        <h3>${translations.zhHant["project.responsibilities"]}</h3>
        <ul>
          <li>為機械人外牆敲擊測試設計模組化可伸縮機構。</li>
          <li>開發兼顧工具保護及纜索檢測機械人整合的封裝與介面概念。</li>
          <li>評估敲擊器與推進器佈局，確保在高樓檢測位置穩定接觸牆面。</li>
        </ul>`
    }
  },
  footController: {
    en: {
      title: siteProjects.footController.title.en,
      content: `
        <p>Developed for SuperLimb, this compact wearable foot controller supports hands-free, multi-axis robot input through motorized pedals, wireless telemetry, and ergonomic foot movement.</p>
        <p>The prototype combines mechanical design, embedded electronics, haptic feedback, and wireless communication in a wearable human-robot control interface.</p>
        <figure><img src="./assets/images/footcontroler.jpg" alt="Wireless motorized foot controller for SuperLimb robot control" width="600" loading="lazy"><figcaption>Wireless motorized foot controller prototype</figcaption></figure>
        <h3>${translations.en["project.responsibilities"]}</h3>
        <ul>
          <li>Designed the mechanical layout and wearable form of the motorized foot interface.</li>
          <li>Integrated embedded electronics, wireless communication, and haptic feedback for robot control.</li>
          <li>Developed the control approach around precise, ergonomic multi-axis input for SuperLimb.</li>
        </ul>`
    },
    zhHant: {
      title: siteProjects.footController.title.zhHant,
      content: `
        <p>這款為 SuperLimb 開發的緊湊穿戴式腳踏控制器，透過電動踏板、無線遙測與符合人體工學的腳部動作，支援免手持多軸機械人輸入。</p>
        <p>原型把機械設計、嵌入式電子、觸覺回饋與無線通訊整合成穿戴式人機控制介面。</p>
        <figure><img src="./assets/images/footcontroler.jpg" alt="SuperLimb 無線電動腳踏控制器" width="600" loading="lazy"><figcaption>無線電動腳踏控制器原型</figcaption></figure>
        <h3>${translations.zhHant["project.responsibilities"]}</h3>
        <ul>
          <li>設計電動腳踏控制介面的機械佈局與穿戴形式。</li>
          <li>整合嵌入式電子、無線通訊及觸覺回饋，用於機械人控制。</li>
          <li>針對 SuperLimb 開發精準、符合人體工學的多軸輸入方式。</li>
        </ul>`
    }
  }
};

Object.entries(siteProjects).forEach(([key, project]) => {
  project.copy = projectPageTranslations[key];
});

function validateSiteData() {
  if (!siteProfile.name || !siteProfile.role?.en || !siteProfile.role?.zhHant) {
    throw new Error("siteProfile requires a name and both localized role values.");
  }
  if (!siteProfile.location?.en || !siteProfile.location?.zhHant) {
    throw new Error("siteProfile requires both localized location values.");
  }

  const parsedSiteUrl = new URL(siteProfile.siteUrl);
  if (parsedSiteUrl.protocol !== "https:") {
    throw new Error("siteProfile.siteUrl must use HTTPS.");
  }

  const requiredProfileSeoFields = [
    "title", "schemaName", "description", "schemaDescription", "keywords",
    "ogDescription", "twitterDescription", "image"
  ];
  const missingProfileSeo = requiredProfileSeoFields.filter((field) => !siteProfile.seo?.[field]);
  if (missingProfileSeo.length || !siteProfile.seo?.knowsAbout?.length) {
    throw new Error(`siteProfile.seo is incomplete: ${missingProfileSeo.join(", ")}`);
  }

  const contactIds = siteProfile.contacts.map(({ id }) => id);
  if (new Set(contactIds).size !== contactIds.length) {
    throw new Error("siteProfile.contacts contains duplicate IDs.");
  }
  siteProfile.contacts.forEach((contact) => {
    if (!contact.id || (!contact.label && !contact.labelKey)) {
      throw new Error("Every profile contact requires an ID and label or labelKey.");
    }
    if (contact.labelKey && (!translations.en[contact.labelKey] || !translations.zhHant[contact.labelKey])) {
      throw new Error(`Missing contact label translation for ${contact.labelKey}.`);
    }
    if (contact.id !== "location" && (!contact.value || !contact.href)) {
      throw new Error(`Profile contact ${contact.id} requires a value and href.`);
    }
  });

  const projectFiles = Object.values(siteProjects).map(({ file }) => file);
  if (new Set(projectFiles).size !== projectFiles.length) {
    throw new Error("siteProjects contains duplicate project files.");
  }

  const requiredProjectSeoFields = [
    "description", "ogDescription", "twitterDescription", "image",
    "structuredDescription", "keywords", "lastmod"
  ];

  Object.entries(siteProjects).forEach(([key, project]) => {
    if (!/^[a-z0-9-]+\.html$/.test(project.file)) {
      throw new Error(`siteProjects.${key}.file must be a safe root HTML filename.`);
    }
    for (const localizedField of ["title", "cardTitle"]) {
      if (!project[localizedField]?.en || !project[localizedField]?.zhHant) {
        throw new Error(`siteProjects.${key}.${localizedField} requires both languages.`);
      }
    }
    if (project.previewTitle && (!project.previewTitle.en || !project.previewTitle.zhHant)) {
      throw new Error(`siteProjects.${key}.previewTitle requires both languages.`);
    }

    const missingSeo = requiredProjectSeoFields.filter((field) => !project.seo?.[field]);
    if (missingSeo.length) {
      throw new Error(`siteProjects.${key}.seo is missing ${missingSeo.join(", ")}.`);
    }
    if (!/^\/assets\/images\//.test(project.seo.image)) {
      throw new Error(`siteProjects.${key}.seo.image must be an /assets/images path.`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(project.seo.lastmod)) {
      throw new Error(`siteProjects.${key}.seo.lastmod must use YYYY-MM-DD.`);
    }

    for (const language of ["en", "zhHant"]) {
      if (!project.copy?.[language]?.content || project.copy[language].title !== project.title[language]) {
        throw new Error(`Project copy mismatch for ${key}.${language}.`);
      }
      if (translations[language][`project.${key}.title`] !== project.cardTitle[language]) {
        throw new Error(`Project card translation mismatch for ${key}.${language}.`);
      }
      if (project.previewTitle
        && translations[language][`projectPreview.${key}`] !== project.previewTitle[language]) {
        throw new Error(`Project preview translation mismatch for ${key}.${language}.`);
      }
    }
  });

  return true;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    siteProfile,
    siteProjects,
    translations,
    projectPageFiles,
    projectPageAliases,
    projectPageTranslations,
    validateSiteData
  };
}
