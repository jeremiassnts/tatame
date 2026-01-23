# iOS Configuration Details

This document summarizes all configurations made to enable iOS builds in the Tatame project.

## Configuration Date

January 14, 2026

---

## 1. app.json Configurations

### 1.1 Global Settings Added

```json
"icon": "./assets/images/icon.png",
"splash": {
  "image": "./assets/images/splash.png",
  "resizeMode": "contain",
  "backgroundColor": "#141414"
}
```

### 1.2 Complete iOS Section

```json
"ios": {
  "bundleIdentifier": "com.anonymous.tatame",
  "supportsTablet": true,
  "icon": "./assets/images/icon.png",
  "infoPlist": {
    "NSCameraUsageDescription": "Este app precisa de acesso à câmera para capturar fotos e vídeos.",
    "NSMicrophoneUsageDescription": "Este app precisa de acesso ao microfone para gravar vídeos com áudio.",
    "NSPhotoLibraryUsageDescription": "Este app precisa de acesso à biblioteca de fotos para salvar e carregar mídias.",
    "NSPhotoLibraryAddUsageDescription": "Este app precisa de permissão para salvar fotos na sua biblioteca.",
    "NSLocationWhenInUseUsageDescription": "Este app precisa de acesso à localização para mostrar academias próximas."
  },
  "buildNumber": "1"
}
```

**Details:**

- **bundleIdentifier**: Unique app identifier on App Store (same structure as Android)
- **supportsTablet**: App optimized for iPad
- **icon**: Main app icon
- **infoPlist**: Required permissions with Portuguese descriptions (shown to users)
- **buildNumber**: Build number (automatically incremented in production)

---

## 2. eas.json Configurations

### 2.1 Profile: Development

```json
"development": {
  "developmentClient": true,
  "distribution": "internal",
  "node": "22.3.0",
  "android": {
    "env": {
      "JAVA_HOME": "/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home",
      "ANDROID_HOME": "/Users/jeremiassantos/Library/Android/sdk"
    }
  },
  "ios": {
    "simulator": true
  }
}
```

- Build for iOS simulator
- No certificates required

### 2.2 Profile: Preview

```json
"preview": {
  "distribution": "internal",
  "node": "22.3.0",
  "android": { ... },
  "ios": {
    "simulator": false
  }
}
```

- Build for real devices
- Distribution via TestFlight
- Requires development certificates

### 2.3 Profile: Production

```json
"production": {
  "autoIncrement": true,
  "node": "22.3.0",
  "android": { ... },
  "ios": {
    "autoIncrement": true
  }
}
```

- Build for App Store
- Auto increment build number
- Requires distribution certificates

---

## 3. Build Scripts Created

### 3.1 `scripts/ios-build-dev.sh`

- Development build
- For iOS simulator
- No certificates required
- Useful for quick testing

### 3.2 `scripts/ios-build-preview.sh`

- Preview build
- For real devices via TestFlight
- Disk space verification
- Temporary files cleanup

### 3.3 `scripts/ios-build-production.sh`

- Production build for App Store
- Confirmation before starting
- Disk space verification
- Auto increment build number

**All scripts:**

- ✅ Are executable (`chmod +x`)
- ✅ Include disk space verification
- ✅ Clean EAS temporary files
- ✅ Follow Android scripts pattern

---

## 4. Created Documentation

### 4.1 `docs/ios-build-guide.md`

Complete guide with:

- Prerequisites
- Certificate configuration
- How to build
- App Store publishing
- Troubleshooting
- First build checklist

### 4.2 README.md updated

- iOS build information
- Available scripts
- Link to complete guide
- Project structure

---

## 5. Comparison: Android vs iOS

