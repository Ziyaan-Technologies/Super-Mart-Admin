<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import KpiBoxUi from '@/components/shared/KpiBoxUi.vue';
import UiPageHeader from '@/components/shared/UiPageHeader.vue';
import SearchHeaderForm from '@/components/shared/SearchHeaderForm.vue';
import UiDataTable from '@/components/shared/UiDataTable.vue';
import UiStatusChip from '@/components/shared/UiStatusChip.vue';
import { useListPage } from '@/composables/useListPage';
import { toOptions, useLookups } from '@/composables/useLookups';
import { formatDate, formatNumber } from '@/utils/api';

const breadcrumbs = [
  { text: 'Dashboard', disabled: false, href: '/dashboard/analytical' },
  { text: 'Stock', disabled: true, href: '#' },
];

const tab = ref('stock');
const filterSource = (f: Record<string, any>) => ({
  vendor_id: f.vendor || undefined,
  clientstore_id: f.store || undefined,
  stock_status: f.type || undefined,
});
const list = useListPage('stock', { exportName: 'Stock', filters: filterSource });
const expiry = useListPage('stock', { listPath: 'stock/v1/expiry', kpis: false, immediate: false, filters: (f) => ({ ...filterSource(f), days: 60 }) });
const { vendors, stores, loadVendors, loadStores } = useLookups();

const stockStatus = [
  { label: 'In stock', value: 'in' },
  { label: 'Low stock', value: 'low' },
  { label: 'Out of stock', value: 'out' },
];

const statusVariant: Record<string, any> = { 'In Stock': 'green', 'Low Stock': 'orange', 'Out of Stock': 'red' };

const headers = [
  { title: 'Product', key: 'product_name' },
  { title: 'SKU', key: 'sku' },
  { title: 'Category', key: 'category_name' },
  { title: 'On Hand', key: 'quantity' },
  { title: 'Reorder At', key: 'reorder_level' },
  { title: 'Avg Cost', key: 'average_cost' },
  { title: 'Value', key: 'stock_value' },
  { title: 'Status', key: 'stock_status' },
];

const expiryHeaders = [
  { title: 'Product', key: 'product' },
  { title: 'Store', key: 'store' },
  { title: 'Batch', key: 'batch_number' },
  { title: 'Expiry', key: 'expiry_date' },
  { title: 'Days Left', key: 'days_left' },
  { title: 'Qty', key: 'quantity' },
  { title: 'Value', key: 'stock_value' },
];

function onFilterChange(value: Record<string, any>) {
  list.onFilterChange(value);
  expiry.onFilterChange(value);
}

function onSearch(key: string) {
  list.onSearch(key);
  expiry.onSearch(key);
}

watch(tab, (value) => {
  if (value === 'expiry') expiry.fetchData();
});
watch(() => list.filters.value.vendor, (vendorId) => loadStores(vendorId || null));

onMounted(() => Promise.all([loadVendors(), loadStores()]));
</script>

