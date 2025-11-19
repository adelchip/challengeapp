-- Demo Challenges with realistic scenarios
-- This script creates 20 challenges with appropriate participants and ratings

-- First, let's get profile IDs (you'll need to replace these with actual UUIDs from your database)
-- For now, using placeholders that you'll need to update after running the schema

-- Challenge 1: Migrate Legacy Authentication System
INSERT INTO challenges (title, description, type, status, participants, created_at) VALUES
('Migrate Legacy Authentication System to OAuth 2.0',
'Our current authentication system is outdated and poses security risks. We need to migrate to OAuth 2.0 with support for social logins (Google, GitHub, Microsoft). The system handles 100K+ daily active users, so zero-downtime migration is critical. Requirements: backward compatibility during transition, comprehensive audit logging, multi-factor authentication support, and thorough security testing.',
'public',
'completed',
ARRAY(SELECT id FROM profiles WHERE name IN ('Carlos Rodriguez', 'Nina Petrov', 'Ahmed Hassan', 'Kevin Lee') LIMIT 4),
NOW() - INTERVAL '45 days');

-- Challenge 2: Real-time Analytics Dashboard
INSERT INTO challenges (title, description, type, status, participants, created_at) VALUES
('Build Real-Time Analytics Dashboard for Customer Insights',
'Create a real-time analytics dashboard that processes and visualizes customer behavior data from multiple sources (web, mobile, API). Need to handle 10M events/day with sub-second latency. Tech stack should include: streaming data pipeline, time-series database, interactive visualizations, and alerting system for anomalies. Must be scalable and cost-efficient.',
'public',
'completed',
ARRAY(SELECT id FROM profiles WHERE name IN ('Andrei Volkov', 'Aisha Nkrumah', 'Alex Rivera', 'Tom Anderson') LIMIT 4),
NOW() - INTERVAL '60 days');

-- Challenge 3: Mobile App Performance Optimization
INSERT INTO challenges (title, description, type, status, participants, created_at) VALUES
('Optimize Mobile App Performance - Reduce Load Time by 50%',
'Our mobile app (iOS & Android) has degraded performance with average load time of 8 seconds. Users are churning due to poor experience. Need to: identify bottlenecks through profiling, optimize image loading and caching, reduce bundle size, implement lazy loading, optimize API calls, and improve rendering performance. Target: <3s initial load, smooth 60fps scrolling.',
'public',
'completed',
ARRAY(SELECT id FROM profiles WHERE name IN ('Sarah Chen', 'James Park', 'Emma Williams', 'Maria Garcia') LIMIT 4),
NOW() - INTERVAL '38 days');

-- Challenge 4: Kubernetes Migration
INSERT INTO challenges (title, description, type, status, participants, created_at) VALUES
('Migrate Monolithic Application to Kubernetes Microservices',
'Migrate our legacy monolith (currently on EC2) to a microservices architecture on Kubernetes. The application serves 500K users with critical 99.9% uptime SLA. Deliverables: service decomposition strategy, containerization of all services, CI/CD pipeline updates, service mesh implementation, monitoring & observability setup, gradual rollout plan with rollback capabilities.',
'public',
'completed',
ARRAY(SELECT id FROM profiles WHERE name IN ('Michael Brown', 'Anna Kowalski', 'Diego Santos', 'Zara Khan', 'Lisa Mueller') LIMIT 5),
NOW() - INTERVAL '52 days');

-- Challenge 5: Design System Implementation
INSERT INTO challenges (title, description, type, status, participants, created_at) VALUES
('Implement Company-Wide Design System from Scratch',
'Create a comprehensive design system to unify UX across 12 products. Includes: component library (React & Vue), design tokens, documentation site, Figma library with auto-sync, accessibility compliance (WCAG 2.1 AA), theming support, and migration guide. Must support both web and mobile platforms. Expected to reduce design-to-development time by 60%.',
'public',
'completed',
ARRAY(SELECT id FROM profiles WHERE name IN ('Hassan Ahmed', 'Isabella Rossi', 'Olivia Martinez', 'Alex Rivera', 'Sarah Chen') LIMIT 5),
NOW() - INTERVAL '70 days');

-- Challenge 6: AI-Powered Search Engine
INSERT INTO challenges (title, description, type, status, participants, created_at) VALUES
('Build AI-Powered Semantic Search Engine for Documentation',
'Replace our keyword-based search with AI-powered semantic search for 50K+ documentation pages. Requirements: vector embeddings for all content, hybrid search (keyword + semantic), query understanding with NLP, personalized results, sub-200ms response time, support for 23 languages, and continuous learning from user interactions. Tech: transformer models, vector DB, caching layer.',
'public',
'completed',
ARRAY(SELECT id FROM profiles WHERE name IN ('Andrei Volkov', 'Lars Eriksson', 'Ahmed Hassan', 'Nina Petrov') LIMIT 4),
NOW() - INTERVAL '42 days');

