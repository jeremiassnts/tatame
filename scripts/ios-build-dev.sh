#!/bin/bash

# Helper script to run local EAS builds for iOS development
# Usage: ./ios-build-dev.sh
# This will create a development build for iOS simulator

echo "🍎 iOS Development Build"
echo "========================"
echo ""

# Check disk space
echo "Checking disk space..."
DISK_INFO=$(df -h / | tail -1)
DISK_SPACE=$(echo "$DISK_INFO" | awk '{print $4}')
echo "Available space: $DISK_SPACE"
echo ""

# Clean EAS temporary files
echo "Cleaning EAS temporary files..."
find /private/var/folders -name "*eas-build-local*" -type d -maxdepth 3 -exec rm -rf {} + 2>/dev/null || true
echo "Cleanup completed."
echo ""

# Execute EAS build for iOS development
echo "Executing: eas build --platform ios --profile development --local"
echo ""

eas build --platform ios --profile development --local
