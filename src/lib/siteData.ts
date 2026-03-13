// Site data types and management

export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  type: string;
  description?: string;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  iconType: 'users' | 'user' | 'monitor' | 'layers' | 'swords';
}

export interface EventSection {
  id: string;
  title: string;
  description: string;
  iconType: 'tent' | 'trophy' | 'lightbulb' | 'info';
}

export interface PastBootcamp {
  id: string;
  title: string;
  paragraphs: string[];
}

export interface AboutFeature {
  id: string;
  title: string;
  description: string;
  iconType: 'book' | 'target' | 'star' | 'user';
}

export interface AboutPageData {
  storyTitle: string;
  storyParagraphs: string[];
  missionTitle: string;
  missionText: string;
  visionTitle: string;
  visionText: string;
  coachSectionTitle: string;
  coachName: string;
  coachParagraphs: string[];
  coachPhotoUrl?: string;
  features: AboutFeature[];
}

export interface HomePageData {
  heroTagline: string;
  heroTitle: string;
  heroTitleAccent: string;
  heroDescription: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText: string;
  ctaSectionTitle: string;
  ctaSectionDescription: string;
  ctaSectionButtonText: string;
}

export interface EventPageCard {
  id: string;
  title: string;
  description: string;
  extraText?: string;
}

export interface ContactPageData {
  pageTitle: string;
  pageSubtitle: string;
  email: string;
  phone: string;
  phoneRaw: string;
  whatsappMessage: string;
  formRecipientEmail: string;
}

export interface EventsPageData {
  registerLink: string;
  registerText: string;
  registrationDescription: string;
}

export interface FooterQuickLink {
  id: string;
  label: string;
  path: string;
}

export interface FooterSocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface FooterData {
  brandName: string;
  tagline: string;
  contactEmail: string;
  copyrightText: string;
  quickLinks: FooterQuickLink[];
  socialLinks: FooterSocialLink[];
}

export interface SiteData {
  upcomingEvents: UpcomingEvent[];
  programs: Program[];
  eventSections: EventSection[];
  pastBootcamp: PastBootcamp;
  eventsPageCards: EventPageCard[];
  aboutPage: AboutPageData;
  homePage: HomePageData;
  contactPage: ContactPageData;
  eventsPage: EventsPageData;
  footer: FooterData;
}

