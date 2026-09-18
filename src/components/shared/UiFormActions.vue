<script setup lang="ts">
/**
 * UiFormActions
 * Reusable form action bar: Cancel + submit (primary) buttons.
 *
 * Props:
 *   cancelLabel  – cancel button text (default 'Cancel')
 *   submitLabel  – submit button text (default 'Save')
 *   loading      – shows spinner on submit button when true
 *   disabled     – disables submit button when true
 *
 * Emits:
 *   cancel   – cancel button clicked
 *   submit   – submit button clicked
 */
withDefaults(defineProps<{
  cancelLabel?: string;
  submitLabel?: string;
  loading?: boolean;
  disabled?: boolean;
}>(), {
  cancelLabel: 'Cancel',
  submitLabel: 'Save',
  loading: false,
  disabled: false,
});

defineEmits<{
  (e: 'cancel'): void;
  (e: 'submit'): void;
}>();
</script>

<template>
  <div class="ui-form-actions">
    <v-btn
      variant="outlined"
      class="ui-btn-cancel"
      type="button"
      @click="$emit('cancel')"
    >
      {{ cancelLabel }}
    </v-btn>

    <v-btn
      variant="flat"
      class="ui-btn-submit"
      type="submit"
      :loading="loading"
      :disabled="disabled"
      @click="$emit('submit')"
    >
      {{ submitLabel }}
    </v-btn>
  </div>
</template>