-- Challenge 7: Payment Gateway Integration
INSERT INTO challenges (title, description, type, status, participants, created_at) VALUES
('Integrate Multi-Currency Payment Gateway with Fraud Detection',
'Implement payment processing supporting 50+ currencies and payment methods (cards, wallets, bank transfers). Critical requirements: PCI DSS compliance, real-time fraud detection using ML, automated reconciliation, webhook handling, refund management, subscription billing support, and detailed transaction reporting. Must handle 100K transactions/day with 99.99% uptime.',
'public',
'completed',
ARRAY(SELECT id FROM profiles WHERE name IN ('Carlos Rodriguez', 'Raj Patel', 'Lucas Silva', 'Andrei Volkov', 'Elena Popov') LIMIT 5),
NOW() - INTERVAL '55 days');

-- Challenge 8: GraphQL API Development
INSERT INTO challenges (title, description, type, status, participants, created_at) VALUES
('Develop Unified GraphQL API Gateway for Microservices',
'Create a GraphQL API gateway that consolidates 15 microservices into a single, efficient interface. Requirements: schema federation, N+1 query optimization with DataLoader, caching strategy, rate limiting, authentication/authorization, real-time subscriptions, comprehensive error handling, and automated schema documentation. Must maintain backward compatibility with existing REST APIs.',
'public',
'completed',
ARRAY(SELECT id FROM profiles WHERE name IN ('Nina Petrov', 'Ahmed Hassan', 'Sophie Martin', 'Priya Sharma') LIMIT 4),
NOW() - INTERVAL '48 days');

-- Challenge 9: Accessibility Audit & Remediation
INSERT INTO challenges (title, description, type, status, participants, created_at) VALUES
('Complete WCAG 2.1 AA Accessibility Compliance Across Platform',
'Conduct comprehensive accessibility audit and remediate all issues across our web platform (8 major products). Scope: keyboard navigation, screen reader support, color contrast, focus management, ARIA labels, semantic HTML, form accessibility, and dynamic content handling. Deliverables: audit report, remediation plan, automated testing setup, developer guidelines, and training materials.',
'public',
'completed',
ARRAY(SELECT id FROM profiles WHERE name IN ('Sarah Chen', 'Mei Lin', 'Isabella Rossi', 'Kevin Lee', 'Emma Williams') LIMIT 5),
NOW() - INTERVAL '35 days');

-- Challenge 10: Data Pipeline Optimization
INSERT INTO challenges (title, description, type, status, participants, created_at) VALUES
('Optimize ETL Pipeline to Process 1TB Daily Data 5x Faster',
'Our current ETL pipeline is bottlenecked, taking 12 hours to process daily data. Need to redesign for: parallel processing, incremental loads, schema evolution, data quality checks, error handling with replay capability, and monitoring. Target: <2 hour processing time, 99.5% data quality, automatic recovery from failures. Tech stack: Apache Airflow, Spark, and data lake architecture.',
'public',
'completed',
ARRAY(SELECT id FROM profiles WHERE name IN ('Lisa Mueller', 'Aisha Nkrumah', 'Anna Kowalski', 'Ahmed Hassan') LIMIT 4),
NOW() - INTERVAL '40 days');

-- Challenge 11: Video Streaming Platform (ONGOING)
INSERT INTO challenges (title, description, type, status, participants, suggested_profiles, created_at) VALUES
('Build Scalable Video Streaming Platform with Adaptive Bitrate',
'Create a Netflix-like video streaming platform supporting 100K concurrent viewers. Requirements: video transcoding to multiple qualities, adaptive bitrate streaming (HLS/DASH), CDN integration, DRM protection, subtitle support, viewing analytics, resume playback, and offline download. Infrastructure must auto-scale based on demand and optimize for cost efficiency.',
'public',
'ongoing',
ARRAY(SELECT id FROM profiles WHERE name IN ('Michael Brown', 'Carlos Rodriguez', 'Alex Rivera', 'Zara Khan') LIMIT 4),
ARRAY(SELECT id FROM profiles WHERE name IN ('Michael Brown', 'Carlos Rodriguez', 'Alex Rivera', 'Zara Khan', 'Lisa Mueller', 'Nina Petrov', 'Tom Anderson', 'Diego Santos', 'Sophie Martin', 'Anna Kowalski') LIMIT 10),
NOW() - INTERVAL '15 days');

