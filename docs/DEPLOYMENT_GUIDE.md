# Deployment Guide

## Recommended topology

This project is best deployed in one of these two ways:

1. Single-server deployment behind one domain
   - Frontend static files served by Nginx
   - FastAPI backend served by Uvicorn/Systemd
   - Reverse proxy:
     - `/` -> frontend
     - `/api` -> backend
     - `/ws` -> backend WebSocket
     - `/medvoice` -> backend mounted service
   - Best fit for:
     - webcam features
     - WebSocket stability
     - lowest integration complexity
     - domain-based production rollout

2. Split deployment
   - Frontend on Vercel / Cloudflare Pages
   - Backend on Railway / Render / VM
   - Use env vars:
     - `VITE_API_BASE_URL`
     - `VITE_WS_URL`
     - `VITE_MEDVOICE_BASE_URL`
   - Best fit for:
     - fastest demo launch
     - lower ops effort on frontend

## Current production behavior

The frontend production config now defaults to same-origin URLs:

- API: current site origin
- WebSocket: current site origin + `/ws/analyze`
- MedVoice: current site origin + `/medvoice`

That means if you place frontend and backend behind the same domain with Nginx,
you do not need extra frontend environment variables.

## Recommended choice

For this project, prefer:

- Domain + DNS: Cloudflare
- Server: Alibaba Cloud / Tencent Cloud lightweight server or ECS, Hong Kong region for fastest no-filing demo
- Reverse proxy: Nginx
- Frontend: Vite build output
- Backend: FastAPI + Uvicorn

Reason:

- the project uses browser camera
- the project uses WebSocket analysis
- the backend has Python dependencies and mounted subservices
- same-origin deployment is simpler and more robust than split-origin deployment

## Domain strategy

Use one of these:

1. One main domain
   - `rehab-demo.com`
   - everything served from one origin

2. Main domain + API subdomain
   - `app.rehab-demo.com` for frontend
   - `api.rehab-demo.com` for backend
   - requires frontend env vars

For this repo, one origin is simpler.

## Mainland China note

If you deploy on mainland China servers, ICP filing is required.

If you use Hong Kong or other non-mainland servers, ICP filing is not required.

## Environment variables

Frontend optional:

```env
VITE_API_BASE_URL=https://your-domain.com
VITE_WS_URL=wss://your-domain.com/ws/analyze
VITE_MEDVOICE_BASE_URL=https://your-domain.com/medvoice
```

Backend suggested:

```env
CORS_ALLOW_ORIGINS=https://your-domain.com,https://www.your-domain.com
DEBUG_LOGS=false
STRICT_RBAC=false
DEEPSEEK_API_KEY=your_key_here
```

## Build and run

### Frontend

```bash
npm install
npm run build
```

Output:

- `dist/`

### Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```

Default backend port:

- `8002`

Recommended production command:

```bash
uvicorn main:app --host 127.0.0.1 --port 8002
```

## Nginx example

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate     /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    root /var/www/rehab-app/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /ws/ {
        proxy_pass http://127.0.0.1:8002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /medvoice/ {
        proxy_pass http://127.0.0.1:8002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

If your Nginx setup does not define `$connection_upgrade`, use:

```nginx
proxy_set_header Connection "upgrade";
```

## DNS checklist

For one-server deployment:

- `A` record:
  - `@` -> your server public IP
- optional:
  - `www` -> your server public IP or CNAME to apex

For split deployment:

- frontend domain -> hosting provider target
- backend domain -> backend provider target

## Camera and HTTPS

Camera access requires HTTPS in production.

Do not launch the production site on plain HTTP if you need webcam features.

## Pre-go-live checklist

- domain resolves correctly
- HTTPS certificate is valid
- `/ws/analyze` upgrades successfully
- browser camera permission works on the final domain
- backend `.env` is set
- `CORS_ALLOW_ORIGINS` matches the final domain
- MedVoice path is reachable if enabled
- report generation keys are configured

## Practical rollout order

1. Buy domain
2. Create server
3. Point DNS to server
4. Build frontend
5. Start backend
6. Configure Nginx reverse proxy
7. Enable HTTPS
8. Test:
   - homepage
   - camera
   - WebSocket analysis
   - report generation
9. Only then expose to users
