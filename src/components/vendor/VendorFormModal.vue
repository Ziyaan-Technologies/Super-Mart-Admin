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
  countries: any[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', payload: Record<string, any>): void;
}>();

const businessTypes = ['Supermarket', 'Hypermarket', 'Grocery', 'Convenience Store', 'Pharmacy'].map((name) => ({ id: name, name }));
const isEdit = computed(() => !!props.data?.id);
const form = ref<any>({});
const logoFile = ref<File | null>(null);
const errors = ref<Record<string, string>>({});
const cities = ref<any[]>([]);

const reset = () => {
  const data = props.data || {};
  form.value = {
    business_name: data.business_name || '',
    owner_name: data.owner_name || '',
    email: data.email || '',
    phone: data.phone || '',
    address: data.address || '',
    business_type: data.business_type || 'Supermarket',
    tax_number: data.tax_number || '',
    country_id: data.country_id || null,
    city_id: data.city_id || null,
    allow_negative_stock: data.allow_negative_stock ?? false,
    is_active: data.is_active ?? true,
    logo_url: data.logo_url || '',
    owner: { full_name: '', email: '', phone: '', password: '' },
  };
  logoFile.value = null;
  errors.value = {};
};

const loadCities = async (countryId: number | null) => {
  cities.value = countryId ? (await axios.get('cities/list', { params: { country_id: countryId } })).data : [];
};

watch(() => props.modelValue, (open) => {
  if (open) {
    reset();
    loadCities(form.value.country_id);
  }
});

watch(() => form.value.country_id, (countryId, previous) => {
  if (previous !== undefined && countryId !== previous) {
    form.value.city_id = null;
    loadCities(countryId);
  }
});

function close() {
  emit('update:modelValue', false);
}

function validate() {
  const next: Record<string, string> = {};
  if (!form.value.business_name?.trim()) next.business_name = 'Business name is required';
  if (!/.+@.+\..+/.test(form.value.email || '')) next.email = 'A valid email is required';
  if (!form.value.country_id) next.country_id = 'Country is required';
  if (!isEdit.value) {
    const owner = form.value.owner;
    if (!owner.full_name?.trim()) next.owner_full_name = 'Owner name is required';
    if (!/.+@.+\..+/.test(owner.email || '')) next.owner_email = 'A valid owner email is required';
    if (!owner.phone?.trim()) next.owner_phone = 'Owner phone is required';
    if ((owner.password || '').length < 6) next.owner_password = 'At least 6 characters';
  }
  errors.value = next;
  return !Object.keys(next).length;
}

function submit() {
  if (!validate()) return;
  const { owner, ...fields } = form.value;
  const payload: Record<string, any> = { ...fields, city_id: fields.city_id || null, _logoFile: logoFile.value };
  if (!isEdit.value) {
    payload.owner = owner;
  }
  emit('submit', payload);
}
</script>

<template>
  <UiBaseModal :model-value="modelValue" :title="isEdit ? 'Edit Client' : 'Add Client'" max-width="860px" @update:model-value="emit('update:modelValue', $event)" @close="close">
    <form novalidate @submit.prevent="submit">
      <div class="form-section-title">Business</div>
      <div class="form-grid mb-4">
        <UiTextfieldPrimary title="Business Name" v-model="form.business_name" :error="!!errors.business_name" :errorMessage="errors.business_name" />
        <UiSelectField title="Business Type" v-model="form.business_type" :items="businessTypes" />
        <UiTextfieldPrimary title="Business Email" type="email" v-model="form.email" :error="!!errors.email" :errorMessage="errors.email" />
        <UiTextfieldPrimary title="Phone" v-model="form.phone" />
        <UiSelectField title="Country" v-model="form.country_id" :items="countries" :error="errors.country_id" />
        <UiSelectField title="City" v-model="form.city_id" :items="cities" clearable :disabled="!form.country_id" />
        <UiTextfieldPrimary title="Address" v-model="form.address" class="form-grid__full" />
        <UiTextfieldPrimary title="Tax Number" v-model="form.tax_number" />
        <UiTextfieldPrimary title="Contact Person" v-model="form.owner_name" />
      </div>

      <template v-if="!isEdit">
        <div class="form-section-title">Owner Login</div>
        <div class="form-grid mb-4">
          <UiTextfieldPrimary title="Full Name" v-model="form.owner.full_name" :error="!!errors.owner_full_name" :errorMessage="errors.owner_full_name" />
          <UiTextfieldPrimary title="Phone" v-model="form.owner.phone" :error="!!errors.owner_phone" :errorMessage="errors.owner_phone" />
          <UiTextfieldPrimary title="Login Email" type="email" v-model="form.owner.email" :error="!!errors.owner_email" :errorMessage="errors.owner_email" />
          <UiTextfieldPrimary title="Password" type="password" v-model="form.owner.password" :error="!!errors.owner_password" :errorMessage="errors.owner_password" />
        </div>
      </template>

      <div class="form-grid mb-4">
        <UiImagePicker v-model="logoFile" label="Logo" placeholder="Choose Logo" :existing-image-url="form.logo_url" />
        <div>
          <UiToggleRow label="Active" v-model="form.is_active" class="mb-3" />
          <UiToggleRow label="Allow selling below zero stock" v-model="form.allow_negative_stock" />
        </div>
      </div>
    </form>
    <template #footer>
      <UiFormActions cancel-label="Cancel" :submit-label="isEdit ? 'Save' : 'Create Vendor'" :loading="loading ?? false" @cancel="close" @submit="submit" />
    </template>
  </UiBaseModal>
</template>
