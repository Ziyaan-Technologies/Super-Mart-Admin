<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from 'axios';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import UiPageHeader from '@/components/shared/UiPageHeader.vue';
import KpiBoxUi from '@/components/shared/KpiBoxUi.vue';
import UiDataTable from '@/components/shared/UiDataTable.vue';
import UiStatusChip from '@/components/shared/UiStatusChip.vue';
import { useAuthStore } from '@/stores/auth';
import { can } from '@/utils/permissions';
import { formatDate, formatNumber } from '@/utils/api';

const authStore = useAuthStore();
const loading = ref(true);
const stats = ref<Record<string, any>>({});
const recentVendors = ref<any[]>([]);
const stores = ref<any[]>([]);
const lowStock = ref<any[]>([]);

const sources = [
  { key: 'vendors', path: 'vendors/v1/kpis', permission: ['vendors_view', 'Vendors'] },
  { key: 'stores', path: 'clientstores/v1/kpis', permission: ['client_stores_view', 'Client Stores'] },
  { key: 'clients', path: 'clients/v1/kpis', permission: ['clients_view', 'Clients'] },
  { key: 'customers', path: 'users/v1/kpis', permission: ['customers_view', 'Customers'] },
  { key: 'products', path: 'products/v1/kpis', permission: ['products_view', 'Products'] },
  { key: 'stock', path: 'stock/v1/kpis', permission: ['stock_view', 'Stock'] },
];

async function load() {
  loading.value = true;
  await Promise.all(sources.map(async (source) => {
    if (!can(source.permission[0], source.permission[1])) return;
    try {
      stats.value[source.key] = (await axios.post(source.path, {})).data;
    } catch (error) {
      console.error(`Failed to load ${source.key}`, error);
    }
  }));
  if (can('vendors_view', 'Vendors')) {
    recentVendors.value = (await axios.post('vendors/v1/list', { page: 1, take: 5 })).data.data;
  }
  if (can('client_stores_view', 'Client Stores')) {
    stores.value = (await axios.post('clientstores/v1/list', { page: 1, take: 8 })).data.data;
  }
  if (can('stock_view', 'Stock')) {
    lowStock.value = (await axios.post('stock/v1/list', { page: 1, take: 5, stock_status: 'low', sortBy: 'Quantity Low' })).data.data;
  }
  loading.value = false;
}

onMounted(load);
</script>

