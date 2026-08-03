import { 
  Heart, 
  Briefcase, 
  Baby, 
  Flame, 
  CalendarClock, 
  CalendarDays, 
  Star, 
  Map, 
  BookOpen,
  Gem,
  Hand,
  UserCheck,
  UserPlus,
  HeartPulse,
  Globe,
  HelpCircle,
  Award
} from 'lucide-react';

export const kundliFeatures = [
  { id: 'kundli-generation', title: 'Online Kundli Generation', icon: Globe, description: 'Generate your precise Vedic Kundli instantly with accurate planetary positions and details.' },
  { id: 'gun-milan', title: 'Kundli Matching / Gun Milan', icon: UserCheck, description: 'Check Ashtakoot Milan for marriage compatibility with detailed score analysis.' },
  { id: 'love-report', title: 'Love Report', icon: HeartPulse, description: 'Get deep insights into your love life, compatibility, and relationship prospects.' },
  { id: 'marriage-report', title: 'Marriage Report', icon: Award, description: 'Analyze marriage timing, spouse characteristics, and married life predictions.' },
  { id: 'career-report', title: 'Career Report', icon: Briefcase, description: 'Find the best career paths, success timing, and job vs. business analysis.' },
  { id: 'santan-report', title: 'Santan Report', icon: Baby, description: 'Astrological guidance for progeny, timing of childbirth, and remedies.' },
  { id: 'manglik-analysis', title: 'Manglik Analysis', icon: Flame, description: 'Detailed Mangal Dosha check and its effects on your life and marriage.' },
  { id: 'dasha-transit', title: 'Dasha & Transit Analysis', icon: CalendarClock, description: 'Understand your current planetary periods and how they affect your immediate future.' }
];

export const services = [
  { id: 'marriage', title: 'Marriage', icon: UserPlus, description: 'Consultations regarding marriage delays, issues, and successful matchmaking.' },
  { id: 'career', title: 'Career', icon: Briefcase, description: 'Overcome career hurdles and get guidance on promotion and professional growth.' },
  { id: 'health', title: 'Health', icon: Heart, description: 'Astrological insights into health matters and potential well-being.' },
  { id: 'business', title: 'Business', icon: Globe, description: 'Auspicious times for starting a business, partnerships, and financial growth.' },
  { id: 'vastu', title: 'Vastu', icon: Map, description: 'Align your home or workspace with Vastu Shastra principles for prosperity.' },
  { id: 'numerology', title: 'Numerology', icon: Star, description: 'Discover the power of your numbers and how they shape your destiny.' },
  { id: 'prashn-kundli', title: 'Prashn Kundli', icon: HelpCircle, description: 'Get answers to specific questions based on the exact time they are asked.' },
  { id: 'palm-reading', title: 'Palm Reading', icon: Hand, description: 'Deep analysis of the lines on your palm to uncover your life path.' },
  { id: 'gemstones', title: 'Gemstones', icon: Gem, description: 'Recommendations for lucky gemstones to enhance positive planetary effects.' }
];

export const dailyAstrology = [
  { id: 'daily-horoscope', title: 'Daily Horoscope', icon: CalendarDays, description: 'Read your daily predictions for all 12 zodiac signs.' },
  { id: 'weekly-horoscope', title: 'Weekly Horoscope', icon: CalendarDays, description: 'Plan your week ahead with accurate astrological forecasts.' },
  { id: 'monthly-horoscope', title: 'Monthly Horoscope', icon: CalendarDays, description: 'Comprehensive monthly overview of major planetary transits and their effects.' },
  { id: 'rashifal', title: 'Rashifal', icon: Star, description: 'Detailed insights based on your Moon sign.' },
  { id: 'nakshatra', title: 'Nakshatra Horoscope', icon: Star, description: 'Deep dive into your Nakshatra and its daily impact.' },
  { id: 'panchang', title: 'Panchang', icon: BookOpen, description: 'Daily Hindu calendar detailing Tithi, Vaar, Nakshatra, Yoga, and Karana.' },
  { id: 'muhurat', title: 'Muhurat', icon: CalendarClock, description: 'Find auspicious timings for important events and new beginnings.' },
  { id: 'festivals', title: 'Festival Calendar', icon: CalendarDays, description: 'Important upcoming Hindu festivals and their astrological significance.' },
  { id: 'blogs', title: 'Astrology Blogs', icon: BookOpen, description: 'Articles and insights into Vedic astrology, spirituality, and remedies.' }
];
