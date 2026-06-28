# PickBazar — E-Commerce Platform

A full-featured multi-vendor e-commerce platform built with Next.js, NestJS, and Tailwind CSS.

**Live Demo:** [switchgod.com.np](https://switchgod.com.np)

---

## What's Included

- **Storefront** — Product browsing, search, cart, checkout, user profiles, wishlists, order tracking
- **Admin Dashboard** — Product management, order management, vendor management, coupons, reports
- **REST API** — NestJS backend with in-memory mock data (no database required)
- **Multi-vendor** — Vendor shop pages, seller registration, vendor-specific policies
- **Mobile Ready** — Responsive design with dedicated mobile navigation
- **Multi-language** — i18next integration (currently English)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 13.5, React 18, Tailwind CSS |
| Backend | NestJS (Node.js) |
| State | React Query, Jotai, Zustand |
| Auth | NextAuth.js (JWT-based) |
| Styling | Tailwind CSS, Headless UI |
| Deployment | PM2, Cloudflare Tunnel |

## Project Structure

```
pickbazar/
├── shop/           # Storefront (Next.js) → port 3003
├── admin/rest/     # Admin dashboard (Next.js) → port 3002
├── api/rest/       # Backend API (NestJS) → port 9000
├── .deploy/        # Deployment scripts, project context, and audit findings
└── deployment/     # Original deployment docs
```

## Quick Start

```bash
# Install dependencies (use npm, not yarn)
cd shop && npm install --legacy-peer-deps
cd ../api/rest && npm install --legacy-peer-deps
cd ../../admin/rest && npm install --legacy-peer-deps

# Build
cd ../../api/rest && npx nest build
cd ../../shop && npx next build
cd ../admin/rest && npx next build

# Run (PM2)
pm2 start dist/main.js --name api --cwd api/rest
pm2 start npm --name shop --cwd shop -- run start -- -p 3003
pm2 start npm --name admin --cwd admin/rest -- run start -- -p 3002
```

## Environment Variables

Each service has its own `.env` file. See `.deploy/README.md` for full configuration details.

## License

MIT — Based on [PickBazar by RedQ](https://redq.io)

---

> **For AI agents:** Read `.deploy/README.md` first for full project context, then `.deploy/PLAN.md` for the active improvement plan. Read `.deploy/AUDIT.md` for mobile visual/UX audit findings.
