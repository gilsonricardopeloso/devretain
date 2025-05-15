# DevRetain - Knowledge Retention System

DevRetain is a comprehensive system designed to reduce the impact of knowledge loss when key technical staff leave an organization. It provides tools for mapping knowledge distribution, documenting technical decisions, and accelerating onboarding processes.

## Project Structure

This project consists of two main parts:

1. **Frontend**: React.js application with TypeScript
2. **Backend**: NestJS API with PostgreSQL database

## Features

- Knowledge Mapping and Heat Maps
- Technical Decision Documentation
- Onboarding Acceleration
- Structured Offboarding Process
- Career Development Tracking

## Getting Started

### Prerequisites

- Node.js 16+
- PostgreSQL 14+
- Docker (optional, for containerized database)

### Installation

#### Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start PostgreSQL using Docker
docker-compose up -d

# Start the development server
npm run dev
```

#### Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Default Users

The system comes with two pre-configured users for testing:

1. **Admin User**:

   - Email: admin@example.com
   - Password: admin123

2. **Regular User**:
   - Email: user@example.com
   - Password: user123

## Tech Stack

### Frontend

- Vite as bundler
- React.js (version 19) with hooks
- TypeScript for static typing
- PWA for mobile and offline experience
- Axios for HTTP requests
- Radix UI for accessible components
- TailwindCSS for styling
- Zod for schema validation

### Backend

- NestJS as framework
- JWT for authentication
- Bcrypt for password hashing
- Passport for authentication strategies
- Drizzle ORM for database access
- PostgreSQL as database

## License

MIT
