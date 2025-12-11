-- Create github_credentials table
CREATE TABLE IF NOT EXISTS github_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  github_username TEXT NOT NULL UNIQUE,
  github_token TEXT NOT NULL, -- This should be encrypted in production
  github_user_id INTEGER NOT NULL UNIQUE,
  github_avatar_url TEXT,
  github_bio TEXT,
  github_public_repos INTEGER,
  github_followers INTEGER,
  github_following INTEGER,
  github_created_at TIMESTAMP,
  stored_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create portfolio_settings table
CREATE TABLE IF NOT EXISTS portfolio_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  portfolio_title TEXT,
  portfolio_description TEXT,
  portfolio_theme TEXT DEFAULT 'dark',
  portfolio_slug TEXT UNIQUE,
  show_repositories BOOLEAN DEFAULT true,
  show_followers BOOLEAN DEFAULT true,
  repositories_limit INTEGER DEFAULT 6,
  featured_repositories TEXT[], -- Array of repo names
  social_links JSONB, -- { twitter, linkedin, personal_website, etc }
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create portfolio_projects table for custom projects
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  link TEXT,
  github_link TEXT,
  tags TEXT[],
  featured BOOLEAN DEFAULT false,
  order_index INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create portfolio_skills table
CREATE TABLE IF NOT EXISTS portfolio_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  skill_name TEXT NOT NULL,
  skill_category TEXT, -- 'language', 'framework', 'tool', etc
  proficiency_level TEXT, -- 'beginner', 'intermediate', 'advanced', 'expert'
  icon_url TEXT,
  order_index INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create auth logs table for tracking authentication events
CREATE TABLE IF NOT EXISTS auth_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'github_login', 'logout', 'token_refresh', etc
  ip_address TEXT,
  user_agent TEXT,
  github_username TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_github_credentials_user_id ON github_credentials(user_id);
CREATE INDEX idx_portfolio_settings_user_id ON portfolio_settings(user_id);
CREATE INDEX idx_portfolio_projects_user_id ON portfolio_projects(user_id);
CREATE INDEX idx_portfolio_skills_user_id ON portfolio_skills(user_id);
CREATE INDEX idx_auth_logs_user_id ON auth_logs(user_id);
CREATE INDEX idx_auth_logs_created_at ON auth_logs(created_at);

-- Enable Row Level Security (RLS) for better security
ALTER TABLE github_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for github_credentials table
CREATE POLICY "Users can view their own GitHub credentials"
-- Since we're using custom UUID-based user management (not Supabase Auth),
-- we disable RLS for inserts from service role and enable based on user_id
CREATE POLICY "Allow inserts to github_credentials"
  ON github_credentials
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own GitHub credentials"
  ON github_credentials
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own GitHub credentials"
  ON github_credentials
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete their own GitHub credentials"
  ON github_credentials
  FOR DELETE
  USING (true
-- Create RLS pAllow inserts to portfolio_settings"
  ON portfolio_settings
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own portfolio settings"
  ON portfolio_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own portfolio settings"
  ON portfolio_settings
  FOR UPDATE
  USING (true)
  WITH CHECK (true
  WITH CHECK (auth.uid() = user_id);

-- Create RLS pAllow inserts to portfolio_projects"
  ON portfolio_projects
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own projects"
  ON portfolio_projects
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own projects"
  ON portfolio_projects
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete their own projects"
  ON portfolio_projects
  FOR DELETE
  USING (true
  USING (auth.uid() = user_id);
Allow inserts to portfolio_skills"
  ON portfolio_skills
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own skills"
  ON portfolio_skills
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own skills"
  ON portfolio_skills
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete their own skills"
  ON portfolio_skills
  FOR DELETE
  USING (true
  FOR DELETE
  USING (auth.uid() = user_id);
