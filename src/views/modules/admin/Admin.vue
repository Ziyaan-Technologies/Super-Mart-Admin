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
import AdminFormModal from '@/components/access/AdminFormModal.vue';
import { useListPage } from '@/composables/useListPage';
import { useLookups } from '@/composables/useLookups';
import { useAuthStore } from '@/stores/auth';
import { can } from '@/utils/permissions';
import { formatDate, notifyError, sortOptions, statusOptions, uploadImage } from '@/utils/api';

const authStore = useAuthStore();
const breadcrumbs = [
  { text: 'Dashboard', disabled: false, href: '/dashboard/analytical' },
  { text: 'Admins', disabled: true, href: '#' },
];

const list = useListPage('admins', { exportName: 'Admins' });
const { countries, loadCountries } = useLookups();
const roles = ref<any[]>([]);

const formOpen = ref(false);
const deleteOpen = ref(false);
const saving = ref(false);
const selected = ref<any>(null);

const headers = [
  { title: 'Name', key: 'full_name' },
  { title: 'Role', key: 'role' },
  { title: 'Country', key: 'country' },
  { title: 'Created', key: 'created_at' },
  { title: 'Status', key: 'is_active', align: 'center' as const },
];

const actions = computed(() => [
  ...(can('admins_edit', 'Admins') ? [{ key: 'edit', label: 'Edit', variant: 'filled' as const }] : []),
  ...(can('admins_delete', 'Admins') ? [{ key: 'delete', label: 'Delete', variant: 'danger' as const, when: (item: any) => item.id !== authStore.user?.id }] : []),
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
    const { _imageFile, ...fields } = payload;
    const image = await uploadImage('admin', _imageFile);
    if (image) fields.image_url = image;
    if (selected.value?.id) {
      await axios.put(`admins/${selected.value.id}`, fields);
      toast.success('Admin updated');
    } else {
      await axios.post('admins', fields);
      toast.success('Admin created');
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
    await axios.delete(`admins/${selected.value.id}`);
    toast.success('Admin deleted');
    list.refresh();
  } catch (error) {
    notifyError(error);
  }
}

onMounted(async () => {
  await loadCountries();
  roles.value = (await axios.get('roles/list', { params: { type: 'Admin' } })).data;
});
</script>

<template>
  <UiPageHeader
    title="Admins"
    :breadcrumbs="breadcrumbs"
    :add-label="can('admins_create', 'Admins') ? 'Add Admin' : undefined"
    show-download-pdf
    :export-loading="list.exportingExcel.value"
    :pdf-loading="list.exportingPdf.value"
    @add="openCreate"
    @export="list.exportFile('excel')"
    @download-pdf="list.exportFile('pdf')"
  />

  <div class="kpi-grid mb-4">
    <KpiBoxUi title="Admins" :value="list.kpis.value.totalAdmins ?? 0" icon="mdi-account-cog-outline" :percentage="`${list.kpis.value.totalAdminsGrowth ?? 0}%`" :is-positive="(list.kpis.value.totalAdminsGrowth ?? 0) >= 0" comparison-text="vs previous period" color="#6366f1" icon-bg-color="#e8ebff" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Active" :value="list.kpis.value.activeAdmins ?? 0" icon="mdi-check-circle-outline" percentage="" :is-positive="true" comparison-text="" footer-text="Can sign in" color="#16a34a" icon-bg-color="#e7f8ee" :loading="list.kpiLoading.value" />
    <KpiBoxUi title="Inactive" :value="list.kpis.value.inactiveAdmins ?? 0" icon="mdi-pause-circle-outline" percentage="" :is-positive="false" comparison-text="" footer-text="Blocked" color="#dc2626" icon-bg-color="#fdecec" :loading="list.kpiLoading.value" />
  </div>

  <SearchHeaderForm
    class="mb-3"
    page-context="admins"
    search-text="Search name, email, phone..."
    :status-options="statusOptions"
    :sort-options="sortOptions"
    @on-search="list.onSearch"
    @filter-change="list.onFilterChange"
  />

  <UiParentCard title="Admins">
    <UiDataTable
      :headers="headers"
      :items="list.items.value"
      :loading="list.loading.value"
      :total-items="list.totalItems.value"
      :current-page="list.currentPage.value"
      :items-per-page="list.itemsPerPage.value"
      :page-count="list.pageCount.value"
      :actions="actions"
      item-label="admins"
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
            <div class="font-weight-medium">{{ item.full_name }}<span v-if="item.id === authStore.user?.id" class="text-muted-sm"> (you)</span></div>
            <div class="text-muted-sm">{{ item.email }} · {{ item.phone }}</div>
          </div>
        </div>
      </template>
      <template #item.role="{ item }">{{ item.role?.name }}</template>
      <template #item.country="{ item }">{{ item.country?.name || '—' }}</template>
      <template #item.created_at="{ item }">{{ formatDate(item.created_at) }}</template>
      <template #item.is_active="{ item }">
        <UiStatusChip :status="item.is_active ? 'Active' : 'Inactive'" :variant="item.is_active ? 'green' : 'gray'" />
      </template>
    </UiDataTable>
  </UiParentCard>

  <AdminFormModal v-model="formOpen" :loading="saving" :data="selected" :roles="roles" :countries="countries" @submit="save" />
  <SharedDeleteModal v-model="deleteOpen" item-type="Admin" :item-name="selected?.full_name" @confirm="remove" />
</template>
