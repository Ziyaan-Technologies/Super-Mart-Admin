<script setup lang="ts">
import { ref } from 'vue';

export interface OptionItem {
  key: string;
  label: string;
  icon: string;
}

const props = defineProps<{
  generalSettings?: boolean;
  devices?: boolean;
  paymentMethods?: boolean;
  syncedLogs?: boolean;
  showStoreDropdown?: boolean;
  storePlaceholder?: string;
  storeOptions?: Array<{ id: number | string; name: string }>;
}>();

const emit = defineEmits<{
  (e: 'optionChange', key: string): void;
  (e: 'storeChange', storeId: number | string): void;
}>();

const activeOption = ref('generalSettings');

const options: OptionItem[] = [];

if (props.generalSettings !== false) {
  options.push({ key: 'generalSettings', label: 'General Settings', icon: 'mdi-cog' });
}
if (props.devices !== false) {
  options.push({ key: 'devices', label: 'Devices', icon: 'mdi-monitor' });
}
if (props.paymentMethods !== false) {
  options.push({ key: 'paymentMethods', label: 'Payment Methods', icon: 'mdi-credit-card' });
}
if (props.syncedLogs !== false) {
  options.push({ key: 'syncedLogs', label: 'Synced Logs', icon: 'mdi-sync' });
}

const handleOptionClick = (key: string) => {
  activeOption.value = key;
  emit('optionChange', key);
};

const selectedStore = ref<number | string | null>(null);

const handleStoreChange = (storeId: number | string) => {
  selectedStore.value = storeId;
  emit('storeChange', storeId);
};
</script>

<template>
  <div class="multi-slide-option">
    <div class="options-wrapper">
      <div class="options-left">
        <div
          v-for="option in options"
          :key="option.key"
          class="option-item"
          :class="{ 'option-item--active': activeOption === option.key }"
          @click="handleOptionClick(option.key)"
        >
          <v-icon class="option-icon">{{ option.icon }}</v-icon>
          <span class="option-label">{{ option.label }}</span>
        </div>
      </div>
      <div v-if="showStoreDropdown !== false" class="options-right">
        <v-select
          v-model="selectedStore"
          :items="storeOptions || []"
          item-title="name"
          item-value="id"
          :placeholder="storePlaceholder || 'Select Store'"
          variant="outlined"
          density="compact"
          hide-details
          class="store-dropdown"
          @update:model-value="handleStoreChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.multi-slide-option {
  margin-bottom: 24px;
}

.options-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 16px 20px;
  background: #fff;
  border-radius: 8px;
}

.options-left {
  display: flex;
  align-items: center;
  gap: 32px;
  flex: 1;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 0;
  position: relative;
  transition: all 0.2s ease;
}

.option-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #4F30A9;
  transition: width 0.2s ease;
}

.option-item--active::after {
  width: 100%;
}

.option-item--active .option-label {
  color: #4F30A9;
  font-weight: 600;
}

.option-item--active .option-icon {
  color: #4F30A9;
}

.option-icon {
  font-size: 20px;
  color: #6b6f76;
  transition: color 0.2s ease;
}

.option-label {
  font-size: 14px;
  color: #6b6f76;
  font-weight: 500;
  transition: color 0.2s ease;
  white-space: nowrap;
}

.options-right {
  min-width: 200px;
}

.store-dropdown {
  max-width: 250px;
}

.store-dropdown :deep(.v-field) {
  border-radius: 6px;
}

.store-dropdown :deep(.v-field__outline) {
  border-color: #e4e7ec;
}

@media (max-width: 768px) {
  .options-wrapper {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .options-left {
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
  }

  .options-right {
    min-width: auto;
  }

  .store-dropdown {
    max-width: 100%;
  }
}
</style>
