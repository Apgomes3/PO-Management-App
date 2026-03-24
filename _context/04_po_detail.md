# ProcureArch Operations — PO Detail Modal

## Purpose

The PO Detail modal is the **core operational screen** of the app. The Purchase Order is the initiating document for the entire process lifecycle. From within this modal, the Project Manager links a Factory Order (FO), routes it internally, manages payment claims from the factory, and tracks the full journey through to final delivery.

**Component:** `src/components/PODetail.tsx`
**Trigger:** Clicking any row in `POTable`, or clicking View/Edit action icons
**Display:** Full-screen overlay modal with close button

---

## Props

```typescript
interface PODetailProps {
  po: PurchaseOrder
  onClose: () => void
  onUpdate: (updatedPO: PurchaseOrder) => void
}
```

---

## Layout

```
┌────────────────────────────────────────────────────────────────┐
│  [X]  PO #PO-24-GBR-01                                        │
│       Great Barrier Reef Exhibit — EXH-GBR-402                │
├────────────────────────────────────────────────────────────────┤
│  LIFECYCLE STEPPER (9 stages)                                  │
│  ●━━━●━━━●━━━○━━━○━━━○━━━○━━━○━━━○                            │
│  HQ  FAC  FO  PRO  ENG  OPS  PROD SHIP DELV                   │
├────────────────────────────────────────────────────────────────┤
│  CURRENT STATUS                                               │
│  Stage: FACTORY_RECEIVED          [Create Factory Order →]    │
│  Status: Approved                 Date: 2024-01-15            │
│  Amount: $1,250,000                                           │
├────────────────────────────────────────────────────────────────┤
│  FACTORY ORDER (FO)                     [+ Link Factory Order] │
│  FO Number: FO-2024-0381                                      │
│  Issued: 2024-02-01                                           │
│  Procurement: [Cleared ✓]   Engineering: [Pending ...]        │
│  [Route to Procurement]  [Route to Engineering]               │
│  [Release to Operations ▶]                                    │
├────────────────────────────────────────────────────────────────┤
│  ORDER ITEMS                                                   │
│  • Acrylic Panels 200mm [AC-20-002] — Acrylic — 12 pcs        │
│  • Life Support System Unit — LSS — 1 unit                    │
├────────────────────────────────────────────────────────────────┤
│  PAYMENT CLAIMS                              [+ Append Claim]  │
│  INV-001 — $250,000 — 2024-03-15 — Approved                   │
│  INV-002 — $500,000 — 2024-06-20 — Pending                    │
├────────────────────────────────────────────────────────────────┤
│  SHIPPING INFORMATION                        [+ Add Shipping]  │
│  Carrier: Global Logistics                                     │
│  Tracking: GL-2024-88821                                      │
│  Est. Delivery: 2024-09-30    Est. Shipping Cost: $18,500     │
│  Status: In Transit                                           │
├────────────────────────────────────────────────────────────────┤
│  REQUIREMENTS                                                  │
│  [✓] Requires Procurement    [ ] Requires Engineering         │
└────────────────────────────────────────────────────────────────┘
```

---

## Section 1 — Lifecycle Stepper

A 9-step horizontal progress indicator showing the full PO & FO process lifecycle.

**Stages in order:**

| Index | Stage Key | Label | Owner |
|---|---|---|---|
| 0 | `HQ_ISSUED` | HQ Issued | Project Manager (melody@) |
| 1 | `FACTORY_RECEIVED` | Factory Received | Factory acknowledges |
| 2 | `FO_ISSUED` | FO Issued | Project Manager links Factory Order |
| 3 | `PROCUREMENT` | Procurement | Wendy (wendy@) clears |
| 4 | `ENGINEERING` | Engineering | Alex (alex@) clears |
| 5 | `OPERATIONS_RELEASED` | Ops Released | Jenny (jenny@) takes over |
| 6 | `PRODUCTION` | Production | Vincent (vincent@) oversees |
| 7 | `SHIPPING` | Shipping | Celene (celene@) adds details |
| 8 | `DELIVERED` | Delivered | Final confirmation |

**Visual rules:**
- Completed stages: filled circle + connecting line (primary colour)
- Current stage: filled circle (accent/highlight)
- Future stages: empty circle + grey line
- Conditional stages (PROCUREMENT, ENGINEERING) shown in muted style if not required

**Stage type definition:**
```typescript
type POStage =
  | 'HQ_ISSUED'
  | 'FACTORY_RECEIVED'
  | 'FO_ISSUED'
  | 'PROCUREMENT'
  | 'ENGINEERING'
  | 'OPERATIONS_RELEASED'
  | 'PRODUCTION'
  | 'SHIPPING'
  | 'DELIVERED'
```