-- Challenge 12: Machine Learning Model Deployment (ONGOING)
INSERT INTO challenges (title, description, type, status, participants, suggested_profiles, created_at) VALUES
('Deploy ML Recommendation Engine with A/B Testing Framework',
'Deploy our trained recommendation model to production with full MLOps pipeline. Scope: model versioning, feature store, A/B testing framework, monitoring for model drift, automated retraining pipeline, explainability dashboard, and gradual rollout system. Must handle 1M predictions/day with <100ms latency. Include comprehensive metrics for business impact measurement.',
'public',
'ongoing',
ARRAY(SELECT id FROM profiles WHERE name IN ('Lars Eriksson', 'Andrei Volkov', 'Julia Schmidt', 'Diego Santos') LIMIT 4),
ARRAY(SELECT id FROM profiles WHERE name IN ('Lars Eriksson', 'Andrei Volkov', 'Julia Schmidt', 'Diego Santos', 'Aisha Nkrumah', 'Michael Brown', 'Anna Kowalski', 'Ahmed Hassan', 'Nina Petrov', 'David Kim') LIMIT 10),
NOW() - INTERVAL '10 days');

-- Challenge 13: Multi-Tenant SaaS Architecture (ONGOING)
INSERT INTO challenges (title, description, type, status, participants, suggested_profiles, created_at) VALUES
('Refactor Application to Multi-Tenant SaaS Architecture',
'Transform our single-tenant application into a multi-tenant SaaS platform supporting 1000+ organizations. Key challenges: tenant isolation, data segregation, custom configurations per tenant, usage metering, rate limiting per tenant, tenant-specific customizations, and zero-downtime updates. Must maintain security, performance, and allow for horizontal scaling.',
'public',
'ongoing',
ARRAY(SELECT id FROM profiles WHERE name IN ('Stefan Novak', 'Lisa Mueller', 'Raj Patel', 'Sophie Martin', 'David Kim') LIMIT 5),
ARRAY(SELECT id FROM profiles WHERE name IN ('Stefan Novak', 'Lisa Mueller', 'Raj Patel', 'Sophie Martin', 'David Kim', 'Carlos Rodriguez', 'Tom Anderson', 'Anna Kowalski', 'Chris Johnson', 'Fatima Ali') LIMIT 10),
NOW() - INTERVAL '20 days');

-- Challenge 14: Mobile App Redesign (ONGOING)
INSERT INTO challenges (title, description, type, status, participants, suggested_profiles, created_at) VALUES
('Complete Mobile App Redesign with New Design Language',
'Redesign our mobile app (iOS & Android) with modern design language and improved UX. Research shows 40% of users abandon tasks due to confusing navigation. Deliverables: user research & personas, information architecture, high-fidelity prototypes, usability testing, design system integration, micro-interactions, and smooth implementation handoff. Goal: increase task completion by 50%.',
'public',
'ongoing',
ARRAY(SELECT id FROM profiles WHERE name IN ('Noah Anderson', 'Mei Lin', 'Chloe Brown', 'James Park', 'Julia Schmidt') LIMIT 5),
ARRAY(SELECT id FROM profiles WHERE name IN ('Noah Anderson', 'Mei Lin', 'Chloe Brown', 'James Park', 'Julia Schmidt', 'Isabella Rossi', 'Olivia Martinez', 'Hassan Ahmed', 'Sarah Chen', 'David Kim') LIMIT 10),
NOW() - INTERVAL '12 days');

-- Challenge 15: Security Hardening (ONGOING)
INSERT INTO challenges (title, description, type, status, participants, suggested_profiles, created_at) VALUES
('Security Hardening - Fix 50+ Critical Vulnerabilities',
'Security audit revealed 50+ critical vulnerabilities across our infrastructure and applications. Priority fixes needed: SQL injection risks, XSS vulnerabilities, insecure authentication, exposed secrets, outdated dependencies, improper access controls, and missing security headers. Deliverables: vulnerability patches, security testing automation, developer security training, and ongoing monitoring setup.',
'public',
'ongoing',
ARRAY(SELECT id FROM profiles WHERE name IN ('Anna Kowalski', 'Carlos Rodriguez', 'Kevin Lee', 'Elena Popov', 'Fatima Ali') LIMIT 5),
ARRAY(SELECT id FROM profiles WHERE name IN ('Anna Kowalski', 'Carlos Rodriguez', 'Kevin Lee', 'Elena Popov', 'Fatima Ali', 'Michael Brown', 'Ahmed Hassan', 'Lisa Mueller', 'Diego Santos', 'Stefan Novak') LIMIT 10),
NOW() - INTERVAL '8 days');

