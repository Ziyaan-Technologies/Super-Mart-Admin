<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import UiBaseModal from '@/components/shared/UiBaseModal.vue';
import UiTextfieldPrimary from '@/components/shared/UiTextfieldPrimary.vue';
import UiSelectField from '@/components/shared/UiSelectField.vue';
import UiToggleRow from '@/components/shared/UiToggleRow.vue';
import UiFormActions from '@/components/shared/UiFormActions.vue';

const props = defineProps<{ modelValue: boolean; loading?: boolean; data?: any }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', payload: Record<string, any>): void;
}>();

const types = ['Piece', 'Weight', 'Volume', 'Length'].map((name) => ({ id: name, name }));
const isEdit = computed(() => !!props.data?.id);
const form = ref<any>({});
const errors = ref<Record<string, string>>({});

watch(() => props.modelValue, (open) => {
  if (!open) return;
  const data = props.data || {};
  form.value = {
    name: data.name || '',
    short_name: data.short_name || '',
    type: data.type || 'Piece',
    allow_decimal: data.allow_decimal ?? false,
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
  if (!form.value.short_name?.trim()) next.short_name = 'Short name is required';
  errors.value = next;
  if (!Object.keys(next).length) emit('submit', { ...form.value });
}
</script>

<template>
  <UiBaseModal :model-value="modelValue" :title="isEdit ? 'Edit Unit' : 'Add Unit'" max-width="620px" @update:model-value="emit('update:modelValue', $event)" @close="close">
    <div class="form-grid mb-4">
      <UiTextfieldPrimary title="Name" v-model="form.name" placeholder="Kilogram" :error="!!errors.name" :errorMessage="errors.name" />
      <UiTextfieldPrimary title="Short Name" v-model="form.short_name" placeholder="kg" :error="!!errors.short_name" :errorMessage="errors.short_name" />
      <UiSelectField title="Type" v-model="form.type" :items="types" />
    </div>
    <UiToggleRow label="Allow decimal quantities (weighed / measured)" v-model="form.allow_decimal" class="mb-3" />
    <UiToggleRow label="Active" v-model="form.is_active" />
    <template #footer>
      <UiFormActions :submit-label="isEdit ? 'Save' : 'Create Unit'" :loading="loading ?? false" @cancel="close" @submit="submit" />
    </template>
  </UiBaseModal>
</template>
