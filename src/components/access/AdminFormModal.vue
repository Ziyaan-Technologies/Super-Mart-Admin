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
  roles: any[];
  countries: any[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', payload: Record<string, any>): void;
}>();

const isEdit = computed(() => !!props.data?.id);
const form = ref<any>({});
const imageFile = ref<File | null>(null);
const errors = ref<Record<string, string>>({});
const cities = ref<any[]>([]);
const ready = ref(false);

const loadCities = async (countryId: number | null) => {
  cities.value = countryId ? (await axios.get('cities/list', { params: { country_id: countryId } })).data : [];
};

watch(() => props.modelValue, async (open) => {
  if (!open) return;
  ready.value = false;
  const data = props.data || {};
  form.value = {
    full_name: data.full_name || '',
    phone: data.phone || '',
    email: data.email || '',
    password: '',
    role_id: data.role_id || null,
    country_id: data.country_id || null,
    city_id: data.city_id || null,
    is_active: data.is_active ?? true,
    image_url: data.image_url || '',
  };
  imageFile.value = null;
  errors.value = {};
  await loadCities(form.value.country_id);
  ready.value = true;
});

watch(() => form.value.country_id, (value, previous) => {
  if (!ready.value || value === previous) return;
  form.value.city_id = null;
  loadCities(value);
});

function close() {
  emit('update:modelValue', false);
}

function submit() {
  const next: Record<string, string> = {};
  if (!form.value.full_name?.trim()) next.full_name = 'Name is required';
  if (!form.value.phone?.trim()) next.phone = 'Phone is required';
  if (!/.+@.+\..+/.test(form.value.email || '')) next.email = 'A valid email is required';
  if (!form.value.role_id) next.role_id = 'Role is required';
  if (!isEdit.value && form.value.password.length < 6) next.password = 'At least 6 characters';
  if (isEdit.value && form.value.password && form.value.password.length < 6) next.password = 'At least 6 characters';
  errors.value = next;
  if (Object.keys(next).length) return;
  const { password, ...fields } = form.value;
  emit('submit', {
    ...fields,
    ...(password ? { password } : {}),
    country_id: fields.country_id || null,
    city_id: fields.city_id || null,
    _imageFile: imageFile.value,
  });
}
</script>

<template>
  <UiBaseModal :model-value="modelValue" :title="isEdit ? 'Edit Admin' : 'Add Admin'" max-width="780px" @update:model-value="emit('update:modelValue', $event)" @close="close">
    <div class="form-grid mb-4">
      <UiTextfieldPrimary title="Full Name" v-model="form.full_name" :error="!!errors.full_name" :errorMessage="errors.full_name" />
      <UiTextfieldPrimary title="Phone" v-model="form.phone" :error="!!errors.phone" :errorMessage="errors.phone" />
      <UiTextfieldPrimary title="Email" type="email" v-model="form.email" :error="!!errors.email" :errorMessage="errors.email" />
      <UiTextfieldPrimary :title="isEdit ? 'New Password (optional)' : 'Password'" type="password" v-model="form.password" :error="!!errors.password" :errorMessage="errors.password" />
      <UiSelectField title="Role" v-model="form.role_id" :items="roles" :error="errors.role_id" />
      <UiSelectField title="Country" v-model="form.country_id" :items="countries" clearable />
      <UiSelectField title="City" v-model="form.city_id" :items="cities" clearable :disabled="!form.country_id" />
    </div>
    <div class="form-grid mb-4">
      <UiImagePicker v-model="imageFile" label="Photo" placeholder="Choose Photo" :existing-image-url="form.image_url" />
      <UiToggleRow label="Active" v-model="form.is_active" />
    </div>
    <template #footer>
      <UiFormActions :submit-label="isEdit ? 'Save' : 'Create Admin'" :loading="loading ?? false" @cancel="close" @submit="submit" />
    </template>
  </UiBaseModal>
</template>
