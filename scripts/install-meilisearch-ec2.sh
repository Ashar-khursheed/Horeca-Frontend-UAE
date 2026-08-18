#!/usr/bin/env bash
# Run on the Ubuntu EC2 as ubuntu. Installs Docker + Meilisearch.
set -euo pipefail

MASTER_KEY="${MEILI_MASTER_KEY:-horeca_meili_$(openssl rand -hex 12)}"

sudo apt-get update -y
sudo apt-get install -y docker.io
sudo systemctl enable --now docker
sudo usermod -aG docker ubuntu || true

sudo docker rm -f meilisearch 2>/dev/null || true
sudo docker run -d \
  --name meilisearch \
  --restart unless-stopped \
  -p 127.0.0.1:7700:7700 \
  -v meili_data:/meili_data \
  -e MEILI_MASTER_KEY="$MASTER_KEY" \
  -e MEILI_ENV=production \
  getmeili/meilisearch:v1.12

echo
echo "Meilisearch is running on this server (localhost:7700 only — not public)."
echo "MASTER KEY (save this): $MASTER_KEY"
echo
echo "From your Mac, keep this SSH session open OR add a tunnel:"
echo "  ssh -i ~/.ssh/horeca-meilisearch-key.pem -L 7700:127.0.0.1:7700 ubuntu@54.236.19.21"
