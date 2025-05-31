# URL Shortener

A modern URL shortening service built with a microservices architecture.

## Architecture

The system follows a clean architecture pattern with the following components:
![Architecture Diagram](https://i.ibb.co/Gv8FWkS7/2025-04-14-00-33.png)

Alternative: https://postimg.cc/PpMch3yw
Alternative: https://ibb.co/3yjkpWZ1

## How to run the backend
```bash
cd server
docker-compose up
```

In another terminal run Prisma migrations to create the database:
```bash
docker exec api_deep npx prisma migrate deploy --schema=./src/infrastructure/persistence/prisma/schema.prisma
```

## How to run the frontend
```bash
cd web
npm install
npm run dev
```

The frontend will be available at http://localhost:3001

### Key Components:
- Dashboard UI: Web interface for managing short URLs
- URL Creation/Modification Service
- URL Redirection Service
- Analytics Service
- Slug Generator Service

## Tech Stack

### Frontend
- Next.js 15.3
- React 18.2
- Chakra UI
- Apollo Client for GraphQL
- TypeScript

### Backend
- NestJS 11
- GraphQL with Apollo Server
- Prisma 6.6 ORM
- PostgreSQL 16
- Redis 7 for caching
- Apache Kafka 7.5.1 for event streaming
- Docker & Docker Compose
- TypeScript

## Features
- Custom slug creation
- URL redirection
- Visit analytics
- Real-time slug availability
- Caching for high-performance
- Event-driven architecture
- Scalable microservices design

## System Design
- Automatic slug generation every 2 minutes
- Two-layer caching system (available slugs and redirects)
- Event-based analytics tracking
- Clean architecture with clear separation of concerns
- Horizontally scalable services

## Development
The project uses Docker Compose for local development, which sets up:
- PostgreSQL database
- Redis cache
- Kafka & Zookeeper for event streaming
- API service with hot-reload
