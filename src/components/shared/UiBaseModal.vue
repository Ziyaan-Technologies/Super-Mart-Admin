<script setup lang="ts">
/**
 * UiBaseModal
 * Reusable modal container that wraps Vuetify v-dialog.
 *
 * Props:
 *   modelValue  – controls open/close (v-model)
 *   title       – header title text
 *   maxWidth    – dialog max width (default '640px')
 *   persistent  – prevents close on backdrop click (default true)
 *
 * Slots:
 *   default   – form / body content
 *   footer    – action buttons (optional; shows divider above)
 *
 * Emits:
 *   update:modelValue  – v-model sync
 *   close              – when the × button is clicked
 */
defineProps<{
  modelValue: boolean;
  title?: string;
  maxWidth?: string | number;
  persistent?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
}>();

function close() {
  emit('update:modelValue', false);
  emit('close');
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    :max-width="maxWidth ?? '640px'"
    :persistent="persistent ?? true"
    @update:model-value="(v) => emit('update:modelValue', v)"
  >
    <div class="ui-modal">
      <!-- ── Header ── -->
      <div class="ui-modal__header">
        <span class="ui-modal__title">{{ title }}</span>
        <button class="ui-modal__close" type="button" :aria-label="`Close ${title}`" @click="close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5"
               stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <!-- ── Body ── -->
      <div class="ui-modal__body">
        <slot />
      </div>

      <!-- ── Footer (optional) ── -->
      <template v-if="$slots.footer">
        <div class="ui-modal__divider" />
        <div class="ui-modal__footer">
          <slot name="footer" />
        </div>
      </template>
    </div>
  </v-dialog>
</template>
