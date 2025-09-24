'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
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
import PaymentModal from '@/components/PaymentModal';
import { mockUsers, mockOpportunities, mockCampaigns, mockResources } from '@/lib/mock-data';
import { EXPERTISE_TAGS, INTEREST_TAGS } from '@/lib/constants';
import { Globe, Users as UsersIcon, BarChart3, Crown } from 'lucide-react';

export default function HealthConnectApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showProfileSheet, setShowProfileSheet] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [premiumData, setPremiumData] = useState<any>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'info' | 'warning';
    message: string;
  } | null>(null);

  const { isConnected } = useAccount();

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

  const handlePremiumAccess = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (data: any) => {
    setPremiumData(data.data);
    setShowPaymentModal(false);
    showNotification('success', 'Premium content unlocked successfully!');
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

      {/* Premium Health Insights */}
      <div className="px-4">
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg p-6">
          <div className="flex items-center mb-3">
            <Crown className="w-6 h-6 mr-2" />
            <h3 className="text-lg font-semibold">Premium Health Insights</h3>
          </div>
          <p className="text-white/90 mb-4">
            Get personalized health recommendations, specialist referrals, and advanced analytics.
          </p>
          
          {premiumData ? (
            <div className="space-y-4">
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-semibold mb-2">✨ Premium Content Unlocked</h4>
                <p className="text-sm text-white/80 mb-3">
                  Specialist Recommendations: {premiumData.specialistRecommendations?.length || 0} found
                </p>
                <p className="text-sm text-white/80 mb-3">
                  Risk Analysis: {premiumData.advancedAnalytics?.riskFactors?.length || 0} factors analyzed
                </p>
                <p className="text-sm text-white/80">
                  Personalized Plan: Complete wellness roadmap available
                </p>
              </div>
              <PrimaryButton
                variant="outline"
                className="w-full border-white text-white hover:bg-white hover:text-purple-600"
                onClick={() => {
                  // In a real app, this would navigate to detailed premium content
                  showNotification('info', 'Viewing detailed premium health insights...');
                }}
              >
                View Full Report
              </PrimaryButton>
            </div>
          ) : (
            <div>
              <div className="text-sm text-white/80 mb-4">
                💰 5 USDC • 🔗 Base Network
              </div>
              <PrimaryButton
                variant="outline"
                className="w-full border-white text-white hover:bg-white hover:text-purple-600"
                onClick={handlePremiumAccess}
              >
                {isConnected ? 'Unlock Premium Content' : 'Connect Wallet & Unlock'}
              </PrimaryButton>
            </div>
          )}
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
                {isConnected ? 'W' : 'U'}
              </span>
            </div>
            <h3 className="heading">
              User Profile
            </h3>
            <p className="text-secondary-text">
              {isConnected ? 'Wallet Connected' : 'Public Health Professional'}
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

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
      />

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
