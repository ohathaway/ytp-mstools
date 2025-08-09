# OHLaw MSTools 2

A Nuxt 4 application for Microsoft Office integration with Lawmatics CRM, featuring Firebase authentication and Vuetify UI components.

## Features

- **Microsoft Office Integration**: Built as an Office Add-in with Office.js support
- **Lawmatics CRM Integration**: Connect with Lawmatics API for contact and matter management
- **Firebase Authentication**: Secure user authentication
- **Vuetify UI**: Modern Material Design components
- **Fluent UI**: Microsoft Fluent Web Components integration
- **TypeScript Support**: Full TypeScript configuration
- **Cloudflare Pages**: Optimized for Cloudflare Pages deployment

## Tech Stack

- **Framework**: Nuxt 4 with Vue 3
- **UI Libraries**: Vuetify 3, Fluent UI Web Components
- **Authentication**: Firebase Auth
- **Database**: NuxtHub (Cloudflare D1)
- **Storage**: NuxtHub KV
- **Deployment**: Cloudflare Pages
- **Package Manager**: pnpm

## Prerequisites

- Node.js (recommended version)
- pnpm package manager
- Firebase project setup
- Lawmatics API credentials

## Environment Variables

Create a `.env` file with the following variables:

```env
BASIC_AUTH=your_basic_auth
LAWMATICS_TOKEN=your_lawmatics_token
LAWMATICS_URL=your_lawmatics_url
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
```

## Installation

```bash
# Install dependencies
pnpm install

# Prepare Nuxt
pnpm run postinstall
```

## Development

```bash
# Start development server with HTTPS
pnpm run dev

# Build for development and serve with Wrangler
pnpm run build:dev
```

## Production

```bash
# Build for production
pnpm run build

# Generate static files
pnpm run generate

# Preview production build
pnpm run preview
```

## Project Structure

- `app/` - Application source code
  - `components/` - Vue components organized by feature
  - `composables/` - Reusable composition functions
  - `middleware/` - Route middleware
  - `plugins/` - Nuxt plugins
  - `stores/` - Pinia state management
  - `utils/` - Utility functions
- `server/` - Server-side API routes and middleware
- `public/` - Static assets
- `doc/` - Documentation and reference files

## Key Components

- **Format Tools**: Text formatting utilities for Office documents
- **Lawmatics Integration**: Contact and matter search functionality
- **Field Management**: Dynamic field handling with relationships
- **Authentication**: Secure login/logout flow

## Development Notes

- Uses HTTPS in development for Office Add-in compatibility
- Configured for hash routing disabled (standard routing)
- SSR disabled for client-side rendering
- Vuetify auto-import enabled
- Custom element support for Fluent UI components

## License

Private project
