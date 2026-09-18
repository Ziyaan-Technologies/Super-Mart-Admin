<script setup lang="ts">
/**
 * UiActionMenu
 * Reusable 3-dot row-action menu used in tables (Clients, Vendors, Orders…).
 * Renders a configurable list of action buttons inside a dropdown.
 *
 * Props:
 *   actions – list of { key, label, icon?, variant? }
 *             variant: 'filled' (purple) | 'outline' (purple border) | 'danger' (red)
 *
 * Emits:
 *   action – the clicked action's `key`
 */
interface ActionItem {
  key: string;
  label: string;
  icon?: string;
  variant?: 'filled' | 'outline' | 'danger';
}

defineProps<{
  actions: ActionItem[];
}>();

const emit = defineEmits<{
  (e: 'action', key: string): void;
}>();
</script>

<template>
  <v-menu :close-on-content-click="true" location="bottom end">
    <template #activator="{ props }">
      <v-btn v-bind="props" icon variant="outlined" size="small" class="ui-action-btn">
        <v-icon size="20">mdi-dots-vertical</v-icon>
      </v-btn>
    </template>

    <div class="ui-action-menu">
      <button
        v-for="a in actions"
        :key="a.key"
        type="button"
        class="ui-action-item"
        :class="`ui-action-item--${a.variant || 'outline'}`"
        @click="emit('action', a.key)"
      >
        <v-icon v-if="a.icon" size="15" class="ui-action-item__icon">{{ a.icon }}</v-icon>
        {{ a.label }}
      </button>
    </div>
  </v-menu>
</template>
