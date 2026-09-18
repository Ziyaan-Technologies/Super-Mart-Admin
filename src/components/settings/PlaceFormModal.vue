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
  label: string;
  parentLabel: string;
  parentKey: string;
  parents: any[];
}>();

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
    [props.parentKey]: data[props.parentKey] || data[props.parentKey.replace('_id', '')]?.id || null,
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
  if (!form.value[props.parentKey]) next.parent = `${props.parentLabel} is required`;
  errors.value = next;
  if (!Object.keys(next).length) emit('submit', { ...form.value });
}
</script>

<template>
  <UiBaseModal :model-value="modelValue" :title="`${isEdit ? 'Edit' : 'Add'} ${label}`" max-width="600px" @update:model-value="emit('update:modelValue', $event)" @close="close">
    <div class="form-grid mb-4">
      <UiTextfieldPrimary title="Name" v-model="form.name" :error="!!errors.name" :errorMessage="errors.name" />
      <UiSelectField :title="parentLabel" v-model="form[parentKey]" :items="parents" :error="errors.parent" />
    </div>
    <UiToggleRow label="Active" v-model="form.is_active" />
    <template #footer>
      <UiFormActions :submit-label="isEdit ? 'Save' : `Create ${label}`" :loading="loading ?? false" @cancel="close" @submit="submit" />
    </template>
  </UiBaseModal>
</template>
