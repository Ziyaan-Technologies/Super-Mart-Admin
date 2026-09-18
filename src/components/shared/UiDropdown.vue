<script setup lang="ts">
/**
 * UiDropdown
 * Reusable filter/select dropdown styled to match the dashboard toolbar
 * (e.g. "All Types", "All Statuses", "All Stores", "Sort by: Newest").
 *
 * Props:
 *   modelValue – selected value (v-model)
 *   items      – list of options
 *   icon       – optional leading mdi icon
 *   label      – optional floating label
 *   placeholder – optional placeholder
 *
 * Emits:
 *   update:modelValue
 */
defineProps<{
  modelValue: any;
  items: any[];
  icon?: string;
  label?: string;
  placeholder?: string;
  itemTitle?: string;
  itemValue?: string | ((item: any) => any);
}>();

defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();
</script>

<template>
  <v-autocomplete
    :model-value="modelValue"
    :items="items"
    :prepend-inner-icon="icon"
    :label="label"
    :placeholder="placeholder"
    :item-title="itemTitle"
    :item-value="itemValue"
    variant="outlined"
    density="compact"
    hide-details
    class="ui-dropdown-select"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
