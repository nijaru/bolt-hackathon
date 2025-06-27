-- Create custom_domains table for IONOS integration
CREATE TABLE custom_domains (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subdomain TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL,
  roast_id UUID REFERENCES roasts(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'pending', 'inactive')) DEFAULT 'pending',
  ionos_domain_id TEXT,
  ssl_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- IONOS specific fields
  dns_configured BOOLEAN DEFAULT false,
  ssl_cert_status TEXT DEFAULT 'pending',
  cdn_enabled BOOLEAN DEFAULT true
);

-- Create indexes for performance
CREATE INDEX idx_custom_domains_user_id ON custom_domains(user_id);
CREATE INDEX idx_custom_domains_subdomain ON custom_domains(subdomain);
CREATE INDEX idx_custom_domains_status ON custom_domains(status);
CREATE INDEX idx_custom_domains_roast_id ON custom_domains(roast_id);

-- Enable Row Level Security (RLS)
ALTER TABLE custom_domains ENABLE ROW LEVEL SECURITY;

-- RLS Policies for custom_domains table
CREATE POLICY "Users can view their own custom domains" ON custom_domains
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own custom domains" ON custom_domains
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custom domains" ON custom_domains
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custom domains" ON custom_domains
  FOR DELETE USING (auth.uid() = user_id);

-- Public access policy for domain resolution
CREATE POLICY "Public can view active domains for resolution" ON custom_domains
  FOR SELECT USING (status = 'active');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_custom_domains_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on custom_domains
CREATE TRIGGER update_custom_domains_updated_at
  BEFORE UPDATE ON custom_domains
  FOR EACH ROW EXECUTE FUNCTION update_custom_domains_updated_at();

-- Function to validate subdomain format
CREATE OR REPLACE FUNCTION validate_subdomain(subdomain TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if subdomain is valid (alphanumeric and hyphens only, no spaces)
  RETURN subdomain ~ '^[a-z0-9][a-z0-9-]*[a-z0-9]$' AND LENGTH(subdomain) >= 3 AND LENGTH(subdomain) <= 63;
END;
$$ LANGUAGE plpgsql;

-- Add constraint to ensure valid subdomain format
ALTER TABLE custom_domains 
ADD CONSTRAINT valid_subdomain_format 
CHECK (validate_subdomain(subdomain));

-- Add feature tracking to subscriptions table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'subscriptions' AND column_name = 'custom_domains_count'
  ) THEN
    ALTER TABLE subscriptions 
    ADD COLUMN custom_domains_count INTEGER DEFAULT 0,
    ADD COLUMN max_custom_domains INTEGER DEFAULT 0;
  END IF;
END $$;

-- Update max_custom_domains based on tier
UPDATE subscriptions 
SET max_custom_domains = CASE 
  WHEN tier = 'enterprise' THEN 10
  WHEN tier = 'premium' THEN 3
  ELSE 0
END;

-- Function to check custom domain limits
CREATE OR REPLACE FUNCTION check_custom_domain_limit()
RETURNS TRIGGER AS $$
DECLARE
  current_count INTEGER;
  max_allowed INTEGER;
  user_tier TEXT;
BEGIN
  -- Get user's subscription tier and limits
  SELECT s.tier, s.max_custom_domains, COUNT(cd.id) 
  INTO user_tier, max_allowed, current_count
  FROM subscriptions s
  LEFT JOIN custom_domains cd ON cd.user_id = s.user_id
  WHERE s.user_id = NEW.user_id
  GROUP BY s.tier, s.max_custom_domains;

  -- Check if user can create more domains
  IF current_count >= max_allowed THEN
    RAISE EXCEPTION 'Custom domain limit reached. Upgrade your subscription to create more domains.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to check domain limits before insert
CREATE TRIGGER check_custom_domain_limit_trigger
  BEFORE INSERT ON custom_domains
  FOR EACH ROW EXECUTE FUNCTION check_custom_domain_limit();

-- Function to update custom domain count
CREATE OR REPLACE FUNCTION update_custom_domain_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the count in subscriptions table
  UPDATE subscriptions 
  SET custom_domains_count = (
    SELECT COUNT(*) 
    FROM custom_domains 
    WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
    AND status = 'active'
  )
  WHERE user_id = COALESCE(NEW.user_id, OLD.user_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers to update custom domain count
CREATE TRIGGER update_custom_domain_count_insert
  AFTER INSERT ON custom_domains
  FOR EACH ROW EXECUTE FUNCTION update_custom_domain_count();

CREATE TRIGGER update_custom_domain_count_update
  AFTER UPDATE ON custom_domains
  FOR EACH ROW EXECUTE FUNCTION update_custom_domain_count();

CREATE TRIGGER update_custom_domain_count_delete
  AFTER DELETE ON custom_domains
  FOR EACH ROW EXECUTE FUNCTION update_custom_domain_count();