-- Challenge 16: Real-time Collaboration Features (ONGOING)
INSERT INTO challenges (title, description, type, status, participants, suggested_profiles, created_at) VALUES
('Implement Real-Time Collaborative Editing (Google Docs-like)',
'Add real-time collaborative editing to our document platform. Requirements: operational transformation or CRDT for conflict resolution, presence indicators, cursor tracking, commenting system, version history, offline support with sync, and performance optimization for large documents. Must support 50+ concurrent editors per document with <50ms latency.',
'public',
'ongoing',
ARRAY(SELECT id FROM profiles WHERE name IN ('Tom Anderson', 'Nina Petrov', 'Sophie Martin', 'Marco Bianchi') LIMIT 4),
ARRAY(SELECT id FROM profiles WHERE name IN ('Tom Anderson', 'Nina Petrov', 'Sophie Martin', 'Marco Bianchi', 'Alex Rivera', 'Ahmed Hassan', 'Sarah Chen', 'Lisa Mueller', 'Raj Patel', 'Yuki Tanaka') LIMIT 10),
NOW() - INTERVAL '18 days');

-- Challenge 17: Automated Testing Infrastructure (ONGOING)
INSERT INTO challenges (title, description, type, status, participants, suggested_profiles, created_at) VALUES
('Build Comprehensive Automated Testing Infrastructure',
'Establish robust automated testing across all layers: unit tests (80% coverage), integration tests, E2E tests, visual regression tests, performance tests, and API contract tests. Setup: parallel test execution, flaky test detection, test data management, CI/CD integration, and detailed reporting dashboard. Goal: reduce manual QA effort by 70% while improving release confidence.',
'public',
'ongoing',
ARRAY(SELECT id FROM profiles WHERE name IN ('Maria Garcia', 'Kevin Lee', 'Elena Popov', 'Marco Bianchi', 'Rachel Wong') LIMIT 5),
ARRAY(SELECT id FROM profiles WHERE name IN ('Maria Garcia', 'Kevin Lee', 'Elena Popov', 'Marco Bianchi', 'Rachel Wong', 'Alex Rivera', 'Sarah Chen', 'Tom Anderson', 'Diego Santos', 'Michael Brown') LIMIT 10),
NOW() - INTERVAL '14 days');

-- Challenge 18: Internationalization Platform (ONGOING)
INSERT INTO challenges (title, description, type, status, participants, suggested_profiles, created_at) VALUES
('Internationalize Platform for Global Expansion (30+ Languages)',
'Prepare platform for global expansion supporting 30+ languages and regional variations. Scope: i18n framework implementation, translation management system, RTL language support, locale-specific formatting (dates, numbers, currency), content translation workflow, language detection, and cultural adaptation. Must support dynamic language switching without page reload.',
'public',
'ongoing',
ARRAY(SELECT id FROM profiles WHERE name IN ('Yuki Tanaka', 'Sarah Chen', 'Mei Lin', 'Hassan Ahmed', 'Robert Taylor') LIMIT 5),
ARRAY(SELECT id FROM profiles WHERE name IN ('Yuki Tanaka', 'Sarah Chen', 'Mei Lin', 'Hassan Ahmed', 'Robert Taylor', 'Alex Rivera', 'Tom Anderson', 'Sophie Martin', 'Isabella Rossi', 'David Kim') LIMIT 10),
NOW() - INTERVAL '22 days');

-- Challenge 19: Cost Optimization Initiative (ONGOING)
INSERT INTO challenges (title, description, type, status, participants, suggested_profiles, created_at) VALUES
('Cloud Infrastructure Cost Optimization - Reduce Spend by 40%',
'Current cloud costs are $500K/month and growing unsustainably. Objectives: identify waste, right-size resources, implement auto-scaling, optimize storage tiers, leverage reserved instances, reduce data transfer costs, and implement cost monitoring/alerts. Need detailed analysis, optimization plan, and automated enforcement. Target: save $200K/month without impacting performance or reliability.',
'public',
'ongoing',
ARRAY(SELECT id FROM profiles WHERE name IN ('Michael Brown', 'Anna Kowalski', 'Chris Johnson', 'Lisa Mueller') LIMIT 4),
ARRAY(SELECT id FROM profiles WHERE name IN ('Michael Brown', 'Anna Kowalski', 'Chris Johnson', 'Lisa Mueller', 'Diego Santos', 'Zara Khan', 'Stefan Novak', 'Fatima Ali', 'Carlos Rodriguez', 'Ahmed Hassan') LIMIT 10),
NOW() - INTERVAL '6 days');

