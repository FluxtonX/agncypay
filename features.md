# AgncyPay Feature & Component Roadmap

This roadmap tracks the development of the modularized AgncyPay frontend, breaking down the dashboard views into clean, isolated, and reusable React components integrated with NestJS backend APIs.

## Phased Implementation Checklist

### Module 3: Modular Dashboard & State Management
- [ ] **Dashboard State Management Layer**:
  - [ ] Implement robust local/context state sync for active wallet ledger accounts
  - [ ] Support optimistic updates and real-time loading/error boundaries for queries
- [ ] **Pane 1: Transaction & Ledger Components (Left Side)**:
  - [ ] `RecentIncomeCard`: Display paginated incoming campaign payments (calls `/payments/wallet/:id`)
  - [ ] `RecentPayoutsCard`: Display outgoing bank settlements and transfers (calls `/payouts/wallet/:id`)
  - [ ] `RecentVendorsCard`: List connected creator and brand agencies (calls `/wallets/resolve`)
- [ ] **Pane 2: Control & Integration Utilities (Right Side)**:
  - [ ] `QuickActionsCard`: Inline shortcuts container (Send request, Split settings, Add partner)
  - [ ] `RequestAnalyticsCard`: Compact SVG or CSS-based analytics tracking metrics
  - [ ] `PlaidConnectorCard`: Connect Plaid link modal flow and active cards/banks list

### Module 4: Invoice & Payment Orchestration
- [ ] `InvoiceCreationDrawer`: Slide-over component with form validation
- [ ] `PaymentMethodSelector`: Choose between ACH/Plaid transfer and Credit Card pipelines
- [ ] `BatchSettlementQueue`: Batch payout approval table

### Module 5: QuickBooks Online Sync Manager
- [ ] `QBOConnector`: Connection state toggle and callback handler
- [ ] `QBOReconciliationLog`: List mismatched ledger items and manual reconciliation overrides

### Module 6: Guest Portals & Exports
- [ ] Shared client invoice payment screens
- [ ] PDF report generation utilities
