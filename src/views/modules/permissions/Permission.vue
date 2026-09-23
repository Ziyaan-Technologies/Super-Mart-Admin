<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';
import { toast } from 'vue3-toastify';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import KpiBoxUi from '@/components/shared/KpiBoxUi.vue';
import UiPageHeader from '@/components/shared/UiPageHeader.vue';
import SearchHeaderForm from '@/components/shared/SearchHeaderForm.vue';
import UiDataTable from '@/components/shared/UiDataTable.vue';
import UiStatusChip from '@/components/shared/UiStatusChip.vue';
import UiBaseModal from '@/components/shared/UiBaseModal.vue';
import UiTextfieldPrimary from '@/components/shared/UiTextfieldPrimary.vue';
import UiSelectField from '@/components/shared/UiSelectField.vue';
import UiFormActions from '@/components/shared/UiFormActions.vue';
import SharedDeleteModal from '@/components/shared/SharedDeleteModal.vue';
import { useListPage } from '@/composables/useListPage';
import { can } from '@/utils/permissions';
import { notifyError } from '@/utils/api';

const breadcrumbs = [
  { text: 'Dashboard', disabled: false, href: '/dashboard/analytical' },
  { text: 'Permissions', disabled: true, href: '#' },
];

const list = useListPage('permissions', {
  exportName: 'Permissions',
  filters: (f) => ({ moduleName: f.module || undefined, type: f.type || undefined }),
});
const modules = ref<string[]>([]);
const formOpen = ref(false);
const deleteOpen = ref(false);
const saving = ref(false);
const selected = ref<any>(null);
const panels = [{ id: 'Admin', name: 'Admin panel' }, { id: 'Vendor', name: 'Store panel' }, { id: 'Electric', name: 'Electric Store panel' }];
const form = ref<any>({ name: '', permission_key: '', module_name: '', type: 'Vendor' });
const isEdit = computed(() => !!selected.value);

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Key', key: 'permission_key' },
  { title: 'Module', key: 'module_name' },
  { title: 'Panel', key: 'type' },
];

const actions = computed(() => [
  ...(can('permissions_edit', 'Permissions') ? [{ key: 'edit', label: 'Edit', variant: 'filled' as const }] : []),
  ...(can('permissions_delete', 'Permissions') ? [{ key: 'delete', label: 'Delete', variant: 'danger' as const }] : []),
]);

function openForm(item: any = null) {
  selected.value = item;
  form.value = {
    name: item?.name || '',
    permission_key: item?.permission_key || '',
    module_name: item?.module_name || '',
    type: item?.type || 'Vendor',
  };
  formOpen.value = true;
}

function onAction(key: string, item: any) {
  selected.value = item;
  if (key === 'edit') {
    openForm(item);
  } else {
    deleteOpen.value = true;
  }
}

async function save() {
  const payload = {
    name: form.value.name.trim(),
    permission_key: form.value.permission_key.trim(),
    module_name: form.value.module_name.trim(),
    type: form.value.type,
  };
  if (!payload.name || !payload.permission_key || !payload.module_name) return;
  saving.value = true;
  try {
    if (isEdit.value) {
      await axios.put(`permissions/${selected.value.id}`, payload);
      toast.success('Permission updated');
    } else {
      await axios.post('permissions', payload);
      toast.success('Permission added');
    }
    formOpen.value = false;
    list.fetchData();
    modules.value = (await axios.get('permissions/moduleList')).data;
  } catch (error) {
    notifyError(error);
  } finally {
    saving.value = false;
  }
}

async function remove() {
  try {
    await axios.delete(`permissions/${selected.value.id}`);
    toast.success('Permission deleted');
    list.fetchData();
  } catch (error) {
    notifyError(error);
  }
}

onMounted(async () => {
  modules.value = (await axios.get('permissions/moduleList')).data;
});
</script>

