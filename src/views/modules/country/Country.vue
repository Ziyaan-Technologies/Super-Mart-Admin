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
import CountryFormModal from '@/components/settings/CountryFormModal.vue';
import { useListPage } from '@/composables/useListPage';

import { can } from '@/utils/permissions';
import { formatDate, notifyError, sortOptions, statusOptions } from '@/utils/api';

const breadcrumbs = [
  { text: 'Dashboard', disabled: false, href: '/dashboard/analytical' },
  { text: 'Countries', disabled: true, href: '#' },
];

const list = useListPage('countries', {
  exportName: 'Countries',
  filters: (f) => ({}),
});

const formOpen = ref(false);
const deleteOpen = ref(false);
const saving = ref(false);
const selected = ref<any>(null);

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Code', key: 'country_code' },
  { title: 'Dialling', key: 'phone_code' },
  { title: 'Currency', key: 'currency_short_name' },
  { title: 'Time Zone', key: 'country_time_zone' },
  { title: 'Status', key: 'is_active', align: 'center' as const },
];

const actions = computed(() => [
  ...(can('countries_edit', 'Countries') ? [{ key: 'edit', label: 'Edit', variant: 'filled' as const }] : []),
  ...(can('countries_delete', 'Countries') ? [{ key: 'delete', label: 'Delete', variant: 'danger' as const }] : []),
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
      await axios.put(`countries/${selected.value.id}`, payload);
      toast.success('Country updated');
    } else {
      await axios.post('countries', payload);
      toast.success('Country created');
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
    await axios.delete(`countries/${selected.value.id}`);
    toast.success('Country deleted');
    list.refresh();
  } catch (error) {
    notifyError(error);
  }
}

</script>

<template>
  <UiPageHeader
    title="Countries"
    :breadcrumbs="breadcrumbs"
    :add-label="can('countries_create', 'Countries') ? 'Add Country' : undefined"
    show-download-pdf
    :export-loading="list.exportingExcel.value"
    :pdf-loading="list.exportingPdf.value"
    @add="openCreate"
    @export="list.exportFile('excel')"
    @download-pdf="list.exportFile('pdf')"
  />

  <div class="kpi-grid mb-4">
    <KpiBoxUi title="Countries" :value="list.kpis.value.totalCountries ?? 0" icon="mdi-earth" :percentage="`${list.kpis.value.totalCountriesGrowth ?? 0}%`" :is-positive="(list.kpis.value.totalCountriesGrowth ?? 0) >= 0" comparison-text="vs previous period" color="#6366f1" icon-bg-color="#e8ebff" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Active" :value="list.kpis.value.activeCountries ?? 0" icon="mdi-check-circle-outline" percentage="" :is-positive="true" comparison-text="" footer-text="Available to vendors" color="#16a34a" icon-bg-color="#e7f8ee" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Inactive" :value="list.kpis.value.inactiveCountries ?? 0" icon="mdi-pause-circle-outline" percentage="" :is-positive="true" comparison-text="" footer-text="Hidden" color="#dc2626" icon-bg-color="#fdecec" :loading="list.kpiLoading.value" />
  </div>

  <SearchHeaderForm
    class="mb-3"
    page-context="country"
    search-text="Search countries..."
    :status-options="statusOptions"
    :sort-options="sortOptions"
    @on-search="list.onSearch"
    @filter-change="list.onFilterChange"
  />

  <UiParentCard title="Countries">
    <UiDataTable
      :headers="headers"
      :items="list.items.value"
      :loading="list.loading.value"
      :total-items="list.totalItems.value"
      :current-page="list.currentPage.value"
      :items-per-page="list.itemsPerPage.value"
      :page-count="list.pageCount.value"
      :actions="actions"
      item-label="countries"
      @update:current-page="list.currentPage.value = $event"
      @update:items-per-page="list.itemsPerPage.value = $event"
      @action="onAction"
    >
      <template #item.currency_short_name="{ item }">{{ item.currency_short_name }} <span class="text-muted-sm">{{ item.currency_symbol }}</span></template>
      <template #item.created_at="{ item }">{{ formatDate(item.created_at) }}</template>
      <template #item.is_active="{ item }">
        <UiStatusChip :status="item.is_active ? 'Active' : 'Inactive'" :variant="item.is_active ? 'green' : 'gray'" />
      </template>
    </UiDataTable>
  </UiParentCard>

  <CountryFormModal v-model="formOpen" :loading="saving" :data="selected" @submit="save" />
  <SharedDeleteModal v-model="deleteOpen" item-type="Country" :item-name="selected?.name" @confirm="remove" />
</template>
