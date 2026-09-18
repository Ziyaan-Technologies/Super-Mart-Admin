<script setup lang="ts">
/**
 * UiStatusChip
 * Colored status badge used in tables (Orders, Vendors, Recent Activities, …).
 *
 * Props:
 *   status  – the label to display (e.g. "Accepted", "Active", "Suspended").
 *   variant – optional explicit color. If omitted, the color is auto-mapped from
 *             the status text. Use this when the same word needs a different color
 *             across pages (e.g. "Active" is orange in Orders but green in Vendors).
 */
import { computed } from 'vue';

type ChipColor = 'green' | 'purple' | 'orange' | 'red' | 'gray';

const props = defineProps<{
  status: string;
  variant?: ChipColor;
}>();

const autoMap: Record<string, ChipColor> = {
  accepted: 'green',
  completed: 'green',
  delivered: 'purple',
  active: 'orange',
  pending: 'orange',
  preparing: 'orange',
  processing: 'orange',
  cancel: 'red',
  cancelled: 'red',
  canceled: 'red',
  rejected: 'red',
  failed: 'red',
};

const color = computed<ChipColor>(
  () => props.variant ?? autoMap[props.status?.toLowerCase()] ?? 'gray'
);
</script>

<template>
  <span class="ui-status-chip" :class="`ui-status-chip--${color}`">{{ status }}</span>
</template>
