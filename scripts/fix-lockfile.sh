#!/bin/bash
# Fix pnpm lockfile mismatch after adding overrides

echo "Fixing pnpm lockfile mismatch..."

# Remove the lockfile and node_modules
rm -rf pnpm-lock.yaml node_modules

# Reinstall dependencies with new overrides
pnpm install

echo "Lockfile regenerated successfully!"
