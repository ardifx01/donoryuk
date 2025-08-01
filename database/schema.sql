-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE blood_type_enum AS ENUM ('A', 'B', 'AB', 'O');
CREATE TYPE rhesus_enum AS ENUM ('Rh+', 'Rh-');
CREATE TYPE donor_status_enum AS ENUM ('active', 'unavailable', 'pending_verification');

-- Create donors table
CREATE TABLE donors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    blood_type blood_type_enum NOT NULL,
    rhesus rhesus_enum NOT NULL,
    location VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    notes TEXT,
    status donor_status_enum DEFAULT 'pending_verification',
    last_donation_date DATE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create verifications table
CREATE TABLE verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donor_id UUID REFERENCES donors(id) ON DELETE CASCADE,
    donor_card_url TEXT NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    admin_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admins table
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_donors_blood_type ON donors(blood_type);
CREATE INDEX idx_donors_rhesus ON donors(rhesus);
CREATE INDEX idx_donors_location ON donors(location);
CREATE INDEX idx_donors_status ON donors(status);
CREATE INDEX idx_donors_user_id ON donors(user_id);
CREATE INDEX idx_verifications_donor_id ON verifications(donor_id);
CREATE INDEX idx_verifications_verified ON verifications(verified);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_donors_updated_at 
    BEFORE UPDATE ON donors 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically update donor status based on cooldown
CREATE OR REPLACE FUNCTION update_donor_status_on_cooldown()
RETURNS TRIGGER AS $$
BEGIN
    -- If last_donation_date is set and it's been more than 100 days, set status to active
    IF NEW.last_donation_date IS NOT NULL AND 
       NEW.last_donation_date + INTERVAL '100 days' <= CURRENT_DATE AND
       NEW.status = 'unavailable' THEN
        NEW.status = 'active';
    -- If last_donation_date is set and it's been less than 100 days, set status to unavailable
    ELSIF NEW.last_donation_date IS NOT NULL AND 
          NEW.last_donation_date + INTERVAL '100 days' > CURRENT_DATE AND
          NEW.status = 'active' THEN
        NEW.status = 'unavailable';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for automatic cooldown management
CREATE TRIGGER update_donor_cooldown_status 
    BEFORE INSERT OR UPDATE ON donors 
    FOR EACH ROW 
    EXECUTE FUNCTION update_donor_status_on_cooldown();

-- Row Level Security (RLS) policies
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Donors can read all active donors (for search functionality)
CREATE POLICY "Anyone can view active donors" ON donors
    FOR SELECT USING (status = 'active');

-- Donors can insert their own record
CREATE POLICY "Users can insert their own donor record" ON donors
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Donors can update their own record
CREATE POLICY "Users can update their own donor record" ON donors
    FOR UPDATE USING (auth.uid() = user_id);

-- Admins can view all donors
CREATE POLICY "Admins can view all donors" ON donors
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE user_id = auth.uid()
        )
    );

-- Admins can update any donor
CREATE POLICY "Admins can update any donor" ON donors
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE user_id = auth.uid()
        )
    );

-- Verification policies
CREATE POLICY "Users can insert their own verification" ON verifications
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM donors 
            WHERE id = donor_id AND user_id = auth.uid()
        )
    );

-- Admins can view all verifications
CREATE POLICY "Admins can view all verifications" ON verifications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE user_id = auth.uid()
        )
    );

-- Admins can update verifications
CREATE POLICY "Admins can update verifications" ON verifications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE user_id = auth.uid()
        )
    );

-- Admin policies
CREATE POLICY "Admins can view admin records" ON admins
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admins 
            WHERE user_id = auth.uid()
        )
    );