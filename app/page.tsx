'use client';

import { useState, useEffect } from 'react';
// Removed MiniKit dependency for local development
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
import { LoadingSpinner, LoadingSection } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProfileCardSkeleton, OpportunityCardSkeleton, CampaignCardSkeleton } from '@/components/ui/Skeleton';
import { mockUsers, mockOpportunities, mockCampaigns, mockResources } from '@/lib/mock-data';
import { EXPERTISE_TAGS, INTEREST_TAGS } from '@/lib/constants';
import { Globe, Users as UsersIcon, BarChart3, Search, Briefcase, Megaphone } from 'lucide-react';

export default function HealthConnectApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showProfileSheet, setShowProfileSheet] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{
    type: 'success' | 'info' | 'warning';
    message: string;
  } | null>(null);

  // Mock context for development
  const context = {
    user: {
      displayName: "Dr. Sarah Johnson",
      username: "sarah_health"
    }
  };

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const showNotification = (type: 'success' | 'info' | 'warning', message: string) => {
    setNotification({ type, message });
  };

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
    <div className="space-y-6 pb-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-primary to-primary-600 text-white rounded-xl p-6 mx-4 -mt-2 animate-fade-in">
        <h2 className="text-xl font-semibold mb-2">
          Welcome to HealthConnect
        </h2>
        <p className="text-white/90 mb-6">
          Connect, advocate, and thrive in public health. Join a community of professionals making a difference.
        </p>
        
        {/* Feature Icons */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white/20 rounded-full p-4 mx-auto mb-2 w-16 h-16 flex items-center justify-center hover-lift">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <p className="text-sm font-medium">Global Health</p>
            <p className="text-xs text-white/80">Global reach</p>
          </div>
          <div className="text-center animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white/20 rounded-full p-4 mx-auto mb-2 w-16 h-16 flex items-center justify-center hover-lift">
              <UsersIcon className="h-8 w-8 text-white" />
            </div>
            <p className="text-sm font-medium">Community</p>
            <p className="text-xs text-white/80">Engagement</p>
          </div>
          <div className="text-center animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <div className="bg-white/20 rounded-full p-4 mx-auto mb-2 w-16 h-16 flex items-center justify-center hover-lift">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <p className="text-sm font-medium">Data Networks</p>
            <p className="text-xs text-white/80">Data insights</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4">
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

      {/* Featured Opportunities */}
      <div className="px-4">
        <h3 className="heading mb-3">Featured Opportunities</h3>
        {isLoading ? (
          <div className="space-y-3">
            <OpportunityCardSkeleton />
            <OpportunityCardSkeleton />
          </div>
        ) : (
          <div className="space-y-3">
            {mockOpportunities.slice(0, 2).map((opportunity, index) => (
              <div key={opportunity.opportunityId} className="animate-fade-in" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
                <OpportunityListItem
                  opportunity={opportunity}
                  variant="featured"
                  onApply={() => handleApplyOpportunity(opportunity.opportunityId)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Campaigns */}
      <div className="px-4">
        <h3 className="heading mb-3">Active Campaigns</h3>
        {isLoading ? (
          <div className="space-y-3">
            <CampaignCardSkeleton />
            <CampaignCardSkeleton />
          </div>
        ) : (
          <div className="space-y-3">
            {mockCampaigns.filter(c => c.status === 'active').slice(0, 2).map((campaign, index) => (
              <div key={campaign.campaignId} className="animate-fade-in" style={{ animationDelay: `${0.6 + index * 0.1}s` }}>
                <CampaignCard
                  campaign={campaign}
                  onJoin={() => handleJoinCampaign(campaign.campaignId)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderConnections = () => {
    const filteredUsers = mockUsers.filter(user => 
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.expertiseTags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
      <div className="space-y-4 pb-6">
        <div className="px-4">
          <SearchBar
            placeholder="Search professionals..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
        
        <div className="px-4">
          <h3 className="heading mb-3">
            {searchQuery ? `Search Results (${filteredUsers.length})` : 'Suggested Connections'}
          </h3>
          
          {isLoading ? (
            <div className="space-y-3">
              <ProfileCardSkeleton />
              <ProfileCardSkeleton />
              <ProfileCardSkeleton />
            </div>
          ) : filteredUsers.length === 0 ? (
            <EmptyState
              icon={<Search className="h-8 w-8 text-secondary-text" />}
              title={searchQuery ? "No professionals found" : "No connections yet"}
              description={searchQuery ? "Try adjusting your search terms or browse our suggested connections." : "Start building your professional network by connecting with public health experts."}
              action={searchQuery ? {
                label: "Clear Search",
                onClick: () => setSearchQuery('')
              } : {
                label: "Explore Opportunities",
                onClick: () => setActiveTab('opportunities')
              }}
            />
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((user, index) => (
                <div key={user.userId} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProfileCard
                    user={user}
                    onConnect={() => handleConnect(user.userId)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderOpportunities = () => {
    const filteredOpportunities = mockOpportunities.filter(opportunity => {
      const matchesSearch = opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opportunity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opportunity.organization.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilters = selectedFilters.length === 0 || 
        selectedFilters.includes('All') ||
        selectedFilters.some(filter => 
          filter.toLowerCase() === opportunity.type ||
          (filter === 'Jobs' && opportunity.type === 'job') ||
          (filter === 'Internships' && opportunity.type === 'internship') ||
          (filter === 'Projects' && opportunity.type === 'project')
        );
      
      return matchesSearch && matchesFilters;
    });

    return (
      <div className="space-y-4 pb-6">
        <div className="px-4">
          <SearchBar
            placeholder="Search opportunities..."
            value={searchQuery}
            onChange={setSearchQuery}
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
            Opportunities ({filteredOpportunities.length})
          </h3>
          
          {isLoading ? (
            <div className="space-y-3">
              <OpportunityCardSkeleton />
              <OpportunityCardSkeleton />
              <OpportunityCardSkeleton />
            </div>
          ) : filteredOpportunities.length === 0 ? (
            <EmptyState
              icon={<Briefcase className="h-8 w-8 text-secondary-text" />}
              title="No opportunities found"
              description="No opportunities match your current search and filters. Try adjusting your criteria or check back later for new postings."
              action={{
                label: "Clear Filters",
                onClick: () => {
                  setSearchQuery('');
                  setSelectedFilters([]);
                }
              }}
            />
          ) : (
            <div className="space-y-3">
              {filteredOpportunities.map((opportunity, index) => (
                <div key={opportunity.opportunityId} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <OpportunityListItem
                    opportunity={opportunity}
                    onApply={() => handleApplyOpportunity(opportunity.opportunityId)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCampaigns = () => {
    const filteredCampaigns = mockCampaigns.filter(campaign => {
      const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.goal.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilters = selectedFilters.length === 0 || 
        selectedFilters.includes('All') ||
        selectedFilters.some(filter => 
          filter.toLowerCase() === campaign.status ||
          (filter === 'Active' && campaign.status === 'active') ||
          (filter === 'Completed' && campaign.status === 'completed')
        );
      
      return matchesSearch && matchesFilters;
    });

    return (
      <div className="space-y-4 pb-6">
        <div className="px-4">
          <SearchBar
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
        
        <div className="px-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {['All', 'Active', 'Completed'].map((filter) => (
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
            Campaigns ({filteredCampaigns.length})
          </h3>
          
          {isLoading ? (
            <div className="space-y-3">
              <CampaignCardSkeleton />
              <CampaignCardSkeleton />
              <CampaignCardSkeleton />
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <EmptyState
              icon={<Megaphone className="h-8 w-8 text-secondary-text" />}
              title="No campaigns found"
              description="No campaigns match your current search and filters. Join the movement and start advocating for public health issues that matter to you."
              action={{
                label: "Clear Filters",
                onClick: () => {
                  setSearchQuery('');
                  setSelectedFilters([]);
                }
              }}
            />
          ) : (
            <div className="space-y-3">
              {filteredCampaigns.map((campaign, index) => (
                <div key={campaign.campaignId} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CampaignCard
                    campaign={campaign}
                    variant={campaign.status === 'completed' ? 'completed' : 'active'}
                    onJoin={() => handleJoinCampaign(campaign.campaignId)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderResources = () => (
    <div className="space-y-4">
      <div className="px-4">
        <SearchBar
          placeholder="Search resources..."
          value={searchQuery}
          onChange={setSearchQuery}
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
        
        <div className="space-y-3">
          {mockResources.map((resource) => (
            <ResourceCard
              key={resource.resourceId}
              resource={resource}
              onView={() => showNotification('info', 'Opening resource details...')}
            />
          ))}
        </div>
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

  return (
    <div className="min-h-screen bg-bg">
      <Header
        title={getHeaderTitle()}
        subtitle={getHeaderSubtitle()}
        onProfileClick={() => setShowProfileSheet(true)}
      />
      
      <main className="pb-24 max-w-2xl mx-auto">
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
