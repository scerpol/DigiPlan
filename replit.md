# DigiPlan - Cadastral Floor Plan Digitization Service

## Overview

DigiPlan is a landing page and contact form application for a floor plan digitization service targeting real estate agencies. The service transforms old cadastral floor plans into modern digital representations. The application features an Apple-inspired minimalist design with a hero section, pricing tiers, and a contact form that sends inquiries via email.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: shadcn/ui component library (Radix UI primitives)
- **Animations**: Framer Motion for scroll effects and transitions
- **Forms**: React Hook Form with Zod validation

The frontend is a single-page application with a landing page structure containing:
- Hero section with gradient background
- About section
- Transformation examples (before/after comparisons)
- Pricing cards (Base €50, Premium €70, Professional €100)
- Contact form with file attachment support

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **Build Tool**: esbuild for production bundling, Vite for development
- **API Pattern**: REST endpoints defined in shared route schemas

The server handles:
- Static file serving in production
- Contact form submission via `/api/inquiries`
- Email sending through SendGrid

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts`
- **Migrations**: Drizzle Kit (`drizzle-kit push`)

Current schema includes an `inquiries` table for storing contact form submissions with fields for name, email, selected package, message, and optional attachment URL.

### Shared Code Pattern
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts`: Drizzle table definitions and Zod schemas
- `routes.ts`: API endpoint definitions with input/output validation schemas

This pattern ensures type safety across the full stack.

## External Dependencies

### Email Service
- **Provider**: SendGrid
- **Configuration**: Requires `SENDGRID_API_KEY_2` environment variable
- **Usage**: Sends contact form submissions to `digiplanservice@gmail.com`
- **Features**: Supports base64-encoded file attachments

### Database
- **Provider**: PostgreSQL (connection via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema-to-validation integration
- **Session Store**: connect-pg-simple for Express sessions (available but not currently active)

### Development Tools
- **Vite Plugins**: Replit-specific plugins for development banners, error overlays, and cartographer
- **Build Process**: Custom build script using esbuild with dependency bundling allowlist for faster cold starts