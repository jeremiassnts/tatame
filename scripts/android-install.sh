#!/bin/bash

# Helper script to install APK builds on Android devices
# Usage: ./android-install.sh [apk-file]
# Example: ./android-install.sh build-1765225083884.apk
# Example: ./android-install.sh (installs the most recent .apk file)

# Configure Android SDK path
export ANDROID_HOME="/Users/jeremiassantos/Library/Android/sdk"
ADB_PATH="$ANDROID_HOME/platform-tools/adb"

# Check if adb is available
if [ ! -f "$ADB_PATH" ]; then
  echo "Error: adb not found at $ADB_PATH"
  echo "Please install Android SDK or configure ANDROID_HOME correctly"
  exit 1
fi

# Check if device is connected
DEVICE_COUNT=$("$ADB_PATH" devices | grep -v "List of devices" | grep -v "^$" | wc -l | tr -d ' ')
if [ "$DEVICE_COUNT" -eq 0 ]; then
  echo "Error: No Android device connected"
  echo "Please connect a device or start an emulator"
  exit 1
fi

# Show connected devices
echo "Connected devices:"
"$ADB_PATH" devices
echo ""

# Determine which APK to install
if [ -n "$1" ]; then
  # APK file specified as argument
  APK_FILE="$1"
  if [ ! -f "$APK_FILE" ]; then
    echo "Error: APK file not found: $APK_FILE"
    exit 1
  fi
else
  # Find the most recent APK file in current directory
  APK_FILE=$(ls -t *.apk 2>/dev/null | head -1)
  if [ -z "$APK_FILE" ]; then
    echo "Error: No .apk files found in current directory"
    echo "Usage: $0 [apk-file]"
    exit 1
  fi
  echo "No APK file specified, using most recent: $APK_FILE"
  echo ""
fi

# Get APK file size for display
APK_SIZE=$(du -h "$APK_FILE" | cut -f1)

echo "Installing APK:"
echo "  File: $APK_FILE"
echo "  Size: $APK_SIZE"
echo ""

# Install the APK with -r flag (replace existing app)
echo "Installing... (this may take a moment)"
if "$ADB_PATH" install -r "$APK_FILE"; then
  echo ""
  echo "✅ Installation completed successfully!"
else
  echo ""
  echo "❌ Installation failed"
  echo ""
  echo "Common issues:"
  echo "  - Device is locked (unlock your device)"
  echo "  - USB debugging not authorized (check device for popup)"
  echo "  - Incompatible APK architecture"
  echo "  - Insufficient storage space on device"
  exit 1
fi
