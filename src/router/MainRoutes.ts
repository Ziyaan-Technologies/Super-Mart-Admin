const module = (name: string, path: string, component: () => Promise<any>, action: string, subject: string) => ({
  name,
  path,
  component,
  meta: {
    requiresAuth: true,
    action: [action],
    subject
  }
});

const MainRoutes = {
  path: '/main',
  meta: {
    requiresAuth: true
  },
  redirect: '/main',
  component: () => import('@/layouts/full/FullLayout.vue'),
  children: [
    {
      path: '/',
      redirect: '/dashboard/analytical',
    },
    {
      name: 'Dashboard',
      path: '/dashboard/analytical',
      component: () => import('@/views/dashboards/analytical/Analytical.vue'),
      meta: {
        requiresAuth: true,
      }
    },
    {
      name: 'UpdateProfile',
      path: '/profile/update-details',
      component: () => import('@/views/profile/Profile.vue')
    },
    {
      name: 'UpdatePassword',
      path: '/auth/update-password',
      component: () => import('@/views/profile/BoxedUpdatePassword.vue'),
    },
    module('Vendors', '/vendors', () => import('@/views/modules/vendor/Vendor.vue'), 'vendors_view', 'Vendors'),
    module('ClientStores', '/client-stores', () => import('@/views/modules/client-store/ClientStore.vue'), 'client_stores_view', 'Client Stores'),
    module('Clients', '/clients', () => import('@/views/modules/client/Client.vue'), 'clients_view', 'Clients'),
    module('Customers', '/customers', () => import('@/views/modules/user/User.vue'), 'customers_view', 'Customers'),
    module('Categories', '/categories', () => import('@/views/modules/category/Category.vue'), 'categories_view', 'Categories'),
    module('Brands', '/brands', () => import('@/views/modules/brand/Brand.vue'), 'brands_view', 'Brands'),
    module('Products', '/products', () => import('@/views/modules/product/Product.vue'), 'products_view', 'Products'),
    module('Stock', '/stock', () => import('@/views/modules/stock/Stock.vue'), 'stock_view', 'Stock'),
    module('Units', '/units', () => import('@/views/modules/unit/Unit.vue'), 'units_view', 'Units'),
    module('Countries', '/countries', () => import('@/views/modules/country/Country.vue'), 'countries_view', 'Countries'),
    module('Cities', '/cities', () => import('@/views/modules/city/City.vue'), 'cities_view', 'Cities'),
    module('Areas', '/areas', () => import('@/views/modules/area/Area.vue'), 'areas_view', 'Areas'),
    module('Admins', '/admins', () => import('@/views/modules/admin/Admin.vue'), 'admins_view', 'Admins'),
    module('Roles', '/roles', () => import('@/views/modules/roles/Roles.vue'), 'roles_view', 'Roles'),
    module('Permissions', '/permissions', () => import('@/views/modules/permissions/Permission.vue'), 'permissions_view', 'Permissions'),
  ]
};

export default MainRoutes;
