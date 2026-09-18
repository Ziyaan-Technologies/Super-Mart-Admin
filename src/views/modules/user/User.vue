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
import UserFormModal from '@/components/user/UserFormModal.vue';
import { useListPage } from '@/composables/useListPage';
import { toOptions, useLookups } from '@/composables/useLookups';
import { can } from '@/utils/permissions';
import { formatDate, notifyError, sortOptions, statusOptions } from '@/utils/api';

const breadcrumbs = [
  { text: 'Dashboard', disabled: false, href: '/dashboard/analytical' },
  { text: 'Customers', disabled: true, href: '#' },
];

const list = useListPage('users', {
  exportName: 'Customers',
  filters: (f) => ({ vendor_id: f.vendor || undefined }),
});
const { vendors, cities, loadVendors, loadCities } = useLookups();

const formOpen = ref(false);
const deleteOpen = ref(false);
const saving = ref(false);
const selected = ref<any>(null);

const headers = [
  { title: 'Customer', key: 'full_name' },
  { title: 'Client', key: 'vendor' },
  { title: 'City', key: 'city' },
  { title: 'Loyalty Points', key: 'loyalty_points' },
  { title: 'Joined', key: 'created_at' },
  { title: 'Status', key: 'is_active', align: 'center' as const },
];

const actions = computed(() => [
  ...(can('customers_edit', 'Customers') ? [{ key: 'edit', label: 'Edit', variant: 'filled' as const }] : []),
  ...(can('customers_delete', 'Customers') ? [{ key: 'delete', label: 'Delete', variant: 'danger' as const }] : []),
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
      await axios.put(`users/${selected.value.id}`, payload);
      toast.success('Customer updated');
    } else {
      await axios.post('users', payload);
      toast.success('Customer created');
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
    await axios.delete(`users/${selected.value.id}`);
    toast.success('Customer deleted');
    list.refresh();
  } catch (error) {
    notifyError(error);
  }
}

onMounted(() => Promise.all([loadVendors(), loadCities()]));
</script>

<template>
  <UiPageHeader
    title="Customers"
    :breadcrumbs="breadcrumbs"
    :add-label="can('customers_create', 'Customers') ? 'Add Customer' : undefined"
    show-download-pdf
    :export-loading="list.exportingExcel.value"
    :pdf-loading="list.exportingPdf.value"
    @add="openCreate"
    @export="list.exportFile('excel')"
    @download-pdf="list.exportFile('pdf')"
  />

  <div class="kpi-grid mb-4">
    <KpiBoxUi title="Customers" :value="list.kpis.value.totalCustomers ?? 0" icon="mdi-account-group-outline" :percentage="`${list.kpis.value.totalCustomersGrowth ?? 0}%`" :is-positive="(list.kpis.value.totalCustomersGrowth ?? 0) >= 0" comparison-text="vs previous period" color="#6366f1" icon-bg-color="#e8ebff" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Active" :value="list.kpis.value.activeCustomers ?? 0" icon="mdi-check-circle-outline" percentage="" :is-positive="true" comparison-text="" footer-text="Can place orders" color="#16a34a" icon-bg-color="#e7f8ee" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Inactive" :value="list.kpis.value.inactiveCustomers ?? 0" icon="mdi-pause-circle-outline" percentage="" :is-positive="false" comparison-text="" footer-text="Blocked" color="#dc2626" icon-bg-color="#fdecec" :loading="list.kpiLoading.value" />
  </div>

  <SearchHeaderForm
    class="mb-3"
    page-context="users"
    search-text="Search name, email, phone..."
    :vendor-options="toOptions(vendors, 'business_name')"
    :status-options="statusOptions"
    :sort-options="sortOptions"
    @on-search="list.onSearch"
    @filter-change="list.onFilterChange"
  />

  <UiParentCard title="Customers">
    <UiDataTable
      :headers="headers"
      :items="list.items.value"
      :loading="list.loading.value"
      :total-items="list.totalItems.value"
      :current-page="list.currentPage.value"
      :items-per-page="list.itemsPerPage.value"
      :page-count="list.pageCount.value"
      :actions="actions"
      item-label="customers"
      @update:current-page="list.currentPage.value = $event"
      @update:items-per-page="list.itemsPerPage.value = $event"
      @action="onAction"
    >
      <template #item.full_name="{ item }">
        <div class="font-weight-medium">{{ item.full_name }}</div>
        <div class="text-muted-sm">{{ item.phone }}<span v-if="item.email"> · {{ item.email }}</span></div>
      </template>
      <template #item.vendor="{ item }">{{ item.vendor?.business_name }}</template>
      <template #item.city="{ item }">{{ item.city?.name || '—' }}</template>
      <template #item.created_at="{ item }">{{ formatDate(item.created_at) }}</template>
      <template #item.is_active="{ item }">
        <UiStatusChip :status="item.is_active ? 'Active' : 'Inactive'" :variant="item.is_active ? 'green' : 'gray'" />
      </template>
    </UiDataTable>
  </UiParentCard>

  <UserFormModal v-model="formOpen" :loading="saving" :data="selected" :vendors="vendors" :cities="cities" show-vendor @submit="save" />
  <SharedDeleteModal v-model="deleteOpen" item-type="Customer" :item-name="selected?.full_name" @confirm="remove" />
</template>
