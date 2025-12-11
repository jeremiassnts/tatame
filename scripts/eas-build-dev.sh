#!/bin/bash

# Helper script to run local EAS builds with Java 17
# Usage: ./eas-build-local.sh [profile] [platform]
# Example: ./eas-build-local.sh preview android

# Configure JAVA_HOME for Java 17
export JAVA_HOME="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"

# Configure ANDROID_HOME
export ANDROID_HOME="/Users/jeremiassantos/Library/Android/sdk"

# Check if Java 17 is available
if [ ! -f "$JAVA_HOME/bin/java" ]; then
  echo "Error: Java 17 not found at $JAVA_HOME"
  echo "Please install Java 17 using: brew install openjdk@17"
  exit 1
fi

# Check if Android SDK is available
if [ ! -d "$ANDROID_HOME" ]; then
  echo "Error: Android SDK not found at $ANDROID_HOME"
  echo "Please install Android SDK or configure ANDROID_HOME correctly"
  exit 1
fi

# Show versions that will be used
echo "Using Java:"
"$JAVA_HOME/bin/java" -version
echo ""
echo "Android SDK: $ANDROID_HOME"
echo ""

# Check disk space
echo "Checking disk space..."
DISK_INFO=$(df -h / | tail -1)
DISK_SPACE=$(echo "$DISK_INFO" | awk '{print $4}')
DISK_USAGE=$(echo "$DISK_INFO" | awk '{print $5}' | sed 's/%//')
echo "Available space: $DISK_SPACE"
echo ""

# Check if there is enough space (at least 5GB recommended)
# Extract only the number from available space
DISK_SPACE_NUM=$(echo "$DISK_SPACE" | grep -oE '[0-9]+\.?[0-9]*')
DISK_SPACE_UNIT=$(echo "$DISK_SPACE" | grep -oE '[A-Za-z]+')

if [[ "$DISK_SPACE_UNIT" == "Gi" ]] && (( $(echo "$DISK_SPACE_NUM < 5" | bc -l 2>/dev/null || echo "1") )); then
  echo "⚠️  WARNING: Low disk space ($DISK_SPACE available)"
  echo "   Android builds require at least 5-10GB of free space"
  echo ""
  read -p "Do you want to continue anyway? (y/N): " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Build cancelled. Please free up disk space first."
    exit 1
  fi
elif [[ "$DISK_SPACE_UNIT" == "Mi" ]]; then
  echo "⚠️  WARNING: Very low disk space ($DISK_SPACE available)"
  echo "   Android builds require at least 5-10GB of free space"
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

# Execute EAS build
PROFILE=${1:-development}
PLATFORM=${2:-android}

echo "Executing: eas build --platform $PLATFORM --profile $PROFILE" --local
echo ""

eas build --platform "$PLATFORM" --profile "$PROFILE" --local

