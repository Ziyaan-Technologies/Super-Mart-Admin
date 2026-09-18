<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';
import { toast } from 'vue3-toastify';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import KpiBoxUi from '@/components/shared/KpiBoxUi.vue';
import UiPageHeader from '@/components/shared/UiPageHeader.vue';
import SearchHeaderForm from '@/components/shared/SearchHeaderForm.vue';
import SharedDeleteModal from '@/components/shared/SharedDeleteModal.vue';
import UiDataTable from '@/components/shared/UiDataTable.vue';
import UiStatusChip from '@/components/shared/UiStatusChip.vue';
import PlaceFormModal from '@/components/settings/PlaceFormModal.vue';
import { useListPage } from '@/composables/useListPage';
import { toOptions, useLookups } from '@/composables/useLookups';
import { can } from '@/utils/permissions';
import { formatDate, notifyError, sortOptions, statusOptions } from '@/utils/api';

const breadcrumbs = [
  { text: 'Dashboard', disabled: false, href: '/dashboard/analytical' },
  { text: 'Cities', disabled: true, href: '#' },
];

const list = useListPage('cities', {
  exportName: 'Cities',
  filters: (f) => ({ country_id: f.country || undefined }),
});
const { countries, loadCountries } = useLookups();

const formOpen = ref(false);
const deleteOpen = ref(false);
const saving = ref(false);
const selected = ref<any>(null);

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Country', key: 'country' },
  { title: 'Created', key: 'created_at' },
  { title: 'Status', key: 'is_active', align: 'center' as const },
];

const actions = computed(() => [
  ...(can('cities_edit', 'Cities') ? [{ key: 'edit', label: 'Edit', variant: 'filled' as const }] : []),
  ...(can('cities_delete', 'Cities') ? [{ key: 'delete', label: 'Delete', variant: 'danger' as const }] : []),
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
      await axios.put(`cities/${selected.value.id}`, payload);
      toast.success('City updated');
    } else {
      await axios.post('cities', payload);
      toast.success('City created');
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
    await axios.delete(`cities/${selected.value.id}`);
    toast.success('City deleted');
    list.refresh();
  } catch (error) {
    notifyError(error);
  }
}

onMounted(loadCountries);
</script>

<template>
  <UiPageHeader
    title="Cities"
    :breadcrumbs="breadcrumbs"
    :add-label="can('cities_create', 'Cities') ? 'Add City' : undefined"
    show-download-pdf
    :export-loading="list.exportingExcel.value"
    :pdf-loading="list.exportingPdf.value"
    @add="openCreate"
    @export="list.exportFile('excel')"
    @download-pdf="list.exportFile('pdf')"
  />

  <div class="kpi-grid mb-4">
    <KpiBoxUi title="Cities" :value="list.kpis.value.totalCities ?? 0" icon="mdi-city-variant-outline" :percentage="`${list.kpis.value.totalCitiesGrowth ?? 0}%`" :is-positive="(list.kpis.value.totalCitiesGrowth ?? 0) >= 0" comparison-text="vs previous period" color="#6366f1" icon-bg-color="#e8ebff" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Active" :value="list.kpis.value.activeCities ?? 0" icon="mdi-check-circle-outline" percentage="" :is-positive="true" comparison-text="" footer-text="Available to stores" color="#16a34a" icon-bg-color="#e7f8ee" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Inactive" :value="list.kpis.value.inactiveCities ?? 0" icon="mdi-pause-circle-outline" percentage="" :is-positive="true" comparison-text="" footer-text="Hidden" color="#dc2626" icon-bg-color="#fdecec" :loading="list.kpiLoading.value" />
  </div>

  <SearchHeaderForm
    class="mb-3"
    page-context="cities"
    search-text="Search cities..."
    :country-options="toOptions(countries)"
    :status-options="statusOptions"
    :sort-options="sortOptions"
    @on-search="list.onSearch"
    @filter-change="list.onFilterChange"
  />

  <UiParentCard title="Cities">
    <UiDataTable
      :headers="headers"
      :items="list.items.value"
      :loading="list.loading.value"
      :total-items="list.totalItems.value"
      :current-page="list.currentPage.value"
      :items-per-page="list.itemsPerPage.value"
      :page-count="list.pageCount.value"
      :actions="actions"
      item-label="cities"
      @update:current-page="list.currentPage.value = $event"
      @update:items-per-page="list.itemsPerPage.value = $event"
      @action="onAction"
    >
      <template #item.country="{ item }">{{ item.country?.name }}</template>
      <template #item.created_at="{ item }">{{ formatDate(item.created_at) }}</template>
      <template #item.is_active="{ item }">
        <UiStatusChip :status="item.is_active ? 'Active' : 'Inactive'" :variant="item.is_active ? 'green' : 'gray'" />
      </template>
    </UiDataTable>
  </UiParentCard>

  <PlaceFormModal v-model="formOpen" :loading="saving" :data="selected" label="City" parent-label="Country" parent-key="country_id" :parents="countries" @submit="save" />
  <SharedDeleteModal v-model="deleteOpen" item-type="City" :item-name="selected?.name" @confirm="remove" />
</template>
