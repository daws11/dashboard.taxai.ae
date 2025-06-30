export const TABS = ["Profile", "Subscription", "Account History"];

export const JOB_TITLES = [
  { value: "tax agent", label: "Tax Agent" },
  { value: "business owner", label: "Business Owner" },
  { value: "finance", label: "Finance" },
];

export const LANGUAGES = [
  { value: "english", label: "English" },
  { value: "arabic", label: "العربية" },
  { value: "chinese", label: "中文" },
];

export const plans = [
  {
    key: 'trial',
    name: 'Free Trial',
    price: 'Free',
    priceAED: 'Free',
    description: 'Try all features for 14 days',
    features: [
      '1 user',
      'Up to 30 messages',
      'Coverage of UAE VAT, Corporate Tax, and Excise regulations',
      'Answers in both English and Arabic',
      'Standard support',
      'No credit card required',
    ],
  },
  {
    key: 'monthly',
    name: 'Monthly Plan',
    price: '$99',
    priceAED: 'AED 365',
    description: 'Ideal for business owners, freelancers, tax advisors, accountants, and finance professionals who need accurate and accessible tax guidance.',
    features: [
      '1 user',
      '100 AI-powered messages per month',
      'Coverage of UAE VAT, Corporate Tax, and Excise regulations',
      'Answers in both English and Arabic',
      'Standard support',
      'Access to step-by-step guidance and process explanations',
    ],
  },
  {
    key: 'quarterly',
    name: 'Quarterly Plan',
    price: '$250',
    priceAED: 'AED 915',
    description: 'Best for professionals who want consistent tax advisory access with savings.',
    features: [
      '1 user',
      '300 messages total over 3 months',
      'All Monthly features',
      'Priority email support',
      'Access to monthly tax regulation digest',
    ],
    mostPopular: true,
  },
  {
    key: 'yearly',
    name: 'Yearly Plan',
    price: '$899',
    priceAED: 'AED 3,300',
    description: 'For users committed to long-term support and deeper features, with the best value.',
    features: [
      '1 to 2 users',
      '1,200 messages per year (averaging 100/month)',
      'All Quarterly features',
      'Early access to new features',
      'Onboarding session included',
    ],
  },
  {
    key: 'enterprise',
    name: 'Enterprise Plan',
    price: '',
    priceAED: '',
    description: 'For tax advisors, legal firms, or corporate finance departments managing multiple clients or entities.',
    features: [
      'AI-powered tax automation',
      'Insights dashboard with ERP-integrated',
      'Custom-built advisory modules',
      'Private AI assistant for your team',
      'Dedicated account manager & SLA support',
      'Flexible usage & multi-user access',
    ],
    contact: true,
  },
]; 