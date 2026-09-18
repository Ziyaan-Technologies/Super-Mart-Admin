<script setup lang="ts">
defineProps<{
  modelValue?: string | null;
  title?: string;
  placeholder?: string;
  rows?: number;
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
  <div class="ui-field">
    <label v-if="title" class="ui-field__label">{{ title }}</label>
    <textarea
      class="ui-field__textarea"
      :value="modelValue || ''"
      :rows="rows || 3"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
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
</style>
