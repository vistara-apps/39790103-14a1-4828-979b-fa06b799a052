'use client';

import { useState, useEffect } from 'react';
// MiniKit integration temporarily removed for development
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
import { LoadingState, ProfileCardSkeleton, OpportunityCardSkeleton, CampaignCardSkeleton } from '@/components/ui/LoadingState';
import { EmptyState, SearchEmptyState, NetworkEmptyState } from '@/components/ui/EmptyState';
import { mockUsers, mockOpportunities, mockCampaigns, mockResources } from '@/lib/mock-data';
import { EXPERTISE_TAGS, INTEREST_TAGS } from '@/lib/constants';
import { Globe, Users as UsersIcon, BarChart3, Briefcase } from 'lucide-react';

export default function HealthConnectApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showProfileSheet, setShowProfileSheet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'info' | 'warning';
    message: string;
  } | null>(null);

  // MiniKit context temporarily removed for development

  const showNotification = (type: 'success' | 'info' | 'warning', message: string) => {
    setNotification({ type, message });
  };

  // Simulate loading for better UX
  const simulateLoading = async (duration: number = 1000) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, duration));
    setLoading(false);
  };

  const simulateSearchLoading = async (duration: number = 500) => {
    setSearchLoading(true);
    await new Promise(resolve => setTimeout(resolve, duration));
    setSearchLoading(false);
  };

  const handleConnect = async (userId: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setLoading(false);
    showNotification('success', 'Connection request sent successfully!');
  };

  const handleJoinCampaign = async (campaignId: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    setLoading(false);
    showNotification('success', 'Successfully joined the campaign!');
  };

  const handleApplyOpportunity = async (opportunityId: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    showNotification('info', 'Redirecting to application page...');
  };

  const handleSearch = async (query: string) => {
    if (query.trim()) {
      await simulateSearchLoading();
      setSearchQuery(query);
    }
  };

  // Simulate tab change loading
  const handleTabChange = async (tab: string) => {
    if (tab !== activeTab) {
      await simulateLoading(300);
      setActiveTab(tab);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="gradient-primary text-primary-foreground rounded-lg p-6 mx-4 -mt-2 glow-hover">
        <h2 className="text-xl font-semibold mb-2 animate-slide-in-left">
          Welcome to HealthConnect
        </h2>
        <p className="text-primary-foreground/90 mb-4 animate-slide-in-left" style={{animationDelay: '0.1s'}}>
          Connect, advocate, and thrive in public health. Join a community of professionals making a difference.
        </p>
        
        {/* Feature Icons */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { icon: Globe, title: 'Global Health', subtitle: 'Global reach', delay: '0.2s' },
            { icon: UsersIcon, title: 'Community', subtitle: 'Engagement', delay: '0.3s' },
            { icon: BarChart3, title: 'Data Networks', subtitle: 'Data insights', delay: '0.4s' }
          ].map((feature, index) => (
            <div key={index} className="text-center animate-scale-in" style={{animationDelay: feature.delay}}>
              <div className="bg-primary-foreground/20 hover:bg-primary-foreground/30 rounded-full p-4 mx-auto mb-2 w-16 h-16 flex items-center justify-center transition-all duration-200 hover:scale-110">
                <feature.icon className="h-8 w-8 text-primary-foreground" />
              </div>
              <p className="text-sm font-medium">{feature.title}</p>
              <p className="text-xs text-primary-foreground/80">{feature.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 animate-slide-up" style={{animationDelay: '0.5s'}}>
        <h3 className="heading mb-3 text-foreground">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <PrimaryButton
            variant="outline"
            onClick={() => setActiveTab('connections')}
            className="h-12 group"
          >
            <UsersIcon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
            Find Connections
          </PrimaryButton>
          <PrimaryButton
            variant="outline"
            onClick={() => setActiveTab('opportunities')}
            className="h-12 group"
          >
            <Briefcase className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
            Browse Jobs
          </PrimaryButton>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4">
        <h3 className="heading mb-3">Featured Opportunities</h3>
        <div className="space-y-3">
          {mockOpportunities.slice(0, 2).map((opportunity) => (
            <OpportunityListItem
              key={opportunity.opportunityId}
              opportunity={opportunity}
              variant="featured"
              onApply={() => handleApplyOpportunity(opportunity.opportunityId)}
            />
          ))}
        </div>
      </div>

      {/* Active Campaigns */}
      <div className="px-4">
        <h3 className="heading mb-3">Active Campaigns</h3>
        <div className="space-y-3">
          {mockCampaigns.filter(c => c.status === 'active').slice(0, 2).map((campaign) => (
            <CampaignCard
              key={campaign.campaignId}
              campaign={campaign}
              onJoin={() => handleJoinCampaign(campaign.campaignId)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderConnections = () => {
    const filteredUsers = searchQuery 
      ? mockUsers.filter(user => 
          user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.expertiseTags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : mockUsers;

    return (
      <div className="space-y-4 animate-fade-in">
        <div className="px-4">
          <SearchBar
            placeholder="Search professionals..."
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearch}
            loading={searchLoading}
            onClear={() => setSearchQuery('')}
          />
        </div>
        
        <div className="px-4">
          <h3 className="heading mb-3 text-foreground">
            {searchQuery ? `Search Results (${filteredUsers.length})` : 'Suggested Connections'}
          </h3>
          
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <ProfileCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="space-y-3">
              {filteredUsers.map((user, index) => (
                <div key={user.userId} className="animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
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
              onExplore={() => showNotification('info', 'Exploring more professionals...')}
            />
          )}
        </div>
      </div>
    );
  };

  const renderOpportunities = () => {
    const filteredOpportunities = mockOpportunities.filter(opportunity => {
      const matchesSearch = !searchQuery || 
        opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opportunity.organization.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilters = selectedFilters.length === 0 || 
        selectedFilters.includes('All') ||
        selectedFilters.some(filter => 
          opportunity.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
        );
      
      return matchesSearch && matchesFilters;
    });

    return (
      <div className="space-y-4 animate-fade-in">
        <div className="px-4">
          <SearchBar
            placeholder="Search opportunities..."
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearch}
            loading={searchLoading}
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
          
          <h3 className="heading mb-3 text-foreground">
            {searchQuery || selectedFilters.length > 0 
              ? `Filtered Results (${filteredOpportunities.length})`
              : 'All Opportunities'
            }
          </h3>
          
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <OpportunityCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredOpportunities.length > 0 ? (
            <div className="space-y-3">
              {filteredOpportunities.map((opportunity, index) => (
                <div key={opportunity.opportunityId} className="animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <OpportunityListItem
                    opportunity={opportunity}
                    onApply={() => handleApplyOpportunity(opportunity.opportunityId)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              variant="opportunities"
              title="No opportunities found"
              description={searchQuery ? "Try adjusting your search terms or filters." : "New opportunities will appear here when available."}
              action={{
                label: "Clear filters",
                onClick: () => {
                  setSearchQuery('');
                  setSelectedFilters([]);
                }
              }}
            />
          )}
        </div>
      </div>
    );
  };

  const renderCampaigns = () => (
    <div className="space-y-4">
      <div className="px-4">
        <SearchBar
          placeholder="Search campaigns..."
          value={searchQuery}
          onChange={setSearchQuery}
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
        
        <div className="space-y-3">
          {mockCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.campaignId}
              campaign={campaign}
              variant={campaign.status === 'completed' ? 'completed' : 'active'}
              onJoin={() => handleJoinCampaign(campaign.campaignId)}
            />
          ))}
        </div>
      </div>
    </div>
  );

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
    <div className="min-h-screen bg-background text-foreground">
      <Header
        title={getHeaderTitle()}
        subtitle={getHeaderSubtitle()}
        onProfileClick={() => setShowProfileSheet(true)}
      />
      
      <main className="pb-20 pt-2">
        {loading && activeTab !== 'dashboard' ? (
          <div className="px-4 pt-8">
            <LoadingState text="Loading content..." />
          </div>
        ) : (
          renderContent()
        )}
      </main>
      
      <Navigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
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
                JD
              </span>
            </div>
            <h3 className="heading">
              Dr. Jane Smith
            </h3>
            <p className="text-text-secondary">
              @janesmith_ph
            </p>
          </div>
          
          <div className="space-y-4">
            <PrimaryButton className="w-full">
              Edit Profile
            </PrimaryButton>
            <PrimaryButton variant="outline" className="w-full">
              Settings
            </PrimaryButton>
            <PrimaryButton variant="ghost" className="w-full">
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
