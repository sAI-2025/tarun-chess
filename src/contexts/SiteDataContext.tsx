import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
  desc: string;
  iconType: "users" | "user" | "monitor" | "layers" | "swords";
}

export interface EventSection {
  id: string;
  title: string;
  desc: string;
  iconType: "tent" | "trophy" | "lightbulb";
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
    { id: "1", date: "Mar 15, 2026", title: "Spring Group Classes Begin", type: "Classes", description: "" },
    { id: "2", date: "Jun 22, 2026", title: "Summer Chess Bootcamp", type: "Camp", description: "" },
    { id: "3", date: "Aug 10, 2026", title: "City Championship Prep Workshop", type: "Workshop", description: "" },
  ],
  programs: [
    { id: "1", iconType: "users", title: "Group Classes", desc: "Learn alongside peers in a collaborative environment. Small class sizes ensure personal attention while fostering friendly competition and social growth." },
    { id: "2", iconType: "user", title: "One-on-One Training", desc: "Personalized lessons tailored to your unique strengths and areas for improvement. The fastest path to measurable progress." },
    { id: "3", iconType: "monitor", title: "Online Coaching", desc: "Flexible virtual sessions that fit your schedule. All the benefits of private coaching from the comfort of home." },
    { id: "4", iconType: "layers", title: "Beginner & Intermediate", desc: "Structured curriculum for every level. Beginners learn the rules and basic strategy; intermediates deepen positional understanding and tactical vision." },
    { id: "5", iconType: "swords", title: "Tournament Preparation", desc: "Advanced training focused on opening repertoire, time management, and competitive mindset for serious tournament players." },
  ],
  eventSections: [
    { id: "1", iconType: "tent", title: "Summer Camps", desc: "Immersive multi-day chess bootcamps with structured lessons, guided play, and fun activities." },
    { id: "2", iconType: "trophy", title: "Tournaments", desc: "Competitive events for students to test their skills and gain real tournament experience." },
    { id: "3", iconType: "lightbulb", title: "Workshops", desc: "Focused sessions on specific topics like endgames, openings, and competitive mindset." },
  ],
  pastBootcamp: {
    id: "1",
    title: "Past Bootcamp: VTSEVA Chess Camp 2024",
    paragraphs: [
      "As an active VTSEVA volunteer, Tarun ran a 4-week chess bootcamp starting June 24, 2024. Students learned fundamental and intermediate chess strategies in a fun, supportive environment.",
      "The complete bootcamp cost was $15, with all proceeds going toward visually impaired kids at Netra Vidyalaya."
    ]
  }
};

const STORAGE_KEY = "tarun_chess_site_data";
const AUTH_KEY = "tarun_chess_admin_auth";
const ADMIN_CREDENTIALS = {
  email: "tarun.tubati9@gmail.com",
  password: "12345678"
};

interface SiteDataContextType {
  siteData: SiteData;
  updateSiteData: (data: SiteData) => void;
  resetToDefault: () => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updatePassword: (newPassword: string) => void;
}

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

export const SiteDataProvider = ({ children }: { children: ReactNode }) => {
  const [siteData, setSiteData] = useState<SiteData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultSiteData;
      }
    }
    return defaultSiteData;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(AUTH_KEY) === "true";
  });

  const [credentials, setCredentials] = useState(() => {
    const stored = localStorage.getItem("tarun_chess_admin_creds");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return ADMIN_CREDENTIALS;
      }
    }
    return ADMIN_CREDENTIALS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
  }, [siteData]);

  const updateSiteData = (data: SiteData) => {
    setSiteData(data);
  };

  const resetToDefault = () => {
    setSiteData(defaultSiteData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSiteData));
  };

  const login = (email: string, password: string): boolean => {
    if (email === credentials.email && password === credentials.password) {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_KEY, "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
  };

  const updatePassword = (newPassword: string) => {
    const newCreds = { ...credentials, password: newPassword };
    setCredentials(newCreds);
    localStorage.setItem("tarun_chess_admin_creds", JSON.stringify(newCreds));
  };

  return (
    <SiteDataContext.Provider value={{ siteData, updateSiteData, resetToDefault, isAuthenticated, login, logout, updatePassword }}>
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error("useSiteData must be used within a SiteDataProvider");
  }
  return context;
};