---

## Section 2 — Current Status & Action Buttons

Displays the live state with context-sensitive action buttons per stage.

**Displayed fields:**
- Current stage badge
- PO Status (Approved / Pending / Rejected)
- PO Amount (formatted USD)
- Date created

**Action buttons by stage:**

| Stage | Button | Next Stage | Who Acts |
|---|---|---|---|
| `HQ_ISSUED` | Mark as Received | `FACTORY_RECEIVED` | Factory / HQ |
| `FACTORY_RECEIVED` | Create Factory Order | `FO_ISSUED` | melody@ |
| `FO_ISSUED` | Route to Procurement | `PROCUREMENT` | melody@ (if required) |
| `FO_ISSUED` | Route to Engineering | `ENGINEERING` | melody@ (if required) |
| `FO_ISSUED` | Release to Operations | `OPERATIONS_RELEASED` | melody@ (if no routing needed) |
| `PROCUREMENT` | Clear Procurement | `OPERATIONS_RELEASED`* | wendy@ |
| `ENGINEERING` | Clear Engineering | `OPERATIONS_RELEASED`* | alex@ |
| `OPERATIONS_RELEASED` | Begin Production | `PRODUCTION` | jenny@ |
| `PRODUCTION` | Dispatch Shipment | `SHIPPING` | vincent@ / jenny@ |
| `SHIPPING` | Confirm Delivery | `DELIVERED` | celene@ |
| `DELIVERED` | — (completed) | — | — |

> *When both PROCUREMENT and ENGINEERING are required, `OPERATIONS_RELEASED` is only reached after **both** are cleared. The system should check both statuses on the FO record before allowing release.

Clicking an action button calls `onUpdate()` with the updated PO stage.

---

## Section 3 — Factory Order (FO)

The Factory Order is a sub-record linked to the PO. It carries the factory's reference number and tracks the internal routing and clearance workflow.

**Displayed when:** Always shown after `FACTORY_RECEIVED` stage. Before FO is created, shows `[+ Link Factory Order]` button.

```typescript
interface FactoryOrder {
  id: string                          // po_factoryorderid
  purchaseOrderId: string             // FK to PurchaseOrder
  foNumber: string                    // Factory's reference number
  issueDate: string                   // Date PM linked the FO
  sentToProcurement: boolean          // Has it been routed to Wendy
  sentToEngineering: boolean          // Has it been routed to Alex
  procurementStatus: 'Not Required' | 'Pending' | 'Cleared'
  engineeringStatus: 'Not Required' | 'Pending' | 'Cleared'
  releasedToOps: boolean              // Has it been released to Jenny
  releaseDate?: string                // Date released to operations
  notes?: string                      // Internal notes/comments
}
```

**FO section display:**
- FO Number (e.g., `FO-2024-0381`)
- Issue date
- Procurement status badge: `Not Required` / `Pending` / `Cleared ✓`
- Engineering status badge: `Not Required` / `Pending` / `Cleared ✓`
- Action buttons (context-sensitive, see table in Section 2)
- Notes field (editable text area)

**Routing logic:**
- "Route to Procurement" → sets `sentToProcurement = true`, `procurementStatus = Pending`, sends notification to `wendy@advanced-aquariums.com`
- "Route to Engineering" → sets `sentToEngineering = true`, `engineeringStatus = Pending`, sends notification to `alex@advanced-aquariums.com`
- "Clear Procurement" (Wendy) → sets `procurementStatus = Cleared`
- "Clear Engineering" (Alex) → sets `engineeringStatus = Cleared`
- "Release to Operations" → only enabled when all required clearances are `Cleared` → sets `releasedToOps = true`, sends notification to `jenny@advanced-aquariums.com`, advances PO stage to `OPERATIONS_RELEASED`

---

## Section 4 — Order Items

A read-only list of all line items attached to the PO. Each item links to the master `po_Item` catalog.

```typescript
interface POItem {
  id: string              // po_poitemid
  itemId: string          // po_itemid — lookup to master catalog
  description: string     // resolved from po_Item.po_description
  itemCode?: string       // resolved from po_Item.po_itemcode (may be blank — reserved for ERP)
  type: POItemType        // resolved from po_Item.po_type
  quantity?: number
  unit?: string           // e.g., "pcs", "m", "unit"
}
```

