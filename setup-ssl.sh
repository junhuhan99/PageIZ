#!/bin/bash

echo "🔍 Checking DNS resolution..."
if ! nslookup pageiz.me | grep -q "13.125.150.235"; then
    echo "❌ Error: pageiz.me is not pointing to 13.125.150.235"
    echo "Please update your DNS settings first!"
    exit 1
fi

echo "✅ DNS is correctly configured!"
echo ""
echo "📜 Obtaining SSL certificate..."

# Stop Nginx temporarily to allow Certbot to bind to port 80
sudo systemctl stop nginx

# Obtain SSL certificate
sudo certbot certonly --standalone \
    -d pageiz.me \
    -d www.pageiz.me \
    --non-interactive \
    --agree-tos \
    --email admin@pageiz.me \
    --preferred-challenges http

if [ $? -ne 0 ]; then
    echo "❌ Failed to obtain SSL certificate"
    sudo systemctl start nginx
    exit 1
fi

echo "✅ SSL certificate obtained!"
echo ""
echo "🔧 Updating Nginx configuration..."

# Update Nginx config for HTTPS
sudo tee /etc/nginx/sites-available/pageiz > /dev/null <<'EOF'
# HTTP - Redirect to HTTPS
server {
    listen 80;
    server_name pageiz.me www.pageiz.me *.pageiz.me;
    return 301 https://$host$request_uri;
}

# HTTPS
server {
    listen 443 ssl http2;
    server_name pageiz.me www.pageiz.me *.pageiz.me;

    ssl_certificate /etc/letsencrypt/live/pageiz.me/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pageiz.me/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Test Nginx configuration
sudo nginx -t

if [ $? -ne 0 ]; then
    echo "❌ Nginx configuration test failed"
    exit 1
fi

# Restart Nginx
sudo systemctl start nginx
sudo systemctl reload nginx

echo "✅ Nginx configured and restarted!"
echo ""
echo "🎉 SSL setup complete!"
echo ""
echo "Your site is now available at:"
echo "  https://pageiz.me"
echo "  https://www.pageiz.me"
echo ""
echo "SSL certificate will auto-renew via certbot timer."
