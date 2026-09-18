<script setup lang="ts">
import { onMounted } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import KpiBoxUi from '@/components/shared/KpiBoxUi.vue';
import UiPageHeader from '@/components/shared/UiPageHeader.vue';
import SearchHeaderForm from '@/components/shared/SearchHeaderForm.vue';
import UiDataTable from '@/components/shared/UiDataTable.vue';
import UiStatusChip from '@/components/shared/UiStatusChip.vue';
import { useListPage } from '@/composables/useListPage';
import { toOptions, useLookups } from '@/composables/useLookups';
import { formatDate, sortOptions, statusOptions } from '@/utils/api';

const breadcrumbs = [
  { text: 'Dashboard', disabled: false, href: '/dashboard/analytical' },
  { text: 'Brands', disabled: true, href: '#' },
];

const list = useListPage('brands', {
  exportName: 'Brands',
  filters: (f) => ({ vendor_id: f.vendor || undefined }),
});
const { vendors, loadVendors } = useLookups();

const headers = [
  { title: 'Brand', key: 'name' },
  { title: 'Client', key: 'vendor' },
  { title: 'Description', key: 'description' },
  { title: 'Created', key: 'created_at' },
  { title: 'Status', key: 'is_active', align: 'center' as const },
];

onMounted(loadVendors);
</script>

<template>
  <UiPageHeader
    title="Brands"
    :breadcrumbs="breadcrumbs"
    show-download-pdf
    :export-loading="list.exportingExcel.value"
    :pdf-loading="list.exportingPdf.value"
    @export="list.exportFile('excel')"
    @download-pdf="list.exportFile('pdf')"
  />

  <div class="kpi-grid mb-4">
    <KpiBoxUi title="Brands" :value="list.kpis.value.totalBrands ?? 0" icon="mdi-tag-outline" :percentage="`${list.kpis.value.totalBrandsGrowth ?? 0}%`" :is-positive="(list.kpis.value.totalBrandsGrowth ?? 0) >= 0" comparison-text="vs previous period" color="#6366f1" icon-bg-color="#e8ebff" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Active" :value="list.kpis.value.activeBrands ?? 0" icon="mdi-check-circle-outline" percentage="" :is-positive="true" comparison-text="" footer-text="Selectable on products" color="#16a34a" icon-bg-color="#e7f8ee" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Inactive" :value="list.kpis.value.inactiveBrands ?? 0" icon="mdi-pause-circle-outline" percentage="" :is-positive="false" comparison-text="" footer-text="Hidden" color="#dc2626" icon-bg-color="#fdecec" :loading="list.kpiLoading.value" />
  </div>

  <SearchHeaderForm
    class="mb-3"
    page-context="vendor-catalog"
    search-text="Search brands..."
    :vendor-options="toOptions(vendors, 'business_name')"
    :status-options="statusOptions"
    :sort-options="sortOptions"
    @on-search="list.onSearch"
    @filter-change="list.onFilterChange"
  />

  <UiParentCard title="Brands">
    <UiDataTable
      :headers="headers"
      :items="list.items.value"
      :loading="list.loading.value"
      :total-items="list.totalItems.value"
      :current-page="list.currentPage.value"
      :items-per-page="list.itemsPerPage.value"
      :page-count="list.pageCount.value"
      item-label="brands"
      @update:current-page="list.currentPage.value = $event"
      @update:items-per-page="list.itemsPerPage.value = $event"
    >
      <template #item.name="{ item }">
        <div class="cell-avatar">
          <v-avatar size="28" color="grey-lighten-4">
            <v-img v-if="item.image_url" :src="item.image_url" cover />
            <span v-else class="text-caption font-weight-bold">{{ item.name?.charAt(0) }}</span>
          </v-avatar>
          <span class="font-weight-medium">{{ item.name }}</span>
        </div>
      </template>
      <template #item.vendor="{ item }">{{ item.vendor?.business_name }}</template>
      <template #item.description="{ item }">{{ item.description || '—' }}</template>
      <template #item.created_at="{ item }">{{ formatDate(item.created_at) }}</template>
      <template #item.is_active="{ item }">
        <UiStatusChip :status="item.is_active ? 'Active' : 'Inactive'" :variant="item.is_active ? 'green' : 'gray'" />
      </template>
    </UiDataTable>
  </UiParentCard>
</template>
