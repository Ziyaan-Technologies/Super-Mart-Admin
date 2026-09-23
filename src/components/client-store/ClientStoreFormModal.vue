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
  vendors?: any[];
  countries: any[];
  showVendor?: boolean;
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
const areas = ref<any[]>([]);
const ready = ref(false);

const loadCities = async (countryId: number | null) => {
  cities.value = countryId ? (await axios.get('cities/list', { params: { country_id: countryId } })).data : [];
};

const loadAreas = async (cityId: number | null) => {
  areas.value = cityId ? (await axios.get('areas/list', { params: { city_id: cityId } })).data : [];
};

watch(() => props.modelValue, async (open) => {
  if (!open) return;
  ready.value = false;
  const data = props.data || {};
  form.value = {
    vendor_id: data.vendor_id || null,
    store_name: data.store_name || '',
    store_code: data.store_code || '',
    store_type: data.store_type || '',
    store_phone: data.store_phone || '',
    store_email: data.store_email || '',
    address: data.address || '',
    lat: data.lat || '',
    lng: data.lng || '',
    country_id: data.country_id || null,
    city_id: data.city_id || null,
    area_id: data.area_id || null,
    opening_time: data.opening_time?.slice(0, 5) || '',
    closing_time: data.closing_time?.slice(0, 5) || '',
    is_pos_active: data.is_pos_active ?? true,
    is_delivery_active: data.is_delivery_active ?? false,
    is_active: data.is_active ?? true,
    image_url: data.image_url || '',
  };
  imageFile.value = null;
  errors.value = {};
  await Promise.all([loadCities(form.value.country_id), loadAreas(form.value.city_id)]);
  ready.value = true;
});

watch(() => form.value.country_id, (value, previous) => {
  if (!ready.value || value === previous) return;
  form.value.city_id = null;
  loadCities(value);
});

watch(() => form.value.city_id, (value, previous) => {
  if (!ready.value || value === previous) return;
  form.value.area_id = null;
  loadAreas(value);
});

function close() {
  emit('update:modelValue', false);
}

function submit() {
  const next: Record<string, string> = {};
  if (props.showVendor && !isEdit.value && !form.value.vendor_id) next.vendor_id = 'Vendor is required';
  if (!form.value.store_name?.trim()) next.store_name = 'Store name is required';
  if (!form.value.store_code?.trim()) next.store_code = 'Store code is required';
  if (!form.value.country_id) next.country_id = 'Country is required';
  if (!form.value.city_id) next.city_id = 'City is required';
  if (form.value.store_email && !/.+@.+\..+/.test(form.value.store_email)) next.store_email = 'Email is not valid';
  errors.value = next;
  if (Object.keys(next).length) return;
  const { vendor_id, ...fields } = form.value;
  emit('submit', {
    ...fields,
    ...(props.showVendor && !isEdit.value ? { vendor_id } : {}),
    store_email: fields.store_email || undefined,
    opening_time: fields.opening_time || undefined,
    closing_time: fields.closing_time || undefined,
    area_id: fields.area_id || null,
    _imageFile: imageFile.value,
  });
}
</script>

<template>
  <UiBaseModal :model-value="modelValue" :title="isEdit ? 'Edit Store' : 'Add Store'" max-width="860px" @update:model-value="emit('update:modelValue', $event)" @close="close">
    <form novalidate @submit.prevent="submit">
      <div class="form-grid mb-4">
        <UiSelectField v-if="showVendor && !isEdit" class="form-grid__full" title="Client" v-model="form.vendor_id" :items="vendors || []" item-title="business_name" :error="errors.vendor_id" />
        <UiTextfieldPrimary title="Store Name" v-model="form.store_name" :error="!!errors.store_name" :errorMessage="errors.store_name" />
        <UiTextfieldPrimary title="Store Code" v-model="form.store_code" placeholder="e.g. MAIN" :error="!!errors.store_code" :errorMessage="errors.store_code" />
        <UiTextfieldPrimary title="Shop Type" v-model="form.store_type" placeholder="e.g. Big electric products" />
        <UiTextfieldPrimary title="Phone" v-model="form.store_phone" />
        <UiTextfieldPrimary title="Email" type="email" v-model="form.store_email" :error="!!errors.store_email" :errorMessage="errors.store_email" />
        <UiSelectField title="Country" v-model="form.country_id" :items="countries" :error="errors.country_id" />
        <UiSelectField title="City" v-model="form.city_id" :items="cities" :disabled="!form.country_id" :error="errors.city_id" />
        <UiSelectField title="Area" v-model="form.area_id" :items="areas" clearable :disabled="!form.city_id" />
        <UiTextfieldPrimary title="Address" v-model="form.address" />
        <UiTextfieldPrimary title="Latitude" v-model="form.lat" />
        <UiTextfieldPrimary title="Longitude" v-model="form.lng" />
        <UiTextfieldPrimary title="Opens At" type="time" v-model="form.opening_time" />
        <UiTextfieldPrimary title="Closes At" type="time" v-model="form.closing_time" />
      </div>
      <div class="form-grid mb-4">
        <UiImagePicker v-model="imageFile" label="Store Image" placeholder="Choose Image" :existing-image-url="form.image_url" />
        <div>
          <UiToggleRow label="Active" v-model="form.is_active" class="mb-3" />
          <UiToggleRow label="POS enabled" v-model="form.is_pos_active" class="mb-3" />
          <UiToggleRow label="Delivery enabled" v-model="form.is_delivery_active" />
        </div>
      </div>
    </form>
    <template #footer>
      <UiFormActions :submit-label="isEdit ? 'Save' : 'Create Store'" :loading="loading ?? false" @cancel="close" @submit="submit" />
    </template>
  </UiBaseModal>
</template>
