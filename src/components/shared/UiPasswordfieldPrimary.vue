<script setup lang="ts">
/**
 * UiPasswordfieldPrimary
 * A reusable password field with show/hide toggle.
 *
 * Props:
 *   modelValue  – the password string
 *   label       – field label
 *   placeholder – placeholder text (default '')
 *   rules       – validation rules array
 *
 * Emits:
 *   update:modelValue – emits the password string
 */
import { ref } from 'vue';

const props = withDefaults(defineProps<{
  modelValue: string;
  label?: string;
  placeholder?: string;
  rules?: any[];
  error?: boolean;
  errorMessage?: string;
  autocomplete?: string;
}>(), {
  label: '',
  placeholder: '',
  rules: () => [],
  error: false,
  errorMessage: '',
  autocomplete: 'new-password',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const showPassword = ref(false);

function togglePassword() {
  showPassword.value = !showPassword.value;
}
</script>

<template>
  <div class="ui-field" :class="{ 'ui-password-field--error': error }">
    <label v-if="label" class="ui-field__label">{{ label }}</label>
    <div class="ui-password-field">
      <input
        :type="showPassword ? 'text' : 'password'"
        :value="modelValue"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        class="ui-password-field__input"
        @input="(e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value)"
      />
      <button
        type="button"
        class="ui-password-field__toggle"
        @click="togglePassword"
        aria-label="Toggle password visibility"
      >
        <!-- Open eye = password is visible (click to hide) -->
        <svg v-if="showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        <!-- Slashed eye = password is hidden (click to show) -->
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 5.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
      </button>
    </div>
    <span v-if="error && errorMessage" class="ui-password-field__error">{{ errorMessage }}</span>
  </div>
</template>

<style scoped>
.ui-password-field {
  position: relative;
  display: flex;
  align-items: center;
}

.ui-password-field__input {
  width: 100%;
  padding: 12px 16px;
  padding-right: 48px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.ui-password-field__input:focus {
  outline: none;
  border-color: #696cff;
}

.ui-password-field__toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #D0D0D0;
  transition: color 0.2s;
}

.ui-password-field__toggle:hover {
  color: #a8a7a7;
}

.ui-password-field--error .ui-password-field__input {
  border-color: #ef4444;
}

.ui-password-field__error {
  display: block;
  font-size: 12px;
  color: #ef4444;
  margin-top: 6px;
}
</style>