| Configuration         | Android                   | iOS                               |
| --------------------- | ------------------------- | --------------------------------- |
| **Package/Bundle ID** | ✅ `com.anonymous.tatame` | ✅ `com.anonymous.tatame`         |
| **Icon**              | ✅ Adaptive Icon          | ✅ Icon configured                |
| **Splash Screen**     | ✅ Via plugin             | ✅ Via plugin                     |
| **Permissions**       | ✅ AndroidManifest.xml    | ✅ Info.plist                     |
| **Google Services**   | ✅ google-services.json   | ⚠️ Needs GoogleService-Info.plist |
| **Build Scripts**     | ✅ 3 scripts              | ✅ 3 scripts                      |
| **Build Numbers**     | ✅ Auto increment         | ✅ Auto increment                 |
| **Tablet Support**    | ✅ Implicit               | ✅ Explicit                       |

---

## 6. Configured Permissions (iOS)

| Permission                              | Description       | Purpose                |
| --------------------------------------- | ----------------- | ---------------------- |
| **NSCameraUsageDescription**            | Camera access     | Capture photos/videos  |
| **NSMicrophoneUsageDescription**        | Microphone access | Record audio in videos |
| **NSPhotoLibraryUsageDescription**      | Library access    | Load media             |
| **NSPhotoLibraryAddUsageDescription**   | Save to library   | Save photos/videos     |
| **NSLocationWhenInUseUsageDescription** | Location          | Show nearby gyms       |

---

## 7. Next Steps

### Before First iOS Build:

1. **Configure Apple Developer Account**

   - [ ] Create/access account ($99/year)
   - [ ] Add test devices
   - [ ] Configure App Store Connect

2. **Certificates and Provisioning Profiles**

   ```bash
   eas credentials --platform ios
   ```

   - [ ] Choose automatic management (recommended)
   - [ ] Or configure manually in Apple Developer Portal

3. **Google Services (if needed)**

   - [ ] Download `GoogleService-Info.plist` from Firebase
   - [ ] Add to project
   - [ ] Update `app.json`:

   ```json
   "ios": {
     "googleServicesFile": "./GoogleService-Info.plist"
   }
   ```

4. **First Test Build**

   ```bash
   ./scripts/ios-build-dev.sh
   ```

   - [ ] Test on simulator
   - [ ] Fix errors if any

5. **Preview Build**

   ```bash
   ./scripts/ios-build-preview.sh
   ```

   - [ ] Test on real device via TestFlight
   - [ ] Validate all features

6. **Prepare App Store Assets**

   - [ ] Screenshots (multiple iPhone/iPad sizes)
   - [ ] App description
   - [ ] Keywords
   - [ ] Privacy Policy URL
   - [ ] Categories

7. **Production Build**
   ```bash
   ./scripts/ios-build-production.sh
   ```
   - [ ] Submit to App Store
   - [ ] Wait for review

---

## 8. Resources and Useful Links

- **Expo iOS Guide**: https://docs.expo.dev/guides/ios/
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **App Store Connect**: https://appstoreconnect.apple.com
- **Apple Developer**: https://developer.apple.com
- **TestFlight**: https://developer.apple.com/testflight/

---

## 9. Common Troubleshooting

### "No bundle identifier configured"

✅ **Resolved**: Bundle identifier configured in `app.json`

### "Missing permissions in Info.plist"

✅ **Resolved**: All necessary permissions configured

### "Code signing error"

📝 **Solution**: Run `eas credentials --platform ios`

### "Build failed - out of disk space"

📝 **Solution**: Scripts include disk space check

---

## 10. Configuration Verification

To verify everything is configured:

```bash
# Check app.json
cat app.json | grep -A 20 '"ios"'

# Check eas.json
cat eas.json | grep -A 10 '"ios"'

# Check scripts
ls -la scripts/ios-*.sh

# Test EAS login
eas whoami
```

---

## Conclusion

✅ **All necessary configurations for iOS builds have been completed.**

The project is ready for:

- Development builds (simulator)
- Preview builds (TestFlight)
- Production builds (App Store)

**Next step**: Configure certificates and make the first test build.
