<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from 'axios';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import KpiBoxUi from '@/components/shared/KpiBoxUi.vue';
import UiPageHeader from '@/components/shared/UiPageHeader.vue';
import SearchHeaderForm from '@/components/shared/SearchHeaderForm.vue';
import UiDataTable from '@/components/shared/UiDataTable.vue';
import UiStatusChip from '@/components/shared/UiStatusChip.vue';
import UiBaseModal from '@/components/shared/UiBaseModal.vue';
import { useListPage } from '@/composables/useListPage';
import { toOptions, useLookups } from '@/composables/useLookups';
import { can } from '@/utils/permissions';
import { formatNumber, notifyError, sortOptions, statusOptions } from '@/utils/api';

const breadcrumbs = [
  { text: 'Dashboard', disabled: false, href: '/dashboard/analytical' },
  { text: 'Products', disabled: true, href: '#' },
];

const list = useListPage('products', {
  exportName: 'Products',
  filters: (f) => ({ vendor_id: f.vendor || undefined }),
});
const { vendors, loadVendors } = useLookups();

const viewOpen = ref(false);
const product = ref<any>(null);
const stock = ref<any>({ stores: [], batches: [] });
const stockLoading = ref(false);

const headers = [
  { title: 'Product', key: 'name' },
  { title: 'Client', key: 'vendor' },
  { title: 'Category', key: 'category' },
  { title: 'Variants', key: 'variants' },
  { title: 'Price', key: 'price' },
  { title: 'Status', key: 'is_active', align: 'center' as const },
];

