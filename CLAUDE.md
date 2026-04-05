# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RehabHub is a professional rehabilitation assessment mobile application built with React + TypeScript + Capacitor. It provides video-based movement analysis using TensorFlow.js for Functional Movement Screen (FMS) assessments.

**Key characteristics:**
- Dual-mode architecture: standalone web app + pluggable widget
- Hybrid backend: Node.js Express (port 8001) for mock/dev + Python FastAPI (port 8000) for production
- Source code lives in `uploads/src/` (not `src/`)
- Mobile builds via Capacitor targeting iOS/Android
- Chinese language UI (康复宝)

## Development Commands

### Running the application
```bash
# Start both frontend and backend
npm run dev:all

# Frontend only (port 3000)
npm run dev

# Backend only (Node.js server on port 8001)
npm run server
```

### Building
```bash
# Standard web app build → dist/
npm run build

# Plugin/widget build → dist-plugin/
npm run build:plugin

# Android APK (requires Java 21)
cd android
./gradlew assembleDebug
```

### Testing
```bash
# Run tests once
npm test

# Tests use Vitest with jsdom environment
# Setup file: uploads/src/setupTests.ts
```

### Mobile development
```bash
# Sync web build to native projects
npx cap sync android
npx cap sync ios

# Open in Android Studio
npx cap open android
```

## Architecture

### Dual-mode system
The app can run as:
1. **Standalone app**: Full React SPA with routing and navigation
2. **Plugin widget**: Embeddable component exported via `plugin-entry.tsx`

Build mode controlled by Vite config - plugin mode bundles to UMD/ES modules with CSS injection.

### Backend split
- **Node.js server (server.js)**: Development mock API on port 8001
  - Handles file uploads (multer)
  - Stores data in JSON files (`data/assessment-results.json`, `data/reports.json`)
  - CORS enabled for local dev
  
- **Python FastAPI (backend/app/)**: Production business API on port 8000
  - Target architecture for all business logic
  - Currently being migrated to become single source of truth

**Important**: Frontend currently talks to both backends. Architecture goal is to consolidate to FastAPI only.

### Source structure
```
uploads/src/
├── components/     # UI components and pages
├── contexts/       # React contexts (navigation, state)
├── hooks/          # Custom React hooks
├── movements/      # 7 FMS movement analysis modules
├── services/       # API clients and data services
├── shared/         # Shared components
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── App.tsx         # Main app component
├── plugin-entry.tsx # Plugin mode entry point
└── main.tsx        # Standalone app entry point
```

### Path aliasing
`@/` maps to `uploads/src/` via Vite config.

### Navigation system
Custom hash-based routing via NavigationContext. Not using React Router. Navigation state managed through context with breadcrumb support.

## Key Technical Details

### Video analysis
- Uses TensorFlow.js with PoseNet model for pose detection
- Runs in browser (no server-side inference)
- Main analysis component: `uploads/src/VideoAnalysis.tsx`

### Mobile integration
- Capacitor config: `capacitor.config.ts`
- App ID: `com.rehabhub.app`
- Web build output: `dist/` (configured as `webDir`)
- Native projects in `android/` directory

### Data persistence
Currently split between:
- Browser localStorage (draft/cache)
- Node.js JSON files (`data/` directory)
- Target: migrate to FastAPI backend with proper database

### Testing setup
- Framework: Vitest
- Environment: jsdom
- Config in `vite.config.ts` under `test` key
- Setup file: `uploads/src/setupTests.ts`

## Common Issues

### Java version for Android builds
Requires Java 21. Scripts provided:
- `check-java-version.bat`
- `switch-to-java21.bat`
- See `JAVA_21_INSTALLATION_INSTRUCTIONS.md`

### Port conflicts
- Frontend: 3000
- Node backend: 8001
- Python backend: 8000 (when running)

### Build modes
Always specify which build you're doing:
- `npm run build` for web app
- `npm run build:plugin` for widget
- Different output directories and bundling strategies

## Documentation

- `PROJECT_OVERVIEW.md` - Comprehensive technical overview
- `API_INTERFACE_SPECIFICATION.md` - API contracts
- `ARCHITECTURE_API_TARGET_DRAFT.md` - Target architecture (migration plan)
- `DEVELOPMENT_ROADMAP.md` - Feature roadmap
- `AI_CODING_GUIDE.md` - AI-assisted development guidelines
- `CODE_REVIEW_GUIDE.md` - Review standards
