# ProcureArch Operations — Dashboard View

## Purpose

The Dashboard is the executive overview screen. It is the high-level entry point for leadership to see the health of the operation at a glance — budgets, active projects, and procurement pipeline efficiency.

**Component:** `src/components/DashboardView.tsx`
**Route:** Activated when `currentView === 'Dashboard'`
**Props:** `onCreatePO: () => void`

---

## Current Implementation (March 2026)

The Dashboard is partially implemented. It has the layout shell and three metric cards but is not yet pulling live data.

### Layout

```
┌────────────────────────────────────────────────────────┐
│  Dashboard                                             │
│  Overview of procurement activity and project health   │
│                                                        │
│  ┌──────────────┐ ┌──────────────┐ ┌───────────────┐  │
│  │ Total Revenue│ │ Active Users │ │ Avg. Lead Time│  │
│  │  $8.6M       │ │     24       │ │    14 days    │  │
│  └──────────────┘ └──────────────┘ └───────────────┘  │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Operational Efficiency           [placeholder]  │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

### Current Metric Cards

| Card | Value | Note |
|---|---|---|
| Total Revenue | $8.6M | Hardcoded |
| Active Users | 24 | Hardcoded |
| Avg. Lead Time | 14 days | Hardcoded |

---

## Planned Dashboard Sections

When connected to Dataverse, the Dashboard should display:

### Section 1 — Top KPI Strip
Four metrics aligned with the KPIData model:
- **Project Allocation** — active POs vs. total budget capacity
- **Pending Approvals** — count of POs in Pending status
- **Total Budget Committed** — sum of all approved PO amounts
- **Active Projects** — count of In Progress projects

### Section 2 — Spending Overview
A summary chart (reuse `SpendingChart`) showing budget consumed per project code across all active projects.

### Section 3 — PO Stage Pipeline
A horizontal funnel or bar chart showing how many POs are at each stage:
```
HQ_ISSUED | FACTORY_RECEIVED | OPERATIONS_RELEASED | ... | DELIVERED
```

### Section 4 — Recent Activity
A compact version of the `AuditLedger` showing the last 5 audit events.

### Section 5 — Projects at Risk
Cards for projects where:
- A PO has been `Rejected`
- A payment claim has `Exceeded Ceiling`
- A shipping item is overdue

---

## Data Requirements (from Dataverse)

| Metric | Source Table | Query |
|---|---|---|
| Total PO value | `po_PurchaseOrder` | SUM of `amount` where status = Approved |
| Pending approvals | `po_PurchaseOrder` | COUNT where status = Pending |
| Active projects | `po_Project` | COUNT where status = In Progress |
| Recent audit events | `po_AuditLog` | TOP 5 ORDER BY time DESC |
| Spending by project | `po_SpendingData` | All records grouped by code |

---

## Navigation Trigger

The Dashboard view is accessed via:
1. Sidebar nav item "Dashboard"
2. TopNav link "Dashboard"

The "Create New PO" button on the dashboard calls `onCreatePO()` which opens the `CreateModal`.

---

## Component Dependencies

```
DashboardView
└── (planned) KPICard[]
└── (planned) SpendingChart
└── (planned) AuditLedger (compact version)
```

---

## Status

| Item | Status |
|---|---|
| Layout shell | Done |
| Static metric cards | Done |
| Live data connection | Not started |
| Spending chart | Not wired |
| PO pipeline view | Not built |
| Projects at risk | Not built |

---

*Context file — keep updated as dashboard features are added.*
*Related: `01_app_structure.md`, `03_purchase_orders.md`, `08_database.md`*
