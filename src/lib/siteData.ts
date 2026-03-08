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

export interface SiteData {
  upcomingEvents: UpcomingEvent[];
  programs: Program[];
  eventSections: EventSection[];
  pastBootcamp: PastBootcamp;
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
