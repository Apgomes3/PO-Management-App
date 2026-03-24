# ProcureArch Operations — Dataverse Table Creation Prompt

## Usage

Paste the prompt below into Copilot Studio, Power Apps AI, or any AI assistant to generate all 9 Dataverse tables. Character count: **1839** (limit: 1900).

---

## Prompt

```
Create 9 Dataverse tables (prefix: po_) in this order:

1.po_Project: name(txt,req), code(txt,unique,req), status(choice:In Progress|Planning|On Hold|Completed,req), progress(int)

2.po_Item: description(txt,req), itemcode(txt), type(choice:Tanks|LSS|Acrylic|Rockwork|Components|Electrical|Other,req)

3.po_PurchaseOrder: ponumber(autonumber,req), projectid(→po_Project,req), date(date,req), amount(currency), status(choice:Approved|Pending|Rejected,req), stage(choice:HQ_ISSUED|FACTORY_RECEIVED|FO_ISSUED|PROCUREMENT|ENGINEERING|OPERATIONS_RELEASED|PRODUCTION|SHIPPING|DELIVERED,req), requiresprocurement(bool,def:No), requiresengineering(bool,def:No)

4.po_FactoryOrder: purchaseorderid(→po_PurchaseOrder,req,1:1), fonumber(txt,req), issuedate(date,req), sentprocurement(bool,def:No), sentengineering(bool,def:No), procurementstatus(choice:Not Required|Pending|Cleared,req), engineeringstatus(choice:Not Required|Pending|Cleared,req), releasedtoops(bool,def:No), releasedate(date), notes(memo)

5.po_POItem: purchaseorderid(→po_PurchaseOrder,req,cascade), itemid(→po_Item,req), quantity(decimal), unit(txt)

6.po_PaymentClaim: purchaseorderid(→po_PurchaseOrder,req,cascade), amount(currency,req), date(date,req), status(choice:Pending|Approved|Paid,req), reference(txt,req)

7.po_ShippingInfo: purchaseorderid(→po_PurchaseOrder,req,1:1), carrier(txt), trackingnumber(txt), estimateddelivery(date), estimatedshippingcost(currency), status(choice:In Transit|At Port|Delivered)

8.po_AuditLog: purchaseorderid(→po_PurchaseOrder,opt), type(choice:Allocation Approved|Internal Draft|Exceeded Ceiling,req), message(txt,req), time(datetime,req)

9.po_Report: title(txt,req), date(date,req), type(choice:Financial|Operational|Logistics,req), generatedby(txt), projectcode(txt), periodstart(date), periodend(date), downloadurl(url)
```

---

*Related: `08_database.md` for full table definitions, column notes, and OData queries.*
