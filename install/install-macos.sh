#/bin/bash

RELEASE_URL="https://gitlab.com/b263/stream-deck-time-tracker/-/archive/main/stream-deck-time-tracker-main.zip"
LIB_URL="https://github.com/elgatosf/streamdeck-javascript-sdk/archive/refs/heads/main.zip"

TARGET_DIR="$HOME/Library/Application Support/com.elgato.StreamDeck/Plugins/"
BUILD_DIR=$(mktemp -d)

if [ -d "$1" ]; then
  TARGET_DIR="$1"
fi

cd $BUILD_DIR

echo "Downloading and extracting plugin..."
curl -sL -o source.zip $RELEASE_URL
unzip -qq source.zip
mv stream-deck-time-tracker-* stream-deck-time-tracker

echo "Downloading and extracting library..."
curl -sL -o lib.zip $LIB_URL
unzip -qq lib.zip
mv streamdeck-javascript-sdk-main libs
mv libs stream-deck-time-tracker/src/dev.b263.time-tracker.sdPlugin

echo "Moving files to Stream Deck plugin directory..."
mv stream-deck-time-tracker/src/dev.b263.time-tracker.sdPlugin "$TARGET_DIR"

echo "Cleaning up..."
rm -rf $BUILD_DIR

echo "Done"
