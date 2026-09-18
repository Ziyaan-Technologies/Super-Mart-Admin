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
import VendorFormModal from '@/components/vendor/VendorFormModal.vue';
import { useListPage } from '@/composables/useListPage';
import { toOptions, useLookups } from '@/composables/useLookups';
import { can } from '@/utils/permissions';
import { formatDate, notifyError, sortOptions, statusOptions, uploadImage } from '@/utils/api';

const breadcrumbs = [
  { text: 'Dashboard', disabled: false, href: '/dashboard/analytical' },
  { text: 'Clients', disabled: true, href: '#' },
];

const list = useListPage('vendors', {
  exportName: 'Vendors',
  filters: (f) => ({ country_id: f.country || undefined }),
});
const { countries, loadCountries } = useLookups();

const formOpen = ref(false);
const deleteOpen = ref(false);
const saving = ref(false);
const selected = ref<any>(null);

const headers = [
  { title: 'Business', key: 'business_name' },
  { title: 'Type', key: 'business_type' },
  { title: 'Email', key: 'email' },
  { title: 'Country', key: 'country' },
  { title: 'Created', key: 'created_at' },
  { title: 'Status', key: 'is_active', align: 'center' as const },
];

const actions = computed(() => [
  ...(can('vendors_edit', 'Vendors') ? [{ key: 'edit', label: 'Edit', variant: 'filled' as const }] : []),
  ...(can('vendors_delete', 'Vendors') ? [{ key: 'delete', label: 'Delete', variant: 'danger' as const }] : []),
]);

async function onAction(key: string, item: any) {
  selected.value = item;
  if (key === 'edit') {
    try {
      selected.value = (await axios.get(`vendors/${item.id}`)).data;
      formOpen.value = true;
    } catch (error) {
      notifyError(error);
    }
  } else if (key === 'delete') {
    deleteOpen.value = true;
  }
}

function openCreate() {
  selected.value = null;
  formOpen.value = true;
}

async function save(payload: Record<string, any>) {
  saving.value = true;
  try {
    const { _logoFile, ...fields } = payload;
    const logo = await uploadImage('vendor', _logoFile);
    if (logo) fields.logo_url = logo;
    if (selected.value?.id) {
      await axios.put(`vendors/${selected.value.id}`, fields);
      toast.success('Client updated');
    } else {
      await axios.post('vendors', fields);
      toast.success('Client and owner account created');
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
    await axios.delete(`vendors/${selected.value.id}`);
    toast.success('Client deleted');
    list.refresh();
  } catch (error) {
    notifyError(error);
  }
}

onMounted(loadCountries);
</script>

<template>
  <UiPageHeader
    title="Clients"
    :breadcrumbs="breadcrumbs"
    :add-label="can('vendors_create', 'Vendors') ? 'Add Client' : undefined"
    show-download-pdf
    :export-loading="list.exportingExcel.value"
    :pdf-loading="list.exportingPdf.value"
    @add="openCreate"
    @export="list.exportFile('excel')"
    @download-pdf="list.exportFile('pdf')"
  />

  <div class="kpi-grid mb-4">
    <KpiBoxUi title="Total Clients" :value="list.kpis.value.totalVendors ?? 0" icon="mdi-storefront-outline" :percentage="`${list.kpis.value.totalVendorsGrowth ?? 0}%`" :is-positive="(list.kpis.value.totalVendorsGrowth ?? 0) >= 0" comparison-text="vs previous period" color="#6366f1" icon-bg-color="#e8ebff" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Active" :value="list.kpis.value.activeVendors ?? 0" icon="mdi-check-circle-outline" percentage="" :is-positive="true" comparison-text="" footer-text="Can sign in" color="#16a34a" icon-bg-color="#e7f8ee" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Inactive" :value="list.kpis.value.inactiveVendors ?? 0" icon="mdi-pause-circle-outline" percentage="" :is-positive="false" comparison-text="" footer-text="Blocked from signing in" color="#dc2626" icon-bg-color="#fdecec" :loading="list.kpiLoading.value" />
  </div>

  <SearchHeaderForm
    class="mb-3"
    page-context="vendors"
    search-text="Search business, owner, email..."
    :country-options="toOptions(countries)"
    :status-options="statusOptions"
    :sort-options="sortOptions"
    @on-search="list.onSearch"
    @filter-change="list.onFilterChange"
  />

  <UiParentCard title="Clients">
    <UiDataTable
      :headers="headers"
      :items="list.items.value"
      :loading="list.loading.value"
      :total-items="list.totalItems.value"
      :current-page="list.currentPage.value"
      :items-per-page="list.itemsPerPage.value"
      :page-count="list.pageCount.value"
      :actions="actions"
      item-label="vendors"
      @update:current-page="list.currentPage.value = $event"
      @update:items-per-page="list.itemsPerPage.value = $event"
      @action="onAction"
    >
      <template #item.business_name="{ item }">
        <div class="cell-avatar">
          <v-avatar size="30" color="grey-lighten-4">
            <v-img v-if="item.logo_url" :src="item.logo_url" cover />
            <span v-else class="text-caption font-weight-bold">{{ item.business_name?.charAt(0) }}</span>
          </v-avatar>
          <div>
            <div class="font-weight-medium">{{ item.business_name }}</div>
            <div class="text-muted-sm">{{ item.owner_name || '—' }}</div>
          </div>
        </div>
      </template>
      <template #item.country="{ item }">{{ item.country?.name || '—' }}<span v-if="item.city" class="text-muted-sm">, {{ item.city.name }}</span></template>
      <template #item.created_at="{ item }">{{ formatDate(item.created_at) }}</template>
      <template #item.is_active="{ item }">
        <UiStatusChip :status="item.is_active ? 'Active' : 'Inactive'" :variant="item.is_active ? 'green' : 'gray'" />
      </template>
    </UiDataTable>
  </UiParentCard>

  <VendorFormModal v-model="formOpen" :loading="saving" :data="selected" :countries="countries" @submit="save" />
  <SharedDeleteModal v-model="deleteOpen" item-type="Client" :item-name="selected?.business_name" @confirm="remove" />
</template>