<template>
  <UiPageHeader :title="`Welcome, ${authStore.user?.full_name || ''}`" :breadcrumbs="[{ text: 'Dashboard', disabled: true, href: '#' }]" :show-export="false" />

  <div class="kpi-grid mb-6">
    <KpiBoxUi v-if="can('vendors_view', 'Vendors')" title="Clients" :value="stats.vendors?.totalVendors ?? 0" icon="mdi-storefront-outline" percentage="" :is-positive="true" comparison-text="" :footer-text="`${stats.vendors?.activeVendors ?? 0} active`" color="#6366f1" icon-bg-color="#e8ebff" :loading="loading" />
    <KpiBoxUi v-if="can('client_stores_view', 'Client Stores')" title="Stores" :value="stats.stores?.totalStores ?? 0" icon="mdi-store-outline" percentage="" :is-positive="true" comparison-text="" :footer-text="`${stats.stores?.posStores ?? 0} with POS`" color="#0891b2" icon-bg-color="#e7f5ff" :loading="loading" />
    <KpiBoxUi v-if="can('clients_view', 'Clients')" title="Store Users" :value="stats.clients?.totalClients ?? 0" icon="mdi-account-tie-outline" percentage="" :is-positive="true" comparison-text="" :footer-text="`${stats.clients?.owners ?? 0} owners`" color="#7c3aed" icon-bg-color="#f1eaff" :loading="loading" />
    <KpiBoxUi v-if="can('customers_view', 'Customers')" title="Customers" :value="stats.customers?.totalCustomers ?? 0" icon="mdi-account-group-outline" percentage="" :is-positive="true" comparison-text="" :footer-text="`${stats.customers?.activeCustomers ?? 0} active`" color="#16a34a" icon-bg-color="#e7f8ee" :loading="loading" />
    <KpiBoxUi v-if="can('products_view', 'Products')" title="Products" :value="stats.products?.totalProducts ?? 0" icon="mdi-package-variant-closed" percentage="" :is-positive="true" comparison-text="" :footer-text="`${stats.products?.expiryTracked ?? 0} expiry-tracked`" color="#ea580c" icon-bg-color="#fff1e6" :loading="loading" />
    <KpiBoxUi v-if="can('stock_view', 'Stock')" title="Stock Value" :value="formatNumber(stats.stock?.stockValue, 0)" icon="mdi-cash-multiple" percentage="" :is-positive="true" comparison-text="" :footer-text="`${stats.stock?.lowStock ?? 0} low · ${stats.stock?.outOfStock ?? 0} out · ${stats.stock?.expiringSoon ?? 0} expiring`" color="#dc2626" icon-bg-color="#fdecec" :loading="loading" />
  </div>

  <v-row>
    <v-col v-if="can('client_stores_view', 'Client Stores')" cols="12">
      <UiParentCard title="Stores">
        <template #action>
          <v-btn variant="text" color="primary" to="/client-stores">View all</v-btn>
        </template>
        <UiDataTable
          :headers="[{ title: 'Store', key: 'store_name' }, { title: 'Client', key: 'vendor' }, { title: 'City', key: 'city' }, { title: 'Phone', key: 'store_phone' }, { title: 'Hours', key: 'hours' }, { title: 'POS', key: 'is_pos_active' }, { title: 'Status', key: 'is_active' }]"
          :items="stores"
          :loading="loading"
          :paginate="false"
          empty-text="No stores yet"
        >
          <template #item.store_name="{ item }">
            <div class="d-flex align-center ga-3">
              <v-avatar size="34" rounded="lg" color="grey-lighten-3">
                <v-img v-if="item.image_url" :src="item.image_url" cover />
                <v-icon v-else size="18" color="primary">mdi-store-outline</v-icon>
              </v-avatar>
              <div>
                <div class="font-weight-medium">{{ item.store_name }}</div>
                <div class="text-muted-sm">{{ item.store_code }}<span v-if="item.address"> · {{ item.address }}</span></div>
              </div>
            </div>
          </template>
          <template #item.vendor="{ item }">{{ item.vendor?.business_name || '—' }}</template>
          <template #item.city="{ item }">{{ item.city?.name || '—' }}</template>
          <template #item.store_phone="{ item }">{{ item.store_phone || '—' }}</template>
          <template #item.hours="{ item }">
            {{ item.opening_time ? `${item.opening_time.slice(0, 5)} - ${(item.closing_time || '').slice(0, 5)}` : '—' }}
          </template>
          <template #item.is_pos_active="{ item }">
            <UiStatusChip :status="item.is_pos_active ? 'On' : 'Off'" :variant="item.is_pos_active ? 'green' : 'gray'" />
          </template>
          <template #item.is_active="{ item }">
            <UiStatusChip :status="item.is_active ? 'Active' : 'Inactive'" :variant="item.is_active ? 'green' : 'gray'" />
          </template>
        </UiDataTable>
      </UiParentCard>
    </v-col>
    <v-col v-if="can('vendors_view', 'Vendors')" cols="12" lg="6">
      <UiParentCard title="Newest Clients">
        <template #action>
          <v-btn variant="text" color="primary" to="/vendors">View all</v-btn>
        </template>
        <UiDataTable
          :headers="[{ title: 'Business', key: 'business_name' }, { title: 'Type', key: 'business_type' }, { title: 'Joined', key: 'created_at' }, { title: 'Status', key: 'is_active' }]"
          :items="recentVendors"
          :loading="loading"
          :paginate="false"
          empty-text="No clients yet"
        >
          <template #item.created_at="{ item }">{{ formatDate(item.created_at) }}</template>
          <template #item.is_active="{ item }">
            <UiStatusChip :status="item.is_active ? 'Active' : 'Inactive'" :variant="item.is_active ? 'green' : 'gray'" />
          </template>
        </UiDataTable>
      </UiParentCard>
    </v-col>
    <v-col v-if="can('stock_view', 'Stock')" cols="12" lg="6">
      <UiParentCard title="Low Stock (all clients)">
        <template #action>
          <v-btn variant="text" color="primary" to="/stock">View stock</v-btn>
        </template>
        <UiDataTable
          :headers="[{ title: 'Product', key: 'product_name' }, { title: 'SKU', key: 'sku' }, { title: 'On Hand', key: 'quantity' }, { title: 'Reorder At', key: 'reorder_level' }]"
          :items="lowStock"
          :loading="loading"
          :paginate="false"
          empty-text="Nothing is running low"
        >
          <template #item.product_name="{ item }">
            <div class="font-weight-medium">{{ item.product_name }}</div>
            <div class="text-muted-sm">{{ item.variant_name }}</div>
          </template>
          <template #item.quantity="{ item }">{{ formatNumber(item.quantity, 3) }} {{ item.stock_unit }}</template>
        </UiDataTable>
      </UiParentCard>
    </v-col>
  </v-row>
</template>
