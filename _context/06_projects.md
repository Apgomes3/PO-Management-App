# ProcureArch Operations — Projects View

## Purpose

The Projects View provides a portfolio-level overview of all active and completed projects. Each project card shows its name, code, current status, and progress percentage.

**Component:** `src/components/ProjectsView.tsx`
**Route:** Activated when `currentView === 'Projects'`
**Props:** `onCreate: () => void`

---

## Layout

```
┌────────────────────────────────────────────────────────────┐
│  Projects                              [+ New Project]     │
│  Track and manage your project portfolio                   │
├────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌──────────────────────┐        │
│  │ Great Barrier Reef   │  │ Amazon Flooded Forest │        │
│  │ EXH-GBR-402          │  │ EXH-AMZ-118           │        │
│  │ ████████████░░░░ 65% │  │ ████░░░░░░░░░░░░ 20%  │        │
│  │ [In Progress]        │  │ [Planning]            │        │
│  └──────────────────────┘  └──────────────────────┘        │
│  ┌──────────────────────┐  ┌──────────────────────┐        │
│  │ Atlantic Deep Water  │  │ Arctic Tundra         │        │
│  │ EXH-ATL-305          │  │ EXH-ARC-211           │        │
│  │ ███████░░░░░░░░ 45%  │  │ ████████████████ 100% │        │
│  │ [On Hold]            │  │ [Completed]           │        │
│  └──────────────────────┘  └──────────────────────┘        │
└────────────────────────────────────────────────────────────┘
```

---

## Project Card Structure

Each card displays:

| Field | Display |
|---|---|
| Project Name | Large heading text |
| Project Code | Small grey subtext below name |
| Progress | Horizontal progress bar (animated) |
| Progress % | Percentage text beside bar |
| Status | Coloured pill badge |

**Status badge colours:**

| Status | Style |
|---|---|
| In Progress | Primary blue/indigo |
| Planning | Secondary muted |
| On Hold | Amber/yellow |
| Completed | Green |

---

## Current Data (Hardcoded)

```typescript
const projects = [
  {
    id: '1',
    name: 'Great Barrier Reef Exhibit',
    code: 'EXH-GBR-402',
    status: 'In Progress',
    progress: 65
  },
  {
    id: '2',
    name: 'Amazon Flooded Forest',
    code: 'EXH-AMZ-118',
    status: 'Planning',
    progress: 20
  },
  {
    id: '3',
    name: 'Atlantic Deep Water',
    code: 'EXH-ATL-305',
    status: 'On Hold',
    progress: 45
  },
  {
    id: '4',
    name: 'Arctic Tundra',
    code: 'EXH-ARC-211',
    status: 'Completed',
    progress: 100
  }
]
```

---

## Project Data Model

```typescript
interface Project {
  id: string
  name: string
  code: string
  status: 'In Progress' | 'Planning' | 'On Hold' | 'Completed'
  progress: number    // 0-100 integer
}
```

---

## Header Actions

| Button | Action |
|---|---|
| `+ New Project` | Calls `onCreate()` → opens `CreateModal` with `action='Project'` |

---

## Planned Enhancements

### Phase 1 — Data Connection
- Load projects from `po_Project` Dataverse table
- Calculate `progress` dynamically from PO stages (% of POs at DELIVERED)
- Filter projects by status

### Phase 2 — Project Detail View
Each project card should be clickable and open a `ProjectDetail` view showing:
- List of all POs linked to this project (by `projectCode`)
- Total budget allocated vs. spent (sum of `po.amount`)
- Timeline of PO stage completions
- Active payment claims for this project

### Phase 3 — Project Creation
Full project creation form via `CreateModal` when `action === 'Project'`:
- Project Name (required)
- Project Code (required, unique)
- Status (default: Planning)
- Estimated Start Date
- Estimated End Date
- Budget ceiling (optional)

---

## Project ↔ PO Relationship

Projects and Purchase Orders are linked by `projectCode`:
```
Project.code === PurchaseOrder.projectCode
```

This is a **logical link** (string match), not a foreign key, in the current implementation. When Dataverse is connected, this should become a proper lookup relationship.

**Dataverse relationship:**
- `po_Project` (1) → `po_PurchaseOrder` (many) via `po_projectid` lookup column

---

## Progress Calculation Logic (Planned)

```typescript
function calculateProgress(projectCode: string, orders: PurchaseOrder[]): number {
  const projectPOs = orders.filter(po => po.projectCode === projectCode)
  if (projectPOs.length === 0) return 0
  const delivered = projectPOs.filter(po => po.stage === 'DELIVERED').length
  return Math.round((delivered / projectPOs.length) * 100)
}
```

---

## Dataverse Integration Plan

- `GET /api/data/v9.2/po_projects?$orderby=po_createdon desc`
- For each project, fetch linked POs: `$filter=po_projectid eq {guid}`
- Calculate progress from PO stages client-side or via calculated column in Dataverse
- Project creation: `POST /api/data/v9.2/po_projects`

---

*Context file — update as project detail view and creation form are built.*
*Related: `03_purchase_orders.md`, `08_database.md`*