-- Challenge 20: Customer Support Portal (ONGOING)
INSERT INTO challenges (title, description, type, status, participants, suggested_profiles, created_at) VALUES
('Develop Self-Service Customer Support Portal with AI Chatbot',
'Build comprehensive self-service portal to reduce support tickets by 60%. Features: AI-powered chatbot with NLP, searchable knowledge base, ticket submission system, status tracking, community forum, video tutorials, and in-app contextual help. Integration with existing CRM and support tools required. Must support mobile-responsive design and analytics for content effectiveness.',
'public',
'ongoing',
ARRAY(SELECT id FROM profiles WHERE name IN ('Alex Rivera', 'Andrei Volkov', 'Priya Sharma', 'Isabella Rossi', 'Sophie Martin') LIMIT 5),
ARRAY(SELECT id FROM profiles WHERE name IN ('Alex Rivera', 'Andrei Volkov', 'Priya Sharma', 'Isabella Rossi', 'Sophie Martin', 'Tom Anderson', 'Lars Eriksson', 'Noah Anderson', 'Ahmed Hassan', 'David Kim') LIMIT 10),
NOW() - INTERVAL '11 days');

-- Now add ratings for completed challenges
-- Challenge 1 ratings
INSERT INTO challenge_ratings (challenge_id, profile_id, rating)
SELECT 
  c.id,
  p.id,
  CASE p.name
    WHEN 'Carlos Rodriguez' THEN 5
    WHEN 'Nina Petrov' THEN 5
    WHEN 'Ahmed Hassan' THEN 4
    WHEN 'Kevin Lee' THEN 5
  END
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Migrate Legacy Authentication System to OAuth 2.0'
AND p.name IN ('Carlos Rodriguez', 'Nina Petrov', 'Ahmed Hassan', 'Kevin Lee');

-- Challenge 2 ratings
INSERT INTO challenge_ratings (challenge_id, profile_id, rating)
SELECT 
  c.id,
  p.id,
  CASE p.name
    WHEN 'Andrei Volkov' THEN 5
    WHEN 'Aisha Nkrumah' THEN 5
    WHEN 'Alex Rivera' THEN 4
    WHEN 'Tom Anderson' THEN 5
  END
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Build Real-Time Analytics Dashboard for Customer Insights'
AND p.name IN ('Andrei Volkov', 'Aisha Nkrumah', 'Alex Rivera', 'Tom Anderson');

-- Challenge 3 ratings
INSERT INTO challenge_ratings (challenge_id, profile_id, rating)
SELECT 
  c.id,
  p.id,
  CASE p.name
    WHEN 'Sarah Chen' THEN 5
    WHEN 'James Park' THEN 4
    WHEN 'Emma Williams' THEN 4
    WHEN 'Maria Garcia' THEN 5
  END
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Optimize Mobile App Performance - Reduce Load Time by 50%'
AND p.name IN ('Sarah Chen', 'James Park', 'Emma Williams', 'Maria Garcia');

-- Challenge 4 ratings
INSERT INTO challenge_ratings (challenge_id, profile_id, rating)
SELECT 
  c.id,
  p.id,
  CASE p.name
    WHEN 'Michael Brown' THEN 5
    WHEN 'Anna Kowalski' THEN 5
    WHEN 'Diego Santos' THEN 4
    WHEN 'Zara Khan' THEN 4
    WHEN 'Lisa Mueller' THEN 5
  END
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Migrate Monolithic Application to Kubernetes Microservices'
AND p.name IN ('Michael Brown', 'Anna Kowalski', 'Diego Santos', 'Zara Khan', 'Lisa Mueller');

-- Challenge 5 ratings
INSERT INTO challenge_ratings (challenge_id, profile_id, rating)
SELECT 
  c.id,
  p.id,
  CASE p.name
    WHEN 'Hassan Ahmed' THEN 5
    WHEN 'Isabella Rossi' THEN 5
    WHEN 'Olivia Martinez' THEN 5
    WHEN 'Alex Rivera' THEN 4
    WHEN 'Sarah Chen' THEN 4
  END
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Implement Company-Wide Design System from Scratch'
AND p.name IN ('Hassan Ahmed', 'Isabella Rossi', 'Olivia Martinez', 'Alex Rivera', 'Sarah Chen');

-- Challenge 6 ratings
INSERT INTO challenge_ratings (challenge_id, profile_id, rating)
SELECT 
  c.id,
  p.id,
  CASE p.name
    WHEN 'Andrei Volkov' THEN 5
    WHEN 'Lars Eriksson' THEN 5
    WHEN 'Ahmed Hassan' THEN 4
    WHEN 'Nina Petrov' THEN 5
  END
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Build AI-Powered Semantic Search Engine for Documentation'
AND p.name IN ('Andrei Volkov', 'Lars Eriksson', 'Ahmed Hassan', 'Nina Petrov');

