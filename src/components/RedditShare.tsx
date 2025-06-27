import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { SelectProvider, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Share2, MessageCircle, TrendingUp, Zap } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface RedditShareProps {
  roastId: string;
  roastText: string;
  personality: string;
  userId: string;
}

const POPULAR_SUBREDDITS = [
  { value: 'funny', label: 'r/funny', description: 'General humor and laughs' },
  { value: 'roastme', label: 'r/RoastMe', description: 'Classic roasting community' },
  { value: 'mildlyinteresting', label: 'r/mildlyinteresting', description: 'Interesting content' },
  { value: 'showerthoughts', label: 'r/Showerthoughts', description: 'Random thoughts' },
  { value: 'todayilearned', label: 'r/todayilearned', description: 'Learning experiences' },
  { value: 'casualconversation', label: 'r/CasualConversation', description: 'Friendly chat' }
];

export const RedditShare: React.FC<RedditShareProps> = ({ 
  roastId, 
  roastText, 
  personality, 
  userId 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedSubreddit, setSelectedSubreddit] = useState('');
  const [customSubreddit, setCustomSubreddit] = useState('');
  const { toast } = useToast();

  const handleShare = async () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your Reddit post",
        variant: "destructive"
      });
      return;
    }

    const subreddit = customSubreddit || selectedSubreddit;
    if (!subreddit) {
      toast({
        title: "Subreddit Required",
        description: "Please select or enter a subreddit",
        variant: "destructive"
      });
      return;
    }

    setIsSharing(true);

    try {
      const response = await fetch('/.netlify/functions/reddit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roastId,
          title: title.trim(),
          subreddit: subreddit.replace('r/', ''),
          userId
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "🔥 Shared to Reddit!",
          description: `Your roast is now live on r/${subreddit}`,
        });
        
        // Open Reddit post in new tab (demo URL)
        window.open(data.redditUrl, '_blank');
        setIsOpen(false);
        
        // Reset form
        setTitle('');
        setSelectedSubreddit('');
        setCustomSubreddit('');
      } else {
        throw new Error(data.error || 'Failed to share');
      }
    } catch (error) {
      console.error('Share error:', error);
      toast({
        title: "Sharing Failed",
        description: "Unable to share to Reddit. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  };

  const generateSuggestedTitle = () => {
    const suggestions = [
      `AI ${personality} roasted me and I'm not okay 😭`,
      `Got absolutely destroyed by AI ${personality}`,
      `This AI roast hit different... thoughts?`,
      `${personality} personality AI just called me out`,
      `Rate this AI-generated roast (be gentle)`,
      `AI roast generator went OFF on me`
    ];
    
    const randomTitle = suggestions[Math.floor(Math.random() * suggestions.length)];
    setTitle(randomTitle);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
        >
          <Share2 className="w-4 h-4" />
          Share to Reddit
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-orange-500" />
            Share Your Roast to Reddit
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Preview */}
          <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-orange-500">
            <p className="text-sm text-gray-600 mb-2">Preview:</p>
            <p className="text-sm font-medium line-clamp-3">
              {roastText.substring(0, 120)}...
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Personality: {personality}
            </p>
          </div>

          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title">Post Title</Label>
            <div className="flex gap-2">
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a catchy title..."
                maxLength={300}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateSuggestedTitle}
                className="whitespace-nowrap"
              >
                <Zap className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              {title.length}/300 characters
            </p>
          </div>

          {/* Subreddit Selection */}
          <div className="space-y-2">
            <Label>Choose Subreddit</Label>
            <SelectProvider value={selectedSubreddit} onValueChange={setSelectedSubreddit}>
              <SelectTrigger>
                <SelectValue placeholder="Select a popular subreddit..." />
              </SelectTrigger>
              <SelectContent>
                {POPULAR_SUBREDDITS.map((sub) => (
                  <SelectItem key={sub.value} value={sub.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{sub.label}</span>
                      <span className="text-xs text-gray-500">{sub.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectProvider>
            
            <div className="text-xs text-gray-500 text-center">or</div>
            
            <Input
              value={customSubreddit}
              onChange={(e) => setCustomSubreddit(e.target.value)}
              placeholder="Enter custom subreddit (e.g., funny)"
              disabled={!!selectedSubreddit}
            />
          </div>

          {/* Share Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-600 bg-blue-50 p-2 rounded">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Viral Potential</span>
            </div>
            <div className="text-orange-600 font-medium">HIGH 🔥</div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleShare}
              disabled={isSharing || !title.trim()}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              {isSharing ? 'Sharing...' : 'Share to Reddit'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};