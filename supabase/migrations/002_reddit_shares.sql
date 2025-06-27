-- Create reddit_shares table for tracking shared roasts
CREATE TABLE reddit_shares (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  roast_id UUID REFERENCES roasts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reddit_post_id TEXT NOT NULL,
  subreddit TEXT NOT NULL,
  title TEXT NOT NULL,
  reddit_url TEXT NOT NULL,
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  upvotes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  last_sync_at TIMESTAMP WITH TIME ZONE
);

-- Add columns to roasts table for share tracking
ALTER TABLE roasts 
ADD COLUMN IF NOT EXISTS share_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_shared_at TIMESTAMP WITH TIME ZONE;

-- Create indexes for performance
CREATE INDEX idx_reddit_shares_roast_id ON reddit_shares(roast_id);
CREATE INDEX idx_reddit_shares_user_id ON reddit_shares(user_id);
CREATE INDEX idx_reddit_shares_shared_at ON reddit_shares(shared_at DESC);
CREATE INDEX idx_reddit_shares_subreddit ON reddit_shares(subreddit);

-- Enable Row Level Security (RLS)
ALTER TABLE reddit_shares ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reddit_shares table
CREATE POLICY "Users can view their own reddit shares" ON reddit_shares
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reddit shares" ON reddit_shares
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reddit shares" ON reddit_shares
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reddit shares" ON reddit_shares
  FOR DELETE USING (auth.uid() = user_id);

-- Function to update share count when a new share is added
CREATE OR REPLACE FUNCTION update_roast_share_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the roast's share count
  UPDATE roasts 
  SET share_count = (
    SELECT COUNT(*) 
    FROM reddit_shares 
    WHERE roast_id = NEW.roast_id
  ),
  last_shared_at = NEW.shared_at
  WHERE id = NEW.roast_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update share count on new reddit share
CREATE TRIGGER on_reddit_share_created
  AFTER INSERT ON reddit_shares
  FOR EACH ROW EXECUTE FUNCTION update_roast_share_count();