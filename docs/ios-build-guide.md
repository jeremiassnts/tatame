# iOS Build Guide

This guide contains the necessary instructions to configure and build the Tatame app for iOS.

## Prerequisites

### 1. Apple Developer Account

- Active Apple Developer account ($99/year)
- Access to Apple Developer Portal
- Certificates and provisioning profiles configured

### 2. Required Tools

- **macOS**: iOS builds can only be done on Mac
- **Xcode**: Latest stable version installed
- **Command Line Tools**: `xcode-select --install`
- **EAS CLI**: `npm install -g eas-cli`
- **Expo CLI**: Already included in project dependencies

### 3. EAS Login

```bash
eas login
```

## Configured Settings

### 1. app.json

iOS configurations already added:

- ✅ Bundle Identifier: `com.anonymous.tatame`
- ✅ App icon
- ✅ Tablet support
- ✅ Permissions (camera, microphone, photos, location)
- ✅ Build number

### 2. eas.json

Configured build profiles:

- ✅ **development**: Build for iOS simulator
- ✅ **preview**: Build for TestFlight (real devices)
- ✅ **production**: Build for App Store

## How to Build

### Development Build (Simulator)

```bash
# Using script
./scripts/ios-build-dev.sh

# Or directly
eas build --platform ios --profile development --local
```

### Preview Build (TestFlight)

```bash
# Using script
./scripts/ios-build-preview.sh

# Or directly
eas build --platform ios --profile preview --local
```

### Production Build (App Store)

```bash
# Using script
./scripts/ios-build-production.sh

# Or directly
eas build --platform ios --profile production --local
```

## Cloud EAS Builds

If you prefer cloud builds (no local Mac needed):

```bash
# Development
eas build --platform ios --profile development

# Preview
eas build --platform ios --profile preview

# Production
eas build --platform ios --profile production
```

**Advantages:**

- No local Mac required
- Automatic certificate setup
- Detailed logs

## Certificates and Provisioning Profiles

### Option 1: EAS Managed (Recommended)

EAS can automatically create and manage certificates and provisioning profiles:

```bash
eas credentials
```

### Option 2: Manual

1. Access [Apple Developer Portal](https://developer.apple.com)
2. Create distribution certificates
3. Create provisioning profiles
4. Configure in EAS:

```bash
eas credentials --platform ios
```

## Publishing

### TestFlight (Preview)

1. Build preview
2. Submit to App Store Connect:

```bash
eas submit --platform ios --profile preview
```

### App Store (Production)

1. Build production
2. Submit to App Store Connect:

```bash
eas submit --platform ios --profile production
```

3. Configure metadata in App Store Connect
4. Submit for review

## Additional Required Configurations

### 1. Google Services (iOS)

If the app uses Firebase/Google Services:

- Download `GoogleService-Info.plist` from Firebase Console
- Add to project:

```json
// In app.json
"ios": {
  "googleServicesFile": "./GoogleService-Info.plist"
}
```

### 2. Push Notifications

For iOS push notifications:

1. Configure in Apple Developer Portal
2. Create APNs key
3. Configure in Firebase/Expo

### 3. App Store Assets

Prepare:

- Screenshots (multiple sizes)
- App description
- Keywords
- Privacy policy URL
- Categories

## Troubleshooting

### Error: "No valid code signing identity"

Run:

```bash
eas credentials --platform ios
```

### Error: "Build failed"

Check:

- Detailed logs in terminal
- Compatible Xcode version
- Valid certificates

### Out of disk space error

Clear cache:

```bash
find /private/var/folders -name "*eas-build-local*" -type d -exec rm -rf {} +
```

## Useful Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Apple Developer Portal](https://developer.apple.com)
- [Expo iOS Configuration](https://docs.expo.dev/guides/ios/)

## First Build Checklist

- [ ] Active Apple Developer account
- [ ] EAS CLI installed and authenticated
- [ ] Bundle identifier configured
- [ ] Certificates configured (EAS or manual)
- [ ] Development build tested
- [ ] App tested on simulator
- [ ] Preview build created
- [ ] App tested on real device via TestFlight
- [ ] Screenshots and metadata prepared
- [ ] Production build created
- [ ] Submitted for App Store review
