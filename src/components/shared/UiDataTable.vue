<script setup lang="ts">
import { computed, useSlots } from 'vue';
import UiPagination from '@/components/shared/UiPagination.vue';
import UiActionMenu from '@/components/shared/UiActionMenu.vue';

interface RowAction {
  key: string;
  label: string;
  variant?: 'filled' | 'outline' | 'danger';
  when?: (item: any) => boolean;
}

const props = withDefaults(defineProps<{
  headers: any[];
  items: any[];
  loading?: boolean;
  totalItems?: number;
  currentPage?: number;
  itemsPerPage?: number;
  pageCount?: number;
  itemLabel?: string;
  actions?: RowAction[];
  paginate?: boolean;
  emptyText?: string;
}>(), {
  loading: false,
  totalItems: 0,
  currentPage: 1,
  itemsPerPage: 10,
  pageCount: 1,
  itemLabel: 'records',
  actions: () => [],
  paginate: true,
  emptyText: 'No records found',
});

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void;
  (e: 'update:itemsPerPage', size: number): void;
  (e: 'action', key: string, item: any): void;
}>();

const tableHeaders = computed(() =>
  props.actions.length
    ? [...props.headers, { title: 'Actions', key: 'actions', align: 'center' as const, sortable: false }]
    : props.headers
);

defineSlots<Record<string, (props: { item: any; index: number; [key: string]: any }) => any>>();

const slots = useSlots();
const forwardedSlots = computed(() => Object.keys(slots) as any[]);

const actionsFor = (item: any) => props.actions.filter((action) => !action.when || action.when(item));
</script>

<template>
  <div class="ui-data-table">
    <v-data-table
      :loading="loading"
      :items-per-page="paginate ? itemsPerPage : -1"
      :headers="tableHeaders"
      :items="items"
      item-value="id"
      hide-default-footer
      class="table"
    >
      <template v-slot:loading>
        <v-skeleton-loader type="table-row@5" />
      </template>

      <template v-for="name in forwardedSlots" #[name]="slotProps">
        <slot :name="name" v-bind="(slotProps as any) || {}" />
      </template>

      <template v-if="actions.length" v-slot:item.actions="{ item }">
        <UiActionMenu v-if="actionsFor(item).length" :actions="actionsFor(item)" @action="(key: string) => emit('action', key, item)" />
      </template>

      <template v-slot:no-data>
        <div class="ui-data-table__empty">{{ emptyText }}</div>
      </template>
    </v-data-table>

    <UiPagination
      v-if="paginate"
      :current-page="currentPage"
      :items-per-page="itemsPerPage"
      :total-items="totalItems"
      :page-count="pageCount"
      :item-label="itemLabel"
      @update:current-page="emit('update:currentPage', $event)"
      @update:items-per-page="emit('update:itemsPerPage', $event)"
    />
  </div>
</template>

<style scoped>
.ui-data-table {
  background: #fff;
  overflow-x: auto;
}
.ui-data-table__empty {
  padding: 24px;
  text-align: center;
  color: #9ca3af;
}
</style>
