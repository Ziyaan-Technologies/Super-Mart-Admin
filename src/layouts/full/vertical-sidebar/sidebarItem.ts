import {
  Home2Icon,
  UserStarIcon,
  BuildingStoreIcon,
  UserHeartIcon,
  UsersIcon,
  CategoryIcon,
  BadgeIcon,
  BoxSeamIcon,
  StackIcon,
  RulerMeasureIcon,
  FlagIcon,
  BuildingCommunityIcon,
  MapPinsIcon,
  UserCogIcon,
  ShieldCheckIcon,
  KeyIcon,
} from 'vue-tabler-icons';

export interface menu {
  header?: string;
  title?: string;
  icon?: any;
  to?: string;
  chip?: string;
  chipBgColor?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  divider?: boolean;
  type?: string;
  subCaption?: string;

  action?: string;
  subject?: string;
}

const sidebarItem: menu[] = [
  { header: 'Dashboard' },
  { title: 'Home', icon: Home2Icon, to: '/dashboard/analytical' },

  { header: 'Businesses' },
  { title: 'Clients', icon: UserStarIcon, to: '/vendors', action: 'vendors_view', subject: 'Vendors' },
  { title: 'Stores', icon: BuildingStoreIcon, to: '/client-stores', action: 'client_stores_view', subject: 'Client Stores' },
  { title: 'Store Users', icon: UserHeartIcon, to: '/clients', action: 'clients_view', subject: 'Clients' },
  { title: 'Customers', icon: UsersIcon, to: '/customers', action: 'customers_view', subject: 'Customers' },

  { header: 'Catalog' },
  { title: 'Categories', icon: CategoryIcon, to: '/categories', action: 'categories_view', subject: 'Categories' },
  { title: 'Brands', icon: BadgeIcon, to: '/brands', action: 'brands_view', subject: 'Brands' },
  { title: 'Products', icon: BoxSeamIcon, to: '/products', action: 'products_view', subject: 'Products' },
  { title: 'Stock', icon: StackIcon, to: '/stock', action: 'stock_view', subject: 'Stock' },

  { header: 'Settings' },
  { title: 'Units', icon: RulerMeasureIcon, to: '/units', action: 'units_view', subject: 'Units' },
  { title: 'Countries', icon: FlagIcon, to: '/countries', action: 'countries_view', subject: 'Countries' },
  { title: 'Cities', icon: BuildingCommunityIcon, to: '/cities', action: 'cities_view', subject: 'Cities' },
  { title: 'Areas', icon: MapPinsIcon, to: '/areas', action: 'areas_view', subject: 'Areas' },

  { header: 'Access Control' },
  { title: 'Admins', icon: UserCogIcon, to: '/admins', action: 'admins_view', subject: 'Admins' },
  { title: 'Roles', icon: ShieldCheckIcon, to: '/roles', action: 'roles_view', subject: 'Roles' },
  { title: 'Permissions', icon: KeyIcon, to: '/permissions', action: 'permissions_view', subject: 'Permissions' },
];

export default sidebarItem;