**Display:**
- Each row: `description [item code if set] — type — quantity unit`
- Example: `Acrylic Panels 200mm [AC-20-002] — Acrylic — 12 pcs`
- No editing in this view

---

## Section 5 — Payment Claims

Payment claims are raised **by the factory** against the PO cost. They can be created at any point once the FO has been issued — independent of PO stage.

```typescript
interface PaymentClaim {
  id: string
  amount: number
  date: string
  status: 'Pending' | 'Approved' | 'Paid'
  reference: string    // e.g., "INV-001", "CLM-123"
}
```

**Display columns:** Reference | Amount (USD) | Date | Status badge

**Status colours:**

| Status | Style |
|---|---|
| Pending | Yellow/amber |
| Approved | Green |
| Paid | Blue |

**"+ Append Claim" button:**
- Opens an inline form to add a new factory payment claim
- Fields: Reference, Amount, Date (status defaults to Pending)
- Notifies `ann@advanced-aquariums.com` (Finance Manager) on creation

---

## Section 6 — Shipping Information

Added by **Celene** (celene@advanced-aquariums.com) from the Logistics team. Includes the estimated shipping cost alongside the actual tracking details.

```typescript
interface ShippingInfo {
  carrier: string
  trackingNumber: string
  estimatedDelivery: string
  estimatedShippingCost?: number     // USD — added by Celene at time of booking
  status: 'In Transit' | 'At Port' | 'Delivered'
}
```

**Display:**
- Carrier name
- Tracking number
- Estimated delivery date
- Estimated shipping cost (USD, formatted as currency)
- Status badge

**"+ Add Shipping" button:**
- Appears when `po.shipping` is undefined (typically at `PRODUCTION` or `SHIPPING` stage)
- Fields: Carrier, Tracking Number, Estimated Delivery, Estimated Shipping Cost, Status
- Calls `onUpdate()` with `po.shipping` set

---

## Section 7 — Requirements Checkboxes

Set at PO creation or updated before FO routing. These flags determine which internal teams must clear the FO before it can be released to Operations.

```typescript
requiresProcurement: boolean   // routes FO to Wendy (wendy@)
requiresEngineering: boolean   // routes FO to Alex (alex@)
```

- Both can be true simultaneously (both must clear before ops release)
- If neither is set, FO can be released directly to Operations from `FO_ISSUED`
- Calls `onUpdate()` when toggled

---

## Data Model Reference

```typescript
interface PurchaseOrder {
  id: string
  poNumber: string
  projectId: string              // GUID — lookup to po_Project
  projectName: string            // resolved via $expand
  projectCode: string            // resolved via $expand
  date: string
  amount?: number
  status: 'Approved' | 'Pending' | 'Rejected'
  stage: POStage                 // 9 stages — see Section 1
  factoryOrder?: FactoryOrder    // linked FO sub-record (created at FO_ISSUED stage)
  paymentClaims: PaymentClaim[]  // raised by factory, any time from FO_ISSUED
  shipping?: ShippingInfo        // added by Celene at PRODUCTION/SHIPPING stage
  requiresProcurement: boolean
  requiresEngineering: boolean
  items: POItem[]                // each references po_Item master catalog
}
```

---

## Dataverse Integration Plan

When live:
- Load PO: `GET /api/data/v9.2/po_purchaseorders(id)?$expand=po_projectid($select=po_name,po_code),po_FactoryOrder_PurchaseOrder,po_POItem_PurchaseOrder($expand=po_itemid),po_PaymentClaim_PurchaseOrder,po_ShippingInfo_PurchaseOrder`
- Stage advance: `PATCH /api/data/v9.2/po_purchaseorders(id)` with `{ po_stage: 'FO_ISSUED' }`
- Link FO: `POST /api/data/v9.2/po_factoryorders` with `po_purchaseorderid@odata.bind`
- Route FO to procurement: `PATCH /api/data/v9.2/po_factoryorders(id)` with `{ po_sentprocurement: true, po_procurementstatus: 'Pending' }` + trigger Power Automate notification to wendy@
- Clear procurement: `PATCH` with `{ po_procurementstatus: 'Cleared' }`
- Release to ops: `PATCH` FO + `PATCH` PO stage to `OPERATIONS_RELEASED` + notify jenny@
- Append claim: `POST /api/data/v9.2/po_paymentclaims` + notify ann@
- Add shipping: `POST /api/data/v9.2/po_shippinginfos` with estimated cost

---

*Context file — keep updated as FO workflow and notifications are implemented.*
*Related: `03_purchase_orders.md`, `05_create_po.md`, `08_database.md`*