const defaultSiteData: SiteData = {
  upcomingEvents: [
    { id: '1', title: 'Spring Group Classes Begin', date: 'Mar 15, 2026', type: 'Classes' },
    { id: '2', title: 'Summer Chess Bootcamp', date: 'Jun 22, 2026', type: 'Camp' },
    { id: '3', title: 'City Championship Prep Workshop', date: 'Aug 10, 2026', type: 'Workshop' },
  ],
  programs: [
    {
      id: '1',
      title: 'Group Classes',
      description: 'Learn alongside peers in a collaborative environment. Small class sizes ensure personal attention while fostering friendly competition and social growth.',
      iconType: 'users',
    },
    {
      id: '2',
      title: 'One-on-One Training',
      description: 'Personalized lessons tailored to your unique strengths and areas for improvement. The fastest path to measurable progress.',
      iconType: 'user',
    },
    {
      id: '3',
      title: 'Online Coaching',
      description: 'Flexible virtual sessions that fit your schedule. All the benefits of private coaching from the comfort of home.',
      iconType: 'monitor',
    },
    {
      id: '4',
      title: 'Beginner & Intermediate',
      description: 'Structured curriculum for every level. Beginners learn the rules and basic strategy; intermediates deepen positional understanding and tactical vision.',
      iconType: 'layers',
    },
    {
      id: '5',
      title: 'Tournament Preparation',
      description: 'Advanced training focused on opening repertoire, time management, and competitive mindset for serious tournament players.',
      iconType: 'swords',
    },
  ],
  eventSections: [
    {
      id: '1',
      title: 'Summer Camps',
      description: 'Immersive multi-day chess bootcamps with structured lessons, guided play, and fun activities.',
      iconType: 'tent',
    },
    {
      id: '2',
      title: 'Tournaments',
      description: 'Competitive events for students to test their skills and gain real tournament experience.',
      iconType: 'trophy',
    },
    {
      id: '3',
      title: 'Workshops',
      description: 'Focused sessions on specific topics like endgames, openings, and competitive mindset.',
      iconType: 'lightbulb',
    },
  ],
  pastBootcamp: {
    id: '1',
    title: 'Past Bootcamp: VTSEVA Chess Camp 2024',
    paragraphs: [
      'As an active VTSEVA volunteer, Tarun ran a 4-week chess bootcamp starting June 24, 2024. Students learned fundamental and intermediate chess strategies in a fun, supportive environment.',
      'The complete bootcamp cost was $15, with all proceeds going toward visually impaired kids at Netra Vidyalaya.',
    ],
  },
  eventsPageCards: [
    {
      id: 'default-bootcamp',
      title: 'Past Bootcamp: VTSEVA Chess Camp 2024',
      description: 'As an active VTSEVA volunteer, Tarun ran a 4-week chess bootcamp starting June 24, 2024. Students learned fundamental and intermediate chess strategies in a fun, supportive environment.',
      extraText: 'The complete bootcamp cost was $15, with all proceeds going toward visually impaired kids at Netra Vidyalaya.',
    },
  ],
  aboutPage: {
    storyTitle: 'Our Story',
    storyParagraphs: [
      'This academy was founded to teach chess clearly, patiently, and with purpose. Through years of competitive play, I noticed a common problem in chess education: students were often overwhelmed too early. Openings were memorized without understanding, tactics were taught without context, and improvement felt frustrating instead of exciting.',
      'Our approach is different. We focus on strong fundamentals first, helping students understand why positions work—not just what moves to play. Lessons are structured, paced to the student, and reinforced through guided play so concepts actually stick.',
      'In 2024, this philosophy was put into practice through structured programs and chess camps. Watching students gain confidence, think independently, and improve week by week confirmed one thing: when chess is taught the right way, students don\'t just get better—they start enjoying the game more.',
      'This academy exists to build confident, thoughtful chess players — one clear idea at a time.',
    ],
    missionTitle: 'Our Mission',
    missionText: 'To make chess education accessible, engaging, and effective for every student — building not just better players, but better thinkers.',
    visionTitle: 'Our Vision',
    visionText: 'A community where every young chess player has the guidance and encouragement to reach their full potential, on and off the board.',
    coachSectionTitle: 'Meet the Coach',
    coachName: 'Tarun Sai Tubati',
    coachParagraphs: [
      "Hi, I'm Tarun — a 10th grader, two-time state chess champion, and dedicated student of the game. I started playing chess at the age of 8, quickly falling in love with the strategy, creativity, and challenge it offers.",
      "What began as games with friends and family grew into a competitive pursuit. Today, I train seriously and compete at the state and national levels. I've also served as an assistant tournament director for the Girls State Chess Championship for the past two years.",
      'Chess has taught me how to think critically, stay disciplined, and grow through challenge — and those are the same values I bring to my teaching.',
    ],
    features: [
      { id: 'f1', title: 'Fundamentals First', description: 'We teach why positions work — not just what moves to play.', iconType: 'book' },
      { id: 'f2', title: 'Structured Learning', description: 'Lessons are paced to each student and reinforced through guided play.', iconType: 'target' },
      { id: 'f3', title: 'Patient Instruction', description: 'Improvement feels exciting, not frustrating. Every student progresses at their own pace.', iconType: 'star' },
      { id: 'f4', title: 'Proven Results', description: 'Students gain confidence, think independently, and genuinely enjoy the game.', iconType: 'user' },
    ],
  },
  homePage: {
    heroTagline: "Welcome to Tarun's Chess Academy",
    heroTitle: 'Build Confidence,',
    heroTitleAccent: 'One Move at a Time',
    heroDescription: 'Patient, fundamentals-first chess instruction that helps students think clearly, play confidently, and love the game.',
    ctaText: 'Join Now',
    ctaLink: 'https://api.whatsapp.com/send/?phone=%2B19846876038&text=Hi%21+I%27m+interested+in+learning+more+about+Tarun\'s+Chess+Academy.+Please+share+details+about+your+chess+coaching+programs.&type=phone_number&app_absent=0',
    secondaryCtaText: 'Explore Programs',
    ctaSectionTitle: 'Ready to Start Your Chess Journey?',
    ctaSectionDescription: "Whether you're a complete beginner or preparing for competition, we have a program for you.",
    ctaSectionButtonText: 'Get Started Today',
  },
  contactPage: {
    pageTitle: 'Contact Us',
    pageSubtitle: 'Have a question or ready to get started? Reach out and we\'ll be happy to help.',
    email: 'tarun.tubati9@gmail.com',
    phone: '+1 (984) 687-6038',
    phoneRaw: '+19846876038',
    whatsappMessage: "Hi! I'm interested in Tarun's Chess Academy.",
    formRecipientEmail: 'tarun.tubati9@gmail.com',
  },
  eventsPage: {
    registerLink: 'https://forms.gle/bkeWgrhbDyHGckok7',
    registerText: 'Register Now',
    registrationDescription: 'Ready to sign up for an upcoming event? Use the link below to register through our Google Form.',
  },
  footer: {
    brandName: "Tarun's Chess Academy",
    tagline: 'Building confident, thoughtful chess players — one clear idea at a time.',
    contactEmail: 'tarun.tubati9@gmail.com',
    copyrightText: "Tarun's Chess Academy. All rights reserved.",
    quickLinks: [
      { id: 'ql1', label: 'Home', path: '/' },
      { id: 'ql2', label: 'About Us', path: '/about' },
      { id: 'ql3', label: 'Programs', path: '/programs' },
      { id: 'ql4', label: 'Events', path: '/events' },
      { id: 'ql5', label: 'Contact Us', path: '/contact' },
    ],
    socialLinks: [],
  },
};

const STORAGE_KEY = 'tarun_chess_site_data';

export function getSiteData(): SiteData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error('Error loading site data:', e);
  }
  return defaultSiteData;
}

export function saveSiteData(data: SiteData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving site data:', e);
  }
}

export function resetSiteData(): SiteData {
  localStorage.removeItem(STORAGE_KEY);
  return defaultSiteData;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export { defaultSiteData };
