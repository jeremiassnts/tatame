#!/bin/bash

# Helper script to display Android device logs
# Usage: ./android-logs.sh [filter]
# Example: ./android-logs.sh (shows ReactNativeJS logs)
# Example: ./android-logs.sh all (shows all logs)

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

# Get filter parameter
FILTER=${1:-react}

case "$FILTER" in
  all)
    echo "Showing all logs (press Ctrl+C to stop)..."
    echo ""
    "$ADB_PATH" logcat
    ;;
  react|reactnative)
    echo "Showing React Native logs (press Ctrl+C to stop)..."
    echo ""
    "$ADB_PATH" logcat | grep -i "ReactNativeJS"
    ;;
  error|errors)
    echo "Showing error logs (press Ctrl+C to stop)..."
    echo ""
    "$ADB_PATH" logcat *:E
    ;;
  clear)
    echo "Clearing logcat buffer..."
    "$ADB_PATH" logcat -c
    echo "Logs cleared."
    ;;
  *)
    echo "Showing logs filtered by: $FILTER (press Ctrl+C to stop)..."
    echo ""
    "$ADB_PATH" logcat | grep -i "$FILTER"
    ;;
esac