<template>
  <UiPageHeader
    title="Stock"
    :breadcrumbs="breadcrumbs"
    show-download-pdf
    :export-loading="list.exportingExcel.value"
    :pdf-loading="list.exportingPdf.value"
    @export="list.exportFile('excel')"
    @download-pdf="list.exportFile('pdf')"
  />

  <div class="kpi-grid mb-4">
    <KpiBoxUi title="SKUs" :value="list.kpis.value.skuCount ?? 0" icon="mdi-barcode" percentage="" :is-positive="true" comparison-text="" footer-text="Active variants" color="#6366f1" icon-bg-color="#e8ebff" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Stock Value" :value="formatNumber(list.kpis.value.stockValue, 0)" icon="mdi-cash-multiple" percentage="" :is-positive="true" comparison-text="" footer-text="At moving average cost" color="#16a34a" icon-bg-color="#e7f8ee" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Low Stock" :value="list.kpis.value.lowStock ?? 0" icon="mdi-alert-outline" percentage="" :is-positive="false" comparison-text="" footer-text="At or below reorder level" color="#ea580c" icon-bg-color="#fff1e6" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Out of Stock" :value="list.kpis.value.outOfStock ?? 0" icon="mdi-close-octagon-outline" percentage="" :is-positive="false" comparison-text="" footer-text="Nothing on hand" color="#dc2626" icon-bg-color="#fdecec" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Expiring (30d)" :value="list.kpis.value.expiringSoon ?? 0" icon="mdi-calendar-alert" percentage="" :is-positive="false" comparison-text="" :footer-text="`${list.kpis.value.expired ?? 0} batches already expired`" color="#7c3aed" icon-bg-color="#f1eaff" :loading="list.kpiLoading.value" />
  </div>

  <SearchHeaderForm
    class="mb-3"
    page-context="stock-overview"
    search-text="Search product, SKU, barcode..."
    :date-ranges="[]"
    :vendor-options="toOptions(vendors, 'business_name')"
    :store-options="toOptions(stores, 'store_name')"
    :type-options="stockStatus"
    :sort-options="['Name', 'Quantity Low', 'Quantity High', 'Newest']"
    @on-search="onSearch"
    @filter-change="onFilterChange"
  />

  <UiParentCard>
    <v-tabs v-model="tab" color="primary" class="px-4">
      <v-tab value="stock">Stock on hand</v-tab>
      <v-tab value="expiry">Expiring batches</v-tab>
    </v-tabs>
    <v-divider />
    <v-window v-model="tab">
      <v-window-item value="stock">
        <UiDataTable
          :headers="headers"
          :items="list.items.value"
          :loading="list.loading.value"
          :total-items="list.totalItems.value"
          :current-page="list.currentPage.value"
          :items-per-page="list.itemsPerPage.value"
          :page-count="list.pageCount.value"
          item-label="SKUs"
          @update:current-page="list.currentPage.value = $event"
          @update:items-per-page="list.itemsPerPage.value = $event"
        >
          <template #item.product_name="{ item }">
            <div class="font-weight-medium">{{ item.product_name }}</div>
            <div class="text-muted-sm">{{ item.variant_name }}<span v-if="item.brand_name"> · {{ item.brand_name }}</span></div>
          </template>
          <template #item.quantity="{ item }"><strong>{{ formatNumber(item.quantity, 3) }}</strong> {{ item.stock_unit }}</template>
          <template #item.reorder_level="{ item }">{{ formatNumber(item.reorder_level, 3) }}</template>
          <template #item.average_cost="{ item }">{{ formatNumber(item.average_cost, 2) }}</template>
          <template #item.stock_value="{ item }">{{ formatNumber(item.stock_value, 2) }}</template>
          <template #item.stock_status="{ item }">
            <UiStatusChip :status="item.stock_status" :variant="statusVariant[item.stock_status]" />
          </template>
        </UiDataTable>
      </v-window-item>
      <v-window-item value="expiry">
        <UiDataTable
          :headers="expiryHeaders"
          :items="expiry.items.value"
          :loading="expiry.loading.value"
          :total-items="expiry.totalItems.value"
          :current-page="expiry.currentPage.value"
          :items-per-page="expiry.itemsPerPage.value"
          :page-count="expiry.pageCount.value"
          item-label="batches"
          empty-text="No batches expire in the next 60 days"
          @update:current-page="expiry.currentPage.value = $event"
          @update:items-per-page="expiry.itemsPerPage.value = $event"
        >
          <template #item.product="{ item }">
            <div class="font-weight-medium">{{ item.product_variant?.product?.name }}</div>
            <div class="text-muted-sm">{{ item.product_variant?.name }} · {{ item.product_variant?.sku }}</div>
          </template>
          <template #item.store="{ item }">{{ item.clientstore?.store_name }}</template>
          <template #item.batch_number="{ item }">{{ item.batch_number || '—' }}</template>
          <template #item.expiry_date="{ item }">{{ formatDate(item.expiry_date) }}</template>
          <template #item.days_left="{ item }">
            <UiStatusChip :status="item.days_left < 0 ? `Expired ${-item.days_left}d ago` : `${item.days_left} days`" :variant="item.days_left < 0 ? 'red' : item.days_left <= 7 ? 'orange' : 'gray'" />
          </template>
          <template #item.quantity="{ item }">{{ formatNumber(item.quantity, 3) }}</template>
          <template #item.stock_value="{ item }">{{ formatNumber(item.stock_value, 2) }}</template>
        </UiDataTable>
      </v-window-item>
    </v-window>
  </UiParentCard>
</template>
