#!/bin/bash

# Helper script to run local EAS builds for production (iOS)
# Usage: ./eas-build-production-ios.sh
# Example: ./eas-build-production-ios.sh

# Check if we're on macOS (required for iOS builds)
if [[ "$(uname)" != "Darwin" ]]; then
  echo "Error: iOS builds require macOS."
  exit 1
fi

# Check if Xcode Command Line Tools are available
if ! command -v xcodebuild &> /dev/null; then
  echo "Error: Xcode Command Line Tools not found."
  echo "Please install with: xcode-select --install"
  exit 1
fi

# Check if Fastlane is available (required for EAS local iOS builds)
if ! command -v fastlane &> /dev/null; then
  echo "Error: Fastlane is not installed or not in your PATH."
  echo "EAS local iOS builds require Fastlane."
  echo ""
  echo "Install with Homebrew:"
  echo "  brew install fastlane"
  echo ""
  echo "Or with RubyGems:"
  echo "  sudo gem install fastlane"
  exit 1
fi

# Check if CocoaPods is available (required for EAS local iOS builds)
if ! command -v pod &> /dev/null; then
  echo "Error: CocoaPods is not installed or not in your PATH."
  echo "EAS local iOS builds require CocoaPods."
  echo ""
  echo "Install with Homebrew:"
  echo "  brew install cocoapods"
  echo ""
  echo "Or with RubyGems:"
  echo "  sudo gem install cocoapods"
  exit 1
fi

# Check for Apple WWDR intermediate certificate (required for distribution cert trust chain)
# Without it you get: "Distribution certificate with fingerprint ... hasn't been imported successfully"
HAS_WWDR=false
for keychain in ~/Library/Keychains/login.keychain-db ~/Library/Keychains/login.keychain; do
  if [[ -f "$keychain" ]] && security find-certificate -a -c "WWDR" "$keychain" 2>/dev/null | grep -qi "WWDR"; then
    HAS_WWDR=true
    break
  fi
done
if [[ "$HAS_WWDR" != "true" ]] && ! security find-certificate -a 2>/dev/null | grep -qi "WWDR"; then
  echo "⚠️  Apple WWDR intermediate certificate not found in your keychain."
  echo "   This often causes 'Distribution certificate hasn't been imported successfully' on local iOS builds."
  echo ""
  echo "   Install it:"
  echo "   1. Download: https://www.apple.com/certificateauthority/AppleWWDRCAG3.cer"
  echo "   2. Double-click the .cer file to add it to Keychain Access (Login keychain)."
  echo "   Or run (after downloading to ~/Downloads):"
  echo "      security add-trusted-cert -d -r unspecified -k ~/Library/Keychains/login.keychain-db ~/Downloads/AppleWWDRCAG3.cer"
  echo ""
  read -p "Continue anyway? (y/N): " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Build cancelled. Install the WWDR certificate and run this script again."
    exit 1
  fi
  echo ""
fi

# Show versions that will be used
echo "Using Xcode:"
xcodebuild -version
echo ""

# Check disk space
echo "Checking disk space..."
DISK_INFO=$(df -h / | tail -1)
DISK_SPACE=$(echo "$DISK_INFO" | awk '{print $4}')
DISK_USAGE=$(echo "$DISK_INFO" | awk '{print $5}' | sed 's/%//')
echo "Available space: $DISK_SPACE"
echo ""

# Check if there is enough space (at least 5GB recommended)
DISK_SPACE_NUM=$(echo "$DISK_SPACE" | grep -oE '[0-9]+\.?[0-9]*')
DISK_SPACE_UNIT=$(echo "$DISK_SPACE" | grep -oE '[A-Za-z]+')

if [[ "$DISK_SPACE_UNIT" == "Gi" ]] && (( $(echo "$DISK_SPACE_NUM < 5" | bc -l 2>/dev/null || echo "1") )); then
  echo "⚠️  WARNING: Low disk space ($DISK_SPACE available)"
  echo "   iOS builds require at least 5-10GB of free space"
  echo ""
  read -p "Do you want to continue anyway? (y/N): " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Build cancelled. Please free up disk space first."
    exit 1
  fi
elif [[ "$DISK_SPACE_UNIT" == "Mi" ]]; then
  echo "⚠️  WARNING: Very low disk space ($DISK_SPACE available)"
  echo "   iOS builds require at least 5-10GB of free space"
  echo ""
  read -p "Do you want to continue anyway? (y/N): " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Build cancelled. Please free up disk space first."
    exit 1
  fi
fi

# Clean EAS temporary files
echo "Cleaning EAS temporary files..."
find /private/var/folders -name "*eas-build-local*" -type d -maxdepth 3 -exec rm -rf {} + 2>/dev/null || true
echo "Cleanup completed."
echo ""

# Production build confirmation
echo "🚨 PRODUCTION BUILD 🚨"
echo "This will create a production build that can be submitted to the App Store."
echo ""
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Production build cancelled."
  exit 1
fi
echo ""

# Execute EAS build
PROFILE="production"
PLATFORM="ios"

# Desabilita sync de capabilities (Apple retorna "bundle cannot be deleted" neste app).
# Capabilities em https://developer.apple.com/account/resources/identifiers
export EXPO_NO_CAPABILITY_SYNC=1

echo "Executing: eas build --platform $PLATFORM --profile $PROFILE --local"
echo ""

eas build --platform "$PLATFORM" --profile "$PROFILE" --local
