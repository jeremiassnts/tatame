#!/bin/bash

# Helper script to list Android devices connected via adb
# Usage: ./android-devices.sh [option]
# Example: ./android-devices.sh (shows connected devices)
# Example: ./android-devices.sh -l (shows detailed device info)

# Configure Android SDK path
export ANDROID_HOME="/Users/jeremiassantos/Library/Android/sdk"
ADB_PATH="$ANDROID_HOME/platform-tools/adb"

# Check if adb is available
if [ ! -f "$ADB_PATH" ]; then
  echo "❌ Error: adb not found at $ADB_PATH"
  echo "Please install Android SDK or configure ANDROID_HOME correctly"
  exit 1
fi

# Get option parameter
OPTION=${1:--s}

echo "📱 Android Devices"
echo "=================="
echo ""

case "$OPTION" in
  -l|--long|--detailed)
    # Show detailed device information
    echo "Connected devices (detailed):"
    "$ADB_PATH" devices -l
    echo ""
    
    # Count devices
    DEVICE_COUNT=$("$ADB_PATH" devices | grep -v "List of devices" | grep -v "^$" | wc -l | tr -d ' ')
    
    if [ "$DEVICE_COUNT" -eq 0 ]; then
      echo "⚠️  No devices connected"
      echo ""
      echo "To connect a device:"
      echo "  1. Enable USB debugging on your Android device"
      echo "  2. Connect via USB cable"
      echo "  3. Accept the debugging prompt on your device"
      echo "  Or start an Android emulator"
    else
      echo "✅ Total devices: $DEVICE_COUNT"
      echo ""
      
      # Show additional info for each device
      echo "Device properties:"
      "$ADB_PATH" devices | grep -v "List of devices" | grep -v "^$" | while read -r line; do
        DEVICE_ID=$(echo "$line" | awk '{print $1}')
        if [ -n "$DEVICE_ID" ]; then
          echo ""
          echo "Device: $DEVICE_ID"
          echo "  Model: $("$ADB_PATH" -s "$DEVICE_ID" shell getprop ro.product.model | tr -d '\r')"
          echo "  Brand: $("$ADB_PATH" -s "$DEVICE_ID" shell getprop ro.product.brand | tr -d '\r')"
          echo "  Android: $("$ADB_PATH" -s "$DEVICE_ID" shell getprop ro.build.version.release | tr -d '\r')"
          echo "  SDK: $("$ADB_PATH" -s "$DEVICE_ID" shell getprop ro.build.version.sdk | tr -d '\r')"
        fi
      done
    fi
    ;;
  -s|--simple|*)
    # Show simple device list
    echo "Connected devices:"
    "$ADB_PATH" devices
    echo ""
    
    # Count devices
    DEVICE_COUNT=$("$ADB_PATH" devices | grep -v "List of devices" | grep -v "^$" | wc -l | tr -d ' ')
    
    if [ "$DEVICE_COUNT" -eq 0 ]; then
      echo "⚠️  No devices connected"
      echo ""
      echo "To connect a device:"
      echo "  1. Enable USB debugging on your Android device"
      echo "  2. Connect via USB cable"
      echo "  3. Accept the debugging prompt on your device"
      echo "  Or start an Android emulator"
    else
      echo "✅ Total devices: $DEVICE_COUNT"
      echo ""
      echo "Tip: Use './android-devices.sh -l' for detailed device information"
    fi
    ;;
esac


