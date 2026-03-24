# ProcureArch Operations — Overall Design & Vision

## Purpose

ProcureArch Operations is an internal procurement management and project allocation tracking dashboard for enterprise operations. It is designed for **Advanced Aquarium Technologies** — a company that delivers large-scale aquarium exhibits (e.g., Great Barrier Reef, Amazon Flooded Forest).

The app manages the full lifecycle of Purchase Orders from issuance at HQ to final delivery on-site, tracking items, payments, shipping, and project budgets in a single interface.

---

## Primary Users

| Role | Microsoft 365 Account | Lifecycle Responsibility |
|---|---|---|
| Head Office Australia | `user@advanced-aquariums.com` | Creates and tracks POs, monitors budget KPIs |
| Admin Manager | `admin@advanced-aquariums.com` | System administration and user access |
| Project Manager | `melody@advanced-aquariums.com` | Creates POs, creates and links Factory Orders (FO) to POs |
| Procurement Officer | `wendy@advanced-aquariums.com` | Receives FO routing, clears procurement step |
| Drafting Manager | `alex@advanced-aquariums.com` | Receives FO routing, clears engineering/drafting step |
| Engineering Manager | `antonio@advanced-aquariums.com` | Reviews and approves engineering requirements |
| Operations Team Manager | `jenny@advanced-aquariums.com` | Takes over when FO is released — manages production stage |
| Production Manager | `vincent@advanced-aquariums.com` | Oversees production stage and timelines |
| Logistics | `celene@advanced-aquariums.com` | Adds shipment details and estimated shipping cost to POs |
| Finance Manager | `ann@advanced-aquariums.com` | Reviews payment claims and spending velocity |


---

## Core Principles

1. **Single source of truth** — All PO data, stages, and payments in one place
2. **Stage-driven workflow** — POs move through a fixed 8-stage lifecycle
3. **Audit transparency** — All changes logged in the audit ledger
4. **Project-centric** — Every PO ties to a project code and project name
5. **Minimal friction** — Quick create (Alt+P), inline editing, modal-based detail views

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 19 with TypeScript |
| Build Tool | Vite 6.2 |
| Styling | Tailwind CSS 4 with custom design tokens |
| Icons | Lucide React |
| Animations | Motion (motion/react) |
| State Management | React Hooks (useState) — no external store |
| AI Integration | Google GenAI SDK (wired, not yet active) |
| Backend (planned) | Microsoft Dataverse via Power Platform |
| Deployment (planned) | Power Apps embedded canvas app |

---

## Design Language

### Color Palette (Custom Tailwind Tokens)

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#4c56af` | Buttons, active nav, badges, accents |
| `primary-dim` | `#4049a2` | Hover states on primary |
| `secondary` | `#4d626c` | Secondary text, inactive elements |
| `tertiary` | `#605c78` | Tertiary accents |
| `background` | `#f8f9fa` | Page background |
| `surface` | white-ish | Card and panel backgrounds |
| `error` | `#9f403d` | Rejected status, Exceeded Ceiling logs |
| `on-surface` | dark | Primary text |
| `on-surface-variant` | muted | Secondary text |

### Typography

| Font | Role |
|---|---|
| **Manrope** | Headlines, card titles, section headers |
| **Inter** | Body text, table data, form inputs |

### Layout Grid

- **Sidebar**: Fixed, left, 16rem (64px) wide, `z-50`
- **TopNav**: Fixed, top, full width, `z-40`, left-padded for sidebar
- **Main Content**: `ml-64 pt-16 p-8` — offset to avoid sidebar/topnav overlap
- **Cards**: Rounded corners (`rounded-2xl`), subtle shadow, white background

---

## Navigation Structure

```
ProcureArch Operations
├── Dashboard            → Executive KPI overview
├── Purchase Orders      → Main PO list + management (default view)
└── Projects             → Project portfolio cards
```

**Planned / Not yet wired:**
- Reports

**Modals (overlays):**
- PO Detail — opens when clicking a PO row
- Create PO Modal — opens via button or Alt+P

---

## PO & FO Process Lifecycle (9 Stages)

The **Purchase Order (PO)** is the initiating document. Once the factory receives it, the **Project Manager** creates a **Factory Order (FO)** — a linked sub-record that carries a factory reference number and drives the internal routing workflow.

```
PO: HQ_ISSUED
    ↓  Factory acknowledges receipt
PO: FACTORY_RECEIVED
    ↓  Project Manager creates & links Factory Order (FO number)
PO: FO_ISSUED
    ↓  FO routed internally (one or both paths, triggered by notification)
    ├── PROCUREMENT  →  Wendy (wendy@) clears procurement step
    └── ENGINEERING  →  Alex (alex@) clears engineering/drafting step
    ↓  All required clearances done
PO: OPERATIONS_RELEASED  →  Jenny (jenny@) takes over
    ↓  Production begins
PO: PRODUCTION
    ↓  Celene (celene@) adds shipping details + estimated cost
PO: SHIPPING
    ↓  Delivery confirmed
PO: DELIVERED
```

**Payment Claims** are independent of stage — the factory can raise a payment claim against the PO cost at any point once the PO exists.

Each stage has specific action buttons in the PO Detail modal to advance the record. Notifications are sent automatically to the relevant team member on routing.

---

## Current State (as of March 2026)

- Frontend: Complete UI with mock data only
- Backend: Not connected — all data resets on page refresh
- Dataverse: Authenticated via `pac auth`, tables not yet created
- Power Apps: Not yet deployed

## Immediate Next Steps

1. Create Dataverse tables manually in Power Apps Maker Portal
2. Connect the frontend to Dataverse via API
3. Replace `constants.ts` mock data with live Dataverse queries
4. Deploy as a Power Apps canvas app or embedded model-driven app

---

## Key Files Reference

| File | Purpose |
|---|---|
| `src/App.tsx` | Root component, all state, view routing |
| `src/types.ts` | All TypeScript interfaces and types |
| `src/constants.ts` | Mock data (to be replaced by Dataverse) |
| `src/index.css` | Tailwind theme and custom tokens |
| `vite.config.ts` | Build config, path aliases, env vars |
| `.env.example` | Required environment variables |

---

*Context file — keep updated as the app evolves.*
*Related files: `01_app_structure.md`, `08_database.md`*
