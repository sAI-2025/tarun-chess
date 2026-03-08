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

export interface SiteData {
  upcomingEvents: UpcomingEvent[];
  programs: Program[];
  eventSections: EventSection[];
  pastBootcamp: PastBootcamp;
  eventsPageCards: EventPageCard[];
  aboutPage: AboutPageData;
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
};

const STORAGE_KEY = 'tarun_chess_site_data';
const AUTH_STORAGE_KEY = 'tarun_chess_admin_auth';
const ADMIN_PASSWORD_KEY = 'tarun_chess_admin_password';
const ADMIN_EMAIL_KEY = 'tarun_chess_admin_email';

// Default admin credentials
const DEFAULT_ADMIN_EMAIL = 'tarun.tubati9@gmail.com';
const DEFAULT_ADMIN_PASSWORD = '12345678';

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

export function getAdminPassword(): string {
  try {
    const stored = localStorage.getItem(ADMIN_PASSWORD_KEY);
    if (stored) return stored;
  } catch (e) {
    console.error('Error loading admin password:', e);
  }
  return DEFAULT_ADMIN_PASSWORD;
}

export function setAdminPassword(password: string): void {
  try {
    localStorage.setItem(ADMIN_PASSWORD_KEY, password);
  } catch (e) {
    console.error('Error saving admin password:', e);
  }
}
export function getAdminEmail(): string {
  try {
    const stored = localStorage.getItem(ADMIN_EMAIL_KEY);
    if (stored) return stored;
  } catch (e) {
    console.error('Error loading admin email:', e);
  }
  return DEFAULT_ADMIN_EMAIL;
}

export function setAdminEmail(email: string): void {
  try {
    localStorage.setItem(ADMIN_EMAIL_KEY, email);
  } catch (e) {
    console.error('Error saving admin email:', e);
  }
}

export function validateAdmin(email: string, password: string): boolean {
  const currentPassword = getAdminPassword();
  const currentEmail = getAdminEmail();
  return email === currentEmail && password === currentPassword;
}

export function isAdminLoggedIn(): boolean {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAdminLoggedIn(value: boolean): void {
  try {
    if (value) {
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Error setting auth status:', e);
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export { defaultSiteData };