const priceRange = (variants: any[]) => {
  if (!variants?.length) return '—';
  const prices = variants.map((variant) => variant.sale_price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? formatNumber(min) : `${formatNumber(min)} – ${formatNumber(max)}`;
};

async function onAction(_: string, item: any) {
  product.value = item;
  viewOpen.value = true;
  stock.value = { stores: [], batches: [] };
  if (!can('stock_view', 'Stock') || !item.variants?.length) return;
  stockLoading.value = true;
  try {
    const results = await Promise.all(item.variants.map((variant: any) => axios.get(`stock/variant/${variant.id}`)));
    stock.value = {
      stores: results.flatMap((result, index) => result.data.stores.map((row: any) => ({ ...row, variant: item.variants[index] }))),
      batches: results.flatMap((result, index) => result.data.batches.map((row: any) => ({ ...row, variant: item.variants[index] }))),
    };
  } catch (error) {
    notifyError(error);
  } finally {
    stockLoading.value = false;
  }
}

onMounted(loadVendors);
</script>

<template>
  <UiPageHeader
    title="Products"
    :breadcrumbs="breadcrumbs"
    show-download-pdf
    :export-loading="list.exportingExcel.value"
    :pdf-loading="list.exportingPdf.value"
    @export="list.exportFile('excel')"
    @download-pdf="list.exportFile('pdf')"
  />

  <div class="kpi-grid mb-4">
    <KpiBoxUi title="Products" :value="list.kpis.value.totalProducts ?? 0" icon="mdi-package-variant-closed" :percentage="`${list.kpis.value.totalProductsGrowth ?? 0}%`" :is-positive="(list.kpis.value.totalProductsGrowth ?? 0) >= 0" comparison-text="vs previous period" color="#6366f1" icon-bg-color="#e8ebff" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Active" :value="list.kpis.value.activeProducts ?? 0" icon="mdi-check-circle-outline" percentage="" :is-positive="true" comparison-text="" footer-text="On sale" color="#16a34a" icon-bg-color="#e7f8ee" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Inactive" :value="list.kpis.value.inactiveProducts ?? 0" icon="mdi-pause-circle-outline" percentage="" :is-positive="false" comparison-text="" footer-text="Hidden or discontinued" color="#dc2626" icon-bg-color="#fdecec" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Expiry Tracked" :value="list.kpis.value.expiryTracked ?? 0" icon="mdi-calendar-clock" percentage="" :is-positive="true" comparison-text="" footer-text="Batch and expiry dates" color="#ea580c" icon-bg-color="#fff1e6" :loading="list.kpiLoading.value" />
  </div>

  <SearchHeaderForm
    class="mb-3"
    page-context="vendor-catalog"
    search-text="Search name, SKU, barcode..."
    :vendor-options="toOptions(vendors, 'business_name')"
    :status-options="statusOptions"
    :sort-options="sortOptions"
    @on-search="list.onSearch"
    @filter-change="list.onFilterChange"
  />

  <UiParentCard title="Products">
    <UiDataTable
      :headers="headers"
      :items="list.items.value"
      :loading="list.loading.value"
      :total-items="list.totalItems.value"
      :current-page="list.currentPage.value"
      :items-per-page="list.itemsPerPage.value"
      :page-count="list.pageCount.value"
      :actions="[{ key: 'view', label: 'View', variant: 'outline' }]"
      item-label="products"
      @update:current-page="list.currentPage.value = $event"
      @update:items-per-page="list.itemsPerPage.value = $event"
      @action="onAction"
    >
      <template #item.name="{ item }">
        <div class="cell-avatar">
          <v-avatar size="30" color="grey-lighten-4" rounded="md">
            <v-img v-if="item.image_url" :src="item.image_url" cover />
            <v-icon v-else size="small">mdi-package-variant</v-icon>
          </v-avatar>
          <div>
            <div class="font-weight-medium">{{ item.name }}</div>
            <div class="text-muted-sm">{{ item.brand?.name || 'No brand' }} · {{ item.unit?.short_name }}</div>
          </div>
        </div>
      </template>
      <template #item.vendor="{ item }">{{ item.vendor?.business_name }}</template>
      <template #item.category="{ item }">{{ item.category?.name }}</template>
      <template #item.variants="{ item }">
        <div class="text-muted-sm">{{ item.variants.map((variant: any) => variant.sku).join(', ') }}</div>
      </template>
      <template #item.price="{ item }">{{ priceRange(item.variants) }}</template>
      <template #item.is_active="{ item }">
        <UiStatusChip :status="item.is_active ? 'Active' : 'Inactive'" :variant="item.is_active ? 'green' : 'gray'" />
      </template>
    </UiDataTable>
  </UiParentCard>

  <UiBaseModal v-model="viewOpen" :title="product?.name" max-width="900px">
    <template v-if="product">
      <div class="detail-grid mb-6">
        <div><div class="detail-grid__label">Client</div><div class="detail-grid__value">{{ product.vendor?.business_name }}</div></div>
        <div><div class="detail-grid__label">Category</div><div class="detail-grid__value">{{ product.category?.name }}</div></div>
        <div><div class="detail-grid__label">Brand</div><div class="detail-grid__value">{{ product.brand?.name || '—' }}</div></div>
        <div><div class="detail-grid__label">Unit</div><div class="detail-grid__value">{{ product.unit?.name }}</div></div>
        <div><div class="detail-grid__label">Tax</div><div class="detail-grid__value">{{ product.tax ? `${product.tax.name}` : 'None' }}</div></div>
        <div><div class="detail-grid__label">Pricing</div><div class="detail-grid__value">{{ product.price_includes_tax ? 'Tax inclusive' : 'Tax exclusive' }}</div></div>
        <div><div class="detail-grid__label">Sold by weight</div><div class="detail-grid__value">{{ product.is_weighted ? 'Yes' : 'No' }}</div></div>
        <div><div class="detail-grid__label">Expiry tracking</div><div class="detail-grid__value">{{ product.track_expiry ? 'Yes' : 'No' }}</div></div>
      </div>
      <div class="form-section-title">Variants</div>
      <UiDataTable
        class="mb-6"
        :paginate="false"
        :items="product.variants"
        :headers="[{ title: 'Variant', key: 'name' }, { title: 'SKU', key: 'sku' }, { title: 'Barcode', key: 'barcode' }, { title: 'Cost', key: 'cost_price' }, { title: 'Price', key: 'sale_price' }, { title: 'Reorder At', key: 'reorder_level' }, { title: 'Status', key: 'is_active' }]"
      >
        <template #item.barcode="{ item }">{{ item.barcode || '—' }}</template>
        <template #item.cost_price="{ item }">{{ formatNumber(item.cost_price, 4) }}</template>
        <template #item.sale_price="{ item }">{{ formatNumber(item.sale_price) }}</template>
        <template #item.is_active="{ item }">
          <UiStatusChip :status="item.is_active ? 'Active' : 'Inactive'" :variant="item.is_active ? 'green' : 'gray'" />
        </template>
      </UiDataTable>
      <template v-if="can('stock_view', 'Stock')">
        <div class="form-section-title">Stock by store</div>
        <UiDataTable
          :paginate="false"
          :loading="stockLoading"
          :items="stock.stores"
          empty-text="No stock recorded yet"
          :headers="[{ title: 'Store', key: 'store' }, { title: 'Variant', key: 'variant' }, { title: 'On Hand', key: 'quantity' }, { title: 'Avg Cost', key: 'average_cost' }]"
        >
          <template #item.store="{ item }">{{ item.clientstore?.store_name }}</template>
          <template #item.variant="{ item }">{{ item.variant.name }}</template>
          <template #item.quantity="{ item }">{{ formatNumber(item.quantity, 3) }}</template>
          <template #item.average_cost="{ item }">{{ formatNumber(item.average_cost, 4) }}</template>
        </UiDataTable>
      </template>
    </template>
  </UiBaseModal>
</template>
