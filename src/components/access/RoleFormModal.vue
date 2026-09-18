<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import axios from 'axios';
import UiBaseModal from '@/components/shared/UiBaseModal.vue';
import UiTextfieldPrimary from '@/components/shared/UiTextfieldPrimary.vue';
import UiSelectField from '@/components/shared/UiSelectField.vue';
import UiFormActions from '@/components/shared/UiFormActions.vue';
import PermissionMatrix from './PermissionMatrix.vue';

const props = defineProps<{
  modelValue: boolean;
  loading?: boolean;
  data?: any;
  vendors?: any[];
  readonly?: boolean;
  allowTypeChoice?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', payload: Record<string, any>): void;
}>();

const types = [{ id: 'Admin', name: 'Admin panel role' }, { id: 'Vendor', name: 'Store panel role' }];
const isEdit = computed(() => !!props.data?.id);
const locked = computed(() => props.readonly || (props.data?.is_system && props.data?.type === 'Admin'));
const form = ref<any>({ name: '', type: 'Vendor', vendor_id: null, permissions: [] });
const groups = ref<any[]>([]);
const errors = ref<Record<string, string>>({});

const loadGroups = async (type: string) => {
  groups.value = (await axios.get('permissions/list', { params: { type } })).data;
};

watch(() => props.modelValue, async (open) => {
  if (!open) return;
  const data = props.data || {};
  form.value = {
    name: data.name || '',
    type: data.type || 'Vendor',
    vendor_id: data.vendor_id || null,
    permissions: (data.permissions || []).map((permission: any) => permission.id),
  };
  errors.value = {};
  await loadGroups(form.value.type);
});

watch(() => form.value.type, (type, previous) => {
  if (!props.modelValue || !previous || type === previous) return;
  form.value.permissions = [];
  loadGroups(type);
});

function close() {
  emit('update:modelValue', false);
}

function submit() {
  const next: Record<string, string> = {};
  if (!form.value.name?.trim()) next.name = 'Role name is required';
  if (!form.value.permissions.length) next.permissions = 'Pick at least one permission';
  errors.value = next;
  if (Object.keys(next).length) return;
  emit('submit', {
    name: form.value.name,
    permissions: form.value.permissions,
    ...(isEdit.value ? {} : { type: form.value.type, vendor_id: form.value.vendor_id || undefined }),
  });
}
</script>

<template>
  <UiBaseModal :model-value="modelValue" :title="readonly ? 'Role Permissions' : isEdit ? 'Edit Role' : 'Add Role'" max-width="900px" @update:model-value="emit('update:modelValue', $event)" @close="close">
    <v-alert v-if="!readonly && data?.is_system" type="info" variant="tonal" density="compact" class="mb-4">
      {{ data?.type === 'Admin' ? 'The Super Admin role always has every permission and cannot be changed.' : 'This is a shared system role. Changes apply to every vendor that uses it.' }}
    </v-alert>
    <div class="form-grid mb-4">
      <UiTextfieldPrimary title="Role Name" v-model="form.name" :disabled="readonly || data?.is_system" :error="!!errors.name" :errorMessage="errors.name" />
      <UiSelectField v-if="allowTypeChoice" title="Panel" v-model="form.type" :items="types" :disabled="isEdit || readonly" />
      <UiSelectField v-if="allowTypeChoice && form.type === 'Vendor' && !isEdit" title="Client" v-model="form.vendor_id" :items="vendors || []" item-title="business_name" clearable placeholder="All clients" />
      <UiTextfieldPrimary v-if="allowTypeChoice && form.type === 'Vendor' && isEdit" title="Client" :model-value="data?.vendor?.business_name || 'All clients'" disabled />
    </div>
    <p v-if="!readonly && form.type === 'Vendor' && !isEdit" class="role-hint mb-4">
      Leave <strong>Client</strong> empty to give this role to every client, or pick one client to keep it private to them.
    </p>
    <div class="form-section-title">Permissions</div>
    <PermissionMatrix v-model="form.permissions" :groups="groups" :readonly="locked" />
    <div v-if="errors.permissions" class="ui-field__error-text mt-2">{{ errors.permissions }}</div>
    <template v-if="!locked" #footer>
      <UiFormActions :submit-label="isEdit ? 'Save' : 'Create Role'" :loading="loading ?? false" @cancel="close" @submit="submit" />
    </template>
  </UiBaseModal>
</template>

<style scoped>
.role-hint {
  font-size: 13px;
  color: #6b7280;
}
</style>
