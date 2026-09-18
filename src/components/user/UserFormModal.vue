<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import UiBaseModal from '@/components/shared/UiBaseModal.vue';
import UiTextfieldPrimary from '@/components/shared/UiTextfieldPrimary.vue';
import UiSelectField from '@/components/shared/UiSelectField.vue';
import UiToggleRow from '@/components/shared/UiToggleRow.vue';
import UiFormActions from '@/components/shared/UiFormActions.vue';

const props = defineProps<{
  modelValue: boolean;
  loading?: boolean;
  data?: any;
  vendors?: any[];
  cities: any[];
  showVendor?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', payload: Record<string, any>): void;
}>();

const genders = ['Male', 'Female', 'Other'].map((name) => ({ id: name, name }));
const isEdit = computed(() => !!props.data?.id);
const form = ref<any>({});
const errors = ref<Record<string, string>>({});

watch(() => props.modelValue, (open) => {
  if (!open) return;
  const data = props.data || {};
  form.value = {
    vendor_id: data.vendor_id || null,
    full_name: data.full_name || '',
    phone: data.phone || '',
    email: data.email || '',
    password: '',
    gender: data.gender || null,
    birthday: data.birthday || '',
    address: data.address || '',
    city_id: data.city_id || null,
    is_active: data.is_active ?? true,
  };
  errors.value = {};
});

function close() {
  emit('update:modelValue', false);
}

function submit() {
  const next: Record<string, string> = {};
  if (props.showVendor && !isEdit.value && !form.value.vendor_id) next.vendor_id = 'Vendor is required';
  if (!form.value.full_name?.trim()) next.full_name = 'Name is required';
  if (!form.value.phone?.trim()) next.phone = 'Phone is required';
  if (form.value.email && !/.+@.+\..+/.test(form.value.email)) next.email = 'Email is not valid';
  if (form.value.password && form.value.password.length < 6) next.password = 'At least 6 characters';
  errors.value = next;
  if (Object.keys(next).length) return;
  const { vendor_id, password, ...fields } = form.value;
  emit('submit', {
    ...fields,
    ...(props.showVendor && !isEdit.value ? { vendor_id } : {}),
    ...(password ? { password } : {}),
    email: fields.email || undefined,
    birthday: fields.birthday || undefined,
    gender: fields.gender || undefined,
    city_id: fields.city_id || null,
  });
}
</script>

<template>
  <UiBaseModal :model-value="modelValue" :title="isEdit ? 'Edit Customer' : 'Add Customer'" max-width="760px" @update:model-value="emit('update:modelValue', $event)" @close="close">
    <form novalidate @submit.prevent="submit">
      <div class="form-grid mb-4">
        <UiSelectField v-if="showVendor && !isEdit" class="form-grid__full" title="Client" v-model="form.vendor_id" :items="vendors || []" item-title="business_name" :error="errors.vendor_id" />
        <UiTextfieldPrimary title="Full Name" v-model="form.full_name" :error="!!errors.full_name" :errorMessage="errors.full_name" />
        <UiTextfieldPrimary title="Phone" v-model="form.phone" :error="!!errors.phone" :errorMessage="errors.phone" />
        <UiTextfieldPrimary title="Email" type="email" v-model="form.email" :error="!!errors.email" :errorMessage="errors.email" />
        <UiTextfieldPrimary :title="isEdit ? 'New Password (optional)' : 'Password (optional)'" type="password" v-model="form.password" :error="!!errors.password" :errorMessage="errors.password" />
        <UiSelectField title="Gender" v-model="form.gender" :items="genders" clearable />
        <UiTextfieldPrimary title="Birthday" type="date" v-model="form.birthday" />
        <UiSelectField title="City" v-model="form.city_id" :items="cities" clearable />
        <UiTextfieldPrimary title="Address" v-model="form.address" />
      </div>
      <UiToggleRow label="Active" v-model="form.is_active" />
    </form>
    <template #footer>
      <UiFormActions :submit-label="isEdit ? 'Save' : 'Create Customer'" :loading="loading ?? false" @cancel="close" @submit="submit" />
    </template>
  </UiBaseModal>
</template>
