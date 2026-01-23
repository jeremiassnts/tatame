# Tatame App 🥋

Mobile application for martial arts gym management, built with [Expo](https://expo.dev) and React Native.

## Prerequisites

- Node.js 22.3.0 or higher
- npm or yarn
- Expo CLI
- EAS CLI (for builds): `npm install -g eas-cli`

### For Android

- Java 17 (OpenJDK)
- Android SDK
- Android Studio (optional, but recommended)

### For iOS

- macOS
- Xcode (latest version)
- Apple Developer Account

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Builds

### Android

Available Android build scripts:

```bash
# Development build
./scripts/eas-build-dev.sh

# Preview build
./scripts/eas-build-preview.sh

# Production build
./scripts/eas-build-production.sh
```

Android configurations:

- ✅ Package: `com.anonymous.tatame`
- ✅ Google Services configured
- ✅ Adaptive Icon
- ✅ Edge-to-Edge enabled

### iOS

Available iOS build scripts:

```bash
# Development build (simulator)
./scripts/ios-build-dev.sh

# Preview build (TestFlight)
./scripts/ios-build-preview.sh

# Production build (App Store)
./scripts/ios-build-production.sh
```

iOS configurations:

- ✅ Bundle Identifier: `com.anonymous.tatame`
- ✅ Tablet support
- ✅ Permissions configured (camera, microphone, photos, location)
- ✅ Icon and splash screen

📖 **[Complete iOS build guide](./docs/ios-build-guide.md)**

## Project Structure

```
tatame/
├── src/
│   ├── app/          # Routes and screens (file-based routing)
│   ├── components/   # Reusable components
│   ├── api/          # API hooks and queries
│   ├── hooks/        # Custom hooks
│   ├── constants/    # Constants and configs
│   └── utils/        # Utility functions
├── assets/           # Images and resources
├── scripts/          # Build and utility scripts
└── docs/             # Documentation
```

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
