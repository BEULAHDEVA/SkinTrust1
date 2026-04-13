-- Supabase Database Schema for SkinTrust

-- Table: users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skin_type VARCHAR(50) CHECK (skin_type IN ('oily', 'dry', 'combination', 'normal')),
  acne_level VARCHAR(50) CHECK (acne_level IN ('none', 'occasional', 'frequent')),
  sensitivity_score INTEGER CHECK (sensitivity_score BETWEEN 1 AND 3),
  pigmentation BOOLEAN DEFAULT false,
  hormonal_condition VARCHAR(50) CHECK (hormonal_condition IN ('none', 'pcod', 'other', 'prefer_not_to_say')),
  climate VARCHAR(50) CHECK (climate IN ('humid', 'dry', 'cold', 'mixed')),
  skin_profile_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Table: products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category VARCHAR(50) CHECK (category IN ('moisturiser', 'serum', 'cleanser', 'toner', 'spf', 'treatment', 'other')),
  ingredient_list TEXT[],
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Table: reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  outcome VARCHAR(50) CHECK (outcome IN ('worked', 'didnt_work', 'neutral')),
  concerns_addressed TEXT[],
  side_effects TEXT[],
  review_text TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Table: suitability_scores
CREATE TABLE suitability_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  skin_profile_hash TEXT NOT NULL,
  score_percentage INTEGER CHECK (score_percentage BETWEEN 0 AND 100),
  sample_size INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE (product_id, skin_profile_hash)
);

-- RLS (Row Level Security) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE suitability_scores ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products and suitability scores
CREATE POLICY "Public profiles are viewable by everyone." ON products FOR SELECT USING (true);
CREATE POLICY "Scores are viewable by everyone." ON suitability_scores FOR SELECT USING (true);

-- Users can only read/update their own profile
CREATE POLICY "Users can insert their own profile." ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can read own profile." ON users FOR SELECT USING (auth.uid() = id);
