#!/usr/bin/env bash
# run-tests.sh — Quick-start script for the companion repo.
#
# Usage:
#   ./examples/run-tests.sh          # list all tests (no running app needed)
#   ./examples/run-tests.sh before   # run the "test that lies"
#   ./examples/run-tests.sh after    # run the "test that catches"
#
# Prerequisites:
#   - Node 20+
#   - npm install && npx playwright install chromium
#   - A running app on http://localhost:3000 (only for running tests, not listing)

set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
  npx playwright install --with-deps chromium
fi

SUITE="${1:-}"

case "$SUITE" in
  before)
    echo "Running the 'test that lies' (before/)..."
    npx playwright test before/
    ;;
  after)
    echo "Running the 'test that catches' (after/)..."
    npx playwright test after/
    ;;
  *)
    echo "Listing all tests (no running app required)..."
    npx playwright test --list
    ;;
esac
