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
import UiFormActions from '@/components/shared/UiFormActions.vue';
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
const editOpen = ref(false);
const saving = ref(false);
const selected = ref<any>(null);
const name = ref('');

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Key', key: 'permission_key' },
  { title: 'Module', key: 'module_name' },
  { title: 'Panel', key: 'type' },
];

const actions = computed(() => (can('permissions_edit', 'Permissions') ? [{ key: 'edit', label: 'Rename', variant: 'filled' as const }] : []));

function onAction(_: string, item: any) {
  selected.value = item;
  name.value = item.name;
  editOpen.value = true;
}

async function save() {
  if (!name.value.trim()) return;
  saving.value = true;
  try {
    await axios.put(`permissions/${selected.value.id}`, { name: name.value.trim() });
    toast.success('Permission renamed');
    editOpen.value = false;
    list.fetchData();
  } catch (error) {
    notifyError(error);
  } finally {
    saving.value = false;
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
    show-download-pdf
    :export-loading="list.exportingExcel.value"
    :pdf-loading="list.exportingPdf.value"
    @export="list.exportFile('excel')"
    @download-pdf="list.exportFile('pdf')"
  />

  <v-alert type="info" variant="tonal" density="compact" class="mb-4">
    Permissions are defined in the backend catalog and synced with <code>npm run seed</code>. Keys match the <code>$can()</code> checks in both panels, so only their display names can be changed here.
  </v-alert>

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
    :type-options="[{ label: 'Admin panel', value: 'Admin' }, { label: 'Store panel', value: 'Vendor' }]"
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
        <UiStatusChip :status="item.type === 'Admin' ? 'Admin panel' : 'Store panel'" :variant="item.type === 'Admin' ? 'purple' : 'green'" />
      </template>
    </UiDataTable>
  </UiParentCard>

  <UiBaseModal v-model="editOpen" title="Rename Permission" max-width="520px">
    <UiTextfieldPrimary title="Display Name" v-model="name" />
    <div class="text-muted-sm mt-2">Key: <code>{{ selected?.permission_key }}</code></div>
    <template #footer>
      <UiFormActions :loading="saving" @cancel="editOpen = false" @submit="save" />
    </template>
  </UiBaseModal>
</template>
