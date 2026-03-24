# ProcureArch Operations — Purchase Orders View

## Purpose

The Purchase Orders view is the **primary working screen** of the app. It is where procurement staff create, track, filter, and manage all Purchase Orders across all active projects.

**Component:** `src/components/PurchaseOrdersView.tsx`
**Route:** Activated when `currentView === 'Purchase Orders'` (default on load)

---

## Layout

```
┌────────────────────────────────────────────────────────────────┐
│  Purchase Orders                     [Export Ledger] [+ Create]│
│  Manage and track all procurement operations                   │
├────────────────────────────────────────────────────────────────┤
│  [Status ▼]  [Project ▼]  [Fiscal Year ▼]                      │
├────────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ KPICard  │ │ KPICard  │ │ KPICard  │ │ KPICard  │          │
│  │allocation│ │ approval │ │  budget  │ │ projects │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
├────────────────────────────────────────────────────────────────┤
│  PO# │ Project │ Stage │ Date │ Amount │ Status │ Actions      │
│  ─── │ ─────── │ ───── │ ──── │ ────── │ ────── │ ───────     │
│  row │ ...     │ ...   │ ...  │ ...    │ ...    │ [👁] [✏]    │
│  ...                                                           │
│  [Pagination: 1 2 3 ... 70]                                    │
├────────────────┬───────────────────────────────────────────────┤
│  SpendingChart │  AuditLedger                                  │
│  (bar chart)   │  (activity log)                               │
└────────────────┴───────────────────────────────────────────────┘
```

---

## Props

```typescript
interface PurchaseOrdersViewProps {
  kpiStats: KPIData[]
  purchaseOrders: PurchaseOrder[]
  spendingVelocity: SpendingData[]
  auditLogs: AuditLog[]
  onSelectPO: (po: PurchaseOrder) => void
  onCreatePO: () => void
}
```

---

## Sub-Components

### KPICard (`src/components/KPICard.tsx`)

Four cards displayed in a 4-column grid. Each card type has a unique layout:

| Type | Icon | Special UI Element |
|---|---|---|
| `allocation` | FileText | Progress bar showing % used |
| `approval` | Users | Row of team member avatars |
| `budget` | DollarSign | Change % badge (up/down) |
| `projects` | Briefcase | Mini list of project codes |

**Props:** `data: KPIData`

**KPIData interface:**
```typescript
interface KPIData {
  label: string
  value: string
  change?: string      // e.g., "+8.2%"
  type: 'allocation' | 'approval' | 'budget' | 'projects'
  subtext?: string     // e.g., "Admin Priority"
}
```

---

### POTable (`src/components/POTable.tsx`)

The main table of purchase orders.

**Props:**
```typescript
interface POTableProps {
  orders: PurchaseOrder[]
  onSelect: (po: PurchaseOrder) => void
}
```

**Columns:**

| Column | Field | Format |
|---|---|---|
| PO Number | `poNumber` | `#PO-24-GBR-01` |
| Project | `projectName` + `projectCode` | Name on top, code below in grey |
| Stage | `stage` | Badge with stage label |
| Date | `date` | ISO date string |
| Amount | `amount` | `$1,250,000` (USD currency) |
| Status | `status` | Coloured pill badge |
| Actions | — | Eye icon (view), Pencil icon (edit) |

**Status badge colours:**

| Status | Style |
|---|---|
| Approved | Green background |
| Pending | Secondary/muted |
| Rejected | Error red |

**Stage badge values:**
`HQ_ISSUED` `FACTORY_RECEIVED` `OPERATIONS_RELEASED` `PROCUREMENT` `ENGINEERING` `PRODUCTION` `SHIPPING` `DELIVERED`

**Interaction:**
- Clicking a row calls `onSelect(po)` → opens `PODetail` modal
- Eye/Pencil icon buttons also trigger `onSelect(po)`

**Pagination:**
- UI shows pages 1–70 (currently static, not functional)
- Will need server-side pagination when connected to Dataverse

---

### SpendingChart (`src/components/SpendingChart.tsx`)

A horizontal bar chart showing **Spending Velocity** per project.

**Props:** `data: SpendingData[]`

```typescript
interface SpendingData {
  code: string    // e.g., "GBR", "AMZ", "ATL"
  value: number   // percentage or absolute value
}
```

**Features:**
- Animated bars (Motion) — animate from 0 to `value` on mount
- 6 project bars: GBR, AMZ, ATL, ARC, IND, PAC
- Hover effect changes bar colour

---

### AuditLedger (`src/components/AuditLedger.tsx`)

A scrollable list of recent procurement audit events.

**Props:** `logs: AuditLog[]`

```typescript
interface AuditLog {
  id: string
  type: 'Allocation Approved' | 'Internal Draft' | 'Exceeded Ceiling'
  message: string
  time: string
}
```

**Log type styles:**

| Type | Style |
|---|---|
| Allocation Approved | Green dot + text |
| Internal Draft | Neutral grey |
| Exceeded Ceiling | Red dot + text |

---

## Filter Bar

Three filter dropdowns (currently UI-only, not filtering data):

| Filter | Options (planned) |
|---|---|
| Status | All, Approved, Pending, Rejected |
| Project | All, GBR, AMZ, ATL, ARC, IND, PAC |
| Fiscal Year | FY2024, FY2025, FY2026 |

When connected to Dataverse, filters will pass query parameters to the OData fetch.

---

## Header Actions

| Button | Action |
|---|---|
| `Export Ledger` | (planned) Export PO list to CSV or PDF |
| `+ Create` | Calls `onCreatePO()` → opens `CreateModal` |

---

## Mock Data (`constants.ts`)

Four sample purchase orders:

| PO Number | Project | Stage | Amount | Status |
|---|---|---|---|---|
| #PO-24-GBR-01 | Great Barrier Reef Exhibit | FACTORY_RECEIVED | $1,250,000 | Approved |
| #PO-24-AMZ-02 | Amazon Flooded Forest | PROCUREMENT | $875,000 | Pending |
| #PO-24-ATL-03 | Atlantic Deep Water | PRODUCTION | $2,100,000 | Approved |
| #PO-24-ARC-04 | Arctic Tundra | DELIVERED | $650,000 | Rejected |

---

## Dataverse Integration Plan

When live:
- Replace `PURCHASE_ORDERS` constant with fetch from `po_PurchaseOrder` table
- Apply OData `$filter` for status, project, fiscal year
- Apply OData `$orderby=createdon desc`
- Use `$top` and `$skip` for pagination
- Expand related: `$expand=po_POItem_PurchaseOrder,po_PaymentClaim_PurchaseOrder`

---

*Context file — keep updated as filters, sorting, and API are implemented.*
*Related: `04_po_detail.md`, `05_create_po.md`, `08_database.md`*
