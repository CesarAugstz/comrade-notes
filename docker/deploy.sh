#!/bin/bash

ARGS=("$@")
REGISTRY="91.99.13.216:5000"
SERVER="91.99.13.216"
SSH_KEY="~/.ssh/id_ed2519hetzner"
PROJECT_PATH="/root/dev/comrade-notes"

echo "Building images locally..."
docker compose -f docker-compose.yml --env-file .env.prod build ${ARGS[@]}

echo "Pushing images to registry..."
docker push $REGISTRY/api:latest
docker push $REGISTRY/web:latest

echo "Copying files to server..."
scp -i $SSH_KEY docker-compose.yml root@$SERVER:$PROJECT_PATH/docker-compose.yml
scp -i $SSH_KEY .env.prod root@$SERVER:$PROJECT_PATH/.env

echo "Deploying on server using registry images..."
ssh -i $SSH_KEY root@$SERVER << 'EOF'
cd /root/dev/comrade-notes
docker compose pull
docker compose down
docker compose up -d
EOF

echo "Deployment complete!"
echo "API available at: http://91.99.13.216:8080"
echo "Web available at: http://91.99.13.216:4173"

