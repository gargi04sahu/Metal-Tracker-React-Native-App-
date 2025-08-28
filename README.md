# MetalTracker - React Native App 🥇

A comprehensive real-time precious metals price tracking application built with React Native and TypeScript. Track live prices for Gold, Silver, Platinum, and Palladium in Indian Rupees with detailed market analytics.

## ✨ Features

- **🔴 Live Price Updates** - Real-time metal prices refreshed every 30 seconds
- **📊 Multiple Metals** - Track Gold (24K), Silver, Platinum, and Palladium  
- **₹ Indian Rupee Pricing** - All prices displayed in INR
- **📈 Detailed Market Data** - Previous open/close, daily highs/lows, 52-week ranges
- **📱 Mobile Navigation** - Seamless stack navigation between screens
- **🎨 Professional UI** - Dark theme with gold accents and modern design
- **⚡ Error Handling** - Graceful fallbacks and loading states
- **🌐 Cross-Platform** - Runs on Android, iOS, and Web
- **🚀 Demo Mode** - Works without API key for testing

## 🛠️ Quick Setup

### Prerequisites
- **Node.js** 18+ 
- **Expo CLI**: `npm install -g @expo/cli`
- **Expo Go** app (for mobile testing)
- **Gold-API.io** account (optional - demo mode available)

### Installation

1. **Create Expo project:**
   ```bash
   npx create-expo-app@latest MetalTrackerFresh --template blank-typescript
   cd MetalTrackerFresh
   ```

2. **Install required dependencies:**
   ```bash
   # Navigation dependencies
   npm install @react-navigation/native @react-navigation/stack
   npm install react-native-screens react-native-safe-area-context 
   npm install react-native-gesture-handler react-native-reanimated
   
   # Web support
   npx expo install @expo/metro-runtime react-dom react-native-web
   ```

3. **Copy project files:**
   - Copy all files from this repository to your project
   - Replace `App.tsx` with provided version
   - Add `src/` folder structure

4. **Configure API (Optional):**
   - Get free API key from [Gold-API.io](https://www.goldapi.io/)
   - Replace `'your-api-key'` in `src/services/MetalApiService.ts`
   - **Note:** App works in demo mode without API key

## 🚀 Running the App

### 📱 Mobile (Expo Go)
```bash
# Basic start - auto-detects best connection
npx expo start

# Local network mode  
npx expo start --localhost

# Clear cache and start
npx expo start --clear
```

# Try this if network issues are coming
npx expo start --lan
```

Then scan QR code with **Expo Go** app on your phone.

### 🌐 Web Browser  
```bash
# Start web version
npx expo start --web

# Web with cache clear
npx expo start --web --clear
```
Opens automatically in browser - perfect for development!

### 🔧 Troubleshooting Connection Issues
```bash
# If tunnel timeout:
npx expo start --lan

# If network issues:
npx expo start --localhost

# Nuclear option:
npx expo start --clear --reset-cache
```

## 📁 Project Structure
```
MetalTrackerFresh/
├── App.tsx                      # Main navigation setup
├── src/
│   ├── types/
│   │   └── MetalTypes.ts        # TypeScript interfaces & types
│   ├── services/
│   │   └── MetalApiService.ts   # API service & demo data
│   ├── components/
│   │   └── MetalCard.tsx        # Metal price card component
│   └── screens/
│       ├── HomeScreen.tsx       # Main screen with all metals  
│       └── MetalDetailScreen.tsx # Detailed metal view
├── package.json
└── README.md
```
## 🔌 API Integration
### Gold-API.io Setup
- **Website**: [Gold-API.io](https://www.goldapi.io/)  
- **Free Plan**: 1,000 requests/month
- **Endpoint**: `https://www.goldapi.io/api/{SYMBOL}/INR`
- **Metals**: XAU (Gold), XAG (Silver), XPT (Platinum), XPD (Palladium)
- **Currency**: Indian Rupees only
- **Rate Limit**: 30-second refresh intervals
### Demo Mode (Current Default)
The app includes realistic sample data:
```javascript
// Gold: ₹6,247.50 (+0.68%)
// Silver: ₹78.25 (-1.45%)  
// Platinum: ₹2,834.75 (+0.66%)
// Palladium: ₹3,156.80 (-0.80%)
```
## 🎨 UI Components
### MetalCard Features
- **Live Pricing** - Current price with change indicators
- **Color Coding** - Green/red for price movements  
- **Metal Icons** - Unique colors for each metal
- **Loading States** - Smooth spinners during updates
- **Error Handling** - Graceful failure messages
### Screen Navigation
- **Stack Navigation** - Smooth transitions
- **Back Gestures** - iOS-style navigation
- **Header Styling** - Custom dark theme headers
## 🚨 Common Issues & Solutions
### 1. "Failed to download remote update"
```bash
# Clear Expo cache
npx expo start --clear
# Try local mode
npx expo start --localhost
# Ultimate fix - clear everything
rm -rf node_modules
npm install
npx expo start --clear
```
### 2. "HTTP error! status: 403"
- ❌ **API key invalid** - Check Gold-API.io dashboard
- ❌ **Request limit exceeded** - Wait for monthly reset
- ✅ **Use demo mode** - Already configured as fallback
### 3. "Metro bundler took too long"  
```bash
# Clear Metro cache
npx expo start --clear --reset-cache
# Alternative: Delete cache manually
rm -rf node_modules/.cache
```
### 4. "ngrok tunnel timeout"
```bash
# Use local network instead
npx expo start --lan
# Or localhost mode
npx expo start --localhost
```
## 🛠️ Technology Stack
- **Framework**: React Native + Expo SDK 49+
- **Language**: TypeScript for type safety
- **Navigation**: React Navigation 6.x stack navigator  
- **HTTP**: Fetch API for Gold-API.io requests
- **State**: React hooks (useState, useEffect)
- **Styling**: React Native StyleSheet with dark theme
- **Platform**: iOS, Android, Web support
## 🔥 Performance Features
- **Auto Refresh** - 30-second intervals with cleanup
- **Memory Efficient** - Proper useEffect cleanup
- **Fast Loading** - Optimized component rendering
- **Offline Ready** - Demo data when network fails
- **Type Safe** - Full TypeScript coverage
## 🚀 Deployment Options
### Expo Go (Development)
- Instant testing on device
- Hot reload for development
- No app store required
### EAS Build (Production)
```bash
# Install EAS CLI
npm install -g @expo/eas-cli
# Build for app stores
eas build --platform all
```
### Web Deployment
```bash
# Build web version
npx expo export:web
# Deploy to Vercel/Netlify
# Upload dist/ folder
```
## 🔮 Future Enhancements
- [ ] **Price Alerts** - Push notifications
- [ ] **Charts** - Historical price graphs  
- [ ] **Themes** - Light/dark mode toggle
- [ ] **Currencies** - Multi-currency support
- [ ] **Favorites** - Custom metal watchlists
- [ ] **Export** - Price data export
- [ ] **Widgets** - Home screen widgets
## 🤝 Contributing
1. **Fork** the repository
2. **Create** feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** branch: `git push origin feature/amazing-feature`  
5. **Open** pull request
## 📄 License
**MIT License** - Free to use, modify, and distribute.
## 🙋‍♂️ Support
Need help? Check these resources:
- 📖 [Expo Documentation](https://docs.expo.dev/)
- 🔧 [React Navigation Docs](https://reactnavigation.org/)
- 🥇 [Gold-API.io API Docs](https://www.goldapi.io/docs)
---
**Built with ❤️ using React Native + TypeScript**
*Real-time precious metals tracking made simple and beautiful.* ✨
