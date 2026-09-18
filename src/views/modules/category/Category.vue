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
import { sortOptions, statusOptions } from '@/utils/api';

const breadcrumbs = [
  { text: 'Dashboard', disabled: false, href: '/dashboard/analytical' },
  { text: 'Categories', disabled: true, href: '#' },
];

const list = useListPage('categories', {
  exportName: 'Categories',
  filters: (f) => ({ vendor_id: f.vendor || undefined }),
});
const { vendors, loadVendors } = useLookups();

const levels: Record<number, string> = { 1: 'Department', 2: 'Aisle', 3: 'Category' };
const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Level', key: 'level' },
  { title: 'Parent', key: 'parent' },
  { title: 'Client', key: 'vendor' },
  { title: 'Status', key: 'is_active', align: 'center' as const },
];

onMounted(loadVendors);
</script>

<template>
  <UiPageHeader
    title="Categories"
    :breadcrumbs="breadcrumbs"
    show-download-pdf
    :export-loading="list.exportingExcel.value"
    :pdf-loading="list.exportingPdf.value"
    @export="list.exportFile('excel')"
    @download-pdf="list.exportFile('pdf')"
  />

  <div class="kpi-grid mb-4">
    <KpiBoxUi title="Categories" :value="list.kpis.value.totalCategories ?? 0" icon="mdi-shape-outline" :percentage="`${list.kpis.value.totalCategoriesGrowth ?? 0}%`" :is-positive="(list.kpis.value.totalCategoriesGrowth ?? 0) >= 0" comparison-text="vs previous period" color="#6366f1" icon-bg-color="#e8ebff" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Active" :value="list.kpis.value.activeCategories ?? 0" icon="mdi-check-circle-outline" percentage="" :is-positive="true" comparison-text="" footer-text="Visible to stores" color="#16a34a" icon-bg-color="#e7f8ee" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Departments" :value="list.kpis.value.departments ?? 0" icon="mdi-file-tree-outline" percentage="" :is-positive="true" comparison-text="" footer-text="Top level" color="#ea580c" icon-bg-color="#fff1e6" :loading="list.kpiLoading.value" />
  </div>

  <SearchHeaderForm
    class="mb-3"
    page-context="vendor-catalog"
    search-text="Search categories..."
    :vendor-options="toOptions(vendors, 'business_name')"
    :status-options="statusOptions"
    :sort-options="sortOptions"
    @on-search="list.onSearch"
    @filter-change="list.onFilterChange"
  />

  <UiParentCard title="Categories">
    <UiDataTable
      :headers="headers"
      :items="list.items.value"
      :loading="list.loading.value"
      :total-items="list.totalItems.value"
      :current-page="list.currentPage.value"
      :items-per-page="list.itemsPerPage.value"
      :page-count="list.pageCount.value"
      item-label="categories"
      @update:current-page="list.currentPage.value = $event"
      @update:items-per-page="list.itemsPerPage.value = $event"
    >
      <template #item.name="{ item }">
        <div class="cell-avatar">
          <v-avatar size="28" color="grey-lighten-4">
            <v-img v-if="item.image_url" :src="item.image_url" cover />
            <v-icon v-else size="small">mdi-shape-outline</v-icon>
          </v-avatar>
          <span class="font-weight-medium">{{ item.name }}</span>
        </div>
      </template>
      <template #item.level="{ item }">{{ levels[item.level] || item.level }}</template>
      <template #item.parent="{ item }">{{ item.parent?.name || '—' }}</template>
      <template #item.vendor="{ item }">{{ item.vendor?.business_name }}</template>
      <template #item.is_active="{ item }">
        <UiStatusChip :status="item.is_active ? 'Active' : 'Inactive'" :variant="item.is_active ? 'green' : 'gray'" />
      </template>
    </UiDataTable>
  </UiParentCard>
</template>
