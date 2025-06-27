import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Globe, Check, Crown, Copy, ExternalLink } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { useSubscription } from '@/hooks/useSubscription';

interface CustomDomainProps {
  userId: string;
  username?: string;
  roastId?: string;
}

interface CustomDomain {
  id: string;
  subdomain: string;
  username: string;
  status: 'active' | 'pending' | 'inactive';
  created_at: string;
  ssl_enabled: boolean;
  roast_id?: string;
}

export const CustomDomain: React.FC<CustomDomainProps> = ({ 
  userId, 
  username = '', 
  roastId 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [customUsername, setCustomUsername] = useState(username);
  const [domains, setDomains] = useState<CustomDomain[]>([]);
  const { toast } = useToast();
  const { hasFeatureAccess, getSubscriptionStatus } = useSubscription();
  const subscriptionStatus = getSubscriptionStatus();
  const canUseFeature = (feature: string) => hasFeatureAccess(feature);

  useEffect(() => {
    if (isOpen) {
      fetchDomains();
    }
  }, [isOpen, userId]);

  const fetchDomains = async () => {
    try {
      const response = await fetch(`/.netlify/functions/ionos?userId=${userId}`);
      const data = await response.json();
      
      if (response.ok) {
        setDomains(data.domains);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error fetching domains:', error);
      toast({
        title: "Error",
        description: "Failed to load custom domains",
        variant: "destructive"
      });
    }
  };

  const handleCreateDomain = async () => {
    if (!customUsername.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a username for your custom domain",
        variant: "destructive"
      });
      return;
    }

    if (!canUseFeature('custom_domains')) {
      toast({
        title: "Premium Feature",
        description: "Custom domains are available for Premium and Enterprise users",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch('/.netlify/functions/ionos/create-subdomain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          username: customUsername.trim(),
          roastId
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "🌐 Custom Domain Created!",
          description: `Your domain ${data.subdomain} is now live`,
        });
        
        // Refresh domains list
        await fetchDomains();
        
        // Reset form
        setCustomUsername('');
      } else {
        throw new Error(data.error || 'Failed to create domain');
      }
    } catch (error) {
      console.error('Domain creation error:', error);
      toast({
        title: "Creation Failed",
        description: error instanceof Error ? error.message : "Unable to create custom domain",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Domain URL copied to clipboard",
    });
  };

  const openDomain = (subdomain: string) => {
    window.open(`https://${subdomain}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white border-purple-500"
        >
          <Globe className="w-4 h-4" />
          Custom Domain
          {subscriptionStatus.tier === 'free' && <Crown className="w-3 h-3" />}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-500" />
            Custom Domain Setup
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Feature Badge */}
          {subscriptionStatus.tier === 'free' && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-purple-700">
                <Crown className="w-4 h-4" />
                <span className="font-medium">Premium Feature</span>
              </div>
              <p className="text-sm text-purple-600 mt-1">
                Custom domains are available for Premium and Enterprise subscribers
              </p>
            </div>
          )}

          {/* Domain Creator */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Create Your Domain</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Choose Your Username</Label>
                <div className="flex gap-2">
                  <Input
                    id="username"
                    value={customUsername}
                    onChange={(e) => setCustomUsername(e.target.value)}
                    placeholder="yourname"
                    className="flex-1"
                  />
                  <div className="flex items-center text-sm text-gray-500 whitespace-nowrap">
                    .roastme.io
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Preview: {customUsername ? `${customUsername.toLowerCase().replace(/[^a-z0-9]/g, '')}.roastme.io` : 'yourname.roastme.io'}
                </p>
              </div>

              <Button
                onClick={handleCreateDomain}
                disabled={isCreating || !customUsername.trim() || !canUseFeature('custom_domains')}
                className="w-full bg-purple-500 hover:bg-purple-600"
              >
                {isCreating ? 'Creating Domain...' : 'Create Custom Domain'}
              </Button>
            </CardContent>
          </Card>

          {/* Existing Domains */}
          {domains.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Domains</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {domains.map((domain) => (
                    <div
                      key={domain.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{domain.subdomain}</span>
                          {domain.ssl_enabled && (
                            <Check className="w-4 h-4 text-green-500" />
                          )}
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            domain.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {domain.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Created {new Date(domain.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(`https://${domain.subdomain}`)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDomain(domain.subdomain)}
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* IONOS Features */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-500 rounded-full p-1">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">Powered by IONOS</h4>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• SSL certificates included</li>
                    <li>• 99.9% uptime guarantee</li>
                    <li>• Global CDN distribution</li>
                    <li>• Professional domain management</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Close
            </Button>
            {subscriptionStatus.tier === 'free' && (
              <Button
                onClick={() => window.open('/pricing', '_blank')}
                className="flex-1 bg-purple-500 hover:bg-purple-600"
              >
                Upgrade Now
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};