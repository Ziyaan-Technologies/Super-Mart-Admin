<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import axios from 'axios';
import UiBaseModal from '@/components/shared/UiBaseModal.vue';
import UiTextfieldPrimary from '@/components/shared/UiTextfieldPrimary.vue';
import UiSelectField from '@/components/shared/UiSelectField.vue';
import UiImagePicker from '@/components/shared/UiImagePicker.vue';
import UiToggleRow from '@/components/shared/UiToggleRow.vue';
import UiFormActions from '@/components/shared/UiFormActions.vue';

const props = defineProps<{
  modelValue: boolean;
  loading?: boolean;
  data?: any;
  vendors: any[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', payload: Record<string, any>): void;
}>();

const clientTypes = [{ id: 'Supervisor', name: 'Store User' }, { id: 'Owner', name: 'Business Owner' }];
const isEdit = computed(() => !!props.data?.id);
const form = ref<any>({});
const imageFile = ref<File | null>(null);
const errors = ref<Record<string, string>>({});
const stores = ref<any[]>([]);
const roles = ref<any[]>([]);
const ready = ref(false);

const loadVendorData = async (vendorId: number | null) => {
  if (!vendorId) {
    stores.value = [];
    roles.value = [];
    return;
  }
  const vendor = props.vendors.find((row: any) => row.id === vendorId);
  const roleType = vendor?.business_type === 'Electric Store' ? 'Electric' : vendor?.business_type === 'Bakery' ? 'Bakery' : 'Vendor';
  const [storeResponse, roleResponse] = await Promise.all([
    axios.get('clientstores/list', { params: { vendor_id: vendorId } }),
    axios.get('roles/list', { params: { type: roleType, vendor_id: vendorId } }),
  ]);
  stores.value = storeResponse.data;
  roles.value = roleResponse.data;
};

watch(() => props.modelValue, async (open) => {
  if (!open) return;
  ready.value = false;
  const data = props.data || {};
  form.value = {
    vendor_id: data.vendor_id || null,
    client_type: data.client_type || 'Supervisor',
    clientstore_id: data.clientstore_id || null,
    full_name: data.full_name || '',
    email: data.email || '',
    phone: data.phone || '',
    password: '',
    role_id: data.role_id || null,
    is_active: data.is_active ?? true,
    image_url: data.image_url || '',
  };
  imageFile.value = null;
  errors.value = {};
  await loadVendorData(form.value.vendor_id);
  ready.value = true;
});

watch(() => form.value.vendor_id, (value, previous) => {
  if (!ready.value || value === previous) return;
  form.value.clientstore_id = null;
  form.value.role_id = null;
  loadVendorData(value);
});

function close() {
  emit('update:modelValue', false);
}

function submit() {
  const next: Record<string, string> = {};
  if (!isEdit.value && !form.value.vendor_id) next.vendor_id = 'Vendor is required';
  if (!form.value.full_name?.trim()) next.full_name = 'Name is required';
  if (!/.+@.+\..+/.test(form.value.email || '')) next.email = 'A valid email is required';
  if (!form.value.phone?.trim()) next.phone = 'Phone is required';
  if (!form.value.role_id) next.role_id = 'Role is required';
  if (!isEdit.value && form.value.password.length < 6) next.password = 'At least 6 characters';
  if (isEdit.value && form.value.password && form.value.password.length < 6) next.password = 'At least 6 characters';
  errors.value = next;
  if (Object.keys(next).length) return;
  const { vendor_id, client_type, password, ...fields } = form.value;
  emit('submit', {
    ...fields,
    ...(isEdit.value ? {} : { vendor_id, client_type }),
    ...(password ? { password } : {}),
    clientstore_id: form.value.client_type === 'Owner' ? null : fields.clientstore_id || null,
    _imageFile: imageFile.value,
  });
}
</script>

<template>
  <UiBaseModal :model-value="modelValue" :title="isEdit ? 'Edit Staff Account' : 'Add Staff Account'" max-width="820px" @update:model-value="emit('update:modelValue', $event)" @close="close">
    <form novalidate @submit.prevent="submit">
      <div class="form-grid mb-4">
        <UiSelectField title="Client" v-model="form.vendor_id" :items="vendors" item-title="business_name" :disabled="isEdit" :error="errors.vendor_id" />
        <UiSelectField title="Account Type" v-model="form.client_type" :items="clientTypes" :disabled="isEdit" />
        <UiSelectField v-if="form.client_type !== 'Owner'" title="Store" v-model="form.clientstore_id" :items="stores" item-title="store_name" clearable placeholder="All stores (vendor level)" :disabled="!form.vendor_id" />
        <UiSelectField title="Role" v-model="form.role_id" :items="roles" :disabled="!form.vendor_id" :error="errors.role_id" />
        <UiTextfieldPrimary title="Full Name" v-model="form.full_name" :error="!!errors.full_name" :errorMessage="errors.full_name" />
        <UiTextfieldPrimary title="Phone" v-model="form.phone" :error="!!errors.phone" :errorMessage="errors.phone" />
        <UiTextfieldPrimary title="Email" type="email" v-model="form.email" :error="!!errors.email" :errorMessage="errors.email" />
        <UiTextfieldPrimary :title="isEdit ? 'New Password (optional)' : 'Password'" type="password" v-model="form.password" :error="!!errors.password" :errorMessage="errors.password" />
      </div>
      <div class="form-grid mb-4">
        <UiImagePicker v-model="imageFile" label="Photo" placeholder="Choose Photo" :existing-image-url="form.image_url" />
        <UiToggleRow label="Active" v-model="form.is_active" />
      </div>
    </form>
    <template #footer>
      <UiFormActions :submit-label="isEdit ? 'Save' : 'Create Account'" :loading="loading ?? false" @cancel="close" @submit="submit" />
    </template>
  </UiBaseModal>
</template>
