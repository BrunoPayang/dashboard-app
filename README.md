# School Dashboard - Student Management System

A modern React-based web application for school staff to manage students, academic records, and school operations.

## Features

- **Authentication**: JWT-based authentication with role-based access control
- **Student Management**: CRUD operations for student records
- **Academic Records**: Manage transcripts, behavior reports, and payment records
- **Parent Management**: Link parents to students and manage communication
- **Notifications**: Send targeted notifications to parents and staff
- **File Management**: Upload and organize school documents
- **Reports & Analytics**: Generate insights and reports
- **School Branding**: Customizable themes and branding per school

## Tech Stack

- **Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit + RTK Query
- **UI Library**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **Form Handling**: React Hook Form + Yup validation
- **HTTP Client**: Axios with interceptors

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Buttons, inputs, modals
│   ├── layout/          # Header, sidebar, navigation
│   ├── forms/           # Form components and validation
│   └── charts/          # Data visualization components
├── pages/               # Main application pages
│   ├── dashboard/       # Main dashboard view
│   ├── students/        # Student management
│   ├── parents/         # Parent management
│   ├── academics/       # Academic records
│   ├── notifications/   # Notification system
│   ├── files/           # File management
│   ├── reports/         # Analytics and reporting
│   └── settings/        # School configuration
├── features/            # Redux slices and API logic
├── services/            # API services and utilities
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── constants/           # Application constants
└── styles/              # Global styles and themes
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Backend API running (Django REST API)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set environment variables:
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_BASE_URL=https://schoolconnect-qeaf.onrender.com/api
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This application is configured for deployment on Render. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Render

1. **Connect Repository**: Go to [Render Dashboard](https://dashboard.render.com) and connect your Git repository
2. **Configure Build**: Use the provided `render.yaml` configuration
3. **Set Environment Variables**: Configure the required environment variables
4. **Deploy**: Click deploy and your app will be live!

### Production Build

```bash
# Build for production
npm run build

# Build with production optimizations
npm run build:production
```

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## API Integration

The dashboard integrates with the Django REST API backend. Make sure the backend is running and accessible at the URL specified in `REACT_APP_API_BASE_URL`.

### Authentication

The app uses JWT authentication:
- Login with username/password
- Automatic token refresh
- Protected routes for authenticated users

### API Endpoints

- **Authentication**: `/api/auth/`
- **Students**: `/api/students/`
- **Parents**: `/api/parents/`
- **Academics**: `/api/transcripts/`, `/api/behavior-reports/`
- **Files**: `/api/files/`
- **Notifications**: `/api/notifications/`
- **School**: `/api/schools/`

## Development

### Adding New Features

1. Create new API endpoints in the appropriate feature file
2. Add new pages in the `pages/` directory
3. Update routing in `App.tsx`
4. Add navigation items in `Sidebar.tsx`

### State Management

- Use Redux Toolkit for global state
- Use RTK Query for API state management
- Local component state for UI-specific state

### Styling

- Material-UI components for consistent design
- Custom theme configuration in `styles/theme.ts`
- Responsive design with Material-UI breakpoints

## Deployment

### Production Build

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `build/` folder to your hosting service

### Environment Variables

Set production environment variables:
```env
REACT_APP_API_BASE_URL=https://schoolconnect-qeaf.onrender.com/api
```

## Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Follow Material-UI design patterns
4. Write tests for new features
5. Update documentation as needed

## License

This project is part of the EduSync Niger Student Management System.
