#!/bin/bash

# https://adriel.dev/posts/2024-02-09-speeding-up-builds-for-berry-yarn-projects-on-vercel#conclusion

echo "Starting the script..."

yarn set version berry
 
# Check if node_modules/install-state.gz exists and copy it to .yarn/install-state.gz
if [ -f "node_modules/install-state.gz" ]; then
    echo "Copying node_modules/install-state.gz to .yarn/install-state.gz..."
    cp node_modules/install-state.gz .yarn/install-state.gz
else
    echo "node_modules/install-state.gz does not exist. Skipping copy."
fi
 
# Set an environment variable YARN_CACHE_FOLDER=./.next/cache/yarn
echo "Setting environment variable YARN_CACHE_FOLDER=./.next/cache/yarn..."
export YARN_CACHE_FOLDER=./.next/cache/yarn
 
# Run yarn install --immutable
echo "Running 'yarn install --immutable'..."
yarn install --immutable
 
# Check if .yarn/install-state.gz exists and copy it to node_modules/install-state.gz
if [ -f ".yarn/install-state.gz" ]; then
    echo "Copying .yarn/install-state.gz back to node_modules/install-state.gz..."
    cp .yarn/install-state.gz node_modules/install-state.gz
else
    echo ".yarn/install-state.gz does not exist. Skipping copy."
fi
 
echo "Script completed."