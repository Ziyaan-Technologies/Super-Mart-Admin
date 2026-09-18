<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import axios from 'axios';
import { toast } from 'vue3-toastify';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import KpiBoxUi from '@/components/shared/KpiBoxUi.vue';
import UiPageHeader from '@/components/shared/UiPageHeader.vue';
import SearchHeaderForm from '@/components/shared/SearchHeaderForm.vue';
import SharedDeleteModal from '@/components/shared/SharedDeleteModal.vue';
import UiDataTable from '@/components/shared/UiDataTable.vue';
import UiStatusChip from '@/components/shared/UiStatusChip.vue';
import ClientFormModal from '@/components/client/ClientFormModal.vue';
import { useListPage } from '@/composables/useListPage';
import { toOptions, useLookups } from '@/composables/useLookups';
import { can } from '@/utils/permissions';
import { notifyError, sortOptions, statusOptions, uploadImage } from '@/utils/api';

const breadcrumbs = [
  { text: 'Dashboard', disabled: false, href: '/dashboard/analytical' },
  { text: 'Store Users', disabled: true, href: '#' },
];

const list = useListPage('clients', {
  exportName: 'Store_Staff',
  filters: (f) => ({ vendor_id: f.vendor || undefined, clientstore_id: f.store || undefined }),
});
const { vendors, stores, loadVendors, loadStores } = useLookups();

const formOpen = ref(false);
const deleteOpen = ref(false);
const saving = ref(false);
const selected = ref<any>(null);

const headers = [
  { title: 'Name', key: 'full_name' },
  { title: 'Client', key: 'vendor' },
  { title: 'Store', key: 'clientstore' },
  { title: 'Role', key: 'role' },
  { title: 'Type', key: 'client_type' },
  { title: 'Status', key: 'is_active', align: 'center' as const },
];

const actions = computed(() => [
  ...(can('clients_edit', 'Clients') ? [{ key: 'edit', label: 'Edit', variant: 'filled' as const }] : []),
  ...(can('clients_delete', 'Clients') ? [{ key: 'delete', label: 'Delete', variant: 'danger' as const }] : []),
]);

async function onAction(key: string, item: any) {
  selected.value = item;
  if (key === 'edit') {
    try {
      selected.value = (await axios.get(`clients/${item.id}`)).data;
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
    const image = await uploadImage('client', _imageFile);
    if (image) fields.image_url = image;
    if (selected.value?.id) {
      await axios.put(`clients/${selected.value.id}`, fields);
      toast.success('Account updated');
    } else {
      await axios.post('clients', fields);
      toast.success('Account created');
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
    await axios.delete(`clients/${selected.value.id}`);
    toast.success('Account deleted');
    list.refresh();
  } catch (error) {
    notifyError(error);
  }
}

watch(() => list.filters.value.vendor, (vendorId) => loadStores(vendorId || null));

onMounted(() => Promise.all([loadVendors(), loadStores()]));
</script>

<template>
  <UiPageHeader
    title="Store Users"
    :breadcrumbs="breadcrumbs"
    :add-label="can('clients_create', 'Clients') ? 'Add Account' : undefined"
    show-download-pdf
    :export-loading="list.exportingExcel.value"
    :pdf-loading="list.exportingPdf.value"
    @add="openCreate"
    @export="list.exportFile('excel')"
    @download-pdf="list.exportFile('pdf')"
  />

  <div class="kpi-grid mb-4">
    <KpiBoxUi title="All Accounts" :value="list.kpis.value.totalClients ?? 0" icon="mdi-account-multiple-outline" :percentage="`${list.kpis.value.totalClientsGrowth ?? 0}%`" :is-positive="(list.kpis.value.totalClientsGrowth ?? 0) >= 0" comparison-text="vs previous period" color="#6366f1" icon-bg-color="#e8ebff" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Active" :value="list.kpis.value.activeClients ?? 0" icon="mdi-check-circle-outline" percentage="" :is-positive="true" comparison-text="" footer-text="Can sign in" color="#16a34a" icon-bg-color="#e7f8ee" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Owners" :value="list.kpis.value.owners ?? 0" icon="mdi-crown-outline" percentage="" :is-positive="true" comparison-text="" footer-text="See every store" color="#ea580c" icon-bg-color="#fff1e6" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Staff" :value="list.kpis.value.supervisors ?? 0" icon="mdi-account-tie-outline" percentage="" :is-positive="true" comparison-text="" footer-text="Role based" color="#7c3aed" icon-bg-color="#f1eaff" :loading="list.kpiLoading.value" />
  </div>

  <SearchHeaderForm
    class="mb-3"
    page-context="clients"
    search-text="Search name, email, phone..."
    :vendor-options="toOptions(vendors, 'business_name')"
    :store-options="toOptions(stores, 'store_name')"
    :status-options="statusOptions"
    :sort-options="sortOptions"
    @on-search="list.onSearch"
    @filter-change="list.onFilterChange"
  />

  <UiParentCard title="Store Users">
    <UiDataTable
      :headers="headers"
      :items="list.items.value"
      :loading="list.loading.value"
      :total-items="list.totalItems.value"
      :current-page="list.currentPage.value"
      :items-per-page="list.itemsPerPage.value"
      :page-count="list.pageCount.value"
      :actions="actions"
      item-label="accounts"
      @update:current-page="list.currentPage.value = $event"
      @update:items-per-page="list.itemsPerPage.value = $event"
      @action="onAction"
    >
      <template #item.full_name="{ item }">
        <div class="cell-avatar">
          <v-avatar size="30" color="grey-lighten-4">
            <v-img v-if="item.image_url" :src="item.image_url" cover />
            <span v-else class="text-caption font-weight-bold">{{ item.full_name?.charAt(0) }}</span>
          </v-avatar>
          <div>
            <div class="font-weight-medium">{{ item.full_name }}</div>
            <div class="text-muted-sm">{{ item.email }} · {{ item.phone }}</div>
          </div>
        </div>
      </template>
      <template #item.vendor="{ item }">{{ item.vendor?.business_name }}</template>
      <template #item.clientstore="{ item }">{{ item.clientstore?.store_name || 'All stores' }}</template>
      <template #item.role="{ item }">{{ item.role?.name || '—' }}</template>
      <template #item.client_type="{ item }">
        <UiStatusChip :status="item.client_type === 'Owner' ? 'Owner' : 'Staff'" :variant="item.client_type === 'Owner' ? 'orange' : 'purple'" />
      </template>
      <template #item.is_active="{ item }">
        <UiStatusChip :status="item.is_active ? 'Active' : 'Inactive'" :variant="item.is_active ? 'green' : 'gray'" />
      </template>
    </UiDataTable>
  </UiParentCard>

  <ClientFormModal v-model="formOpen" :loading="saving" :data="selected" :vendors="vendors" @submit="save" />
  <SharedDeleteModal v-model="deleteOpen" item-type="Account" :item-name="selected?.full_name" @confirm="remove" />
</template>
