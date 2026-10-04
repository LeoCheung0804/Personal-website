'use strict';

const siteProfile = {
  name: "Leo Cheung",
  fullName: "Cheung Man Loc",
  publishedName: "Man Loc Cheung",
  givenName: "Man Loc",
  familyName: "Cheung",
  siteUrl: "https://leocml.com",
  role: {
    en: "Robotics Engineer",
    zhHant: "機械人工程師"
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
    title: "Cheung Man Loc (Leo Cheung) | Robotics Engineer",
    schemaName: "Cheung Man Loc Robotics Portfolio",
    description: "Robotics portfolio of Cheung Man Loc, known as Leo Cheung, featuring CU-Brick, RoBosun-Tapper, robot control, and mechanical design projects in Hong Kong.",
    schemaDescription: "Cheung Man Loc, professionally known as Leo Cheung, shares robotics projects spanning CU-Brick, RoBosun-Tapper, facade inspection, wall spraying, humanoid control, embedded systems, and mechanical design.",
    keywords: "Cheung Man Loc, Leo Cheung, CU-Brick, RoBosun-Tapper, robotics engineer, robotics engineer Hong Kong, construction automation, cable-driven robots, facade inspection robot, ROS, mechatronics",
    ogDescription: "Robotics projects, publications, and awards by Cheung Man Loc, professionally known as Leo Cheung.",
    twitterDescription: "Robotics projects, publications, and awards by Cheung Man Loc (Leo Cheung).",
    image: "/assets/images/profile.jpg",
    imageAlt: "Cheung Man Loc, professionally known as Leo Cheung, robotics engineer",
    lastmod: "2026-10-01",
    schemaDateModified: "2026-10-01T00:00:00+08:00",
    knowsAbout: [
      "CU-Brick cable-driven bricklaying robot",
      "RoBosun-Tapper robotic facade inspection",
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

const standalonePages = {
  dashboard: {
    file: "dashboard.html",
    seo: {
      title: "Hong Kong Weather and KMB Arrival Dashboard | Cheung Man Loc",
      description: "Live Hong Kong dashboard showing Observatory weather data and KMB bus arrivals at Sheung Tak Bus Terminus.",
      ogDescription: "Live Hong Kong weather, warnings, forecasts, and KMB arrival information in one responsive dashboard.",
      twitterDescription: "Live Hong Kong weather and KMB arrival information for Sheung Tak Bus Terminus.",
      image: "/assets/images/profile.jpg",
      imageAlt: "Hong Kong weather and KMB arrival dashboard by Cheung Man Loc, known as Leo Cheung",
      schemaName: "Hong Kong Weather and KMB Arrival Dashboard",
      schemaDescription: "A responsive web dashboard combining Hong Kong Observatory weather data with KMB arrival information for Sheung Tak Bus Terminus.",
      lastmod: "2026-10-01"
    }
  }
};

const siteProjects = {
  tapper: {
    file: "tapper.html",
    title: {
      en: "RoBosun-Tapper: Robotic Facade Inspection",
      zhHant: "RoBosun-Tapper 外牆檢測機械人"
    },
    cardTitle: {
      en: "RoBosun-Tapper: Robotic Facade Inspection",
      zhHant: "RoBosun-Tapper 外牆檢測機械人"
    },
    previewTitle: {
      en: "Cable-driven facade hammer-testing robot",
      zhHant: "纜索驅動外牆敲擊檢測機械人"
    },
    seo: {
      description: "RoBosun-Tapper is a cable-driven robot for high-rise facade hammer testing, combining robotic positioning, automated tapping, and impact-signal analysis.",
      ogDescription: "RoBosun-Tapper combines cable-driven positioning, automated tapping, and impact-signal analysis for high-rise facade inspection.",
      twitterDescription: "RoBosun-Tapper: cable-driven robotic hammer testing for high-rise facade inspection.",
      image: "/assets/images/Robotapper_cropped.jpeg",
      structuredDescription: "Cable-driven robot for high-rise facade hammer testing, robotic positioning, and impact-signal analysis.",
      keywords: "RoBosun-Tapper, facade inspection robot, cable-driven robot, hammer testing robot, impact-signal analysis, construction robotics, Hong Kong robotics",
      lastmod: "2026-10-01"
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
      en: "Cable-driven bricklaying robot",
      zhHant: "纜索驅動砌磚機械人"
    },
    seo: {
      description: "CU-Brick is a cable-driven parallel robot that built a 40-layer YES Pavilion structure from more than 5,800 bricks across a 13 m by 9 m site.",
      ogDescription: "CU-Brick combines fiducial localization, 3D scanning, and elevation control for automated bricklaying at architectural scale.",
      twitterDescription: "A cable-driven robot that built a 40-layer pavilion structure from more than 5,800 bricks.",
      image: "/assets/images/YES_full.jpg",
      structuredDescription: "Architectural-scale cable-driven parallel robot for automated bricklaying, fiducial localization, 3D scanning, and construction automation.",
      keywords: "CU-Brick, bricklaying robot, cable-driven parallel robot, CDPR, construction automation, fiducial markers, 3D scanning, YES Pavilion, Hong Kong robotics",
      lastmod: "2026-10-05"
    },
    awards: [
      {
        name: "Second Runner-up, Open Section, Young Professionals Exhibition & Competition 2025",
        url: "/blog/2nd-runner-up.html"
      },
      {
        name: "Merit Award, Open Category, OSH Innovation and Technology Award 2026",
        url: "/blog/osh-2026.html"
      }
    ],
    citations: [
      "https://doi.org/10.1007/978-3-031-94608-0_28"
    ]
  },
  spray: {
    file: "spray.html",
    title: {
      en: "Autonomous Wall Spraying Robot",
      zhHant: "自主牆面噴塗機械人"
    },
    cardTitle: {
      en: "Autonomous Wall Spraying Robot",
      zhHant: "自主牆面噴塗機械人"
    },
    previewTitle: {
      en: "Mobile wall-spraying robot",
      zhHant: "移動式牆面噴塗機械人"
    },
    seo: {
      description: "An autonomous wall spraying prototype integrating AGV motion, IMU sensing, a linear rail, cameras, and ROS-based control for automated paint application.",
      ogDescription: "A ROS-based wall spraying platform coordinating AGV motion, sensing, linear positioning, and paint application.",
      twitterDescription: "Autonomous wall spraying with AGV motion, sensor feedback, linear positioning, and ROS control.",
      image: "/assets/images/Spray_robot.JPG",
      structuredDescription: "Autonomous wall painting prototype with AGV motion, IMU sensing, cameras, linear rail positioning, and ROS control.",
      keywords: "autonomous wall spraying robot, wall painting robot, ROS robot, AGV, IMU, machine vision, linear rail, construction robotics, industrial painting automation",
      lastmod: "2026-10-01"
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
      en: "Infrared touchless lift controls",
      zhHant: "紅外線免觸式升降機控制"
    },
    seo: {
      description: "kNOw Touch is an infrared touchless lift interface deployed in more than 1,200 Hong Kong units within one year.",
      ogDescription: "An infrared gesture interface designed for existing lift panels and delivered through a large-scale Hong Kong deployment.",
      twitterDescription: "Infrared touchless lift interface deployed in more than 1,200 Hong Kong units within one year.",
      image: "/assets/images/knowtouch_1.jpg",
      structuredDescription: "Infrared gesture interface for touchless lift controls, retrofit installation, and large-scale Hong Kong deployment.",
      keywords: "kNOw Touch, touchless lift button, elevator sensor, infrared gesture sensor, lift call bar, contactless interface, Hong Kong elevators, embedded hardware",
      lastmod: "2026-10-01"
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
      en: "Exoskeleton-controlled humanoid robot",
      zhHant: "外骨骼操控人形機械人"
    },
    seo: {
      description: "ME4 pairs a wearable exoskeleton controller with a humanoid robot, combining haptic feedback, wireless communication, and 48 V BLDC motor control.",
      ogDescription: "A wearable control system for natural humanoid-robot motion with haptic feedback and wireless BLDC control.",
      twitterDescription: "Wearable exoskeleton control for a humanoid robot with haptic feedback and wireless BLDC control.",
      image: "/assets/images/Exoskeleton_robot.jpg",
      structuredDescription: "Humanoid robot and wearable exoskeleton controller with haptic feedback, 48 V BLDC control, and wireless communication.",
      keywords: "exoskeleton control, humanoid robot, haptic feedback, BLDC motor control, wireless robot control, LiDAR, mechatronics, robotics engineering",
      lastmod: "2026-10-01"
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
    detailEyebrow: {
      en: "Remote STEM experiments",
      zhHant: "STEM 遙距實驗"
    },
    seo: {
      description: "Borderless Lab 365 is a browser-based PolyU platform that lets secondary students control real STEM experiments and monitor live sensor data remotely.",
      ogDescription: "A remote STEM laboratory combining browser controls, livestream monitoring, Raspberry Pi, Arduino, and real-time sensor data.",
      twitterDescription: "Browser-based STEM experiments with live video, remote controls, and real-time sensor data.",
      image: "/assets/images/Borderless_lab.jpg",
      structuredDescription: "Browser-based remote STEM laboratory using Raspberry Pi, Arduino, livestream monitoring, and real-time sensor data.",
      keywords: "Borderless Lab 365, remote STEM laboratory, web-based lab platform, Raspberry Pi, Arduino, livestream experiments, real-time sensor data, STEM education",
      lastmod: "2026-10-01"
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
    detailEyebrow: {
      en: "Material heating experiments",
      zhHant: "材料加熱實驗"
    },
    seo: {
      description: "An experimental study of how concrete, cement, and metal compositions respond to microwave heating, supported by CAD-designed moulds and prototypes.",
      ogDescription: "Construction-material microwave heating experiments using CAD-built prototypes, material testing, and a low-cost laboratory setup.",
      twitterDescription: "CAD-led prototype and material tests exploring microwave heating for concrete and cement compositions.",
      image: "/assets/images/Microwave.jpeg",
      structuredDescription: "Experimental microwave heating research for concrete, cement, and metal compositions using CAD-designed moulds and prototypes.",
      keywords: "microwave heating system, concrete heating, cement materials, sustainable construction, CAD prototype, SolidWorks, AutoCAD, material testing",
      lastmod: "2026-10-01"
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
    detailEyebrow: {
      en: "Protected inspection hardware",
      zhHant: "受保護的檢測硬件"
    },
    seo: {
      description: "A compact retractable tapper and thruster module designed to protect impact-testing hardware while a facade inspection robot is moving.",
      ogDescription: "A modular impact-testing tool that deploys at an inspection point and retracts during robot travel.",
      twitterDescription: "Compact retractable impact-testing hardware for cable-driven facade inspection robots.",
      image: "/assets/images/v2.0.png",
      structuredDescription: "Modular retractable tapper and thruster concept for robotic facade hammer testing and protected tool transport.",
      keywords: "retractable tapper, facade inspection robot, robotic hammer testing, thruster module, modular robot tool, construction inspection, robotics hardware design",
      lastmod: "2026-10-01"
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
    detailEyebrow: {
      en: "Hands-free robot control",
      zhHant: "免手持機械人控制"
    },
    seo: {
      description: "A wearable motorized foot controller for SuperLimb, combining multi-axis input, wireless communication, embedded electronics, and haptic feedback.",
      ogDescription: "A hands-free SuperLimb control prototype built around motorized pedals, wireless telemetry, and ergonomic multi-axis input.",
      twitterDescription: "Wearable motorized foot control for SuperLimb with wireless multi-axis input and haptic feedback.",
      image: "/assets/images/footcontroler.jpg",
      structuredDescription: "Wearable wireless foot controller for SuperLimb with motorized pedals, haptic feedback, embedded electronics, and multi-axis input.",
      keywords: "wireless foot controller, SuperLimb, motorized pedal, wearable robot controller, haptic feedback, embedded electronics, multi-axis control, robotics hardware",
      lastmod: "2026-10-01"
    }
  }
};

const translations = {
  en: {
    "explorer.frame": "Reference / Chassis & battery case",
    "explorer.frameText": "The main chassis and battery case stay in place as the reference for the assembly view.",
    "explorer.manualStatus": "Manual view. Use the slider or pose buttons; drag horizontally to adjust yaw ψ.",
    "explorer.eyebrow": "RoBosun-Tapper / SUBSYSTEMS",
    "explorer.title": "Explore the robot assembly",
    "explorer.note": "Use the slider to extend the arm. Drag or swipe horizontally to rotate the view.",
    "explorer.rotateHint": "Drag or swipe to rotate",
    "explorer.canvas": "RoBosun-Tapper CAD assembly. Drag horizontally to adjust yaw ψ; left/right arrow keys rotate, Home resets. Scroll or use the controls to separate subsystems.",
    "explorer.progress": "Assembly separation",
    "explorer.assembled": "Assembled",
    "explorer.exploded": "Exploded",
    "explorer.follow": "Follow scroll",
    "explorer.reset": "Reset angle",
    "explorer.assembledStatus": "Scroll down to separate the assembly, or use the slider. Drag horizontally to adjust yaw ψ around the vertical axis.",
    "explorer.movingStatus": "Thrusters open slightly; the retractable linkage and tapping head move together. Scroll up to close.",
    "explorer.explodedStatus": "Compact assembly reveal. The drives stay mounted; the linkage and tapping head move together. Drag to inspect or scroll up to close.",
    "explorer.fallback": "Loading the local 3D assembly when it comes into view. Robot photos and subsystem descriptions are also available below.",
    "explorer.unavailable": "3D is unavailable in this browser. You can still explore the subsystem descriptions and real project photos below.",
    "explorer.thrusters": "01 / Guarded propellers",
    "explorer.drives": "02 / Drive motors & bearings",
    "explorer.arm": "03 / Scissor linkage",
    "explorer.tool": "04 / Tapper & casters",
    "explorer.thrustersText": "The two propeller units move slightly outward from the chassis. Their motors and blades come from the CAD; the circular guards were reconstructed from the reference image.",
    "explorer.drivesText": "The paired motor and bearing assemblies stay mounted to the chassis during the reveal.",
    "explorer.armText": "The scissor links extend the arm straight out from the chassis. Their motion follows the CAD link spacing; the displayed stroke is illustrative.",
    "explorer.toolText": "The CAD tapper assembly, including its caster wheels, travels with the end of the extending linkage.",
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
    "about.title": "Robotics in practice",
    "about.viewTapper": "View RoBosun-Tapper",
    "about.viewProjects": "View projects",
    "about.contact": "Get in touch",
    "about.paragraph1": "I'm Leo Cheung, a robotics engineer based in Hong Kong. I work on construction robots, humanoid systems, and human-robot control interfaces.",
    "about.paragraph2": "My work spans mechanical design, electronics, ROS software, and field testing. Projects include CU-Brick, RoBosun-Tapper, ME4, and the SuperLimb foot controller.",
    "service.title": "What I do",
    "service.software.title": "Software development",
    "service.software.text": "Develop ROS-based software for robot control, navigation, signal processing, motor control, operator interfaces, and wireless communication.",
    "service.hardware.title": "Hardware design",
    "service.hardware.text": "Design robot mechanisms and electrical systems, and build prototypes using CAD, 3D printing, CNC machining, sensors, and embedded electronics.",
    "service.management.title": "Project management",
    "service.management.text": "Coordinate project requirements, suppliers, system integration, field testing, schedules, and safety documentation.",
    "service.research.title": "Research & publications",
    "service.research.text": "Document experimental results and share engineering findings through technical reports, peer-reviewed publications, and conference presentations.",
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
    "resume.mechanicalEngineer.projects": "RoBosun-Tapper: Robotic Facade Inspection<br>Autonomous Wall Spraying Robot<br>CU-Brick: Cable-Driven Bricklaying Robot<br>Retractable Tapper & Thruster Module",
    "resume.projectEngineer": "Project Engineer",
    "resume.projectEngineer.projects": "kNOw Touch: Touchless Lift Interface<br>ME4: Exoskeleton-Controlled Humanoid Robot",
    "resume.graduateExecutive": "Graduate Executive",
    "resume.graduateExecutive.project": "Borderless Lab 365: Remote STEM Laboratory",
    "resume.summerInternship": "Summer Internship",
    "resume.summerInternship.project": "Microwave Heating for Construction Materials",
    "projects.title": "Selected Projects",
    "projects.moreTools": "More engineering tools",
    "projects.dashboard": "Hong Kong Weather and KMB Arrival Dashboard",
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
    "publications.empty": "No publications in this category yet.",
    "publications.cuBrick.title": "Development of CU-Brick Brick Laying Cable-Driven Robot for a Real-World Construction Project",
    "publications.cuBrick.authors": "Co-authored and presented by Cheung Man Loc (published as Man Loc Cheung).",
    "publications.cuBrick.info": "Presented at CableCon 2025, the 7th International Conference on Cable-Driven Parallel Robots, July 2025",
    "publications.cuBrick.abstract": "This paper presents CU-Brick, a cable-driven parallel robot developed for automated bricklaying and demonstrated through construction of the Yard for Environmental Sustainability (YES) Pavilion. Across a 13 m x 9 m work area, the system built a 2.5 m-high structure with 40 layers and more than 5,800 bricks.",
    "blog.title": "Awards & Project Updates",
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
    "explorer.frame": "參考 / 機身框架與電池盒",
    "explorer.frameText": "主機身框架與電池盒保留原位，作為組件展示的參考。",
    "explorer.manualStatus": "手動模式。使用滑桿或狀態按鈕；水平拖曳以調整偏航角 ψ。",
    "explorer.eyebrow": "RoBosun-Tapper / 子系統",
    "explorer.title": "探索機械人組件",
    "explorer.note": "使用滑桿伸展機械臂；用滑鼠或手指水平拖曳以旋轉視角。",
    "explorer.rotateHint": "拖曳或滑動以旋轉",
    "explorer.canvas": "RoBosun-Tapper CAD 組件。水平拖曳以調整偏航角 ψ；左右方向鍵旋轉，Home 重設。捲動或使用控制分離子系統。",
    "explorer.progress": "組件分離程度",
    "explorer.assembled": "組裝狀態",
    "explorer.exploded": "分解狀態",
    "explorer.follow": "跟隨捲動",
    "explorer.reset": "重設角度",
    "explorer.assembledStatus": "向下捲動或使用滑桿分離組件。水平拖曳以繞垂直軸調整偏航角 ψ。",
    "explorer.movingStatus": "推進器稍微分開，伸縮連桿與敲擊頭一同移動。向上捲動以收合。",
    "explorer.explodedStatus": "組件緊湊展開。驅動組件保留原位，連桿與敲擊頭一同移動。拖曳查看或向上捲動以收合。",
    "explorer.fallback": "組件進入畫面時載入三維模型。下方亦提供機械人照片及子系統說明。",
    "explorer.unavailable": "此瀏覽器無法顯示三維模型。你仍可閱讀下方子系統說明及查看真實項目照片。",
    "explorer.thrusters": "01 / 帶護罩螺旋槳",
    "explorer.drives": "02 / 驅動馬達與軸承",
    "explorer.arm": "03 / 剪式伸縮連桿",
    "explorer.tool": "04 / 敲擊器與腳輪",
    "explorer.thrustersText": "兩組螺旋槳模組稍微向機身兩側移動。馬達與槳葉來自 CAD；環形護罩依參考圖片重建。",
    "explorer.drivesText": "兩組馬達與軸承組件在展示過程中保持安裝於機身框架上。",
    "explorer.armText": "剪式連桿使機械臂從機身直線伸出。動作依 CAD 連桿間距重建，顯示行程僅供示意。",
    "explorer.toolText": "CAD 敲擊器組件連同腳輪，隨伸出的連桿末端一同移動。",
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
    "about.title": "機械人的設計與實踐",
    "about.viewTapper": "查看 RoBosun-Tapper",
    "about.viewProjects": "瀏覽項目",
    "about.contact": "聯絡我",
    "about.paragraph1": "我是 Leo Cheung，一名駐香港的機械人工程師，工作涵蓋建築機械人、人形機械人及人機操控介面。",
    "about.paragraph2": "我的工作涵蓋機械設計、電子系統、ROS 軟件及現場測試。項目包括 CU-Brick、RoBosun-Tapper、ME4 及 SuperLimb 腳踏控制器。",
    "service.title": "我的工作",
    "service.software.title": "軟件開發",
    "service.software.text": "開發 ROS 控制、自主導航、訊號處理、操作介面、馬達控制及無線通訊軟件，讓軟硬件可靠整合。",
    "service.hardware.title": "硬件設計",
    "service.hardware.text": "設計機械人機構及電氣系統，並運用 CAD、3D 打印、CNC 加工、感測器及嵌入式電子製作原型。",
    "service.management.title": "項目管理",
    "service.management.text": "協調項目需求、供應商、系統整合、現場測試、進度及安全文件。",
    "service.research.title": "研究與論文",
    "service.research.text": "記錄實驗結果，並透過技術報告、同行評審論文及會議簡報分享工程研究成果。",
    "projectPreview.title": "精選項目",
    "projectPreview.pause": "暫停精選作品自動捲動",
    "projectPreview.resume": "繼續精選作品自動捲動",
    "projectPreview.tapper": siteProjects.tapper.previewTitle.zhHant,
    "projectPreview.cuBrick": siteProjects.cuBrick.previewTitle.zhHant,
    "projectPreview.spray": siteProjects.spray.previewTitle.zhHant,
    "projectPreview.knowTouch": siteProjects.knowTouch.previewTitle.zhHant,
    "projectPreview.exoskeleton": siteProjects.exoskeleton.previewTitle.zhHant,
    "resume.title": "履歷",
    "resume.education": "學歷",
    "resume.msc.title": "機械與自動化工程理學碩士",
    "resume.msc.project": "碩士項目：SuperLimb 無線電動腳踏控制器",
    "resume.bsc.title": "工程物理學榮譽理學士",
    "resume.bsc.project": "畢業項目：羅勒生長人工照明",
    "resume.experience": "工作經驗",
    "resume.mechanicalEngineer": "機械工程師",
    "resume.mechanicalEngineer.projects": "RoBosun-Tapper 外牆檢測機械人<br>自主牆面噴塗機械人<br>CU-Brick 纜索驅動砌磚機械人<br>可伸縮敲擊與推進模組",
    "resume.projectEngineer": "項目工程師",
    "resume.projectEngineer.projects": "kNOw Touch 免觸式升降機介面<br>ME4 外骨骼操控人形機械人",
    "resume.graduateExecutive": "畢業行政人員",
    "resume.graduateExecutive.project": "Borderless Lab 365 STEM 遙距實驗室",
    "resume.summerInternship": "暑期實習",
    "resume.summerInternship.project": "建築材料微波加熱研究",
    "projects.title": "精選項目",
    "projects.moreTools": "更多工程工具",
    "projects.dashboard": "香港天氣及九巴到站儀表板",
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
    "publications.empty": "此分類暫時未有論文。",
    "publications.cuBrick.title": "Development of CU-Brick Brick Laying Cable-Driven Robot for a Real-World Construction Project",
    "publications.cuBrick.authors": "由 Cheung Man Loc 共同撰寫及發表（論文署名為 Man Loc Cheung）。",
    "publications.cuBrick.info": "於 2025 年 7 月在第 7 屆纜索驅動並聯機械人國際會議 CableCon 2025 發表",
    "publications.cuBrick.abstract": "本文介紹 CU-Brick，一套為自動砌磚而開發的纜索驅動並聯機械人，並透過建造 Yard for Environmental Sustainability (YES) Pavilion 作實際驗證。系統在 13 m × 9 m 的工作範圍內，建成高 2.5 m、共 40 層、使用超過 5,800 塊磚的結構。",
    "blog.title": "獎項與項目動態",
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
  "project.details": "Project Details",
  "project.responsibilities": "Selected Contributions",
  "project.bookNow": "Open Remote Lab",
  "gallery.position": "Item {current} of {total}",
  "projectPreview.previous": "Previous projects",
  "projectPreview.next": "Next projects"
});

Object.assign(translations.zhHant, {
  "projects.back": "返回項目",
  "project.overview": "項目概覽",
  "project.details": "項目詳情",
  "project.responsibilities": "主要貢獻",
  "project.bookNow": "開啟遙距實驗室",
  "gallery.position": "第 {current} 項，共 {total} 項",
  "projectPreview.previous": "上一組項目",
  "projectPreview.next": "下一組項目"
});

// Shared English / Traditional Chinese copy for the CU-Brick assembly explorer.
const brickExplorerCopy = {
  title: ['Inside CU-Brick', '探索 CU-Brick 的構造'],
  intro: ['Explore the cable-driven robot, then look inside its brick-handling end effector.', '探索纜索驅動機械人，再近距離了解夾磚末端執行器的構造。'],
  site: ['Whole robot', '整體機械人'],
  detail: ['End effector', '末端執行器'],
  views: ['Assembly view', '組件視圖'],
  siteMeta: ['4 support poles / 8 cables', '4 支支柱 / 8 條纜索'],
  detailMeta: ['380 × 380 × 220 mm frame', '380 × 380 × 220 毫米框架'],
  components: ['Components', '組件'],
  choose: ['Select a component', '選擇組件'],
  chooseText: ['Select a part in the model or the list to reveal its name and function.', '點選模型或清單中的組件，查看名稱及用途。'],
  functions: ['Five functional modules', '五個功能模組'],
  functionsText: ['Separate the end effector by function. Each module stays together, so you can see how it supports, powers, rotates, grips or sees the brick.', '按功能分解末端執行器。每個模組保持完整，方便了解支撐、供電、旋轉、夾放及視覺定位的分工。'],
  separation: ['Separate by function', '按功能分離'],
  assembled: ['Assembled', '組裝狀態'],
  exploded: ['By function', '功能分解'],
  rotation: ['Brick rotation', '磚塊旋轉'],
  grip: ['Grip & release', '夾持及釋放'],
  gripAction: ['Grip', '夾持'],
  releaseAction: ['Release', '釋放'],
  gripped: ['Gripped', '已夾持'],
  opening: ['Opening', '正在張開'],
  releasing: ['Releasing', '正在釋放'],
  released: ['Released', '已釋放'],
  motionNote: ['Turn the held brick, then slide to release. Reverse to grip again.', '轉動夾持中的磚塊，再滑動以釋放。反向滑動可重新夾持。'],
  cycleTitle: ['Bricklaying cycle', '砌磚工作循環'],
  cyclePlay: ['Play cycle', '播放循環'],
  cyclePause: ['Pause', '暫停'],
  cycleReplay: ['Replay', '重新播放'],
  cycleNext: ['Next stage', '下一步'],
  cycleReset: ['Reset cycle', '重設循環'],
  cycleFocus: ['Focus action', '聚焦動作'],
  cycleNote: ['Play the cycle or drag the timeline to follow one brick from conveyor to wall.', '播放循環或拖曳時間軸，跟隨一塊磚由輸送帶移動至磚牆。'],
  cycleStepFeed: ['Feed', '供磚'],
  cycleStepHandoff: ['Handoff', '交接'],
  cycleStepCollect: ['Collect', '取磚'],
  cycleStepPlace: ['Place', '放磚'],
  'cycle.feed': ['Pick from conveyor', '從輸送帶夾取磚塊'],
  'cycle.transfer': ['Transfer to pick-up pole', '送至取磚支柱'],
  'cycle.present': ['Raise the brick for collection', '升起磚塊準備交接'],
  'cycle.collect': ['End effector collects the brick', '末端執行器夾取磚塊'],
  'cycle.transport': ['Carry to the brick structure', '運送至磚構'],
  'cycle.place': ['Lower and release onto the wall', '降下並釋放磚塊至牆面'],
  'cycle.return': ['Return ready for the next brick', '返回準備下一塊磚'],
  'cycle.complete': ['Brick placed · cycle complete', '磚塊已放置 · 循環完成'],
  elevation: ['Lower cable attachment height', '下方纜索連接點高度'],
  elevationNote: ['Raise the four lower pulleys to clear the growing brickwork.', '升起四個下方滑輪，避開逐漸增高的磚牆。'],
  low: ['Low', '低'],
  raised: ['Raised', '高'],
  labels: ['Annotation', '標註'],
  reset: ['Reset view', '重設視角'],
  zoomIn: ['Zoom in', '放大'],
  zoom: ['Zoom', '縮放'],
  zoomOut: ['Zoom out', '縮小'],
  openDetail: ['Inspect end effector →', '查看末端執行器 →'],
  interaction: ['Drag to orbit · Use + / − to zoom', '拖曳旋轉 · 使用 + / − 縮放'],
  canvas: ['Interactive CU-Brick assembly. Drag or use arrow keys to rotate, plus and minus to zoom, Home to reset. Select a component in the model or the adjacent list.', 'CU-Brick 互動組件模型。拖曳或使用方向鍵旋轉，按加減鍵縮放，Home 重設視角。點選模型或旁邊清單中的組件。'],
  note: ['Simplified site layout; arm reach and end effector enlarged for clarity. The cycle illustrates brick transfer and placement with moving cables. End-effector controls show rotation, gripping and release; separation groups hardware by function.', '場地配置經過簡化；機械臂活動範圍及末端執行器已放大以便觀看。循環展示磚塊交接及放置，纜索隨動。末端執行器控制展示旋轉、夾持及釋放；分離視圖按功能整合零件。'],
  loading: ['Loading the interactive assembly…', '正在載入互動組件模型…'],
  fallback: ['The 3D view is unavailable. CU-Brick uses eight motorized cables on four poles to position a wireless gripper. Four lower pulleys rise as the wall grows; a separate pick-up pole presents bricks to the robot. The project photos above show the assembled system.', '目前無法顯示三維模型。CU-Brick 透過四支支柱上的八條電動纜索定位無線夾爪。四個下方滑輪隨磚牆增高而上升，另一支取磚支柱把磚塊送至機械人。上方項目照片展示實際系統。'],
  'part.pole0': ['Pole 0 · motors 0, 4', '支柱 0 · 馬達 0、4'],
  'part.pole1': ['Pole 1 · motors 1, 5', '支柱 1 · 馬達 1、5'],
  'part.pole2': ['Pole 2 · motors 2, 6', '支柱 2 · 馬達 2、6'],
  'part.pole3': ['Pole 3 · motors 3, 7', '支柱 3 · 馬達 3、7'],
  'part.pole0Text': ['One of four steel support poles around the work area. Carries winches 0 and 4, an upper pulley, and a height-adjustable lower pulley.', '工作範圍四周的四支鋼製支柱之一，設有捲揚機 0 及 4、上方滑輪及可調高度的下方滑輪。'],
  'part.pole1Text': ['Carries winches 1 and 5. Its two cables connect to the upper and lower levels of the suspended frame.', '設有捲揚機 1 及 5，兩條纜索分別連接懸吊框架的上下兩層。'],
  'part.pole2Text': ['Carries winches 2 and 6. Together, the four poles surround the robot’s working area.', '設有捲揚機 2 及 6，與其餘三支支柱一起包圍機械人的工作範圍。'],
  'part.pole3Text': ['Carries winches 3 and 7. The braced steel support transfers cable loads to its base.', '設有捲揚機 3 及 7，帶斜撐的鋼製支柱把纜索負載傳遞至底座。'],
  'part.winches': ['Motorized winches × 8', '電動捲揚機 × 8'],
  'part.winchesText': ['Two motor-and-drum assemblies per pole pay out and retract the cables to position the end effector.', '每支支柱的兩組馬達及捲筒收放纜索，以定位末端執行器。'],
  'part.pulleys': ['Adjustable lower pulleys × 4', '可升降下方滑輪 × 4'],
  'part.pulleysText': ['The secondary elevation system raises the four lower cable attachment points to avoid the growing structure. Try the attachment-height slider.', '輔助升降系統提高四個下方纜索連接點，以避開逐漸增高的結構。可使用高度滑桿查看。'],
  'part.cables': ['Positioning cables × 8', '定位纜索 × 8'],
  'part.cablesText': ['Four upper cables (bronze) and four lower cables (silver) connect the poles to the end effector. Coordinated cable lengths control its position and orientation.', '四條上方纜索（銅色）及四條下方纜索（銀色）連接支柱與末端執行器，透過協調纜索長度控制位置及方向。'],
  'part.effector': ['Suspended end effector', '懸吊末端執行器'],
  'part.effectorText': ['The aluminium frame carries a wireless, rotating brick gripper. Switch to the end-effector view to separate and inspect its components.', '鋁製框架承載無線旋轉夾磚器。切換至末端執行器視圖，以分離並查看內部組件。'],
  'part.pickup': ['Brick pick-up pole', '取磚支柱'],
  'part.pickupText': ['The separate fifth pole has a vertical carriage and a cantilevered brick holder. It presents a brick at the robot’s pick-up height.', '獨立的第五支支柱設有垂直滑台及懸臂式磚塊托架，把磚塊送到機械人的取磚高度。'],
  'part.arm': ['TX2-60 transfer arm', 'TX2-60 轉運機械臂'],
  'part.armText': ['The TX2-60 arm takes a brick from the feed conveyor and sets it on the fifth pole’s holder. The pole then raises it for collection by the cable-driven end effector. The arm geometry and reach are simplified for this demonstration.', 'TX2-60 機械臂從供磚輸送帶取磚，放到第五支柱的托架上，再由支柱升起交予纜索驅動末端執行器。此示範的機械臂形狀及活動範圍經過簡化。'],
  'part.conveyor': ['Brick feed conveyor', '供磚輸送帶'],
  'part.conveyorText': ['The feed conveyor brings individual bricks toward the pick-up station. Rollers and supports are simplified from the site assembly.', '供磚輸送帶把磚塊送至取磚站。模型中的滾輪及支架由場地組件簡化而成。'],
  'part.support': ['Cable support frame', '纜索支撐框架'],
  'part.supportText': ['The aluminium cage carries the cable loads and supports the tool. All eight eyelets and the corner brackets stay attached to the 380 × 380 × 220 mm frame.', '鋁製框架承受纜索負載並支撐工具。八個吊環及角碼均保留在 380 × 380 × 220 毫米框架上。'],
  'part.power': ['Power & control', '電源及控制'],
  'part.powerText': ['The printed enclosure houses an Arduino MEGA 2560 with Bluetooth control. A 120 Wh lithium-ion battery sits inside the printed battery mount and provides around four hours of operation. The battery, mount and enclosure stay together in this view.', '3D 列印外殼內置 Arduino MEGA 2560 及藍牙控制模組。120 Wh 鋰離子電池放在列印電池座內，可支援約四小時運作。此視圖將電池、電池座及外殼保持為同一模組。'],
  'part.rotation': ['Brick rotation', '磚塊旋轉'],
  'part.rotationText': ['The geared ring and bearing turn the gripper relative to the cable-supported frame. Use the rotation slider to orient the held brick before placement.', '齒輪環及軸承讓夾爪相對纜索支撐框架轉動。使用旋轉滑桿，在放置前調整夾持中磚塊的方向。'],
  'part.grip': ['Gripping & release', '夾持及釋放'],
  'part.gripText': ['The gripper motors use impedance control to regulate force. When closed, the pads grip the brick’s two long faces. Slide Grip & release to open the jaws, move the guided release plates and lower the brick. The modular gripper adapts to different brick shapes and sizes.', '夾爪馬達採用阻抗控制以調節力度。閉合時，夾墊夾持磚塊的兩個長側面。滑動「夾持及釋放」，可張開夾爪、移動導向釋放壓板並降下磚塊。模組化夾爪可配合不同形狀及尺寸的磚塊。'],
  'part.vision': ['Vision & alignment', '視覺及對準'],
  'part.visionText': ['A frame-mounted C920 Pro camera feeds ArUco localization on a Raspberry Pi 4B. Two tags in the workspace support regular cable calibration and gripper alignment; localization data reaches the main computer over TCP. Camera, bracket and Pi enclosure move together here.', '框架上的 C920 Pro 相機把影像送至 Raspberry Pi 4B 進行 ArUco 定位。工作範圍內的兩個標記支援定期纜索校準及夾爪對準，定位數據透過 TCP 傳送至主電腦。此處將相機、支架及 Pi 外殼一起移動。']
};
for (const [key, [en, zhHant]] of Object.entries(brickExplorerCopy)) {
  translations.en[`brick.${key}`] = en;
  translations.zhHant[`brick.${key}`] = zhHant;
}

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
        <p>RoBosun-Tapper is a cable-driven robot that performs hammer tests on high-rise building facades. It combines robotic positioning, automated tapping, and impact-signal analysis to support facade inspection.</p>
        <figure>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/5DXR3lMrMCk?si=djfk2KVHWyjRYlTt" title="RoBosun-Tapper project video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
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
        <p>RoBosun-Tapper 是用於高樓外牆敲擊測試的纜索驅動機械人。系統結合機械人定位、自動敲擊及撞擊訊號分析，支援外牆檢測工作。</p>
        <figure>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/5DXR3lMrMCk?si=djfk2KVHWyjRYlTt" title="RoBosun-Tapper 項目影片" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
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
        <p>CU-Brick is a cable-driven parallel robot for automated bricklaying. The system uses cables to position the robot across a large construction workspace and was used to build the brick structure at the Yard for Environmental Sustainability (YES) Pavilion.</p>
        <p>The YES Pavilion project used more than 5,800 bricks across 40 layers, reaching 2.5 m in height within a 13 m by 9 m work area.</p>
        <p>Fiducial-marker localization and 3D scanning support real-time calibration, while an elevation system shifts the robot's workspace to build taller structures without cable interference.</p>
        <figure>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/DkltJm3nhyI?si=xpFi4j9ImTA5RzOU" title="CU-Brick project video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </figure>
        <p><a href="https://news.tvb.com/tc/local/67e04c434fe65d6c2b35ddcd?utm_source=newswebshare&utm_medium=referral" target="_blank" rel="noopener">TVB News: CU-Brick media coverage</a><br><a href="https://news.now.com/home/local/player?newsId=597899" target="_blank" rel="noopener">Now News: CU-Brick media coverage</a><br><a href="https://www.i-cable.com/%E6%96%B0%E8%81%9E%E8%B3%87%E8%A8%8A/331104/%E4%B8%AD%E5%A4%A7%E7%A0%94%E7%99%BC%E7%A0%8C%E7%A3%9A%E6%A9%9F%E6%A2%B0%E4%BA%BA-%E4%BB%A5%E7%B7%9A%E7%BA%9C%E9%A9%85%E5%8B%95-%E8%87%AA%E5%8B%95%E4%BF%AE%E6%AD%A3%E8%B7%AF%E7%B7%9A" target="_blank" rel="noopener">i-CABLE News: CU-Brick media coverage</a><br><a href="https://news.rthk.hk/rthk/ch/component/k2/1797064-20250324.htm" target="_blank" rel="noopener">RTHK News: CU-Brick media coverage</a></p>
        <h3>Awards &amp; Recognition</h3>
        <ul>
          <li><a href="/blog/2nd-runner-up.html">CU-Brick: Second Runner-up, Open Section, YPEC 2025</a></li>
          <li><a href="/blog/osh-2026.html">CU-Brick: Merit Award, Open Category, OSH Innovation and Technology Award 2026</a></li>
        </ul>
        <h3>Publication &amp; Project Updates</h3>
        <ul>
          <li><a href="https://doi.org/10.1007/978-3-031-94608-0_28" target="_blank" rel="noopener">Peer-reviewed CU-Brick paper presented at CableCon 2025</a></li>
          <li><a href="/blog/cablecon-2025.html">CableCon 2025 presentation update</a></li>
          <li><a href="/blog/ypec-2025.html">YPEC 2025 exhibition update</a></li>
        </ul>
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
        <p>CU-Brick 是用於自動砌磚的纜索驅動並聯機械人。系統透過纜索在大型施工範圍內定位，並曾用於建造 Yard for Environmental Sustainability (YES) Pavilion 的磚結構。</p>
        <p>YES Pavilion 項目在 13 米乘 9 米的工作範圍內，使用超過 5,800 塊磚建成高 2.5 米、共 40 層的結構。</p>
        <p>基準標記定位與 3D 掃描支援即時校準，升降系統則調整機械人的工作空間，讓系統在避免纜索互相干涉的情況下建造更高結構。</p>
        <figure>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/DkltJm3nhyI?si=xpFi4j9ImTA5RzOU" title="CU-Brick 項目影片" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </figure>
        <p><a href="https://news.tvb.com/tc/local/67e04c434fe65d6c2b35ddcd?utm_source=newswebshare&utm_medium=referral" target="_blank" rel="noopener">無綫新聞：CU-Brick 媒體報導</a><br><a href="https://news.now.com/home/local/player?newsId=597899" target="_blank" rel="noopener">Now 新聞：CU-Brick 媒體報導</a><br><a href="https://www.i-cable.com/%E6%96%B0%E8%81%9E%E8%B3%87%E8%A8%8A/331104/%E4%B8%AD%E5%A4%A7%E7%A0%94%E7%99%BC%E7%A0%8C%E7%A3%9A%E6%A9%9F%E6%A2%B0%E4%BA%BA-%E4%BB%A5%E7%B7%9A%E7%BA%9C%E9%A9%85%E5%8B%95-%E8%87%AA%E5%8B%95%E4%BF%AE%E6%AD%A3%E8%B7%AF%E7%B7%9A" target="_blank" rel="noopener">有線新聞：CU-Brick 媒體報導</a><br><a href="https://news.rthk.hk/rthk/ch/component/k2/1797064-20250324.htm" target="_blank" rel="noopener">香港電台：CU-Brick 媒體報導</a></p>
        <h3>獎項與嘉許</h3>
        <ul>
          <li><a href="/blog/2nd-runner-up.html">CU-Brick：YPEC 2025 公開組季軍</a></li>
          <li><a href="/blog/osh-2026.html">CU-Brick：2026 年職安健創科大獎公開組嘉許獎</a></li>
        </ul>
        <h3>論文與項目動態</h3>
        <ul>
          <li><a href="https://doi.org/10.1007/978-3-031-94608-0_28" target="_blank" rel="noopener">於 CableCon 2025 發表的 CU-Brick 同行評審論文</a></li>
          <li><a href="/blog/cablecon-2025.html">CableCon 2025 發表動態</a></li>
          <li><a href="/blog/ypec-2025.html">YPEC 2025 展覽動態</a></li>
        </ul>
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
        <p>This mobile robot prototype was developed to automate wall spraying. Its ROS-based control system coordinates the mobile platform, linear rail, and motorized sprayer, with cameras and inertial sensing to support positioning.</p>
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
        <p>這款移動式機械人原型旨在把牆面噴塗工序自動化。系統透過 ROS 協調移動平台、線性滑軌及電動噴塗器，並利用相機和慣性感測支援定位。</p>
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
        <p>kNOw Touch lets users operate lift controls without touching the panel. Its infrared sensor bar detects contactless input and can be fitted to new or existing lift control panels.</p>
        <p>More than 1,200 units were deployed in Hong Kong within one year, including installations at Hong Kong International Airport and Pacific Place.</p>
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
        <p>kNOw Touch 讓使用者無需接觸面板即可操作升降機。其紅外線感應條偵測免觸輸入，並可安裝於新造或現有的升降機控制面板。</p>
        <p>項目於一年內在香港部署超過 1,200 套設備，包括香港國際機場及太古廣場的安裝項目。</p>
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
        <p>ME4 combines a humanoid robot with a wearable exoskeleton controller. The controller provides an interface for operating the robot, supported by haptic feedback, wireless communication, and motor-control software.</p>
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
        <p>ME4 結合人形機械人與穿戴式外骨骼控制器。控制器提供機械人操作介面，並配合觸覺回饋、無線通訊及馬達控制軟件。</p>
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
        <p>Borderless Lab 365 lets secondary school students operate physical STEM experiments through a web browser. The experiment hardware is hosted by PolyU's Department of Applied Physics, with live video and sensor readings available during each session.</p>
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
        <p>Borderless Lab 365 讓中學生透過網頁瀏覽器操控真實 STEM 實驗。實驗硬件設於理工大學應用物理學系，學生可在實驗期間查看即時影像及感測器讀數。</p>
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
        <p>This experimental project studied how construction-material mixtures respond to microwave heating. Tests on concrete, cement, and metal compositions used CAD-designed moulds and prototypes to explore the heating behaviour of different materials.</p>
        <p>Building on research from the Universitat Politècnica de València, the project evaluated a low-cost household microwave setup for construction-material experiments.</p>
        <p>The study compared the heating response of different mixtures and structural forms, and reached the final eight of a local innovation competition.</p>
        <div class="project-media-grid"><figure><a href="https://fablabvalencia.com/proyectos/"><img src="./assets/images/microwave_cad_1.jpeg" alt="CAD model from the microwave-heating project"></a></figure><figure><a href="https://fablabvalencia.com/proyectos/"><img src="./assets/images/microwave_cad_2.jpeg" alt="Prototype from the microwave-heating project"></a></figure></div>
        <h3>${translations.en["project.responsibilities"]}</h3>
        <ul>
          <li>Designed the experimental moulds and system prototypes in SolidWorks and AutoCAD.</li>
          <li>Planned and performed microwave-heating tests on concrete, cement, and metal compositions.</li>
          <li>Coordinated material selection, sourcing, and transport with suppliers.</li>
        </ul>`
    },
    zhHant: {
      title: siteProjects.microwave.title.zhHant,
      content: `
        <p>這個實驗項目研究建築材料混合物在微波加熱下的反應。研究使用 CAD 設計的模具及原型，測試混凝土、水泥與金屬配方，探索不同材料的升溫特性。</p>
        <p>項目建基於 Universitat Politècnica de València 的相關研究，評估以低成本家用微波裝置進行建築材料實驗的可行性。</p>
        <p>項目比較不同混合比例與結構形式的升溫反應，並入選本地創新比賽最後八強。</p>
        <div class="project-media-grid"><figure><a href="https://fablabvalencia.com/proyectos/"><img src="./assets/images/microwave_cad_1.jpeg" alt="微波加熱項目的 CAD 模型"></a></figure><figure><a href="https://fablabvalencia.com/proyectos/"><img src="./assets/images/microwave_cad_2.jpeg" alt="微波加熱項目的原型"></a></figure></div>
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
        <p>This concept explores a retractable tapping mechanism and thruster arrangement for cable-driven facade inspection robots. The tapping tool is designed to extend at an inspection point and retract during travel to protect the mechanism between tests.</p>
        <p>The design considers compact packaging and modular interfaces for integration with a cable-driven inspection robot.</p>
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
        <p>此概念探索用於纜索驅動外牆檢測機械人的可伸縮敲擊機構及推進器佈局。敲擊工具設計為在檢測位置伸出，並在移動期間收回，以保護機構。</p>
        <p>設計考慮緊湊的機構佈局及模組化介面，以便整合至纜索驅動檢測機械人。</p>
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
        <p>This wireless motorized foot controller was developed for the SuperLimb project. It uses foot input to command robotic motion, allowing the operator's hands to remain available for other tasks.</p>
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
        <p>這款無線電動腳踏控制器為 SuperLimb 項目而開發。操作者透過腳部輸入控制機械人動作，同時可騰出雙手處理其他工作。</p>
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

function splitProjectContent(content) {
  const match = content.match(/^\s*(<p>[\s\S]*?<\/p>)([\s\S]*)$/);
  if (!match) {
    throw new Error("Project content must begin with an overview paragraph.");
  }
  let details = match[2];
  // Preserve the original media and captions while promoting one visual block
  // into the project lead. Gallery projects have no image figures in this copy.
  const mediaGrid = details.match(/<div\b[^>]*class=["'][^"']*\bproject-media-grid\b[^"']*["'][^>]*>[\s\S]*?<\/div>/i);
  const imageFigure = [...details.matchAll(/<figure\b[^>]*>[\s\S]*?<\/figure>/gi)]
    .find((figure) => /<img\b/i.test(figure[0]));
  const media = mediaGrid || imageFigure;
  const leadMedia = media?.[0] || "";
  if (media) {
    details = details.slice(0, media.index) + details.slice(media.index + leadMedia.length);
  }
  return { overview: match[1], leadMedia, details };
}

function validateSiteData() {
  if (!siteProfile.name || !siteProfile.fullName || !siteProfile.publishedName
    || !siteProfile.givenName || !siteProfile.familyName
    || !siteProfile.role?.en || !siteProfile.role?.zhHant) {
    throw new Error("siteProfile requires preferred, full, published, given and family names plus both localized role values.");
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
    "ogDescription", "twitterDescription", "image", "imageAlt", "lastmod",
    "schemaDateModified"
  ];
  const missingProfileSeo = requiredProfileSeoFields.filter((field) => !siteProfile.seo?.[field]);
  if (missingProfileSeo.length || !siteProfile.seo?.knowsAbout?.length) {
    throw new Error(`siteProfile.seo is incomplete: ${missingProfileSeo.join(", ")}`);
  }
  if (!/^\/assets\/images\//.test(siteProfile.seo.image)
    || !/^\d{4}-\d{2}-\d{2}$/.test(siteProfile.seo.lastmod)) {
    throw new Error("siteProfile.seo requires an /assets/images image and YYYY-MM-DD lastmod.");
  }
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/.test(siteProfile.seo.schemaDateModified)
    || Number.isNaN(Date.parse(siteProfile.seo.schemaDateModified))
    || !siteProfile.seo.schemaDateModified.startsWith(siteProfile.seo.lastmod)) {
    throw new Error("siteProfile.seo.schemaDateModified must be a valid ISO 8601 datetime matching lastmod.");
  }

  const standaloneFiles = Object.values(standalonePages).map(({ file }) => file);
  if (new Set(standaloneFiles).size !== standaloneFiles.length) {
    throw new Error("standalonePages contains duplicate files.");
  }
  Object.entries(standalonePages).forEach(([key, page]) => {
    const requiredSeoFields = [
      "title", "description", "ogDescription", "twitterDescription", "image",
      "imageAlt", "schemaName", "schemaDescription", "lastmod"
    ];
    const missingFields = requiredSeoFields.filter((field) => !page.seo?.[field]);
    if (!/^[a-z0-9-]+\.html$/.test(page.file) || missingFields.length) {
      throw new Error(`standalonePages.${key} is incomplete: ${missingFields.join(", ")}`);
    }
    if (!/^\/assets\/images\//.test(page.seo.image)
      || !/^\d{4}-\d{2}-\d{2}$/.test(page.seo.lastmod)) {
      throw new Error(`standalonePages.${key}.seo has an invalid image or lastmod.`);
    }
  });

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
    if (project.detailEyebrow && (!project.detailEyebrow.en || !project.detailEyebrow.zhHant)) {
      throw new Error(`siteProjects.${key}.detailEyebrow requires both languages.`);
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
    if (project.awards) {
      if (!Array.isArray(project.awards) || !project.awards.length
        || project.awards.some((award) => !award.name || !/^\/blog\/[a-z0-9-]+\.html$/.test(award.url))) {
        throw new Error(`siteProjects.${key}.awards requires named award records with safe /blog/*.html URLs.`);
      }
    }
    if (project.citations
      && (!Array.isArray(project.citations)
        || project.citations.some((citation) => !/^https:\/\//.test(citation)))) {
      throw new Error(`siteProjects.${key}.citations must contain HTTPS URLs.`);
    }

    for (const language of ["en", "zhHant"]) {
      if (!project.copy?.[language]?.content || project.copy[language].title !== project.title[language]) {
        throw new Error(`Project copy mismatch for ${key}.${language}.`);
      }
      if (!splitProjectContent(project.copy[language].content).details.trim()) {
        throw new Error(`Project details are missing for ${key}.${language}.`);
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
    standalonePages,
    translations,
    projectPageFiles,
    projectPageAliases,
    projectPageTranslations,
    splitProjectContent,
    validateSiteData
  };
}