<template>
  <UiPageHeader
    title="Permissions"
    :breadcrumbs="breadcrumbs"
    :add-label="can('permissions_create', 'Permissions') ? 'Add Permission' : ''"
    show-download-pdf
    :export-loading="list.exportingExcel.value"
    :pdf-loading="list.exportingPdf.value"
    @export="list.exportFile('excel')"
    @download-pdf="list.exportFile('pdf')"
    @add="openForm()"
  />

  <div class="kpi-grid mb-4">
    <KpiBoxUi title="All Permissions" :value="list.kpis.value.allPermissions ?? 0" icon="mdi-key-outline" percentage="" :is-positive="true" comparison-text="" footer-text="In the catalog" color="#6366f1" icon-bg-color="#e8ebff" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Modules" :value="list.kpis.value.moduleGroups ?? 0" icon="mdi-view-module-outline" percentage="" :is-positive="true" comparison-text="" footer-text="Permission groups" color="#0891b2" icon-bg-color="#e7f5ff" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Admin Panel" :value="list.kpis.value.adminPermissions ?? 0" icon="mdi-shield-crown-outline" percentage="" :is-positive="true" comparison-text="" footer-text="Assignable to admin roles" color="#7c3aed" icon-bg-color="#f1eaff" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Store Panel" :value="list.kpis.value.vendorPermissions ?? 0" icon="mdi-storefront-outline" percentage="" :is-positive="true" comparison-text="" footer-text="Assignable to vendor roles" color="#16a34a" icon-bg-color="#e7f8ee" :loading="list.kpiLoading.value" />
  </div>

  <SearchHeaderForm
    class="mb-3"
    page-context="permissions"
    search-text="Search name, key, module..."
    :module-options="modules"
    :type-options="[{ label: 'Admin panel', value: 'Admin' }, { label: 'Store panel', value: 'Vendor' }, { label: 'Electric Store panel', value: 'Electric' }]"
    @on-search="list.onSearch"
    @filter-change="list.onFilterChange"
  />

  <UiParentCard title="Permissions">
    <UiDataTable
      :headers="headers"
      :items="list.items.value"
      :loading="list.loading.value"
      :total-items="list.totalItems.value"
      :current-page="list.currentPage.value"
      :items-per-page="list.itemsPerPage.value"
      :page-count="list.pageCount.value"
      :actions="actions"
      item-label="permissions"
      @update:current-page="list.currentPage.value = $event"
      @update:items-per-page="list.itemsPerPage.value = $event"
      @action="onAction"
    >
      <template #item.permission_key="{ item }"><code>{{ item.permission_key }}</code></template>
      <template #item.type="{ item }">
        <UiStatusChip :status="item.type === 'Admin' ? 'Admin panel' : item.type === 'Electric' ? 'Electric panel' : 'Store panel'" :variant="item.type === 'Admin' ? 'purple' : item.type === 'Electric' ? 'orange' : 'green'" />
      </template>
    </UiDataTable>
  </UiParentCard>

  <UiBaseModal v-model="formOpen" :title="isEdit ? 'Edit Permission' : 'Add Permission'" max-width="560px">
    <div class="form-grid">
      <UiTextfieldPrimary title="Display Name" v-model="form.name" placeholder="e.g. View Bills" />
      <UiTextfieldPrimary title="Key" v-model="form.permission_key" placeholder="e.g. sales_view" />
      <UiTextfieldPrimary title="Module" v-model="form.module_name" placeholder="e.g. Sales" />
      <UiSelectField title="Panel" v-model="form.type" :items="panels" :disabled="isEdit" />
    </div>
    <div class="text-muted-sm mt-2">The key must match the check used in the panel code, for example <code>$can('sales_view', 'Sales')</code>.</div>
    <template #footer>
      <UiFormActions :loading="saving" @cancel="formOpen = false" @submit="save" />
    </template>
  </UiBaseModal>

  <SharedDeleteModal v-model="deleteOpen" :item-name="selected?.name" item-type="permission" @confirm="remove" />
</template>
