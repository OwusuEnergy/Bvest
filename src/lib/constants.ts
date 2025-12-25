type NavLink = {
  name: string;
  path?: string;
  children?: { name: string; path: string }[];
};

export const publicNavLinks: NavLink[] = [
  { name: 'Home', path: '/' },
  { name: 'Investments', path: '/investments' },
  {
    name: 'About',
    children: [
      { name: 'About Us', path: '/about' },
      { name: 'FAQ', path: '/faq' },
      { name: 'Contact', path: '/contact' },
    ],
  },
];

export const authLinks = {
  login: '/auth/login',
  signup: '/auth/login',
  dashboard: '/dashboard',
};

export const footerLinks = {
  legal: [
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Investment Agreement', path: '/agreement' },
    { name: 'Risk Disclosure', path: '/risk-disclosure' },
  ],
  company: [
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'FAQ', path: '/faq' },
  ],
};
