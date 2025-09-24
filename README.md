# HealthConnect - Base Mini App

A mobile and web application connecting public health professionals, students, and advocates to resources, networking, and advocacy opportunities.

## Features

- **Professional Connections**: Connect with public health professionals based on expertise and interests
- **Opportunity Board**: Browse curated job postings, internships, and project opportunities
- **Advocacy Campaigns**: Join or create structured advocacy campaigns with clear calls to action
- **Resource Library**: Access curated public health data, research, and educational materials

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Base Integration**: MiniKit for Base Mini App functionality
- **TypeScript**: Full type safety throughout the application
- **Icons**: Lucide React for consistent iconography

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy `.env.local` and update with your API keys:
   ```bash
   cp .env.local .env.local
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main application component
│   ├── providers.tsx      # MiniKit provider setup
│   ├── loading.tsx        # Loading UI
│   └── error.tsx          # Error boundary
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── ProfileCard.tsx   # User profile display
│   ├── OpportunityListItem.tsx # Job/opportunity display
│   ├── CampaignCard.tsx  # Campaign display
│   ├── ResourceCard.tsx  # Resource display
│   ├── Navigation.tsx    # Bottom navigation
│   └── Header.tsx        # App header
├── lib/                  # Utilities and types
│   ├── types.ts          # TypeScript type definitions
│   ├── utils.ts          # Utility functions
│   ├── constants.ts      # App constants
│   └── mock-data.ts      # Mock data for development
└── public/               # Static assets
```

## Design System

The app features a comprehensive design system with:

### Theme System
- **Light/Dark Mode**: Automatic system detection with manual toggle
- **CSS Variables**: HSL-based color system for consistent theming
- **Theme Provider**: React context for theme management across components

### Colors
- **Primary**: Professional blue palette (HSL 210 40% variants)
- **Accent**: Health-focused green palette (HSL 160 70% variants)
- **Semantic**: Success, warning, error, and info colors
- **Surface**: Layered background system for depth
- **Text**: Hierarchical text colors with proper contrast ratios

### Typography
- **Font**: Inter with optimized loading and font features
- **Scale**: Responsive text scales from caption to display
- **Utilities**: Line clamping, gradient text effects

### Components
- **Buttons**: Primary, outline, ghost, and destructive variants
- **Forms**: Enhanced inputs with focus states and validation
- **Cards**: Interactive cards with hover effects and glass morphism
- **Navigation**: Accessible tab navigation with ARIA support
- **Loading States**: Skeleton loaders and animated spinners

### Animations
- **Micro-interactions**: Hover effects, scale transforms, and transitions
- **Page Transitions**: Fade-in, slide-up, and staggered animations
- **Accessibility**: Respects prefers-reduced-motion preference

## Base Mini App Integration

This app is built as a Base Mini App using:

- **MiniKit Provider**: Handles Base chain integration and wallet connectivity
- **Context Access**: Leverages Farcaster user context for seamless onboarding
- **Mobile-First**: Optimized for mobile experience within Base App

## Development

### Adding New Features

1. Define types in `lib/types.ts`
2. Create components in `components/`
3. Add mock data in `lib/mock-data.ts`
4. Update navigation and routing as needed

### Styling Guidelines

- Use Tailwind CSS classes
- Follow the design system tokens
- Ensure mobile-first responsive design
- Maintain accessibility standards

## Deployment

The app is ready for deployment on Vercel or any Next.js-compatible platform:

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
