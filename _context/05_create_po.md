# ProcureArch Operations — Create PO Modal

## Purpose

The Create PO Modal is the form used to create a new Purchase Order. It collects the minimum required data to initiate a PO and add it to the system at the `HQ_ISSUED` stage.

**Component:** `src/components/CreateModal.tsx`
**Triggers:**
- Sidebar "Create New PO" button → `onNewPO()`
- TopNav quick create button → `onQuickCreate()`
- Keyboard shortcut `Alt + P`
- "Export Ledger / + Create" button in `PurchaseOrdersView`

---

## Props

```typescript
interface CreateModalProps {
  action: CreateAction        // 'PO' | 'Project' | null
  onClose: () => void
  onSave: (data: any) => void
}
```

The modal handles both PO creation and Project creation via the `action` prop, but currently only the PO form is fully built.

---

## Layout (PO Form)

```
┌────────────────────────────────────────────────────────────┐
│  [X]  Create New Purchase Order                            │
├────────────────────────────────────────────────────────────┤
│  PO Number       [#PO-26-XXX-01]  (auto-generated, locked)│
│  Date            [2026-03-24]     (auto-filled, locked)    │
│  Project         [Search project...      ▼]  (required)   │
│                  (shows: Name — Code)                      │
├────────────────────────────────────────────────────────────┤
│  ORDER ITEMS                                               │
│  ┌────────────────────────────────┬──────────┬───┬──────┐  │
│  │ Item (search catalog)          │ Type     │ Qty│     │  │
│  ├────────────────────────────────┼──────────┼───┼──────┤  │
│  │ [Search item...           ▼]   │ Acrylic  │[1]│ [🗑] │  │
│  │ [Search item...           ▼]   │ LSS      │[1]│ [🗑] │  │
│  └────────────────────────────────┴──────────┴───┴──────┘  │
│  (Type auto-fills from catalog; new row added on selection) │
├────────────────────────────────────────────────────────────┤
│  [✓] Requires Procurement   [ ] Requires Engineering       │
├────────────────────────────────────────────────────────────┤
│                             [Cancel]  [Save Purchase Order]│
└────────────────────────────────────────────────────────────┘
```

---

## Form Fields

### Auto-generated / Read-only

| Field | Logic |
|---|---|
| PO Number | Generated as `#PO-{year}-{random 3-char}-{sequence}` e.g. `#PO-26-XKR-01` |
| Date | Set to today's date on modal open |

### Required User Inputs

| Field | Type | Validation | Source |
|---|---|---|---|
| Project | Searchable dropdown | Required | Lookup from `po_Project` table |

**Project field behaviour:**
- Displays as a searchable dropdown: user types to filter by name or code
- Shows each option as: `Great Barrier Reef Exhibit — EXH-GBR-402`
- On selection, stores the `po_projectid` GUID — name and code are resolved from the record, not stored separately

### Order Items (Dynamic List)

Each item row contains:

| Field | Type | Source | Editable |
|---|---|---|---|
| Item | Searchable dropdown | Lookup from `po_Item` catalog | User selects |
| Type | Read-only label | Auto-filled from `po_Item.po_type` | No (from catalog) |
| Quantity | Number input | User enters | Yes |
| Unit | Text input | User enters | Yes |
| Delete | Button (🗑) | — | Removes the row |

**Item field behaviour:**
- Displays as a searchable dropdown: user types to filter by description or item code
- Shows each option as: `Acrylic Panels 200mm` (with item code if set: `AC-20-002`)
- On selection, `po_type` auto-fills from the catalog record (read-only)
- Stores the `po_itemid` GUID in the PO line item record

**Smart row behaviour:**
- A blank item row is always present at the bottom
- When a user selects an item from the catalog on the last row → a new empty row is automatically appended
- The delete button removes a row (minimum 1 row always shown)

**Item type definition (from catalog):**
```typescript
type POItemType = 'Tanks' | 'LSS' | 'Acrylic' | 'Rockwork' | 'Components' | 'Electrical' | 'Other'
```

### Requirement Checkboxes

```typescript
requiresProcurement: boolean   // default: false
requiresEngineering: boolean   // default: false
```

These flags influence the PO lifecycle path (see `04_po_detail.md`).

---

## Form Validation

Submission is blocked if:
- No Project is selected from the lookup
- No item row has an item selected from the catalog

Error states: Input borders turn red, user cannot click Save.

---

## On Save (`onSave`)

When the form is submitted, `onSave(data)` is called with the following structure:

```typescript
{
  poNumber: string,          // auto-generated
  date: string,              // today's date
  projectId: string,         // GUID from po_Project lookup
  items: POItem[],           // filtered to complete items only (each has itemId GUID)
  requiresProcurement: boolean,
  requiresEngineering: boolean,
  status: 'Pending',         // always starts as Pending
  stage: 'HQ_ISSUED',        // always starts at HQ_ISSUED
  paymentClaims: [],         // empty on creation
  shipping: undefined        // no shipping on creation
}
```

In `App.tsx`, `handleCreateSave()` wraps this with a generated `id` (UUID) and adds it to `purchaseOrders` state.

---

## Project Creation Mode

When `action === 'Project'`, the modal switches to a project creation form (not yet fully implemented). Planned fields:
- Project Name
- Project Code
- Status (Planning / In Progress / On Hold)
- Start Date

---

## Dataverse Integration Plan

When live, `onSave` will:
1. Fetch project list on modal open: `GET /api/data/v9.2/po_projects?$select=po_projectid,po_name,po_code&$orderby=po_name`
2. Fetch item catalog on modal open: `GET /api/data/v9.2/po_items?$select=po_itemid,po_description,po_itemcode,po_type&$orderby=po_type,po_description`
3. On submit: `POST /api/data/v9.2/po_purchaseorders` with `po_projectid@odata.bind: '/po_projects({guid})'`
4. For each item: `POST /api/data/v9.2/po_poitems` with `po_purchaseorderid@odata.bind` and `po_itemid@odata.bind`
5. Return the created PO GUID and update local state

---

## Notes

- PO Number format should be standardised when using Dataverse — could use an auto-number column on the table instead of frontend generation
- `amount` is not set at creation time — it is calculated from payment claims or set later
- The modal uses `AnimatePresence` from Motion for entrance/exit animations

---

*Context file — update when create form is extended (project creation, amount field, etc.)*
*Related: `03_purchase_orders.md`, `04_po_detail.md`, `08_database.md`*
