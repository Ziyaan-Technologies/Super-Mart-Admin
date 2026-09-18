<script setup lang="ts">
defineProps<{
  modelValue: boolean;
  itemName?: string;
  itemType?: string;
  actionVerb?: string;
  title?: string;
  confirmColor?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

const close = () => {
  emit('update:modelValue', false);
  emit('cancel');
};

const confirm = () => {
  emit('update:modelValue', false);
  emit('confirm');
};
</script>

<template>
  <Teleport to="body">
    <Transition name="dv-fade">
      <div v-if="modelValue" class="dv-overlay" @click.self="close">
        <div class="dv-modal">

          <!-- Header -->
          <div class="dv-header">
            <span class="dv-title">{{ title || `${actionVerb ? actionVerb.charAt(0).toUpperCase() + actionVerb.slice(1) : 'Delete'} ${itemType || 'Item'}` }}</span>
            <button class="dv-close" @click="close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2.5"
                   stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6"  y2="18"/>
                <line x1="6"  y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="dv-body">
            <p class="dv-message">
              Are you sure you want to {{ actionVerb || 'delete' }} the {{ (itemType || 'item').toLowerCase() }}{{ itemName ? ' ' + itemName : '' }}?
            </p>
          </div>

          <!-- Footer -->
          <div class="dv-footer">
            <v-btn
              variant="outlined"
              class="dv-btn-cancel"
              @click="close"
            >
              Cancel
            </v-btn>
            <v-btn
              variant="flat"
              :color="confirmColor || '#5B21B6'"
              class="dv-btn-confirm"
              @click="confirm"
            >
              Yes
            </v-btn>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ── Overlay ── */
.dv-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* ── Modal ── */
.dv-modal {
  background: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 560px;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* ── Header ── */
.dv-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
}

.dv-title {
  font-size: 16px;
  font-weight: 600;
  color: #09090B;
}

.dv-close {
  width: 28px;
  height: 28px;
  border: none;
  background: none;
  cursor: pointer;
  color: #6B7280;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  padding: 0;
  transition: background 0.12s, color 0.12s;
}
.dv-close:hover {
  background: #F3F4F6;
  color: #111827;
}

/* ── Body ── */
.dv-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 32px;
}

.dv-message {
  font-size: 15px;
  font-weight: 500;
  color: #09090B;
  text-align: center;
  margin: 0;
  line-height: 1.5;
}

/* ── Footer ── */
.dv-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 24px 28px;
}

/* ── Buttons ── */
.dv-btn-cancel {
  height: 40px;
  min-width: 140px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: opacity 0.15s, background 0.15s;
  font-family: inherit;
  border-color: #D1D5DB;
  color: #09090B;
}

.dv-btn-cancel:hover {
  background: #F9FAFB;
}

.dv-btn-confirm {
  height: 40px;
  min-width: 140px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: opacity 0.15s, background 0.15s;
  font-family: inherit;
}

.dv-btn-confirm:hover {
  background: #4C1D95;
}

/* ── Transition ── */
.dv-fade-enter-active,
.dv-fade-leave-active {
  transition: opacity 0.18s ease;
}
.dv-fade-enter-from,
.dv-fade-leave-to {
  opacity: 0;
}
</style>
