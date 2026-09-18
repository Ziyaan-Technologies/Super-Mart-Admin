<script setup lang="ts">
import { computed, ref } from 'vue';
import axios from 'axios';
import { toast } from 'vue3-toastify';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import KpiBoxUi from '@/components/shared/KpiBoxUi.vue';
import UiPageHeader from '@/components/shared/UiPageHeader.vue';
import SearchHeaderForm from '@/components/shared/SearchHeaderForm.vue';
import SharedDeleteModal from '@/components/shared/SharedDeleteModal.vue';
import UiDataTable from '@/components/shared/UiDataTable.vue';
import UiStatusChip from '@/components/shared/UiStatusChip.vue';
import UnitFormModal from '@/components/settings/UnitFormModal.vue';
import { useListPage } from '@/composables/useListPage';

import { can } from '@/utils/permissions';
import { formatDate, notifyError, sortOptions, statusOptions } from '@/utils/api';

const breadcrumbs = [
  { text: 'Dashboard', disabled: false, href: '/dashboard/analytical' },
  { text: 'Units', disabled: true, href: '#' },
];

const list = useListPage('units', {
  exportName: 'Units',
  filters: (f) => ({ type: f.type || undefined }),
});

const formOpen = ref(false);
const deleteOpen = ref(false);
const saving = ref(false);
const selected = ref<any>(null);

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Short Name', key: 'short_name' },
  { title: 'Type', key: 'type' },
  { title: 'Decimals', key: 'allow_decimal', align: 'center' as const },
  { title: 'Status', key: 'is_active', align: 'center' as const },
];

const actions = computed(() => [
  ...(can('units_edit', 'Units') ? [{ key: 'edit', label: 'Edit', variant: 'filled' as const }] : []),
  ...(can('units_delete', 'Units') ? [{ key: 'delete', label: 'Delete', variant: 'danger' as const }] : []),
]);

function onAction(key: string, item: any) {
  selected.value = item;
  if (key === 'edit') formOpen.value = true;
  if (key === 'delete') deleteOpen.value = true;
}

function openCreate() {
  selected.value = null;
  formOpen.value = true;
}

async function save(payload: Record<string, any>) {
  saving.value = true;
  try {
    if (selected.value?.id) {
      await axios.put(`units/${selected.value.id}`, payload);
      toast.success('Unit updated');
    } else {
      await axios.post('units', payload);
      toast.success('Unit created');
    }
    formOpen.value = false;
    list.refresh();
  } catch (error) {
    notifyError(error);
  } finally {
    saving.value = false;
  }
}

async function remove() {
  try {
    await axios.delete(`units/${selected.value.id}`);
    toast.success('Unit deleted');
    list.refresh();
  } catch (error) {
    notifyError(error);
  }
}

</script>

<template>
  <UiPageHeader
    title="Units"
    :breadcrumbs="breadcrumbs"
    :add-label="can('units_create', 'Units') ? 'Add Unit' : undefined"
    show-download-pdf
    :export-loading="list.exportingExcel.value"
    :pdf-loading="list.exportingPdf.value"
    @add="openCreate"
    @export="list.exportFile('excel')"
    @download-pdf="list.exportFile('pdf')"
  />

  <div class="kpi-grid mb-4">
    <KpiBoxUi title="Total Units" :value="list.kpis.value.totalUnits ?? 0" icon="mdi-ruler" percentage="" :is-positive="true" comparison-text="" footer-text="Across all vendors" color="#6366f1" icon-bg-color="#e8ebff" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Active" :value="list.kpis.value.activeUnits ?? 0" icon="mdi-check-circle-outline" percentage="" :is-positive="true" comparison-text="" footer-text="Selectable on products" color="#16a34a" icon-bg-color="#e7f8ee" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Weight Units" :value="list.kpis.value.weightUnits ?? 0" icon="mdi-scale" percentage="" :is-positive="true" comparison-text="" footer-text="Sold by weight" color="#ea580c" icon-bg-color="#fff1e6" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Volume Units" :value="list.kpis.value.volumeUnits ?? 0" icon="mdi-cup-water" percentage="" :is-positive="true" comparison-text="" footer-text="Sold by volume" color="#0891b2" icon-bg-color="#e7f5ff" :loading="list.kpiLoading.value" />
  </div>

  <SearchHeaderForm
    class="mb-3"
    page-context="units"
    search-text="Search units..."
    :type-options="['Piece', 'Weight', 'Volume', 'Length']"
    :status-options="statusOptions"
    :sort-options="sortOptions"
    @on-search="list.onSearch"
    @filter-change="list.onFilterChange"
  />

  <UiParentCard title="Units">
    <UiDataTable
      :headers="headers"
      :items="list.items.value"
      :loading="list.loading.value"
      :total-items="list.totalItems.value"
      :current-page="list.currentPage.value"
      :items-per-page="list.itemsPerPage.value"
      :page-count="list.pageCount.value"
      :actions="actions"
      item-label="units"
      @update:current-page="list.currentPage.value = $event"
      @update:items-per-page="list.itemsPerPage.value = $event"
      @action="onAction"
    >
      <template #item.allow_decimal="{ item }">
        <v-icon :color="item.allow_decimal ? 'success' : 'grey'">{{ item.allow_decimal ? 'mdi-check-circle' : 'mdi-minus-circle-outline' }}</v-icon>
      </template>
      <template #item.created_at="{ item }">{{ formatDate(item.created_at) }}</template>
      <template #item.is_active="{ item }">
        <UiStatusChip :status="item.is_active ? 'Active' : 'Inactive'" :variant="item.is_active ? 'green' : 'gray'" />
      </template>
    </UiDataTable>
  </UiParentCard>

  <UnitFormModal v-model="formOpen" :loading="saving" :data="selected" @submit="save" />
  <SharedDeleteModal v-model="deleteOpen" item-type="Unit" :item-name="selected?.name" @confirm="remove" />
</template>
