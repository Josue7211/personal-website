#!/usr/bin/env bash
set -euo pipefail

ssh_target="${SSH_TARGET:-services-vm}"
base_dir="${DOCS_DEPLOY_DIR:-/var/www/docs-aparcedo}"
release_id="${RELEASE_ID:-$(date +%Y%m%d-%H%M%S)}"
release_dir="$base_dir/releases/$release_id"

npm run build:docs
ssh "$ssh_target" "mkdir -p '$base_dir/releases'"
rsync -az --delete docs-site/dist/ "$ssh_target:$release_dir/"
ssh "$ssh_target" "ln -sfnT '$release_dir' '$base_dir/current'"

echo "deployed docs release: $release_dir"
npm run deploy:docs:check
