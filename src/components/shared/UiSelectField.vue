<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: any;
  items: any[];
  title?: string;
  itemTitle?: string;
  itemValue?: string;
  placeholder?: string;
  error?: string;
  multiple?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  loading?: boolean;
}>(), {
  itemTitle: 'name',
  itemValue: 'id',
  placeholder: 'Select...',
  multiple: false,
  clearable: false,
  disabled: false,
  loading: false,
});

defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();
</script>

<template>
  <div class="ui-field" :class="{ 'ui-field--error': error }">
    <label v-if="title" class="ui-field__label">{{ title }}</label>
    <div class="ui-dropdown">
      <v-autocomplete
        :model-value="modelValue"
        :items="items"
        :item-title="itemTitle"
        :item-value="itemValue"
        :placeholder="placeholder"
        :multiple="multiple"
        :chips="multiple"
        :closable-chips="multiple"
        :clearable="clearable"
        :disabled="disabled"
        :loading="loading"
        :error="!!error"
        variant="outlined"
        density="compact"
        hide-details
        @update:model-value="$emit('update:modelValue', $event)"
      />
    </div>
    <span v-if="error" class="ui-field__error-text">{{ error }}</span>
  </div>
</template>

<style scoped>
.ui-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ui-field__label {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.ui-field__error-text {
  margin-top: -4px;
}
</style>
