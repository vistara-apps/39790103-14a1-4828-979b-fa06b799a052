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

The app uses a custom design system with:

- **Colors**: Professional health-focused palette with primary blue and accent green
- **Typography**: Inter font with defined text scales
- **Components**: Modular, reusable components with consistent styling
- **Motion**: Subtle animations for enhanced user experience

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
