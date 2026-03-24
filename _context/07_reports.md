# ProcureArch Operations — Reports View

## Status

This view exists as a component file (`src/components/ReportsView.tsx`) but is **not yet wired into the main navigation**. It is a placeholder ready to be fully built out.

To wire it in, add `'Reports'` to the `View` type in `types.ts` and add a nav item to `Sidebar.tsx` and `TopNav.tsx`.

---

## Purpose

Generate, view, and export operational and financial reports. Reports give management a summarised view of procurement spend, project progress, FO routing performance, and operational metrics over time.

**Component:** `src/components/ReportsView.tsx`
**Route:** `currentView === 'Reports'` (not yet in nav)

---

## Planned Layout

```
┌────────────────────────────────────────────────────────────┐
│  Reports                       [Generate Report] [Export]  │
│  Financial, operational, and logistics summaries           │
├────────────────────────────────────────────────────────────┤
│  [Report Type ▼]  [Date Range ▼]  [Project ▼]              │
├────────────────────────────────────────────────────────────┤
│  Report Title              │ Date       │ Type       │     │
│  ───────────────────────── │ ─────────  │ ────────── │     │
│  Q1 2026 Procurement       │ 2026-03-01 │ Financial  │ [↓] │
│  GBR Project Ops Summary   │ 2026-02-15 │ Operational│ [↓] │
│  Shipping Delays Log       │ 2026-01-30 │ Logistics  │ [↓] │
└────────────────────────────────────────────────────────────┘
```

---

## Report Data Model

```typescript
interface Report {
  id: string
  title: string
  date: string
  type: 'Financial' | 'Operational' | 'Logistics'
  generatedBy?: string     // user email
  projectCode?: string     // optional project filter scope
  periodStart?: string
  periodEnd?: string
  downloadUrl?: string     // link to exported PDF/CSV
}
```

---

## Report Types

| Type | Contents |
|---|---|
| **Financial** | Total PO spend, payment claim status (Pending/Approved/Paid), budget vs. actual by project |
| **Operational** | PO stage pipeline counts, FO routing times, avg. lead times, procurement cycle times |
| **Logistics** | Shipping status, delivery timelines, estimated vs. actual shipping cost, carrier performance |

---

## Planned Report Templates

1. **Monthly Procurement Summary** — all POs created, updated, or completed in a calendar month
2. **Project Budget Report** — for a specific project: total PO value vs. approved budget + payment claims
3. **Payment Claims Status** — all claims grouped by status (Pending/Approved/Paid) with running totals
4. **Stage Pipeline Snapshot** — current count of POs at each of the 9 lifecycle stages
5. **FO Routing Performance** — avg. time FOs spend in PROCUREMENT and ENGINEERING stages
6. **Shipping Cost Summary** — estimated vs. actual shipping cost per project (Celene's report)
7. **Overdue PO Report** — POs that have been in a stage beyond expected duration

---

## Planned Features

1. **Generate Report** — trigger with filters: type, date range, project
2. **Download** — export as PDF or CSV
3. **Saved Reports** — list of previously generated reports with download links
4. **Scheduled Reports** — auto-generate weekly/monthly via Power Automate

---

## Dataverse Integration Plan

- Stored reports table: `po_Report` (see `08_database.md`)
- `GET /api/data/v9.2/po_reports?$orderby=po_date desc`
- Report data aggregated via FetchXML queries or Power BI embedded
- Exports generated via Power Automate flow triggered from the app

---

## Adding to Navigation

```typescript
// src/types.ts
type View = 'Dashboard' | 'Purchase Orders' | 'Projects' | 'Reports'

// src/components/Sidebar.tsx
{ label: 'Reports', icon: BarChart2, view: 'Reports' }

// src/App.tsx — renderView()
case 'Reports':
  return <ReportsView />
```

---

*Context file — update when Reports view is fully implemented.*
*Related: `01_app_structure.md`, `08_database.md`*
