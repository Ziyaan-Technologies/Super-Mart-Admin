<script setup lang="ts">
/**
 * UiPagination
 * Reusable table pagination bar matching the design:
 *   "Showing X to Y of Z {itemLabel}"  |  [N per page ▾]  [‹] [1] [2] [3] …… [50] [›]
 *
 * Props:
 *   currentPage    – active page (v-model:currentPage)
 *   itemsPerPage   – rows per page (v-model:itemsPerPage)
 *   totalItems     – total record count
 *   pageCount      – total number of pages
 *   itemLabel      – noun shown in "of Z {itemLabel}" (default 'orders')
 *   perPageOptions – options for the per-page select (default [10, 20, 50, 100])
 *
 * Emits:
 *   update:currentPage, update:itemsPerPage
 */
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  pageCount: number;
  itemLabel?: string;
  perPageOptions?: number[];
}>(), {
  itemLabel: 'orders',
  perPageOptions: () => [10, 20, 50, 100],
});

const emit = defineEmits<{
  (e: 'update:currentPage', value: number): void;
  (e: 'update:itemsPerPage', value: number): void;
}>();

const fromIndex = computed(() => {
  if (props.totalItems === 0) return 0;
  return (props.currentPage - 1) * props.itemsPerPage + 1;
});

const toIndex = computed(() => {
  const end = props.currentPage * props.itemsPerPage;
  return end > props.totalItems ? props.totalItems : end;
});

const pagesToDisplay = computed(() => {
  const current = props.currentPage;
  const total = props.pageCount;
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [];
  pages.push(1);

  if (current > 3) pages.push('...');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('...');

  pages.push(total);
  return pages;
});
</script>

<template>
  <div class="ui-pagination d-flex align-center justify-space-between flex-wrap mt-6 px-1">
    <div class="showing-orders-text">
      <a href="#" class="underlined-link font-weight-medium text-black text-decoration-none" @click.prevent>
        Showing {{ fromIndex }} to {{ toIndex }} of {{ totalItems }} {{ itemLabel }}
      </a>
    </div>

    <div class="d-flex align-center flex-wrap ui-pagination__controls">
      <v-select
        :model-value="itemsPerPage"
        @update:model-value="emit('update:itemsPerPage', $event)"
        :items="perPageOptions"
        variant="outlined"
        density="compact"
        hide-details
        class="items-per-page-select"
      >
        <template #selection="{ item }">
          <span class="text-body-2 text-no-wrap">{{ item.title }} per page</span>
        </template>
      </v-select>

      <div class="custom-pagination d-flex align-center">
        <v-btn
          icon
          variant="outlined"
          :disabled="currentPage === 1"
          @click="emit('update:currentPage', currentPage - 1)"
          class="pagination-nav-btn border"
          size="small"
        >
          <v-icon size="18">mdi-chevron-left</v-icon>
        </v-btn>

        <template v-for="(page, index) in pagesToDisplay" :key="index">
          <v-btn
            v-if="page !== '...'"
            variant="flat"
            :color="currentPage === page ? '#512da8' : 'transparent'"
            :class="['pagination-num-btn font-weight-medium', { 'text-white': currentPage === page, 'text-dark': currentPage !== page }]"
            @click="emit('update:currentPage', page as number)"
            size="small"
          >
            {{ page }}
          </v-btn>
          <span v-else class="pagination-dots px-2 font-weight-bold">. . . . . .</span>
        </template>

        <v-btn
          icon
          variant="outlined"
          :disabled="currentPage === pageCount || pageCount === 0"
          @click="emit('update:currentPage', currentPage + 1)"
          class="pagination-nav-btn border"
          size="small"
        >
          <v-icon size="18">mdi-chevron-right</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>
