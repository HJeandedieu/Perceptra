-- PERCEPTRA Database Schema
-- Created by: Isabelle
-- Shared with: Albert for API route development

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'operator', -- 'admin' or 'operator'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Detection events table
CREATE TABLE IF NOT EXISTS detection_events (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL,
    label VARCHAR(100) NOT NULL,
    confidence DECIMAL(5,4) NOT NULL,
    severity VARCHAR(20) NOT NULL, -- 'Low', 'Medium', 'High', 'Critical'
    camera_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    detection_event_id INTEGER REFERENCES detection_events(id),
    severity VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active' or 'dismissed'
    dismissed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
