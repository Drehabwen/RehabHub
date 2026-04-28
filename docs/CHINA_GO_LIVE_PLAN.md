# China Go-Live Plan

## Goal

Launch the youth posture and spinal screening system for real user feedback now,
while keeping a clear path to mainland China formal deployment and later concurrency upgrades.

## Stage A: Fast feedback launch

### Recommended setup

- Domain registrar:
  - Alibaba Cloud or Tencent Cloud
- Domain suffix:
  - `.com`
- Server region:
  - Hong Kong
- Purpose:
  - collect real user feedback quickly
  - avoid ICP filing delay
  - keep HTTPS + camera + WebSocket available

### Suggested machine

- Lightweight server or ECS/CVM
- Minimum:
  - 2 vCPU
  - 4 GB RAM
- Recommended:
  - 4 vCPU
  - 8 GB RAM

### Deployment shape

- One domain
- One server
- Nginx reverse proxy
- Frontend build served from Nginx
- FastAPI on port `8002`
- Same-origin routes:
  - `/`
  - `/api`
  - `/ws`
  - `/medvoice`

## Stage B: Mainland formal deployment

### Recommended setup

- Keep domain at Alibaba Cloud or Tencent Cloud
- Buy mainland China server from the same provider if possible
- Complete:
  - domain real-name verification
  - ICP filing
- After filing approval:
  - point DNS to mainland production server

### Why this is cleaner

- registrar and server on the same provider reduce filing friction
- easier support for filing service number and access verification
- easier long-term institutional operation

## Domain purchase recommendation

Buy one main domain, for example:

- `qingyuezhiheng.com`
- `youthposture.cn`
- `spinescreen.cn`

Prefer one main domain first.

Avoid buying multiple domains before the main deployment path is stable.

## DNS structure

### Recommended

- `@` -> main app
- `www` -> redirect to main app

Optional later:

- `api` -> only if backend is split out later

## HTTPS requirement

This project uses browser camera access.

Production must use HTTPS.

Without HTTPS:

- browser camera access may fail
- user trust drops
- mobile testing becomes unreliable

## ICP filing path

### Practical order

1. Buy domain
2. Complete domain real-name verification
3. Buy mainland server
4. Prepare filing subject information
5. Apply for ICP filing in the cloud provider console
6. Wait for filing approval
7. Switch DNS to mainland server
8. Enable HTTPS
9. Run production verification

### Filing subject note

Choose the filing subject based on your real long-term operator:

- short-term student demo:
  - confirm with provider whether personal filing is acceptable
- long-term school / lab / organization rollout:
  - prefer school or organization subject

Do not guess on this step. Confirm with the cloud provider filing workflow before submitting.

## Recommended rollout decision

### If you want user feedback within days

- launch on Hong Kong now
- keep domain and DNS on Alibaba Cloud / Tencent Cloud
- later migrate to mainland after filing

### If you can wait for formal rollout

- buy mainland server directly
- start ICP filing now
- do not expose the domain publicly until filing is approved

## Production topology

```text
User Browser
  -> HTTPS Domain
  -> Nginx
     -> Frontend static files
     -> /api      -> FastAPI
     -> /ws       -> FastAPI WebSocket
     -> /medvoice -> FastAPI mounted app
```

## Initial server checklist

- Ubuntu 22.04 LTS
- Node.js 20+
- Python 3.11+
- Nginx
- Git
- build tools for Python packages
- SSL certificate via Let's Encrypt

## App deployment steps

### Frontend

```bash
npm install
npm run build
```

Deploy `dist/` to:

- `/var/www/rehab-app/dist`

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8002
```

## systemd service suggestion

Create a service like:

- `rehab-backend.service`

Core command:

```bash
uvicorn main:app --host 127.0.0.1 --port 8002
```

## Environment checklist

Frontend:

- same-origin deployment now works by default
- optional custom env vars only if backend is split

Backend:

```env
CORS_ALLOW_ORIGINS=https://your-domain.com,https://www.your-domain.com
DEBUG_LOGS=false
STRICT_RBAC=false
DEEPSEEK_API_KEY=your_key_here
```

## Real-user feedback phase limits

Current codebase is suitable for:

- single-server deployment
- low to moderate real-user validation
- controlled pilot traffic

Current codebase is not yet ready for:

- multi-instance horizontal scaling
- high WebSocket concurrency
- large-scale institutional rollout

## Current concurrency risks in this repo

### Risk 1: Global singleton state

The backend currently uses global process-level objects such as:

- `camera_manager`
- `posture_agent`

This creates risk of:

- session interference
- cross-user state pollution
- poor multi-worker scaling

### Risk 2: LLM generation inside request flow

Report generation is still coupled to live request / websocket flow.

This creates risk of:

- long request duration
- worker blocking
- unstable latency during bursts

### Risk 3: No job queue boundary

Heavy work is not yet separated into:

- realtime path
- async report path

That blocks safe scale-out.

## Concurrency roadmap

### Phase 1: Pilot-safe

Use for:

- early feedback
- challenge cup demos
- small school pilots

Recommended cap:

- one server
- one backend instance
- moderate concurrent sessions only

### Phase 2: Ready for wider pilots

Required changes:

1. Remove global `posture_agent`
   - create per-request / per-session report context

2. Remove dependence on process-global capture state
   - isolate camera/session data by request or session id

3. Introduce Redis
   - session state
   - transient job status
   - websocket coordination if needed

4. Move long report generation into background jobs
   - Celery / RQ / Dramatiq are all acceptable

5. Split services
   - realtime analysis service
   - report generation service

### Phase 3: Higher concurrency

Required changes:

- multiple backend instances
- load balancer
- Redis-based shared session state
- async job queue
- CDN for static frontend
- observability:
  - logs
  - metrics
  - alerting

## Recommended execution order

1. Buy domain at Alibaba Cloud or Tencent Cloud
2. Launch Hong Kong server first
3. Deploy and collect user feedback
4. Fix product issues from real usage
5. Start mainland ICP filing preparation
6. Refactor singleton backend state
7. Add Redis + job queue
8. Move to mainland formal environment

## What to do next

### Immediate

- buy domain
- choose provider:
  - Alibaba Cloud or Tencent Cloud
- decide:
  - Hong Kong first
  - or mainland filing first

### Then implement

- production Nginx config
- backend systemd service
- final `.env`
- HTTPS
- domain DNS

## Deliverables to prepare next

- `nginx.conf`
- `rehab-backend.service`
- production `.env.example`
- final release checklist
