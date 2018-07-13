#!/bin/bash

# Video resolution depends on platform.
RESOLUTION="750x1334"
if [[ $1 = *"videos/android/"* ]]; then
  RESOLUTION="1080x1920"
fi

# Create the new file.
ffmpeg -i $1 -c:v libx264 -preset slow -s $RESOLUTION -an -b:v 370K $1.new.mp4

# Remove the original file.
rm $1

# Rename the new file to take the place of the original file.
mv $1.new.mp4 $1
