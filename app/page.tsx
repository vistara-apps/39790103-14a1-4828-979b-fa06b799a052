'use client';

import { useState, useEffect } from 'react';
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
import { PaymentFlow } from '@/components/PaymentFlow';
import { PaymentTestUtils } from '@/components/PaymentTestUtils';
import { mockUsers, mockOpportunities, mockCampaigns, mockResources } from '@/lib/mock-data';
import { EXPERTISE_TAGS, INTEREST_TAGS } from '@/lib/constants';
import { Globe, Users as UsersIcon, BarChart3 } from 'lucide-react';

export default function HealthConnectApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showProfileSheet, setShowProfileSheet] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'info' | 'warning';
    message: string;
  } | null>(null);
  const [showPaymentFlow, setShowPaymentFlow] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    amount: '10',
    description: 'Premium Feature Access'
  });
  const [showTestUtils, setShowTestUtils] = useState(false);

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
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-primary text-white rounded-lg p-6 mx-4 -mt-2">
        <h2 className="text-xl font-semibold mb-2">
          Welcome to HealthConnect
        </h2>
        <p className="text-white/90 mb-4">
          Connect, advocate, and thrive in public health. Join a community of professionals making a difference.
        </p>
        
        {/* Feature Icons */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="bg-white/20 rounded-full p-4 mx-auto mb-2 w-16 h-16 flex items-center justify-center">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <p className="text-sm font-medium">Global Health</p>
            <p className="text-xs text-white/80">Global reach</p>
          </div>
          <div className="text-center">
            <div className="bg-white/20 rounded-full p-4 mx-auto mb-2 w-16 h-16 flex items-center justify-center">
              <UsersIcon className="h-8 w-8 text-white" />
            </div>
            <p className="text-sm font-medium">Community</p>
            <p className="text-xs text-white/80">Engagement</p>
          </div>
          <div className="text-center">
            <div className="bg-white/20 rounded-full p-4 mx-auto mb-2 w-16 h-16 flex items-center justify-center">
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

      {/* Premium Features - X402 Payment Demo */}
      <div className="px-4">
        <h3 className="heading mb-3">Premium Features</h3>
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 border border-primary/20">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="font-semibold text-primary mb-1">Advanced Analytics</h4>
              <p className="text-secondary-text text-sm">
                Get detailed insights into your network growth, campaign performance, and professional impact.
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-accent">10 USDC</div>
              <div className="text-xs text-secondary-text">per month</div>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Real-time network analytics</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Campaign performance metrics</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Professional impact scoring</span>
            </div>
          </div>

          <PrimaryButton
            onClick={() => {
              setPaymentDetails({
                amount: '10',
                description: 'Advanced Analytics - Monthly Subscription'
              });
              setShowPaymentFlow(true);
            }}
            className="w-full"
          >
            Subscribe with USDC
          </PrimaryButton>
        </div>

        <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-4 border border-accent/20 mt-3">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="font-semibold text-accent mb-1">Priority Support</h4>
              <p className="text-secondary-text text-sm">
                Get priority customer support and direct access to our health experts.
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary">5 USDC</div>
              <div className="text-xs text-secondary-text">one-time</div>
            </div>
          </div>

          <PrimaryButton
            variant="outline"
            onClick={() => {
              setPaymentDetails({
                amount: '5',
                description: 'Priority Support Access'
              });
              setShowPaymentFlow(true);
            }}
            className="w-full"
          >
            Get Priority Support
          </PrimaryButton>
        </div>
      </div>
    </div>
  );

  const renderConnections = () => (
    <div className="space-y-4">
      <div className="px-4">
        <SearchBar
          placeholder="Search professionals..."
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </div>
      
      <div className="px-4">
        <h3 className="heading mb-3">Suggested Connections</h3>
        <div className="space-y-3">
          {mockUsers.map((user) => (
            <ProfileCard
              key={user.userId}
              user={user}
              onConnect={() => handleConnect(user.userId)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderOpportunities = () => (
    <div className="space-y-4">
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
        
        <div className="space-y-3">
          {mockOpportunities.map((opportunity) => (
            <OpportunityListItem
              key={opportunity.opportunityId}
              opportunity={opportunity}
              onApply={() => handleApplyOpportunity(opportunity.opportunityId)}
            />
          ))}
        </div>
      </div>
    </div>
  );

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
    <div className="min-h-screen bg-bg">
      <Header
        title={getHeaderTitle()}
        subtitle={getHeaderSubtitle()}
        onProfileClick={() => setShowProfileSheet(true)}
        onTestClick={() => setShowTestUtils(true)}
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
              <span className="text-2xl font-semibold text-accent">U</span>
            </div>
            <h3 className="heading">User Profile</h3>
            <p className="text-secondary-text">Public Health Professional</p>
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

      <PaymentFlow
        isOpen={showPaymentFlow}
        onClose={() => setShowPaymentFlow(false)}
        amount={paymentDetails.amount}
        description={paymentDetails.description}
      />

      <PaymentTestUtils
        isOpen={showTestUtils}
        onClose={() => setShowTestUtils(false)}
      />
    </div>
  );
}
