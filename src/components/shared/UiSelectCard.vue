<script setup lang="ts">
/**
 * UiSelectCard
 * A bordered card with a title, subtitle and a single outlined select.
 * Used for the Source / Target store pickers on the Clone Menu page.
 *
 *   <UiSelectCard v-model="store" title="Source Store"
 *                 subtitle="Select the store to clone menu from"
 *                 placeholder="Select source store" :items="storeList" />
 */
withDefaults(defineProps<{
  title: string;
  subtitle?: string;
  placeholder?: string;
  modelValue?: any;
  items?: any[];
  itemTitle?: string;
  itemValue?: string;
  returnObject?: boolean;
}>(), {
  subtitle: '',
  placeholder: 'Select',
  items: () => [],
  itemTitle: 'store_name',
  itemValue: 'id',
  returnObject: true,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void;
}>();
</script>

<template>
  <div class="ui-select-card">
    <h3 class="ui-select-card__title">{{ title }}</h3>
    <p v-if="subtitle" class="ui-select-card__subtitle">{{ subtitle }}</p>

    <v-select
      :model-value="modelValue"
      @update:model-value="emit('update:modelValue', $event)"
      :items="items"
      :item-title="itemTitle"
      :item-value="itemValue"
      :placeholder="placeholder"
      :return-object="returnObject"
      variant="outlined"
      density="comfortable"
      hide-details
      class="ui-select-card__select"
    />
  </div>
</template>

<style scoped>
.ui-select-card {
  border: 1px solid #e4e7ec;
  border-radius: 14px;
  padding: 24px;
  background: #fff;
  flex: 1 1 0;
  min-width: 0;
}

.ui-select-card__title {
  font-size: 22px;
  font-weight: 500;
  color: #111827;
  margin: 0;
  line-height: 1.3;
}

.ui-select-card__subtitle {
  color: #98a2b3;
  font-size: 14px;
  margin: 6px 0 22px;
}

.ui-select-card__select :deep(.v-field) {
  border-radius: 10px;
}
</style>
