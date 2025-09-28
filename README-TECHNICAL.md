# CharlyGG Motors - Technical Documentation

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Google Cloud Console account (for OAuth)

### Installation
```bash
# Clone the repository
git clone https://github.com/David-sudo-droid/charlygg.git
cd charlygg

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

### Environment Variables
```env
VITE_SUPABASE_PROJECT_ID="ioszhuazyewkesfbdmxa"
VITE_SUPABASE_PUBLISHABLE_KEY="your_supabase_anon_key"
VITE_SUPABASE_URL="https://ioszhuazyewkesfbdmxa.supabase.co"
```

---

## 🏗️ Architecture Overview

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth + OAuth
- **State Management**: React Context + useState
- **Routing**: React Router v6

### Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn/ui base components
│   ├── Header.tsx       # Navigation header
│   ├── Hero.tsx         # Landing page hero section
│   ├── SearchSection.tsx # Advanced search interface
│   ├── ListingsGrid.tsx # Listings display grid
│   └── ListingCard.tsx  # Individual listing cards
├── contexts/            # React Context providers
│   └── AuthContext.tsx  # Authentication state management
├── pages/               # Route components
│   ├── Index.tsx        # Main landing page
│   ├── Auth.tsx         # Login/signup page
│   └── Admin.tsx        # Admin dashboard
├── integrations/        # External service integrations
│   └── supabase/        # Supabase client and types
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
└── data/                # Static data and types
```

---

## 🗄️ Database Schema

### Tables

#### `profiles`
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `listings`
```sql
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('car', 'property')),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'KSH',
  location TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  whatsapp_number TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Indexes
- `idx_listings_type` - Query optimization for car/property filtering
- `idx_listings_location` - Location-based search optimization
- `idx_listings_price` - Price range filtering optimization
- `idx_listings_featured` - Featured listings priority
- `idx_listings_created_at` - Chronological sorting

### Row Level Security (RLS)
```sql
-- Anyone can view listings
CREATE POLICY "Anyone can view listings" ON listings
  FOR SELECT USING (true);

-- Users can manage own profiles
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Authenticated users can create listings
CREATE POLICY "Authenticated users can insert listings" ON listings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

---

## 🔐 Authentication System

### AuthContext Implementation
```typescript
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<void>;
}
```

### OAuth Setup (Google)
1. **Google Cloud Console Configuration**:
   - Create OAuth 2.0 Client ID
   - Add redirect URI: `https://ioszhuazyewkesfbdmxa.supabase.co/auth/v1/callback`
   - Enable Google+ API

2. **Supabase Configuration**:
   - Authentication → Providers → Google
   - Add Client ID and Client Secret
   - Enable Google provider

### Automatic Profile Creation
Database trigger automatically creates user profiles:
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 🔍 Search System Architecture

### SearchSection Component
**File**: `src/components/SearchSection.tsx`

**Key Features**:
- Tab-based interface (Cars/Properties)
- Real-time database statistics
- Advanced filtering capabilities
- Responsive design

**Search Query Building**:
```typescript
const handleSearch = async () => {
  let query = supabase.from('listings').select('*');
  
  // Filter by type
  query = query.eq('type', activeTab === 'cars' ? 'car' : 'property');
  
  // Location filtering
  if (filters.location) {
    query = query.ilike('location', `%${filters.location}%`);
  }
  
  // Text search
  if (filters.category) {
    query = query.or(`title.ilike.%${filters.category}%,description.ilike.%${filters.category}%`);
  }
  
  // Price range filtering
  if (filters.priceRange) {
    const [min, max] = filters.priceRange.split('-').map(p => p.replace('+', ''));
    if (max) {
      query = query.gte('price', parseInt(min)).lte('price', parseInt(max));
    } else {
      query = query.gte('price', parseInt(min));
    }
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
};
```

### Filter Options
- **Location**: City-based filtering
- **Price Range**: Predefined ranges for cars/properties
- **Year**: For vehicles
- **Condition**: New/Used/Certified
- **Property Type**: House/Apartment/Land/Commercial
- **Bedrooms**: For properties

---

## 🎨 Design System

### Color Palette
```css
:root {
  /* Primary Colors */
  --primary: 214 84% 56%;           /* Professional Blue */
  --primary-foreground: 0 0% 98%;   /* White */
  
  /* Accent Colors */
  --accent: 214 84% 56%;            /* Matching Blue */
  --accent-foreground: 0 0% 98%;    /* White */
  
  /* Neutral Colors */
  --background: 0 0% 100%;          /* Pure White */
  --foreground: 210 11% 15%;        /* Dark Gray */
  --muted: 210 40% 98%;             /* Light Gray */
  --muted-foreground: 210 11% 71%;  /* Medium Gray */
  
  /* Border & Input */
  --border: 214 32% 91%;            /* Light Blue Gray */
  --input: 214 32% 91%;             /* Light Blue Gray */
}
```

### Typography Scale
- **Hero Heading**: `text-4xl md:text-5xl lg:text-6xl`
- **Section Headings**: `text-3xl md:text-4xl`
- **Card Titles**: `text-xl font-semibold`
- **Body Text**: `text-base`
- **Caption Text**: `text-sm text-muted-foreground`

