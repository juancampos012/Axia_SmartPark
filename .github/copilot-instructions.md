# Axia SmartPark - AI Coding Agent Instructions

## Project Overview
React Native + Expo mobile app for smart parking management. Built with TypeScript, Expo Router (file-based routing), NativeWind (Tailwind CSS), and React Hook Form + Zod validation.

## Architecture

### Directory Structure
- **`app/`**: File-based routing (expo-router). Nested layouts: `(auth)`, `(tabs)` for authenticated flows
- **`components/`**: Atomic Design pattern
  - `atoms/`: Basic UI (Button, Input, Badge, Card)
  - `molecules/`: Composite components (ParkingCard, SearchHeader)
  - `organisms/`: Complex features (ParkingsList, FilterSection)
  - Export via `components/index.ts` barrel file
- **`hooks/`**: Custom React hooks - ALWAYS use these for screen logic (e.g., `useHomeDashboard`, `useParkingsScreen`)
- **`libs/`**: API client functions - centralized in `http-client.ts`
- **`interfaces/`**: TypeScript types for API entities
- **`schemas/`**: Zod validation schemas (e.g., `carSchema.ts`, `loginSchema.ts`)
- **`context/`**: Global state via React Context (`AuthContext.tsx`)

### Key Architectural Patterns

#### 1. Screen Logic in Custom Hooks
**NEVER write business logic directly in screen components**. Every screen should have a corresponding hook in `hooks/`:
```tsx
// ✅ CORRECT: app/(tabs)/home/index.tsx
const { stats, nearbyParkings, loading, handleRefresh } = useHomeDashboard();

// ❌ WRONG: Don't write useState/useEffect/fetch logic in screens
```

#### 2. Authentication & Session Management
- **`AuthContext`** (`context/AuthContext.tsx`): Single source of truth for user state
  - Provides: `user`, `isAuthenticated`, `isAdmin`, `isOperator`, `parkingId`
  - Automatic JWT refresh before expiration (see `utils/jwtUtils.ts`)
  - Network connectivity monitoring
- **`http-client.ts`**: Auto-injects access tokens, handles 401 refresh retry with lock mechanism
- **AsyncStorage keys**: `accessToken`, `refreshToken`, `userData`

#### 3. API Integration Pattern
```typescript
// libs/[feature].ts structure:
export async function fetchSomething(): Promise<Type> {
  return httpClient<Type>('/endpoint'); // Auth handled automatically
}
```
API URL: Configured in `eas.json` per environment (`EXPO_PUBLIC_API_BASE_URL`)

#### 4. Navigation (Expo Router)
- Use `router.push()` for stacking, `router.replace()` for auth flows
- Screen refresh: `useFocusEffect` (not `useEffect`) - critical for data freshness when navigating back
- Protected routes: Check `isAuthenticated` in `_layout.tsx` files

#### 5. Form Validation
Use React Hook Form + Zod:
```tsx
const form = useForm<CarFormData>({
  resolver: zodResolver(CarSchema), // schemas/carSchema.ts
});
```
Colombian vehicle plates validated: Cars `ABC123`, Motorcycles `ABC12D`

## Styling & Design System

### Colors (Tailwind Config)
Reference `IDENTIDAD_VISUAL.md` and `tailwind.config.js`:
- **Primary**: `axia-green` (#006B54), `axia-purple` (#780BB7), `axia-blue` (#093774)
- **Neutrals**: `axia-black`, `axia-darkGray`, `axia-gray`, `axia-white`
- **Parking states**: `parking-available`, `parking-occupied`, `parking-reserved`, `parking-disabled`

### Component Guidelines
- Use NativeWind classes: `className="bg-axia-green rounded-lg p-4"`
- Haptic feedback: `<Button hapticFeedback="light" />` (Button component has built-in support)
- Fonts: Inter (regular/semibold), Poppins (medium/bold) - loaded in `app/_layout.tsx`

## Critical Workflows

### Development Commands
```powershell
npm start          # Start Expo dev server
npm run android    # Run on Android (requires emulator/device)
npm run ios        # Run on iOS (macOS only)
```

### EAS Build (Expo Application Services)
```powershell
eas build --profile development  # Dev build with API: http://192.168.39.131:3001/api
eas build --profile preview      # Preview/production: https://api.axiasmartpark.lat/api
```
Profiles defined in `eas.json` with environment-specific `EXPO_PUBLIC_API_BASE_URL`

### Environment Variables
- **Local**: `.env` file (NOT committed, see `.env.example`)
- **EAS Builds**: Defined in `eas.json` > `build.[profile].env`
- **Runtime access**: `Constants.expoConfig.extra.EXPO_PUBLIC_API_BASE_URL`

## Security Notes (See SECURITY_REMEDIATION.md)
- **NEVER commit** API keys, tokens, or secrets
- Google Maps keys moved to `.env` (already migrated to Mapbox - see `MAPBOX_MIGRATION.md`)
- API_BASE_URL handled via `app.config.js` dynamic config

## Role-Based Access Control
- **USER**: Default role (client)
- **OPERATOR**: Manages parking spots/floors for assigned parking
- **ADMIN**: Full access to user/parking management
- Check roles via `AuthContext`: `isAdmin`, `isOperator`, `isAdminOrOperator`
- Use `<RoleGuard allowedRoles={['ADMIN']}>` component for UI gating

## Common Pitfalls
1. **Don't use `useEffect` for screen refresh** - use `useFocusEffect` from expo-router
2. **Don't call APIs directly** - use functions from `libs/` folder
3. **Don't handle token refresh manually** - `http-client.ts` does it automatically
4. **Don't forget screen hooks** - check `hooks/` for existing logic before creating new
5. **Network state**: AuthContext provides `isConnected` - handle offline gracefully

## Testing & Debugging
- Logs: Check `console.log` with prefixes (e.g., `👤 AuthContext`, `🔄 Refreshing token`)
- Token expiry: Auto-refresh happens 5 minutes before expiration (see `jwtUtils.ts`)
- Reservation polling: `useReservationPolling` handles active reservation state updates

## Key Files Reference
- **Auth flow**: `context/AuthContext.tsx`, `libs/auth.ts`, `utils/jwtUtils.ts`
- **API client**: `libs/http-client.ts` (base URL, token injection, error handling)
- **Navigation guard**: `app/_layout.tsx` (AuthProvider wraps Stack)
- **Design tokens**: `tailwind.config.js`, `IDENTIDAD_VISUAL.md`
- **Map integration**: Migrated from Google Maps to Mapbox (see `MAPBOX_MIGRATION.md`)