-- Challenge 7 ratings
INSERT INTO challenge_ratings (challenge_id, profile_id, rating)
SELECT 
  c.id,
  p.id,
  CASE p.name
    WHEN 'Carlos Rodriguez' THEN 5
    WHEN 'Raj Patel' THEN 4
    WHEN 'Lucas Silva' THEN 5
    WHEN 'Andrei Volkov' THEN 5
    WHEN 'Elena Popov' THEN 4
  END
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Integrate Multi-Currency Payment Gateway with Fraud Detection'
AND p.name IN ('Carlos Rodriguez', 'Raj Patel', 'Lucas Silva', 'Andrei Volkov', 'Elena Popov');

-- Challenge 8 ratings
INSERT INTO challenge_ratings (challenge_id, profile_id, rating)
SELECT 
  c.id,
  p.id,
  CASE p.name
    WHEN 'Nina Petrov' THEN 5
    WHEN 'Ahmed Hassan' THEN 5
    WHEN 'Sophie Martin' THEN 4
    WHEN 'Priya Sharma' THEN 4
  END
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Develop Unified GraphQL API Gateway for Microservices'
AND p.name IN ('Nina Petrov', 'Ahmed Hassan', 'Sophie Martin', 'Priya Sharma');

-- Challenge 9 ratings
INSERT INTO challenge_ratings (challenge_id, profile_id, rating)
SELECT 
  c.id,
  p.id,
  CASE p.name
    WHEN 'Sarah Chen' THEN 5
    WHEN 'Mei Lin' THEN 5
    WHEN 'Isabella Rossi' THEN 5
    WHEN 'Kevin Lee' THEN 4
    WHEN 'Emma Williams' THEN 4
  END
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Complete WCAG 2.1 AA Accessibility Compliance Across Platform'
AND p.name IN ('Sarah Chen', 'Mei Lin', 'Isabella Rossi', 'Kevin Lee', 'Emma Williams');

-- Challenge 10 ratings
INSERT INTO challenge_ratings (challenge_id, profile_id, rating)
SELECT 
  c.id,
  p.id,
  CASE p.name
    WHEN 'Lisa Mueller' THEN 5
    WHEN 'Aisha Nkrumah' THEN 5
    WHEN 'Anna Kowalski' THEN 5
    WHEN 'Ahmed Hassan' THEN 4
  END
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Optimize ETL Pipeline to Process 1TB Daily Data 5x Faster'
AND p.name IN ('Lisa Mueller', 'Aisha Nkrumah', 'Anna Kowalski', 'Ahmed Hassan');

-- Add some collaboration messages for ongoing challenges to make them feel active
-- Challenge 11: Video Streaming Platform
INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'I''ve set up the initial infrastructure for the streaming platform. CDN integration is complete.',
  NOW() - INTERVAL '2 days'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Build Scalable Video Streaming Platform with Adaptive Bitrate'
AND p.name = 'Michael Brown'
LIMIT 1;

INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'Great work! I''ve started working on the adaptive bitrate logic. Should have HLS implementation ready by EOD.',
  NOW() - INTERVAL '1 day'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Build Scalable Video Streaming Platform with Adaptive Bitrate'
AND p.name = 'Carlos Rodriguez'
LIMIT 1;

INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'Working on the player UI. Any preference for the video player library?',
  NOW() - INTERVAL '18 hours'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Build Scalable Video Streaming Platform with Adaptive Bitrate'
AND p.name = 'Alex Rivera'
LIMIT 1;

INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'I recommend Video.js - it has great HLS support and is highly customizable.',
  NOW() - INTERVAL '12 hours'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Build Scalable Video Streaming Platform with Adaptive Bitrate'
AND p.name = 'Carlos Rodriguez'
LIMIT 1;

-- Challenge 12: ML Model Deployment
INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'Model deployment pipeline is configured. Working on the A/B testing framework integration now.',
  NOW() - INTERVAL '3 days'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Deploy ML Recommendation Engine with A/B Testing Framework'
AND p.name = 'Lars Eriksson'
LIMIT 1;

INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'Feature store is ready. We can start tracking model performance metrics.',
  NOW() - INTERVAL '2 days'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Deploy ML Recommendation Engine with A/B Testing Framework'
AND p.name = 'Andrei Volkov'
LIMIT 1;

INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'Perfect! I''ll set up the dashboards for monitoring. What metrics should we prioritize?',
  NOW() - INTERVAL '1 day'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Deploy ML Recommendation Engine with A/B Testing Framework'
AND p.name = 'Julia Schmidt'
LIMIT 1;

INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'Let''s focus on precision, recall, and click-through rate. Also add model latency tracking.',
  NOW() - INTERVAL '8 hours'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Deploy ML Recommendation Engine with A/B Testing Framework'
AND p.name = 'Andrei Volkov'
LIMIT 1;

-- Challenge 13: Multi-Tenant SaaS
INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'I''ve created the database schema for tenant isolation. Using schema-per-tenant approach.',
  NOW() - INTERVAL '5 days'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Refactor Application to Multi-Tenant SaaS Architecture'
