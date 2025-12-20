-- Create github_credentials table
CREATE TABLE IF NOT EXISTS github_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  github_username TEXT NOT NULL UNIQUE,
  github_token TEXT NOT NULL,
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
  featured_repositories TEXT[],
  social_links JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create portfolio_projects table
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
  skill_category TEXT,
  proficiency_level TEXT,
  icon_url TEXT,
  order_index INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create auth_logs table
CREATE TABLE IF NOT EXISTS auth_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  github_username TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create languages table
CREATE TABLE IF NOT EXISTS languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  language_name TEXT NOT NULL,
  proficiency_level TEXT,
  years_of_experience INTEGER,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  certificate_name TEXT NOT NULL,
  issuer TEXT,
  issue_date TIMESTAMP,
  expiry_date TIMESTAMP,
  certificate_url TEXT,
  credential_id TEXT,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create education table
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  school_name TEXT NOT NULL,
  degree TEXT,
  field_of_study TEXT,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  grade TEXT,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create experience table
CREATE TABLE IF NOT EXISTS experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  employment_type TEXT,
  location TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  skills_used TEXT[],
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create github_projects table
CREATE TABLE IF NOT EXISTS github_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  repo_name TEXT NOT NULL,
  repo_url TEXT,
  description TEXT,
  language TEXT,
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_github_credentials_user_id ON github_credentials(user_id);
CREATE INDEX idx_portfolio_settings_user_id ON portfolio_settings(user_id);
CREATE INDEX idx_portfolio_projects_user_id ON portfolio_projects(user_id);
CREATE INDEX idx_portfolio_skills_user_id ON portfolio_skills(user_id);
CREATE INDEX idx_auth_logs_user_id ON auth_logs(user_id);
CREATE INDEX idx_auth_logs_created_at ON auth_logs(created_at);
CREATE INDEX idx_languages_user_id ON languages(user_id);
CREATE INDEX idx_certificates_user_id ON certificates(user_id);
CREATE INDEX idx_education_user_id ON education(user_id);
CREATE INDEX idx_experience_user_id ON experience(user_id);
CREATE INDEX idx_github_projects_user_id ON github_projects(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE github_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_projects ENABLE ROW LEVEL SECURITY;

-- Drop old constraints if they exist
ALTER TABLE github_credentials DROP CONSTRAINT IF EXISTS github_credentials_user_id_fkey;
ALTER TABLE portfolio_settings DROP CONSTRAINT IF EXISTS portfolio_settings_user_id_fkey;
ALTER TABLE portfolio_projects DROP CONSTRAINT IF EXISTS portfolio_projects_user_id_fkey;
ALTER TABLE portfolio_skills DROP CONSTRAINT IF EXISTS portfolio_skills_user_id_fkey;
ALTER TABLE auth_logs DROP CONSTRAINT IF EXISTS auth_logs_user_id_fkey;
ALTER TABLE languages DROP CONSTRAINT IF EXISTS languages_user_id_fkey;
ALTER TABLE certificates DROP CONSTRAINT IF EXISTS certificates_user_id_fkey;
ALTER TABLE education DROP CONSTRAINT IF EXISTS education_user_id_fkey;
ALTER TABLE experience DROP CONSTRAINT IF EXISTS experience_user_id_fkey;
ALTER TABLE github_projects DROP CONSTRAINT IF EXISTS github_projects_user_id_fkey;

