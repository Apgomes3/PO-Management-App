# ProcureArch Operations — Context Index

This folder contains context documents for AI-assisted development.
Each file covers a specific area of the app and is kept to 300–400 lines.
Reference these files at the start of a conversation to restore full context.

---

## Files

| File | Topic | Key Contents |
|---|---|---|
| `00_overview.md` | Overall Design & Vision | Purpose, users, tech stack, colour palette, nav structure, current state |
| `01_app_structure.md` | App Structure | Component hierarchy, Mermaid diagrams (component, data flow, PO lifecycle), file map |
| `02_dashboard.md` | Dashboard View | Layout, current metrics, planned sections, data requirements |
| `03_purchase_orders.md` | Purchase Orders View | Layout, KPICard, POTable, SpendingChart, AuditLedger, filter bar, mock data |
| `04_po_detail.md` | PO Detail Modal | Lifecycle stepper, stage actions, items, payment claims, shipping, requirements |
| `05_create_po.md` | Create PO Modal | Form fields, auto-generation, item list, validation, save flow |
| `06_projects.md` | Projects View | Project cards, data model, progress logic, planned detail view |
| `07_reports.md` | Reports View | Placeholder view, report types, planned templates, how to wire into nav |
| `08_database.md` | Database Schema | Full Dataverse ERD (Mermaid), all 9 tables, column definitions, OData queries |
| `09_dataverse_create_prompt.md` | Dataverse Creation Prompt | 1839-char prompt to generate all 9 tables via AI (Copilot Studio / Power Apps AI) |

---

## Quick Reference

- **App entry point:** `src/App.tsx`
- **All types:** `src/types.ts`
- **Mock data:** `src/constants.ts`
- **Dataverse env:** `https://org29840e8d.crm6.dynamics.com/`
- **Authenticated as:** `antonio@advanced-aquariums.com`
- **pac CLI path:** `C:\Users\AntonioPeresGomes\AppData\Local\Microsoft\PowerAppsCLI\pac.cmd`

## Data Architecture (Key Rule)

- `po_Project` is the **root table** — all POs must link to a project. No free-text project name/code on POs.
- `po_Item` is the **master items catalog** — all PO line items must reference a catalog item. Description and type live here, not on the line item.
- `po_POItem` is the **junction** — links a PO to catalog items, adds quantity/unit only.
- Table creation order: `po_Project` → `po_Item` → `po_PurchaseOrder` → `po_POItem` → rest

---

## Current Status (March 2026)

- Frontend UI: Complete with mock data
- Dataverse: Authenticated, tables not yet created
- API integration: Not started
- Power Apps deployment: Not started
- MCP server (Dataverse): Pending admin consent

## Next Actions

1. Create Dataverse tables — use prompt in `09_dataverse_create_prompt.md` or follow `08_database.md` manually
2. Connect frontend to Dataverse API (replace `constants.ts`)
3. Deploy to Power Apps

---

*Update this index whenever a new context file is added.*
