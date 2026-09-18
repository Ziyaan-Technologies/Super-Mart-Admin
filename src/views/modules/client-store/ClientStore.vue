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
import ClientStoreFormModal from '@/components/client-store/ClientStoreFormModal.vue';
import { useListPage } from '@/composables/useListPage';
import { toOptions, useLookups } from '@/composables/useLookups';
import { can } from '@/utils/permissions';
import { notifyError, sortOptions, statusOptions, uploadImage } from '@/utils/api';

const breadcrumbs = [
  { text: 'Dashboard', disabled: false, href: '/dashboard/analytical' },
  { text: 'Stores', disabled: true, href: '#' },
];

const list = useListPage('clientstores', {
  exportName: 'Stores',
  filters: (f) => ({ vendor_id: f.vendor || undefined }),
});
const { vendors, countries, loadVendors, loadCountries } = useLookups();

const formOpen = ref(false);
const deleteOpen = ref(false);
const saving = ref(false);
const selected = ref<any>(null);

const headers = [
  { title: 'Store', key: 'store_name' },
  { title: 'Client', key: 'vendor' },
  { title: 'Location', key: 'city' },
  { title: 'Hours', key: 'hours' },
  { title: 'POS', key: 'is_pos_active', align: 'center' as const },
  { title: 'Status', key: 'is_active', align: 'center' as const },
];

const actions = computed(() => [
  ...(can('client_stores_edit', 'Client Stores') ? [{ key: 'edit', label: 'Edit', variant: 'filled' as const }] : []),
  ...(can('client_stores_delete', 'Client Stores') ? [{ key: 'delete', label: 'Delete', variant: 'danger' as const }] : []),
]);

async function onAction(key: string, item: any) {
  selected.value = item;
  if (key === 'edit') {
    try {
      selected.value = (await axios.get(`clientstores/${item.id}`)).data;
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
    const { _imageFile, ...fields } = payload;
    const image = await uploadImage('store', _imageFile);
    if (image) fields.image_url = image;
    if (selected.value?.id) {
      await axios.put(`clientstores/${selected.value.id}`, fields);
      toast.success('Store updated');
    } else {
      await axios.post('clientstores', fields);
      toast.success('Store created');
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
    await axios.delete(`clientstores/${selected.value.id}`);
    toast.success('Store deleted');
    list.refresh();
  } catch (error) {
    notifyError(error);
  }
}

onMounted(() => Promise.all([loadVendors(), loadCountries()]));
</script>

<template>
  <UiPageHeader
    title="Stores"
    :breadcrumbs="breadcrumbs"
    :add-label="can('client_stores_create', 'Client Stores') ? 'Add Store' : undefined"
    show-download-pdf
    :export-loading="list.exportingExcel.value"
    :pdf-loading="list.exportingPdf.value"
    @add="openCreate"
    @export="list.exportFile('excel')"
    @download-pdf="list.exportFile('pdf')"
  />

  <div class="kpi-grid mb-4">
    <KpiBoxUi title="Total Stores" :value="list.kpis.value.totalStores ?? 0" icon="mdi-store-outline" :percentage="`${list.kpis.value.totalStoresGrowth ?? 0}%`" :is-positive="(list.kpis.value.totalStoresGrowth ?? 0) >= 0" comparison-text="vs previous period" color="#6366f1" icon-bg-color="#e8ebff" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Active" :value="list.kpis.value.activeStores ?? 0" icon="mdi-check-circle-outline" percentage="" :is-positive="true" comparison-text="" footer-text="Open for business" color="#16a34a" icon-bg-color="#e7f8ee" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Inactive" :value="list.kpis.value.inactiveStores ?? 0" icon="mdi-pause-circle-outline" percentage="" :is-positive="false" comparison-text="" footer-text="Disabled" color="#dc2626" icon-bg-color="#fdecec" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="POS Enabled" :value="list.kpis.value.posStores ?? 0" icon="mdi-cash-register" percentage="" :is-positive="true" comparison-text="" footer-text="Selling at the counter" color="#0891b2" icon-bg-color="#e7f5ff" :loading="list.kpiLoading.value" />
  </div>

  <SearchHeaderForm
    class="mb-3"
    page-context="client-stores"
    search-text="Search name, code, phone..."
    :vendor-options="toOptions(vendors, 'business_name')"
    :status-options="statusOptions"
    :sort-options="sortOptions"
    @on-search="list.onSearch"
    @filter-change="list.onFilterChange"
  />

  <UiParentCard title="Stores">
    <UiDataTable
      :headers="headers"
      :items="list.items.value"
      :loading="list.loading.value"
      :total-items="list.totalItems.value"
      :current-page="list.currentPage.value"
      :items-per-page="list.itemsPerPage.value"
      :page-count="list.pageCount.value"
      :actions="actions"
      item-label="stores"
      @update:current-page="list.currentPage.value = $event"
      @update:items-per-page="list.itemsPerPage.value = $event"
      @action="onAction"
    >
      <template #item.store_name="{ item }">
        <div class="cell-avatar">
          <v-avatar size="30" color="grey-lighten-4">
            <v-img v-if="item.image_url" :src="item.image_url" cover />
            <v-icon v-else size="small">mdi-store</v-icon>
          </v-avatar>
          <div>
            <div class="font-weight-medium">{{ item.store_name }}</div>
            <div class="text-muted-sm">{{ item.store_code }} · {{ item.store_phone || 'No phone' }}</div>
          </div>
        </div>
      </template>
      <template #item.vendor="{ item }">{{ item.vendor?.business_name }}</template>
      <template #item.city="{ item }">{{ [item.area?.name, item.city?.name].filter(Boolean).join(', ') || '—' }}</template>
      <template #item.hours="{ item }">{{ item.opening_time && item.closing_time ? `${item.opening_time.slice(0, 5)} – ${item.closing_time.slice(0, 5)}` : '—' }}</template>
      <template #item.is_pos_active="{ item }">
        <v-icon :color="item.is_pos_active ? 'success' : 'grey'">{{ item.is_pos_active ? 'mdi-check-circle' : 'mdi-minus-circle-outline' }}</v-icon>
      </template>
      <template #item.is_active="{ item }">
        <UiStatusChip :status="item.is_active ? 'Active' : 'Inactive'" :variant="item.is_active ? 'green' : 'gray'" />
      </template>
    </UiDataTable>
  </UiParentCard>

  <ClientStoreFormModal v-model="formOpen" :loading="saving" :data="selected" :vendors="vendors" :countries="countries" show-vendor @submit="save" />
  <SharedDeleteModal v-model="deleteOpen" item-type="Store" :item-name="selected?.store_name" @confirm="remove" />
</template>
