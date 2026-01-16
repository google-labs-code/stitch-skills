#!/bin/bash
URL=$1
OUTPUT=$2
if [ -z "$URL" ] || [ -z "$OUTPUT" ]; then
  echo "Usage: $0 <url> <output_path>"
  exit 1
fi
echo "Initiating high-reliability fetch for Stitch HTML..."
curl -L -f -sS --connect-timeout 10 --compressed "$URL" -o "$OUTPUT"
if [ $? -eq 0 ]; then
  echo "✅ Successfully retrieved HTML at: $OUTPUT"
  exit 0
else
  echo "❌ Error: Failed to retrieve content. Check TLS/SNI or URL expiration."
  exit 1
fi
