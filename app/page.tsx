'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
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
import { PaymentModal } from '@/components/ui/PaymentModal';
import { mockUsers, mockOpportunities, mockCampaigns, mockResources } from '@/lib/mock-data';
import { EXPERTISE_TAGS, INTEREST_TAGS } from '@/lib/constants';
import { createX402Client, PaymentProof } from '@/lib/x402-client';
import { Globe, Users as UsersIcon, BarChart3, Lock, Sparkles } from 'lucide-react';

export default function HealthConnectApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showProfileSheet, setShowProfileSheet] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [premiumData, setPremiumData] = useState<any>(null);
  const [hasPaidAccess, setHasPaidAccess] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'info' | 'warning';
    message: string;
  } | null>(null);

  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const showNotification = (type: 'success' | 'info' | 'warning', message: string) => {
    setNotification({ type, message });
  };

  const handleAccessPremiumData = async () => {
    if (!walletClient) {
      setShowPaymentModal(true);
      return;
    }

    try {
      const x402Client = createX402Client(walletClient);
      const response = await x402Client.makeRequest({
        method: 'GET',
        url: '/api/premium-data',
      });
      
      setPremiumData(response.data);
      setHasPaidAccess(true);
      showNotification('success', 'Premium data access granted!');
    } catch (error: any) {
      if (error.response?.status === 402) {
        setShowPaymentModal(true);
      } else {
        showNotification('warning', 'Failed to access premium data');
      }
    }
  };

  const handlePaymentComplete = async (paymentProof: PaymentProof) => {
    try {
      const x402Client = createX402Client(walletClient);
      const response = await x402Client.makeRequest({
        method: 'GET',
        url: '/api/premium-data',
        headers: {
          'X-Payment-Proof': JSON.stringify(paymentProof)
        }
      });
      
      setPremiumData(response.data);
      setHasPaidAccess(true);
      setShowPaymentModal(false);
      showNotification('success', 'Payment confirmed! Premium data unlocked.');
    } catch (error) {
      showNotification('warning', 'Failed to verify payment');
    }
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

      {/* Premium Data Section */}
      <div className="px-4">
        <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-4 border border-accent/20">
          <div className="flex items-start gap-3">
            <div className="bg-accent/20 rounded-full p-2">
              {hasPaidAccess ? (
                <Sparkles className="w-5 h-5 text-accent" />
              ) : (
                <Lock className="w-5 h-5 text-accent" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-accent mb-1">
                {hasPaidAccess ? 'Premium Data Unlocked' : 'Premium Health Analytics'}
              </h3>
              <p className="text-sm text-secondary-text mb-3">
                {hasPaidAccess 
                  ? 'Access advanced health metrics and exclusive research insights.'
                  : 'Unlock advanced global health metrics, disease burden analytics, and exclusive research insights for 1 USDC.'
                }
              </p>
              {!hasPaidAccess && (
                <PrimaryButton
                  onClick={handleAccessPremiumData}
                  className="text-sm h-8 px-4"
                >
                  {isConnected ? 'Access Premium Data' : 'Connect Wallet & Pay'}
                </PrimaryButton>
              )}
              {hasPaidAccess && premiumData && (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-accent">Available Insights:</div>
                  <div className="text-xs text-secondary-text">
                    • Global Disease Burden Analytics<br/>
                    • Emerging Infectious Disease Predictions<br/>
                    • Mental Health Economic Impact Data
                  </div>
                </div>
              )}
            </div>
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
                U
              </span>
            </div>
            <h3 className="heading">
              User Profile
            </h3>
            <p className="text-secondary-text">
              Public Health Professional
            </p>
          </div>

          {/* Wallet Connection Status */}
          <div className="mb-6 p-3 bg-surface border border-border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Wallet Status</span>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            </div>
            {isConnected ? (
              <div>
                <p className="text-xs text-secondary-text">Connected</p>
                <p className="text-xs font-mono text-secondary-text mt-1">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
                </p>
                {hasPaidAccess && (
                  <p className="text-xs text-accent mt-1">✓ Premium Access</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-secondary-text">Not connected</p>
            )}
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
        onPaymentComplete={handlePaymentComplete}
        paymentDetails={{
          amount: '1.0',
          description: 'Access to premium health analytics and exclusive research insights',
          recipient: '0x742d35Cc8b4a6480D2d5f27b5BF0b8d4C2a71B79'
        }}
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
