#!/bin/bash

# Helper script to run local EAS builds for iOS production
# Usage: ./ios-build-production.sh
# This will create a production build for iOS (App Store)

echo "🍎 iOS Production Build"
echo "======================="
echo ""

# Check disk space
echo "Checking disk space..."
DISK_INFO=$(df -h / | tail -1)
DISK_SPACE=$(echo "$DISK_INFO" | awk '{print $4}')
DISK_SPACE_NUM=$(echo "$DISK_SPACE" | grep -oE '[0-9]+\.?[0-9]*')
DISK_SPACE_UNIT=$(echo "$DISK_SPACE" | grep -oE '[A-Za-z]+')
echo "Available space: $DISK_SPACE"
echo ""

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

# Execute EAS build for iOS production
echo "Executing: eas build --platform ios --profile production --local"
echo ""

eas build --platform ios --profile production --local
