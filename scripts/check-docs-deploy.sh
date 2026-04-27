#!/usr/bin/env bash
set -euo pipefail

ssh_target="${SSH_TARGET:-services-vm}"
public_url="${DOCS_PUBLIC_URL:-https://docs.aparcedo.org}"
origin_url="${DOCS_ORIGIN_URL:-http://127.0.0.1:8080/}"
host_header="${DOCS_HOST_HEADER:-docs.aparcedo.org}"

echo "origin:"
ssh "$ssh_target" "curl -I --max-time 8 -H 'Host: $host_header' '$origin_url' | sed -n '1,8p'"

echo
echo "public:"
curl -I --max-time 12 "$public_url" | sed -n '1,12p'
