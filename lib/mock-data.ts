import { User, Opportunity, Campaign, Resource } from './types';
import { generateId } from './utils';

// Mock Users
export const mockUsers: User[] = [
  {
    userId: generateId(),
    displayName: 'Dr. Sarah Chen',
    username: 'sarahchen',
    bio: 'Epidemiologist focused on infectious disease prevention and global health equity.',
    expertiseTags: ['Epidemiology', 'Global Health', 'Infectious Disease'],
    interestsTags: ['Research', 'Policy Development', 'Health Equity'],
    location: 'San Francisco, CA',
    profileImageUrl: 'https://via.placeholder.com/150/4A90E2/FFFFFF?text=SC',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    userId: generateId(),
    displayName: 'Marcus Johnson',
    username: 'marcusj',
    bio: 'Community health advocate working on health disparities in urban communities.',
    expertiseTags: ['Community Health', 'Health Equity', 'Health Education'],
    interestsTags: ['Community Engagement', 'Advocacy', 'Health Promotion'],
    location: 'Chicago, IL',
    profileImageUrl: 'https://via.placeholder.com/150/50C878/FFFFFF?text=MJ',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    userId: generateId(),
    displayName: 'Dr. Priya Patel',
    username: 'priyap',
    bio: 'Health policy researcher specializing in healthcare access and maternal health.',
    expertiseTags: ['Health Policy', 'Maternal Health', 'Health Systems'],
    interestsTags: ['Policy Development', 'Research', 'Healthcare Access'],
    location: 'Boston, MA',
    profileImageUrl: 'https://via.placeholder.com/150/FF6B6B/FFFFFF?text=PP',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-19'),
  },
];

// Mock Opportunities
export const mockOpportunities: Opportunity[] = [
  {
    opportunityId: generateId(),
    title: 'Public Health Data Analyst',
    description: 'Join our team to analyze health trends and support evidence-based policy decisions. Experience with statistical software required.',
    type: 'job',
    location: 'Washington, DC',
    organization: 'CDC Foundation',
    applyUrl: 'https://example.com/apply/1',
    postedAt: new Date('2024-01-15'),
    expiryDate: new Date('2024-02-15'),
    tags: ['Data Analysis', 'Epidemiology', 'Policy'],
  },
  {
    opportunityId: generateId(),
    title: 'Global Health Internship',
    description: 'Summer internship opportunity to work on maternal health programs in Sub-Saharan Africa. Travel required.',
    type: 'internship',
    location: 'Remote/Travel',
    organization: 'Partners In Health',
    applyUrl: 'https://example.com/apply/2',
    postedAt: new Date('2024-01-18'),
    expiryDate: new Date('2024-03-01'),
    tags: ['Global Health', 'Maternal Health', 'Program Management'],
  },
  {
    opportunityId: generateId(),
    title: 'Health Equity Research Project',
    description: 'Contract position to conduct research on social determinants of health in rural communities. PhD preferred.',
    type: 'project',
    location: 'Remote',
    organization: 'Rural Health Research Center',
    applyUrl: 'https://example.com/apply/3',
    postedAt: new Date('2024-01-20'),
    expiryDate: new Date('2024-02-20'),
    tags: ['Health Equity', 'Research', 'Social Determinants'],
  },
];

// Mock Campaigns
export const mockCampaigns: Campaign[] = [
  {
    campaignId: generateId(),
    title: 'Mental Health Awareness Week',
    description: 'Join us in raising awareness about mental health resources and reducing stigma in our communities.',
    goal: 'Reach 10,000 people with mental health resources and information',
    callToAction: 'Share mental health resources on social media using #MentalHealthMatters',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-07'),
    creatorUserId: mockUsers[0].userId,
    status: 'active',
    participantCount: 156,
  },
  {
    campaignId: generateId(),
    title: 'Clean Air Initiative',
    description: 'Advocate for stronger air quality regulations to protect public health from pollution.',
    goal: 'Collect 5,000 signatures for clean air petition',
    callToAction: 'Sign the petition and contact your local representatives',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-03-15'),
    creatorUserId: mockUsers[1].userId,
    status: 'active',
    participantCount: 2847,
  },
  {
    campaignId: generateId(),
    title: 'Vaccine Education Campaign',
    description: 'Completed campaign that successfully educated communities about vaccine safety and efficacy.',
    goal: 'Educate 1,000 community members about vaccine benefits',
    callToAction: 'Host community education sessions',
    startDate: new Date('2023-10-01'),
    endDate: new Date('2023-12-31'),
    creatorUserId: mockUsers[2].userId,
    status: 'completed',
    participantCount: 89,
  },
];

// Mock Resources
export const mockResources: Resource[] = [
  {
    resourceId: generateId(),
    title: 'Global Health Observatory Data',
    description: 'Comprehensive health statistics and data from WHO covering mortality, morbidity, and health system indicators.',
    url: 'https://www.who.int/data/gho',
    type: 'data',
    tags: ['Global Health', 'Statistics', 'WHO'],
  },
  {
    resourceId: generateId(),
    title: 'Social Determinants of Health Research',
    description: 'Latest research findings on how social and economic factors impact health outcomes across populations.',
    url: 'https://example.com/research/sdoh',
    type: 'research',
    tags: ['Social Determinants', 'Health Equity', 'Research'],
  },
  {
    resourceId: generateId(),
    title: 'Public Health Emergency Preparedness Guide',
    description: 'Comprehensive guide for communities to prepare for and respond to public health emergencies.',
    url: 'https://example.com/guides/emergency-prep',
    type: 'education',
    tags: ['Emergency Preparedness', 'Community Health', 'Guidelines'],
  },
  {
    resourceId: generateId(),
    title: 'Health Policy Analysis Framework',
    description: 'Framework for analyzing and evaluating health policies at local, state, and federal levels.',
    url: 'https://example.com/policy/framework',
    type: 'policy',
    tags: ['Health Policy', 'Analysis', 'Framework'],
  },
];
