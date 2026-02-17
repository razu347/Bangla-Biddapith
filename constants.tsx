
import React from 'react';
import { Facebook, Phone, MessageCircle, MessageSquare, User } from 'lucide-react';

export const COLORS = {
  primary: 'orange-500',
  primaryDark: 'orange-600',
  primaryLight: 'orange-50',
};

export const CONTACT_LINKS = [
  { icon: <MessageCircle className="w-6 h-6" />, label: 'WhatsApp', url: 'https://wa.me/8801750991043' },
  { icon: <Phone className="w-6 h-6" />, label: 'Call', url: 'tel:01750991043' },
  { icon: <Facebook className="w-6 h-6" />, label: 'FB Page', url: '#' },
  { icon: <MessageSquare className="w-6 h-6" />, label: 'FB Group', url: '#' },
  { icon: <User className="w-6 h-6" />, label: 'Director FB', url: '#' },
];

export const SUBJECTS = [
  'Bangla 1st Paper', 
  'Bangla 2nd Paper', 
  'Bangladesh & Global Studies (BGS)', 
  'ICT', 
  'Religion Studies'
];

export const BATCH_TIMES = [
  'Sat-Fri (4:15 PM)',
  'Sat-Fri (5:20 PM)',
  'Sat-Fri (8:30 AM)',
  'Sat-Fri (3:10 PM)',
  'Sat-Fri (7:15 AM)',
  'Sat-Fri (9:30 AM)',
  'Sat-Fri (6:30 PM)',
  'Sun-Fri (9:30 AM)',
  'Sun-Fri (4:15 PM)',
  'Sun-Fri (5:20 PM)',
  'Sun-Fri (7:30 PM)',
  'Sun-Fri (8:30 AM)',
];
