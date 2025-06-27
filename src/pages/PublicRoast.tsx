import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Volume2, Heart, Globe, Crown } from 'lucide-react';
import { useRoasts, Roast } from '@/hooks/useRoasts';

const personalityMap = {
  gordon_ramsay: { name: 'Gordon Ramsay', icon: '👨‍🍳', color: 'from-red-500 to-orange-500' },
  simon_cowell: { name: 'Simon Cowell', icon: '🎤', color: 'from-purple-500 to-pink-500' },
  gordon_gekko: { name: 'Gordon Gekko', icon: '💼', color: 'from-green-500 to-emerald-500' },
  sherlock_holmes: { name: 'Sherlock Holmes', icon: '🔍', color: 'from-blue-500 to-indigo-500' }
};

export function PublicRoast() {
  const { subdomain, roastId } = useParams();
  const { getRoast } = useRoasts();
  const [roast, setRoast] = useState<Roast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublicRoast = async () => {
      if (!roastId) return;
      
      try {
        // In a real implementation, this would fetch via custom domain
        const roastData = await getRoast(roastId);
        if (roastData && roastData.is_public) {
          setRoast(roastData);
        } else {
          setError('Roast not found or not public');
        }
      } catch (error) {
        setError('Failed to load roast');
        console.error('Error fetching public roast:', error);
      }
      
      setLoading(false);
    };

    fetchPublicRoast();
  }, [roastId, getRoast]);

  const playVoice = () => {
    if (roast?.voice_url) {
      const audio = new Audio(roast.voice_url);
      audio.play();
    }
  };

  const shareRoast = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `AI Roast by ${personalityMap[roast!.personality].name}`,
        text: roast!.roast_text.substring(0, 100) + '...',
        url
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !roast) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="text-center p-8">
            <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Roast Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'This roast may be private or no longer available.'}</p>
            <Button 
              onClick={() => window.location.href = 'https://ai-roast-generator.netlify.app'}
              className="bg-purple-500 hover:bg-purple-600"
            >
              Create Your Own Roast
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const personality = personalityMap[roast.personality];
  const customDomain = subdomain ? `${subdomain}.roastme.io` : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${personality.color} flex items-center justify-center text-white font-bold`}>
                {personality.icon}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">AI Roast Generator</h1>
                {customDomain && (
                  <p className="text-sm text-purple-600 flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    {customDomain}
                  </p>
                )}
              </div>
            </div>
            <Button
              onClick={() => window.location.href = 'https://ai-roast-generator.netlify.app'}
              className="bg-purple-500 hover:bg-purple-600"
            >
              Get Your Roast
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Roast Card */}
          <Card className="border-2 border-gray-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-3">
                  <span className="text-3xl">{personality.icon}</span>
                  <div>
                    <span className="text-2xl font-bold">{personality.name}</span>
                    <p className="text-sm text-gray-500 font-normal">says...</p>
                  </div>
                </span>
                <div className="flex space-x-2">
                  {roast.voice_url && (
                    <Button variant="outline" size="sm" onClick={playVoice}>
                      <Volume2 className="h-4 w-4 mr-2" />
                      Play Voice
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={shareRoast}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`bg-gradient-to-r ${personality.color} p-6 rounded-lg text-white shadow-inner`}>
                <p className="text-lg font-medium italic leading-relaxed">
                  "{roast.roast_text}"
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Improvements Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-pink-500" />
                <span>Constructive Improvements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {roast.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <span className="bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full min-w-[2rem] text-center">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 leading-relaxed">{improvement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-xl">
            <CardContent className="text-center p-8">
              <h3 className="text-2xl font-bold mb-2">Want Your Own AI Roast?</h3>
              <p className="text-purple-100 mb-6">
                Get roasted by AI personalities and receive constructive feedback to improve yourself!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => window.location.href = 'https://ai-roast-generator.netlify.app'}
                  className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-3"
                >
                  Create Your Roast
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = 'https://ai-roast-generator.netlify.app/pricing'}
                  className="border-white text-white hover:bg-white/10 px-8 py-3"
                >
                  Get Custom Domain
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Globe className="w-5 h-5" />
            <span className="font-semibold">Powered by IONOS Custom Domains</span>
          </div>
          <p className="text-gray-400 text-sm">
            Professional domain hosting with SSL certificates and 99.9% uptime guarantee
          </p>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500">
              Built for Bolt.new Hackathon • AI Roast Generator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}