### Component Patterns
- **Cards**: White background, subtle border, hover shadow
- **Buttons**: Primary blue, rounded corners, smooth transitions
- **Forms**: Clean inputs with proper spacing and validation
- **Navigation**: Minimal, professional styling

---

## 📱 Responsive Design

### Breakpoints
```css
/* Tailwind CSS Breakpoints */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Small desktops */
xl: 1280px  /* Large desktops */
2xl: 1536px /* Extra large screens */
```

### Mobile-First Approach
- **Grid Layouts**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Navigation**: Hamburger menu with slide-out panel
- **Search**: Stacked filters on mobile
- **Typography**: Responsive scaling with viewport units

---

## 🚀 Performance Optimizations

### Database Optimizations
- **Indexed Queries**: All filterable columns have indexes
- **Efficient Joins**: Minimal data fetching with proper SELECT statements
- **Query Optimization**: Use of appropriate WHERE clauses and LIMIT

### Frontend Optimizations
- **Code Splitting**: Route-based code splitting with React.lazy
- **Image Optimization**: Optimized images with proper sizing
- **Bundle Size**: Tree-shaking enabled, minimal bundle size
- **Caching**: Browser caching for static assets

### Search Performance
- **Debounced Input**: 300ms delay for search input
- **Cached Results**: Recent search results cached in memory
- **Pagination Ready**: Infrastructure for paginated results

---

## 🧪 Testing Strategy

### Component Testing
```typescript
// Example test structure
describe('SearchSection', () => {
  it('should render search form', () => {
    render(<SearchSection />);
    expect(screen.getByPlaceholderText('Search by make, model...')).toBeInTheDocument();
  });
  
  it('should handle tab switching', () => {
    // Test implementation
  });
});
```

### Integration Testing
- **Authentication Flow**: Login/logout functionality
- **Search Functionality**: Filter combinations
- **Database Operations**: CRUD operations
- **Error Handling**: Network failures and edge cases

---

## 🔧 Development Workflow

### Git Workflow
```bash
# Feature development
git checkout -b feature/new-feature
git add .
git commit -m "feat: add new feature with proper description

Co-authored-by: factory-droid[bot] <138933559+factory-droid[bot]@users.noreply.github.com>"
git push origin feature/new-feature
```

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for React and TypeScript
- **Prettier**: Code formatting
- **Commit Messages**: Conventional commits format

### Database Migrations
```sql
-- Always use IF NOT EXISTS for safety
CREATE TABLE IF NOT EXISTS new_table (...);

-- Use transactions for complex changes
BEGIN;
  -- Migration steps
COMMIT;
```

---

## 🚀 Deployment Guide

### Prerequisites
- Supabase project configured
- Google OAuth credentials
- Domain/hosting provider

### Environment Setup
1. **Production Environment Variables**
2. **Database Setup**: Run `supabase-setup.sql`
3. **Authentication Setup**: Run `supabase-auth-setup.sql`
4. **OAuth Configuration**: Google Console + Supabase

### Build Process
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to hosting platform
# (Vercel, Netlify, etc.)
```

### Post-Deployment Checklist
- [ ] Database connectivity verified
- [ ] Authentication flow tested
- [ ] Search functionality working
- [ ] Mobile responsiveness confirmed
- [ ] Performance metrics acceptable
- [ ] Error monitoring configured

---

## 🐛 Troubleshooting

### Common Issues

#### 1. OAuth redirect_uri_mismatch
**Cause**: Incorrect redirect URI in Google Console
**Solution**: Ensure exact match: `https://ioszhuazyewkesfbdmxa.supabase.co/auth/v1/callback`

#### 2. Database Connection Issues
**Cause**: Incorrect Supabase credentials
**Solution**: Verify `.env` file and Supabase project settings

#### 3. Search Not Working
**Cause**: Missing database policies or indexes
**Solution**: Run `supabase-setup.sql` script

#### 4. Profile Creation Fails
**Cause**: Missing authentication triggers
**Solution**: Run `supabase-auth-setup.sql` script

### Debug Tools
- **React DevTools**: Component state inspection
- **Supabase Dashboard**: Database queries and logs
- **Browser DevTools**: Network requests and console errors
- **TypeScript**: Compile-time error checking

---

## 📞 Support & Maintenance

### Monitoring
- **Error Tracking**: Implement Sentry or similar
- **Performance Monitoring**: Core Web Vitals
- **Database Monitoring**: Supabase dashboard
- **User Analytics**: Privacy-compliant tracking

### Regular Maintenance
- **Dependency Updates**: Monthly security updates
- **Database Cleanup**: Archive old data
- **Performance Review**: Quarterly optimization
- **Backup Strategy**: Database and code backups

### Scaling Considerations
- **Database**: Connection pooling, read replicas
- **Frontend**: CDN implementation, caching
- **Search**: Elasticsearch for advanced search
- **File Storage**: Supabase Storage for images

---

This technical documentation provides a comprehensive guide for developers working on the CharlyGG Motors platform. For additional support or questions, refer to the main CHANGELOG.md for historical context and development decisions.
