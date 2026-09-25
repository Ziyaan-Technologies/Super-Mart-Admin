<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  title: string;
  value: string | number;
  icon: string;
  percentage: string;
  isPositive: boolean;
  comparisonText: string;
  color?: string;
  iconBgColor?: string;
  /** Plain footer text shown (in muted grey) when there is no growth percentage, e.g. "All Stores". */
  footerText?: string;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  iconBgColor: '',
  loading: false,
});

const percentageColor = computed(() => props.isPositive ? 'success' : 'error');
const percentageIcon = computed(() => props.isPositive ? 'mdi-arrow-up' : 'mdi-arrow-down');
</script>

<template>
  <VCard elevation="0" class="kpi-info-card" rounded="0">
    <v-card-text class="pa-4" v-if="loading">
      <div class="d-flex align-center mb-3">
        <div class="skeleton-pulse rounded-lg flex-shrink-0 me-3" style="width: 44px; height: 44px;"></div>
        <div class="d-flex flex-column flex-grow-1">
          <div class="skeleton-pulse mb-2 rounded" style="width: 65%; height: 12px;"></div>
          <div class="skeleton-pulse rounded" style="width: 45%; height: 22px;"></div>
        </div>
      </div>
      <div class="d-flex align-center">
        <div class="skeleton-pulse rounded" style="width: 55%; height: 12px;"></div>
      </div>
    </v-card-text>
    <v-card-text class="pa-4" v-else>
      <div class="d-flex align-center mb-3">
        <div
          class="kpi-icon-box d-flex align-center justify-center flex-shrink-0 me-3"
          :style="{ backgroundColor: iconBgColor || `rgba(var(--v-theme-${color}), 0.12)` }"
        >
          <v-icon :icon="icon" :color="color" size="24"></v-icon>
        </div>
        <div class="d-flex flex-column">
          <p class="text-caption text-grey-darken-1 font-weight-bold mb-1 kpi-card-title">{{ title }}</p>
          <h3 class="text-h5 font-weight-bold mb-0 kpi-card-value">{{ value }}</h3>
        </div>
      </div>
      <div v-if="percentage" class="d-flex align-center">
        <v-icon
          :icon="percentageIcon"
          :color="percentageColor"
          size="14"
          class="me-1"
        ></v-icon>
        <span
          class="text-caption font-weight-medium me-1"
          :class="isPositive ? 'text-success' : 'text-error'"
        >{{ percentage }}</span>
        <span class="text-caption text-grey-darken-1 font-weight-bold">{{ comparisonText }}</span>
      </div>
      <div v-else-if="footerText" class="d-flex align-center">
        <span class="text-caption text-grey-darken-1 font-weight-bold">{{ footerText }}</span>
      </div>
    </v-card-text>
  </VCard>
</template>

<style scoped>
.skeleton-pulse {
  background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>