AND p.name = 'Lisa Mueller'
LIMIT 1;

INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'Good choice. I''ll implement the tenant context middleware for API requests.',
  NOW() - INTERVAL '4 days'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Refactor Application to Multi-Tenant SaaS Architecture'
AND p.name = 'Raj Patel'
LIMIT 1;

INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'We need to discuss the migration strategy. How do we handle existing customers?',
  NOW() - INTERVAL '2 days'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Refactor Application to Multi-Tenant SaaS Architecture'
AND p.name = 'David Kim'
LIMIT 1;

-- Challenge 14: Mobile App Redesign
INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'User research is complete! I''ve identified 5 major pain points in the current navigation.',
  NOW() - INTERVAL '4 days'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Complete Mobile App Redesign with New Design Language'
AND p.name = 'Noah Anderson'
LIMIT 1;

INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'Great! I''m working on the new IA based on your findings. Should have wireframes by tomorrow.',
  NOW() - INTERVAL '3 days'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Complete Mobile App Redesign with New Design Language'
AND p.name = 'Mei Lin'
LIMIT 1;

INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'I''ve started the high-fidelity mockups. Can we review the color palette together?',
  NOW() - INTERVAL '1 day'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Complete Mobile App Redesign with New Design Language'
AND p.name = 'Chloe Brown'
LIMIT 1;

-- Challenge 15: Security Hardening
INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'I''ve prioritized the vulnerabilities. 15 critical issues need immediate attention.',
  NOW() - INTERVAL '3 days'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Security Hardening - Fix 50+ Critical Vulnerabilities'
AND p.name = 'Anna Kowalski'
LIMIT 1;

INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'Working on the SQL injection fixes in the API layer. Should be done today.',
  NOW() - INTERVAL '2 days'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Security Hardening - Fix 50+ Critical Vulnerabilities'
AND p.name = 'Carlos Rodriguez'
LIMIT 1;

INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'I''m setting up automated security scanning in the CI/CD pipeline.',
  NOW() - INTERVAL '1 day'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Security Hardening - Fix 50+ Critical Vulnerabilities'
AND p.name = 'Kevin Lee'
LIMIT 1;

INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'Updated all dependencies with known vulnerabilities. 23 packages updated.',
  NOW() - INTERVAL '6 hours'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Security Hardening - Fix 50+ Critical Vulnerabilities'
AND p.name = 'Elena Popov'
LIMIT 1;

-- Challenge 16: Real-time Collaboration
INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'I''ve implemented the WebSocket infrastructure for real-time sync. Ready for testing.',
  NOW() - INTERVAL '4 days'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Implement Real-Time Collaborative Editing (Google Docs-like)'
AND p.name = 'Nina Petrov'
LIMIT 1;

INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'Working on the CRDT implementation for conflict resolution. This is complex!',
  NOW() - INTERVAL '2 days'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Implement Real-Time Collaborative Editing (Google Docs-like)'
AND p.name = 'Tom Anderson'
LIMIT 1;

INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'I can help with that. I''ve used Yjs before - it handles CRDTs really well.',
  NOW() - INTERVAL '1 day'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Implement Real-Time Collaborative Editing (Google Docs-like)'
AND p.name = 'Sophie Martin'
LIMIT 1;

-- Challenge 17: Automated Testing
INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'Test framework is set up. We''re at 45% code coverage now, aiming for 80%.',
  NOW() - INTERVAL '5 days'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Build Comprehensive Automated Testing Infrastructure'
AND p.name = 'Maria Garcia'
LIMIT 1;

INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'E2E tests are running in CI. Found 12 flaky tests that need fixing.',
  NOW() - INTERVAL '3 days'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Build Comprehensive Automated Testing Infrastructure'
AND p.name = 'Kevin Lee'
LIMIT 1;

INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'I''ll work on stabilizing those. Also setting up visual regression testing with Percy.',
  NOW() - INTERVAL '1 day'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Build Comprehensive Automated Testing Infrastructure'
AND p.name = 'Marco Bianchi'
LIMIT 1;

-- Challenge 18: Internationalization
INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'i18n framework integrated. All strings are now extracted and ready for translation.',
  NOW() - INTERVAL '6 days'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Internationalize Platform for Global Expansion (30+ Languages)'
AND p.name = 'Yuki Tanaka'
LIMIT 1;

INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'Working on RTL support for Arabic and Hebrew. CSS changes are tricky!',
  NOW() - INTERVAL '3 days'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Internationalize Platform for Global Expansion (30+ Languages)'
AND p.name = 'Sarah Chen'
LIMIT 1;

INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'I''ve set up the translation management system. Translators can start working now.',
  NOW() - INTERVAL '1 day'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Internationalize Platform for Global Expansion (30+ Languages)'
AND p.name = 'Robert Taylor'
LIMIT 1;

-- Challenge 19: Cost Optimization
INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'Completed the cost analysis. Found $150K/month in potential savings!',
  NOW() - INTERVAL '2 days'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Cloud Infrastructure Cost Optimization - Reduce Spend by 40%'
AND p.name = 'Michael Brown'
LIMIT 1;

INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'Wow! Where are the biggest opportunities?',
  NOW() - INTERVAL '1 day'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Cloud Infrastructure Cost Optimization - Reduce Spend by 40%'
AND p.name = 'Chris Johnson'
LIMIT 1;

INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'Over-provisioned EC2 instances ($60K), unused EBS volumes ($25K), and inefficient S3 storage ($40K).',
  NOW() - INTERVAL '18 hours'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Cloud Infrastructure Cost Optimization - Reduce Spend by 40%'
AND p.name = 'Michael Brown'
LIMIT 1;

-- Challenge 20: Customer Support Portal
INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'Knowledge base is set up with 200+ articles. Search is working great!',
  NOW() - INTERVAL '4 days'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Develop Self-Service Customer Support Portal with AI Chatbot'
AND p.name = 'Sophie Martin'
LIMIT 1;

INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'AI chatbot training is in progress. It''s handling basic queries with 85% accuracy.',
  NOW() - INTERVAL '2 days'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Develop Self-Service Customer Support Portal with AI Chatbot'
AND p.name = 'Andrei Volkov'
LIMIT 1;

INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'That''s impressive! I''m working on the ticket system integration with Zendesk.',
  NOW() - INTERVAL '1 day'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Develop Self-Service Customer Support Portal with AI Chatbot'
AND p.name = 'Priya Sharma'
LIMIT 1;

INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'UI design is ready for review. Focusing on mobile-first approach.',
  NOW() - INTERVAL '8 hours'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Develop Self-Service Customer Support Portal with AI Chatbot'
AND p.name = 'Isabella Rossi'
LIMIT 1;

-- Add messages to some completed challenges to show historical collaboration
-- Challenge 1: OAuth Migration (Completed)
INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'Starting the OAuth implementation. Setting up Auth0 integration.',
  NOW() - INTERVAL '45 days' + INTERVAL '5 hours'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Migrate Legacy Authentication System to OAuth 2.0'
AND p.name = 'Carlos Rodriguez'
LIMIT 1;

INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'I''ll handle the database migration for user accounts. Creating a rollback plan too.',
  NOW() - INTERVAL '44 days'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Migrate Legacy Authentication System to OAuth 2.0'
AND p.name = 'Ahmed Hassan'
LIMIT 1;

INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'Setting up comprehensive test coverage for all auth flows. We can''t afford bugs here!',
  NOW() - INTERVAL '43 days'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Migrate Legacy Authentication System to OAuth 2.0'
AND p.name = 'Kevin Lee'
LIMIT 1;

INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'Migration completed successfully! Zero downtime achieved. Great teamwork everyone! 🎉',
  NOW() - INTERVAL '42 days'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Migrate Legacy Authentication System to OAuth 2.0'
AND p.name = 'Carlos Rodriguez'
LIMIT 1;

-- Challenge 5: Design System (Completed)
INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'Design tokens are defined. We have 120 tokens covering colors, spacing, and typography.',
  NOW() - INTERVAL '69 days'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Implement Company-Wide Design System from Scratch'
AND p.name = 'Hassan Ahmed'
LIMIT 1;

INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'Component library is taking shape. We have 45 components so far, all documented.',
  NOW() - INTERVAL '68 days'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Implement Company-Wide Design System from Scratch'
AND p.name = 'Isabella Rossi'
LIMIT 1;

INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'React components are ready! Working on Vue.js versions now.',
  NOW() - INTERVAL '67 days'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Implement Company-Wide Design System from Scratch'
AND p.name = 'Alex Rivera'
LIMIT 1;

INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'Figma library is complete and synced! Teams can start using it immediately.',
  NOW() - INTERVAL '66 days'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Implement Company-Wide Design System from Scratch'
AND p.name = 'Olivia Martinez'
LIMIT 1;

INSERT INTO messages (challenge_id, sender_profile_id, content, created_at)
SELECT 
  c.id,
  p.id,
  'All accessibility checks passed! WCAG 2.1 AA compliant across the board.',
  NOW() - INTERVAL '65 days'
FROM challenges c
CROSS JOIN profiles p
WHERE c.title = 'Implement Company-Wide Design System from Scratch'
AND p.name = 'Sarah Chen'
LIMIT 1;
