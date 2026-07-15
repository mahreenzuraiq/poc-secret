export interface Complaint {
  id: string;
  category: 'Road' | 'Water' | 'Garbage' | 'Electricity' | 'Health' | 'Others';
  photo: string | null; // Base64 Data URL
  audio: string | null; // Base64 Data URL
  audioDuration: number; // in seconds
  description: string;
  createdAt: string;
  status: 'Received' | 'In Progress' | 'Resolved';
  ward: string;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  category: 'Sale' | 'Maintenance' | 'Health' | 'General';
  date: string;
  location: string;
}

const STORAGE_KEY = 'ward-portal-complaints';

export function getComplaints(): Complaint[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Seed with empty list or a default mock complaint so the history list isn't empty initially
    return [];
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error('Error parsing complaints:', e);
    return [];
  }
}

export function saveComplaint(complaint: Omit<Complaint, 'id' | 'createdAt' | 'status' | 'ward'>): Complaint {
  const newComplaint: Complaint = {
    ...complaint,
    id: 'CMP-' + Math.floor(100000 + Math.random() * 900000),
    createdAt: new Date().toISOString(),
    status: 'Received',
    ward: 'Ward 12 - Greenfield'
  };

  const current = getComplaints();
  const updated = [newComplaint, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newComplaint;
}

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'Grand Organic Sale at Ward Center',
    description: 'Fresh organic farm vegetables, organic honey, and handloom clothes are available at the Ward Community Center grounds this Friday. Senior citizens receive an extra 20% discount on all purchases!',
    category: 'Sale',
    date: 'July 18, 2026',
    location: 'Community Center Hall'
  },
  {
    id: 'n2',
    title: 'Free Health & Eye Camp for Seniors',
    description: 'A free geriatric health and eye care check-up camp is organized by the Municipal Corporation this Saturday. Free consultations and reading glasses will be provided to attendees.',
    category: 'Health',
    date: 'July 19, 2026',
    location: 'Primary Health Center'
  },
  {
    id: 'n3',
    title: 'Road Maintenance: Ward Main Highway',
    description: 'Pothole repairs and tarring work on the Greenfield Main Highway will commence from Tuesday morning. Traffic will be diverted through Station Road. Expected completion within 3 days.',
    category: 'Maintenance',
    date: 'July 21, 2026',
    location: 'Main Highway (Section B)'
  },
  {
    id: 'n4',
    title: 'Scheduled Water Pipe Repairs',
    description: 'A scheduled maintenance repair on the primary water distribution pipeline will take place on Monday between 8 AM and 2 PM. Water supply will be temporarily shut off during these hours.',
    category: 'Maintenance',
    date: 'July 20, 2026',
    location: 'Zone A & Zone C'
  }
];

export function getNews(): NewsItem[] {
  return MOCK_NEWS;
}
