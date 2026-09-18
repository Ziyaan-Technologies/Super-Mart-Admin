<script setup lang="ts">
/**
 * UiToggleRow
 * A labeled toggle switch using the project's .ui-toggle style class.
 * Renders a label + Vuetify v-switch side by side.
 *
 * Props:
 *   modelValue – boolean v-model value
 *   label      – text shown beside the toggle
 *   color      – Vuetify color (default 'primary')
 *
 * Emits:
 *   update:modelValue
 */
withDefaults(defineProps<{
  modelValue: boolean;
  label: string; 
  color?: string;
}>(), {
  color: 'primary',
});

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
</script>

<template>
  <div class="ui-toggle-row">
    <span class="ui-toggle-row__label">{{ label }}</span>
    <v-switch
      :model-value="modelValue"
      :color="color"
      density="compact"
      hide-details
      class="ui-toggle ui-toggle-row__switch"
      @update:model-value="(v) => $emit('update:modelValue', !!v)"
    />
  </div>
</template>
