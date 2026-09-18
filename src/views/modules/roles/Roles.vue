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
import RoleFormModal from '@/components/access/RoleFormModal.vue';
import { useListPage } from '@/composables/useListPage';
import { toOptions, useLookups } from '@/composables/useLookups';
import { can } from '@/utils/permissions';
import { formatDate, notifyError, sortOptions } from '@/utils/api';

const breadcrumbs = [
  { text: 'Dashboard', disabled: false, href: '/dashboard/analytical' },
  { text: 'Roles', disabled: true, href: '#' },
];

const list = useListPage('roles', {
  exportName: 'Roles',
  filters: (f) => ({ type: f.type || undefined, vendor_id: f.vendor || undefined }),
});
const { vendors, loadVendors } = useLookups();

const formOpen = ref(false);
const deleteOpen = ref(false);
const saving = ref(false);
const readonly = ref(false);
const selected = ref<any>(null);

const headers = [
  { title: 'Role', key: 'name' },
  { title: 'Panel', key: 'type' },
  { title: 'Client', key: 'vendor' },
  { title: 'Created', key: 'created_at' },
];

const actions = computed(() => [
  { key: 'view', label: 'Permissions', variant: 'outline' as const },
  ...(can('roles_edit', 'Roles') ? [{ key: 'edit', label: 'Edit', variant: 'filled' as const, when: (item: any) => !(item.is_system && item.type === 'Admin') }] : []),
  ...(can('roles_delete', 'Roles') ? [{ key: 'delete', label: 'Delete', variant: 'danger' as const, when: (item: any) => !item.is_system }] : []),
]);

async function onAction(key: string, item: any) {
  selected.value = item;
  if (key === 'delete') {
    deleteOpen.value = true;
    return;
  }
  try {
    selected.value = (await axios.get(`roles/${item.id}`)).data;
    readonly.value = key === 'view';
    formOpen.value = true;
  } catch (error) {
    notifyError(error);
  }
}

function openCreate() {
  selected.value = null;
  readonly.value = false;
  formOpen.value = true;
}

async function save(payload: Record<string, any>) {
  saving.value = true;
  try {
    if (selected.value?.id) {
      await axios.put(`roles/${selected.value.id}`, payload);
      toast.success('Role updated');
    } else {
      await axios.post('roles', payload);
      toast.success('Role created');
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
    await axios.delete(`roles/${selected.value.id}`);
    toast.success('Role deleted');
    list.refresh();
  } catch (error) {
    notifyError(error);
  }
}

onMounted(loadVendors);
</script>

<template>
  <UiPageHeader
    title="Roles"
    :breadcrumbs="breadcrumbs"
    :add-label="can('roles_create', 'Roles') ? 'Add Role' : undefined"
    show-download-pdf
    :export-loading="list.exportingExcel.value"
    :pdf-loading="list.exportingPdf.value"
    @add="openCreate"
    @export="list.exportFile('excel')"
    @download-pdf="list.exportFile('pdf')"
  />

  <div class="kpi-grid mb-4">
    <KpiBoxUi title="Roles" :value="list.kpis.value.totalRoles ?? 0" icon="mdi-shield-account-outline" :percentage="`${list.kpis.value.totalRolesGrowth ?? 0}%`" :is-positive="(list.kpis.value.totalRolesGrowth ?? 0) >= 0" comparison-text="vs previous period" color="#6366f1" icon-bg-color="#e8ebff" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="System Roles" :value="list.kpis.value.systemRoles ?? 0" icon="mdi-lock-outline" percentage="" :is-positive="true" comparison-text="" footer-text="Shipped with the platform" color="#ea580c" icon-bg-color="#fff1e6" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Custom Roles" :value="list.kpis.value.customRoles ?? 0" icon="mdi-tune-variant" percentage="" :is-positive="true" comparison-text="" footer-text="Roles you created" color="#0891b2" icon-bg-color="#e7f5ff" :loading="list.kpiLoading.value" />
  </div>

  <SearchHeaderForm
    class="mb-3"
    page-context="roles"
    search-text="Search roles..."
    :type-options="[{ label: 'Admin panel', value: 'Admin' }, { label: 'Store panel', value: 'Vendor' }]"
    :vendor-options="toOptions(vendors, 'business_name')"
    :sort-options="sortOptions"
    @on-search="list.onSearch"
    @filter-change="list.onFilterChange"
  />

  <UiParentCard title="Roles">
    <UiDataTable
      :headers="headers"
      :items="list.items.value"
      :loading="list.loading.value"
      :total-items="list.totalItems.value"
      :current-page="list.currentPage.value"
      :items-per-page="list.itemsPerPage.value"
      :page-count="list.pageCount.value"
      :actions="actions"
      item-label="roles"
      @update:current-page="list.currentPage.value = $event"
      @update:items-per-page="list.itemsPerPage.value = $event"
      @action="onAction"
    >
      <template #item.name="{ item }">
        <span class="font-weight-medium">{{ item.name }}</span>
        <v-chip v-if="item.is_system" size="x-small" class="ml-2" variant="tonal" color="warning">System</v-chip>
      </template>
      <template #item.type="{ item }">
        <UiStatusChip :status="item.type === 'Admin' ? 'Admin panel' : 'Store panel'" :variant="item.type === 'Admin' ? 'purple' : 'green'" />
      </template>
      <template #item.vendor="{ item }">{{ item.vendor?.business_name || (item.type === 'Vendor' ? 'All clients' : '—') }}</template>
      <template #item.created_at="{ item }">{{ formatDate(item.created_at) }}</template>
    </UiDataTable>
  </UiParentCard>

  <RoleFormModal v-model="formOpen" :loading="saving" :data="selected" :vendors="vendors" :readonly="readonly" allow-type-choice @submit="save" />
  <SharedDeleteModal v-model="deleteOpen" item-type="Role" :item-name="selected?.name" @confirm="remove" />
</template>
