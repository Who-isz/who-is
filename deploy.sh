#!/bin/bash
# This script builds and manually deploys the app to the gh-pages branch

echo "🏗  Building project..."
npm run build

echo "🚀 Deploying to gh-pages..."
git checkout --orphan gh-pages
git --work-tree build add --all
git --work-tree build commit -m 'Deploy to gh-pages'
git push origin HEAD:gh-pages --force
git checkout -f main
git branch -D gh-pages
echo "✅ Deployed to: https://Who-isz.github.io/who-is"
