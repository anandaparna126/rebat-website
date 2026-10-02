export type EnquiryStatus = "new" | "contacted" | "closed";

export interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  topic: string;
  message: string;
  source_page: string;
  status: EnquiryStatus;
  admin_notes: string;
  ip_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface Paginated<T> {
  results: T[];
  count: number;
  page: number;
  num_pages: number;
}

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "faq"; items: { q: string; a: string }[] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "gallery"; images: { src: string; alt: string; caption?: string }[] };

export interface Article {
  id: number;
  slug: string;
  title: string;
  publish_date: string;
  display_date: string;
  author: string;
  category: string;
  excerpt: string;
  body: ArticleBlock[];
  image: string;
  image_alt: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Dashboard {
  enquiries: { total: number; new: number; contacted: number; closed: number; last_7_days: number };
  articles: { published: number; drafts: number };
  jobs: { active: number; inactive: number };
  timeline: { date: string; count: number }[];
  by_topic: { topic: string; count: number }[];
  recent_enquiries: Enquiry[];
}

// Mirrors NEWSROOM_CATEGORIES on the website and backend.
export const NEWSROOM_CATEGORIES = [
  "Company Updates",
  "Announcements",
  "Industry News",
  "Milestones & Achievements",
  "Events & Activities",
  "New Developments",
  "Blogs",
];

export const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];
