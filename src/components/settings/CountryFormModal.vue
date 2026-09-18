<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import UiBaseModal from '@/components/shared/UiBaseModal.vue';
import UiTextfieldPrimary from '@/components/shared/UiTextfieldPrimary.vue';
import UiToggleRow from '@/components/shared/UiToggleRow.vue';
import UiFormActions from '@/components/shared/UiFormActions.vue';

const props = defineProps<{ modelValue: boolean; loading?: boolean; data?: any }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', payload: Record<string, any>): void;
}>();

const isEdit = computed(() => !!props.data?.id);
const form = ref<any>({});
const errors = ref<Record<string, string>>({});

watch(() => props.modelValue, (open) => {
  if (!open) return;
  const data = props.data || {};
  form.value = {
    name: data.name || '',
    country_code: data.country_code || '',
    phone_code: data.phone_code || '',
    currency_short_name: data.currency_short_name || '',
    currency_symbol: data.currency_symbol || '',
    country_time_zone: data.country_time_zone || '',
    is_active: data.is_active ?? true,
  };
  errors.value = {};
});

function close() {
  emit('update:modelValue', false);
}

function submit() {
  const next: Record<string, string> = {};
  if (!form.value.name?.trim()) next.name = 'Name is required';
  if (!form.value.currency_short_name?.trim()) next.currency_short_name = 'Currency is required';
  if (!form.value.country_time_zone?.trim()) next.country_time_zone = 'Time zone is required';
  errors.value = next;
  if (!Object.keys(next).length) emit('submit', { ...form.value });
}
</script>

<template>
  <UiBaseModal :model-value="modelValue" :title="isEdit ? 'Edit Country' : 'Add Country'" max-width="700px" @update:model-value="emit('update:modelValue', $event)" @close="close">
    <div class="form-grid mb-4">
      <UiTextfieldPrimary title="Name" v-model="form.name" :error="!!errors.name" :errorMessage="errors.name" />
      <UiTextfieldPrimary title="ISO Code" v-model="form.country_code" placeholder="PK" />
      <UiTextfieldPrimary title="Dialling Code" v-model="form.phone_code" placeholder="+92" />
      <UiTextfieldPrimary title="Time Zone" v-model="form.country_time_zone" placeholder="Asia/Karachi" :error="!!errors.country_time_zone" :errorMessage="errors.country_time_zone" />
      <UiTextfieldPrimary title="Currency Code" v-model="form.currency_short_name" placeholder="PKR" :error="!!errors.currency_short_name" :errorMessage="errors.currency_short_name" />
      <UiTextfieldPrimary title="Currency Symbol" v-model="form.currency_symbol" placeholder="Rs" />
    </div>
    <UiToggleRow label="Active" v-model="form.is_active" />
    <template #footer>
      <UiFormActions :submit-label="isEdit ? 'Save' : 'Create Country'" :loading="loading ?? false" @cancel="close" @submit="submit" />
    </template>
  </UiBaseModal>
</template>
