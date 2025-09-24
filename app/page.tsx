'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@coinbase/minikit';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { ProfileCard } from '@/components/ProfileCard';
import { OpportunityListItem } from '@/components/OpportunityListItem';
import { CampaignCard } from '@/components/CampaignCard';
import { ResourceCard } from '@/components/ResourceCard';
import { SearchBar } from '@/components/ui/SearchBar';
import { Tag } from '@/components/ui/Tag';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { InFrameNotification } from '@/components/ui/InFrameNotification';
import { LoadingState, ListSkeleton } from '@/components/ui/LoadingState';
import { 
  EmptyState, 
  SearchEmptyState, 
  NetworkEmptyState, 
  OpportunitiesEmptyState,
  CampaignsEmptyState,
  ResourcesEmptyState 
} from '@/components/ui/EmptyState';
import { mockUsers, mockOpportunities, mockCampaigns, mockResources } from '@/lib/mock-data';
import { EXPERTISE_TAGS, INTEREST_TAGS } from '@/lib/constants';
import { Globe, Users as UsersIcon, BarChart3 } from 'lucide-react';

export default function HealthConnectApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [showProfileSheet, setShowProfileSheet] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'info' | 'warning';
    message: string;
  } | null>(null);

  const { context } = useMiniKit();

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Simulate search loading
  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Clear search when changing tabs
  useEffect(() => {
    setSearchQuery('');
    setSelectedFilters([]);
  }, [activeTab]);

  const showNotification = (type: 'success' | 'info' | 'warning', message: string) => {
    setNotification({ type, message });
  };

  // Filter data based on search and filters
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = searchQuery === '' || 
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.expertiseTags.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilters = selectedFilters.length === 0 ||
      selectedFilters.some(filter => user.expertiseTags.includes(filter) || user.interestsTags.includes(filter));
    
    return matchesSearch && matchesFilters;
  });

  const filteredOpportunities = mockOpportunities.filter(opportunity => {
    const matchesSearch = searchQuery === '' || 
      opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opportunity.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opportunity.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilters = selectedFilters.length === 0 || selectedFilters.includes('All') ||
      selectedFilters.some(filter => opportunity.type.toLowerCase().includes(filter.toLowerCase()));
    
    return matchesSearch && matchesFilters;
  });

  const filteredCampaigns = mockCampaigns.filter(campaign => {
    const matchesSearch = searchQuery === '' || 
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilters = selectedFilters.length === 0 || selectedFilters.includes('All') ||
      selectedFilters.some(filter => 
        filter.toLowerCase() === campaign.status.toLowerCase()
      );
    
    return matchesSearch && matchesFilters;
  });

  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilters = selectedFilters.length === 0 ||
      selectedFilters.some(filter => resource.type === filter.toLowerCase());
    
    return matchesSearch && matchesFilters;
  });

  const handleConnect = (userId: string) => {
    showNotification('success', 'Connection request sent successfully!');
  };

  const handleJoinCampaign = (campaignId: string) => {
    showNotification('success', 'Successfully joined the campaign!');
  };

  const handleApplyOpportunity = (opportunityId: string) => {
    showNotification('info', 'Redirecting to application page...');
  };

  const renderDashboard = () => (
    <div className="space-y-6" role="tabpanel" id="dashboard-panel" aria-labelledby="dashboard-tab">
      {/* Welcome Section */}
      <div className="gradient-primary text-white rounded-lg p-6 mx-4 -mt-2 animate-fade-in">
        <h2 className="text-xl font-semibold mb-2">
          Welcome to HealthConnect
        </h2>
        <p className="text-white/90 mb-4">
          Connect, advocate, and thrive in public health. Join a community of professionals making a difference.
        </p>
        
        {/* Feature Icons */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { icon: Globe, title: 'Global Health', subtitle: 'Global reach', delay: '0.1s' },
            { icon: UsersIcon, title: 'Community', subtitle: 'Engagement', delay: '0.2s' },
            { icon: BarChart3, title: 'Data Networks', subtitle: 'Data insights', delay: '0.3s' }
          ].map(({ icon: Icon, title, subtitle, delay }) => (
            <div 
              key={title}
              className="text-center animate-fade-in" 
              style={{ animationDelay: delay }}
            >
              <div className="bg-white/20 rounded-full p-4 mx-auto mb-2 w-16 h-16 flex items-center justify-center transition-transform duration-300 hover:scale-110">
                <Icon className="h-8 w-8 text-white" />
              </div>
              <p className="text-sm font-medium">{title}</p>
              <p className="text-xs text-white/80">{subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <h3 className="heading mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <PrimaryButton
            variant="outline"
            onClick={() => setActiveTab('connections')}
            className="h-12"
          >
            Find Connections
          </PrimaryButton>
          <PrimaryButton
            variant="outline"
            onClick={() => setActiveTab('opportunities')}
            className="h-12"
          >
            Browse Jobs
          </PrimaryButton>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <h3 className="heading mb-3">Featured Opportunities</h3>
        <div className="space-y-3">
          {mockOpportunities.slice(0, 2).map((opportunity, index) => (
            <div 
              key={opportunity.opportunityId}
              className="animate-fade-in"
              style={{ animationDelay: `${0.6 + index * 0.1}s` }}
            >
              <OpportunityListItem
                opportunity={opportunity}
                variant="featured"
                onApply={() => handleApplyOpportunity(opportunity.opportunityId)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Active Campaigns */}
      <div className="px-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
        <h3 className="heading mb-3">Active Campaigns</h3>
        <div className="space-y-3">
          {mockCampaigns.filter(c => c.status === 'active').slice(0, 2).map((campaign, index) => (
            <div 
              key={campaign.campaignId}
              className="animate-fade-in"
              style={{ animationDelay: `${0.9 + index * 0.1}s` }}
            >
              <CampaignCard
                campaign={campaign}
                onJoin={() => handleJoinCampaign(campaign.campaignId)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderConnections = () => (
    <div className="space-y-4" role="tabpanel" id="connections-panel" aria-labelledby="connections-tab">
      <div className="px-4">
        <SearchBar
          placeholder="Search professionals..."
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
      </div>
      
      {/* Expertise Filter Tags */}
      <div className="px-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {EXPERTISE_TAGS.slice(0, 5).map((tag) => (
            <Tag
              key={tag}
              label={tag}
              variant="filter"
              selected={selectedFilters.includes(tag)}
              onClick={() => {
                if (selectedFilters.includes(tag)) {
                  setSelectedFilters(selectedFilters.filter(f => f !== tag));
                } else {
                  setSelectedFilters([...selectedFilters, tag]);
                }
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="px-4">
        <h3 className="heading mb-3">
          {searchQuery ? `Search Results (${filteredUsers.length})` : 'Suggested Connections'}
        </h3>
        
        {isSearching ? (
          <ListSkeleton items={3} />
        ) : filteredUsers.length > 0 ? (
          <div className="space-y-3">
            {filteredUsers.map((user, index) => (
              <div 
                key={user.userId}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProfileCard
                  user={user}
                  onConnect={() => handleConnect(user.userId)}
                />
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <SearchEmptyState 
            query={searchQuery}
            onClear={() => setSearchQuery('')}
          />
        ) : (
          <NetworkEmptyState 
            onExplore={() => setSearchQuery('public health')}
          />
        )}
      </div>
    </div>
  );

  const renderOpportunities = () => (
    <div className="space-y-4" role="tabpanel" id="opportunities-panel" aria-labelledby="opportunities-tab">
      <div className="px-4">
        <SearchBar
          placeholder="Search opportunities..."
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
      </div>
      
      <div className="px-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {['All', 'Jobs', 'Internships', 'Projects'].map((filter) => (
            <Tag
              key={filter}
              label={filter}
              variant="filter"
              selected={selectedFilters.includes(filter)}
              onClick={() => {
                if (selectedFilters.includes(filter)) {
                  setSelectedFilters(selectedFilters.filter(f => f !== filter));
                } else {
                  setSelectedFilters([...selectedFilters, filter]);
                }
              }}
            />
          ))}
        </div>
        
        <h3 className="heading mb-3">
          {searchQuery ? `Opportunities (${filteredOpportunities.length})` : 'Available Opportunities'}
        </h3>
        
        {isSearching ? (
          <ListSkeleton items={4} />
        ) : filteredOpportunities.length > 0 ? (
          <div className="space-y-3">
            {filteredOpportunities.map((opportunity, index) => (
              <div 
                key={opportunity.opportunityId}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <OpportunityListItem
                  opportunity={opportunity}
                  onApply={() => handleApplyOpportunity(opportunity.opportunityId)}
                />
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <SearchEmptyState 
            query={searchQuery}
            onClear={() => setSearchQuery('')}
          />
        ) : (
          <OpportunitiesEmptyState 
            onBrowse={() => setSearchQuery('health')}
          />
        )}
      </div>
    </div>
  );

  const renderCampaigns = () => (
    <div className="space-y-4" role="tabpanel" id="campaigns-panel" aria-labelledby="campaigns-tab">
      <div className="px-4">
        <SearchBar
          placeholder="Search campaigns..."
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
      </div>
      
      <div className="px-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {['Active', 'Completed', 'All'].map((filter) => (
            <Tag
              key={filter}
              label={filter}
              variant="filter"
              selected={selectedFilters.includes(filter)}
              onClick={() => {
                if (selectedFilters.includes(filter)) {
                  setSelectedFilters(selectedFilters.filter(f => f !== filter));
                } else {
                  setSelectedFilters([...selectedFilters, filter]);
                }
              }}
            />
          ))}
        </div>
        
        <h3 className="heading mb-3">
          {searchQuery ? `Campaigns (${filteredCampaigns.length})` : 'Advocacy Campaigns'}
        </h3>
        
        {isSearching ? (
          <ListSkeleton items={3} />
        ) : filteredCampaigns.length > 0 ? (
          <div className="space-y-3">
            {filteredCampaigns.map((campaign, index) => (
              <div 
                key={campaign.campaignId}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CampaignCard
                  campaign={campaign}
                  variant={campaign.status === 'completed' ? 'completed' : 'active'}
                  onJoin={() => handleJoinCampaign(campaign.campaignId)}
                />
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <SearchEmptyState 
            query={searchQuery}
            onClear={() => setSearchQuery('')}
          />
        ) : (
          <CampaignsEmptyState 
            onCreate={() => showNotification('info', 'Campaign creation coming soon!')}
          />
        )}
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="space-y-4" role="tabpanel" id="resources-panel" aria-labelledby="resources-tab">
      <div className="px-4">
        <SearchBar
          placeholder="Search resources..."
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
      </div>
      
      <div className="px-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {['Data', 'Research', 'Policy', 'Education'].map((filter) => (
            <Tag
              key={filter}
              label={filter}
              variant="filter"
              selected={selectedFilters.includes(filter)}
              onClick={() => {
                if (selectedFilters.includes(filter)) {
                  setSelectedFilters(selectedFilters.filter(f => f !== filter));
                } else {
                  setSelectedFilters([...selectedFilters, filter]);
                }
              }}
            />
          ))}
        </div>
        
        <h3 className="heading mb-3">
          {searchQuery ? `Resources (${filteredResources.length})` : 'Resource Library'}
        </h3>
        
        {isSearching ? (
          <ListSkeleton items={4} />
        ) : filteredResources.length > 0 ? (
          <div className="space-y-3">
            {filteredResources.map((resource, index) => (
              <div 
                key={resource.resourceId}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ResourceCard
                  resource={resource}
                  onView={() => showNotification('info', 'Opening resource details...')}
                />
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <SearchEmptyState 
            query={searchQuery}
            onClear={() => setSearchQuery('')}
          />
        ) : (
          <ResourcesEmptyState 
            onExplore={() => setSearchQuery('public health data')}
          />
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'connections':
        return renderConnections();
      case 'opportunities':
        return renderOpportunities();
      case 'campaigns':
        return renderCampaigns();
      case 'resources':
        return renderResources();
      default:
        return renderDashboard();
    }
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'HealthConnect';
      case 'connections':
        return 'Professional Network';
      case 'opportunities':
        return 'Opportunities';
      case 'campaigns':
        return 'Advocacy Campaigns';
      case 'resources':
        return 'Resource Library';
      default:
        return 'HealthConnect';
    }
  };

  const getHeaderSubtitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Connect, Advocate, and Thrive in Public Health';
      case 'connections':
        return 'Build meaningful professional relationships';
      case 'opportunities':
        return 'Find your next public health role';
      case 'campaigns':
        return 'Take action on public health issues';
      case 'resources':
        return 'Access curated health information';
      default:
        return 'Connect, Advocate, and Thrive in Public Health';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg">
        <Header
          title="HealthConnect"
          subtitle="Loading your health community..."
          showProfile={false}
        />
        <main className="pb-20">
          <div className="px-4 pt-8">
            <LoadingState 
              size="lg" 
              text="Setting up your personalized experience..." 
              className="py-16"
            />
            <ListSkeleton items={3} className="mt-8" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header
        title={getHeaderTitle()}
        subtitle={getHeaderSubtitle()}
        onProfileClick={() => setShowProfileSheet(true)}
      />
      
      <main className="pb-20">
        {renderContent()}
      </main>
      
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <BottomSheet
        isOpen={showProfileSheet}
        onClose={() => setShowProfileSheet(false)}
        title="Profile Settings"
      >
        <div className="p-4">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-semibold text-accent">
                {context?.user?.displayName ? context.user.displayName.charAt(0) : 'U'}
              </span>
            </div>
            <h3 className="heading">
              {context?.user?.displayName || 'User Profile'}
            </h3>
            <p className="text-secondary-text">
              {context?.user?.username ? `@${context.user.username}` : 'Public Health Professional'}
            </p>
          </div>
          
          <div className="space-y-4">
            <PrimaryButton className="w-full">
              Edit Profile
            </PrimaryButton>
            <PrimaryButton variant="outline" className="w-full">
              Settings
            </PrimaryButton>
            <PrimaryButton variant="text" className="w-full">
              Help & Support
            </PrimaryButton>
          </div>
        </div>
      </BottomSheet>

      {notification && (
        <InFrameNotification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
