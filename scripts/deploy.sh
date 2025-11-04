#!/usr/bin/env bash
set -euo pipefail

# configuration (edit if you use different names/paths)
APP_DIR="/home/ubuntu/todo-ci-cd-ubuntu"
REPO="https://github.com/<your-username>/todo-ci-cd-ubuntu.git"
BRANCH="main"
BACKEND_DIR="$APP_DIR/server"
FRONTEND_DIR="$APP_DIR/client"
PM2_NAME="todo-backend"
NGINX_SITE="/etc/nginx/sites-enabled/default"   # Ubuntu path

echo "Deploy script started: $(date)"

# ensure app dir exists and is owned by ubuntu
mkdir -p "$APP_DIR"
chown -R ubuntu:ubuntu "$APP_DIR"

# if repo not yet cloned, clone it
if [ ! -d "$APP_DIR/.git" ]; then
  echo "Cloning repo into $APP_DIR"
  git clone "$REPO" "$APP_DIR"
fi

cd "$APP_DIR"

# ensure branch
git fetch origin
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"
git pull origin "$BRANCH"

# 1) Backend
if [ -d "$BACKEND_DIR" ]; then
  echo "Installing backend deps..."
  cd "$BACKEND_DIR"
  npm install --production
  # start or restart pm2 process
  if pm2 list | grep -q "$PM2_NAME"; then
    pm2 restart "$PM2_NAME"
  else
    pm2 start server.js --name "$PM2_NAME"
  fi
  pm2 save
fi

# 2) Frontend build
if [ -d "$FRONTEND_DIR" ]; then
  echo "Building frontend..."
  cd "$FRONTEND_DIR"
  npm install
  npm run build

  # configure nginx root to point to build dir
  BUILD_DIR="$FRONTEND_DIR/build"
  if [ -d "$BUILD_DIR" ]; then
    echo "Configuring nginx to serve build from $BUILD_DIR"
    # create a simple default site config (backup first)
    sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak || true

    # Write a minimal server block to /etc/nginx/sites-available/default
    # (Ubuntu default uses /etc/nginx/sites-available & sites-enabled)
    SITES_AVAILABLE="/etc/nginx/sites-available/default"
    sudo bash -c "cat > $SITES_AVAILABLE" <<EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    root $BUILD_DIR;
    index index.html;

    location / {
        try_files \$uri /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

    # enable site (symlink)
    sudo ln -sf $SITES_AVAILABLE /etc/nginx/sites-enabled/default
    sudo nginx -t
    sudo systemctl restart nginx
  else
    echo "Build folder not found: $BUILD_DIR"
    exit 1
  fi
fi

echo "Deployment finished: $(date)"
