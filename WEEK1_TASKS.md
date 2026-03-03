# Week 1 Tasks - Ecommerce Application (MERN)

Project: MERN ecommerce app with role-based dashboards (`customer`, `seller`, `admin`)

## 1) Wireframing

- [ ] Create low-fidelity wireframes for key screens:
  - `Login/Register` (`/login`)
  - `Customer Home` (product listing + search/filter + buy flow)
  - `Customer Orders` (`/customer/orders`)
  - `Admin Orders` (`/admin/orders`)
  - `Admin Transport Agents` (`/admin/transport-agents`)
  - `Seller Products` (`/seller`)
- [ ] Include mobile and desktop layout for each screen.
- [ ] Add component blocks per page: navbar/sidebar, cards/tables, form sections, CTA buttons.
- [ ] Final deliverable: one wireframe board (Figma or similar) with all role flows.

## 2) Design Research

- [ ] Collect 5-8 reference ecommerce/admin UI examples.
- [ ] Focus on patterns needed in this project:
  - Product grid and filters
  - Checkout/address form UX
  - Seller product management forms
  - Admin order table and shipment status UI
- [ ] Create a mini style direction document:
  - Color palette (primary, success, warning, error)
  - Typography pair
  - Spacing scale and button/input styles
- [ ] Final deliverable: `design-references.md` with screenshots/links and selected style decisions.

## 3) Data Model Creation

- [ ] Finalize initial entities in MongoDB (Mongoose):
  - `User` (name, email, passwordHash, role, address)
  - `Product` (name, description, price, category, images, features, stock, seller, isActive)
  - `Order` (customer, items, totalAmount, paymentStatus, paymentMethod, deliveryAddress, status, shippingTrackingNumber, shippingCarrier, transportAgent)
  - `TransportAgent` (name, phone, company)
- [ ] Confirm relationships:
  - Seller (`User`) 1..* `Product`
  - Customer (`User`) 1..* `Order`
  - `Order` *..1 `TransportAgent` (optional at creation)
- [ ] Add validation checklist:
  - Required fields
  - Enum values (`role`, `paymentStatus`, `status`)
  - Indexes (`email`, product search fields)
- [ ] Final deliverable: ER diagram + schema notes in `docs/data-model-week1.md`.

## 4) Library and Package Planning

Current stack in repo:

- Backend: `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `dotenv`, `cors`, `multer`, `nodemon`
- Frontend: `react`, `react-dom`, `react-router-dom`, `vite`, `eslint`

Week 1 planned additions (decision list):

- [ ] API validation: `zod` or `joi`
- [ ] Better logging: `morgan`
- [ ] Security hardening: `helmet`, `express-rate-limit`
- [ ] Frontend API/state: keep custom `fetch` wrapper for now; evaluate `axios` + `tanstack/react-query` in Week 2
- [ ] UI system: decide between plain CSS modules vs component library (MUI/Tailwind)
- [ ] Testing baseline for Week 2:
  - Backend: `jest` + `supertest`
  - Frontend: `vitest` + `react-testing-library`

Final deliverable: `docs/package-plan-week1.md` with "Use Now" vs "Later" columns.

## 5) Cloud Platform Accounts

- [ ] MongoDB Atlas account (cloud database option)
- [ ] Cloudinary account (product image hosting alternative to local uploads)
- [ ] Render or Railway account (backend deployment)
- [ ] Vercel or Netlify account (frontend deployment)
- [ ] GitHub repo setup with environment secrets planning

Environment variables to prepare:

- Backend: `MONGO_URI`, `JWT_SECRET`, `PORT`, optional cloud image keys
- Frontend: `VITE_API_BASE_URL`

Final deliverable: `docs/cloud-setup-week1.md` with account links, service choice, and env var checklist.

## Week 1 Output Checklist

- [ ] Wireframe board complete
- [ ] Design references document complete
- [ ] Data model ER + schema notes complete
- [ ] Package plan document complete
- [ ] Cloud accounts created and documented

## Ownership and Timeline

- Owner: Project team
- Week window: Week 1
- Status: In progress
