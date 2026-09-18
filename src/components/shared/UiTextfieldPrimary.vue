<script setup lang="ts">
defineProps<{
  title?: string;
  modelValue?: string | number;
  error?: boolean;
  errorMessage?: string;
  maxlength?: string | number;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'blur', event: FocusEvent): void;
  (e: 'change', event: Event): void;
}>();
</script>

<template>
  <div class="ui-field" :class="{ 'ui-field--error': error }">
    <label class="ui-field__label">{{ title }}</label>
    <input
      class="ui-field__input"
      :value="modelValue"
      :type="type || 'text'"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxlength"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="$emit('blur', $event)"
      @change="$emit('change', $event)"
    />
    <span v-if="error && errorMessage" class="ui-field__error-text">{{ errorMessage }}</span>
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
.ui-field__input {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;
}
.ui-field__input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
.ui-field--error .ui-field__input {
  border-color: #ef4444;
}
.ui-field--error .ui-field__input:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
.ui-field__error-text {
  font-size: 12px;
  color: #ef4444;
  margin-top: -4px;
}
</style>