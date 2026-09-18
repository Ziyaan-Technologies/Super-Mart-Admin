# Super Mart Admin

Platform admin panel for Super Mart (Vue 3, Vuetify 3, Pinia, CASL). It is built from the `saas-new-admin` shell and talks to `Super-Mart-Backend`.

## Setup

```bash
npm ci
cp .env.example .env        # VITE_API_URL=http://localhost:4000/api/
npm run dev -- --port 5174  # port 5174 is already allowed by the API's CORS_ORIGINS
npm run build
```

Sign in with the seeded super admin (`admin@supermart.local` / `Admin@123` unless you changed `SEED_ADMIN_*`).

## What is here

| Section | Pages |
| --- | --- |
| Businesses | Clients (the businesses; creating one also creates its owner login), Stores, Store Users, Customers |
| Catalog | Categories, Brands, Products (with stock per store), Stock (on hand and expiring batches). These are read-only. |
| Settings | Units, Countries, Cities, Areas |
| Access Control | Admins, Roles (permission matrix for admin-panel and store-panel roles), Permissions |

In the API and database a business is still called a *vendor* and its people *clients*; only the labels in this panel say Client and Store User.

## Roles and what each store user can see

- **Roles → Add Role** builds a role: name, panel (Admin or Store), the client it belongs to, and a tick grid of permissions (module + action).
- Leave **Client** empty and the role is offered to every client; pick one client and only that client sees it.
- Four store roles ship ready to use: **Owner, Manager, Cashier, Product Entry**. You can retune their ticks, and `npm run seed` will not overwrite your changes.
- A new client's first login gets the **Owner** role.
- Every tab in the store panel maps to one permission, so unticking `Products view` removes the Products tab for that role. Store owners can only pick roles, never create them.

## How permissions work in the UI

- After login the app loads `GET auth/me/permissions` and builds CASL rules as `can(permission_key, module_name)`.
- Routes declare `meta.action` / `meta.subject`. The sidebar is filtered with `filterMenuByAbility`, and row actions and "Add" buttons check `can()` from `src/utils/permissions.ts`.
- The API enforces the same keys, so hiding a button is only for convenience, not security.

## Conventions

- List pages use `useListPage(resource)` (`src/composables/useListPage.ts`). It calls `<resource>/v1/list`, `v1/kpis` and `export/excel|pdf`.
- Tables use `UiDataTable`, which supports cell slots, permission-aware row actions and pagination.
- Forms are one `<Module>FormModal.vue` per module, used for both add and edit (`data` prop).
- Image uploads go to `POST files/<folder>/upload`.
