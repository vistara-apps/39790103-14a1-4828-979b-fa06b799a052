// User Types
export interface User {
  userId: string;
  displayName: string;
  username?: string;
  bio: string;
  expertiseTags: string[];
  interestsTags: string[];
  location: string;
  profileImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Connection Types
export interface Connection {
  connectionId: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: Date;
}

// Opportunity Types
export interface Opportunity {
  opportunityId: string;
  title: string;
  description: string;
  type: 'job' | 'internship' | 'project';
  location: string;
  organization: string;
  applyUrl: string;
  postedAt: Date;
  expiryDate: Date;
  tags: string[];
}

// Campaign Types
export interface Campaign {
  campaignId: string;
  title: string;
  description: string;
  goal: string;
  callToAction: string;
  startDate: Date;
  endDate: Date;
  creatorUserId: string;
  status: 'active' | 'completed' | 'cancelled';
  participantCount?: number;
}

// Resource Types
export interface Resource {
  resourceId: string;
  title: string;
  description: string;
  url: string;
  type: 'data' | 'research' | 'policy' | 'education';
  tags: string[];
}

// UI Component Props
export interface ProfileCardProps {
  user: User;
  variant?: 'default' | 'compact';
  onConnect?: () => void;
}

export interface OpportunityListItemProps {
  opportunity: Opportunity;
  variant?: 'default' | 'featured';
  onApply?: () => void;
}

export interface CampaignCardProps {
  campaign: Campaign;
  variant?: 'active' | 'completed';
  onJoin?: () => void;
}

export interface ResourceCardProps {
  resource: Resource;
  variant?: 'default' | 'news';
  onView?: () => void;
}

export interface TagProps {
  label: string;
  variant?: 'default' | 'filter';
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
}

export interface NotificationProps {
  type: 'success' | 'info' | 'warning';
  message: string;
  onClose?: () => void;
}
