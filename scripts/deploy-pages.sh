#!/usr/bin/env bash
# Build + deploy the portfolio one-pager to GitHub Pages (static).
#
# Builds with PAGES_BASE=/portfolio/ (assets + router under the project-page
# subpath), snapshots the SSR-rendered home page from the built server, and
# force-pushes the artifact as the orphan gh-pages branch.
#
# Pages is static-only: the /costco app (API routes + Neon) is NOT part of
# this artifact and 404s there — it needs the Vercel deploy (see README).
set -euo pipefail
cd "$(dirname "$0")/.."

npm run build:pages -w apps/web

PORT=4173 node apps/web/.output/server/index.mjs &
SERVER=$!
trap 'kill $SERVER 2>/dev/null || true' EXIT
for _ in $(seq 1 30); do
  curl -sf http://localhost:4173/portfolio/ >/dev/null && break
  sleep 1
done

DIST=$(mktemp -d)
cp -R apps/web/.output/public/* "$DIST"/
curl -s http://localhost:4173/portfolio/ -o "$DIST/index.html"
touch "$DIST/.nojekyll"

SHA=$(git rev-parse --short HEAD)
git -C "$DIST" init -q
git -C "$DIST" checkout -qb gh-pages
git -C "$DIST" add -A
git -C "$DIST" commit -qm "Deploy portfolio to GitHub Pages ($SHA)"
git -C "$DIST" push -f git@github.com:pdanani/portfolio.git gh-pages:gh-pages
rm -rf "$DIST"

echo "Live: https://pdanani.github.io/portfolio/"
