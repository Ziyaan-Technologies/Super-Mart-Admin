<script setup lang="ts">
/**
 * UiImagePicker
 * A reusable image upload picker with preview.
 *
 * Props:
 *   modelValue         – the selected File object (or null)
 *   label              – section label above the picker (default 'Pick a Logo')
 *   placeholder        – text shown in the preview box (default 'Logo Here')
 *   accept             – file accept string (default 'image/*')
 *   existingImageUrl   – URL of an existing image to display for editing
 *
 * Emits:
 *   update:modelValue  – emits the File object when a file is chosen
 */
import { ref, computed } from 'vue';

const props = withDefaults(defineProps<{
  modelValue?: File | null;
  label?: string;
  placeholder?: string;
  accept?: string;
  existingImageUrl?: string;
}>(), {
  modelValue: null,
  label: 'Pick a Logo',
  placeholder: 'Logo Here',
  accept: 'image/*',
  existingImageUrl: '',
});

const emit = defineEmits<{
  (e: 'update:modelValue', file: File | null): void;
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);

const previewUrl = computed<string | null>(() => {
  // Prioritize new file selection over existing image URL
  if (props.modelValue) {
    return URL.createObjectURL(props.modelValue);
  }
  // Fall back to existing image URL if no new file selected
  if (props.existingImageUrl) {
    return props.existingImageUrl;
  }
  return null;
});

function triggerPicker() {
  fileInputRef.value?.click();
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0] ?? null;
  emit('update:modelValue', file);
  // Reset so re-selecting the same file fires change
  input.value = '';
}
</script>

<template>
  <div class="ui-image-picker">
    <span class="ui-image-picker__label">{{ label }}</span>

    <!-- Trigger row -->
    <div class="ui-image-picker__trigger" role="button" tabindex="0"
         @click="triggerPicker"
         @keydown.enter.prevent="triggerPicker"
         @keydown.space.prevent="triggerPicker">
        <div class="ui-image-picker__icon-wrap" aria-hidden="true">
          <v-icon icon="mdi-camera-outline" size="20" />
        </div>
      <span class="ui-image-picker__status">
        {{ modelValue ? 'Image uploaded' : 'Upload image' }}
      </span>
    </div>

    <!-- Hidden file input -->
    <input
      ref="fileInputRef"
      type="file"
      :accept="accept"
      class="ui-image-picker__input"
      aria-hidden="true"
      tabindex="-1"
      @change="onFileChange"
    />

    <!-- Preview box -->
    <div class="ui-image-picker__preview" :class="{ 'ui-image-picker__preview--has-image': !!previewUrl }">
      <img v-if="previewUrl" :src="previewUrl" :alt="placeholder" class="ui-image-picker__img" />
      <span v-else class="ui-image-picker__placeholder">{{ placeholder }}</span>
    </div>
  </div>
</template>
