<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  groups: { module_name: string; permissions: { id: number; name: string; permission_key: string }[] }[];
  modelValue: number[];
  readonly?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number[]): void;
}>();

const selected = computed(() => new Set(props.modelValue));
const allIds = computed(() => props.groups.flatMap((group) => group.permissions.map((permission) => permission.id)));
const allSelected = computed(() => allIds.value.length > 0 && allIds.value.every((id) => selected.value.has(id)));

const actionLabel = (key: string) => {
  const action = key.split('_').pop() || key;
  return action.charAt(0).toUpperCase() + action.slice(1);
};

function toggle(id: number) {
  if (props.readonly) return;
  const next = new Set(selected.value);
  next.has(id) ? next.delete(id) : next.add(id);
  emit('update:modelValue', Array.from(next));
}

function groupState(group: any) {
  const ids = group.permissions.map((permission: any) => permission.id);
  const count = ids.filter((id: number) => selected.value.has(id)).length;
  return { all: count === ids.length, some: count > 0 && count < ids.length };
}

function toggleGroup(group: any) {
  if (props.readonly) return;
  const ids = group.permissions.map((permission: any) => permission.id);
  const next = new Set(selected.value);
  const state = groupState(group);
  ids.forEach((id: number) => (state.all ? next.delete(id) : next.add(id)));
  emit('update:modelValue', Array.from(next));
}

function toggleAll() {
  if (props.readonly) return;
  emit('update:modelValue', allSelected.value ? [] : [...allIds.value]);
}
</script>

<template>
  <div class="permission-matrix">
    <div class="permission-matrix__head">
      <span>{{ modelValue.length }} of {{ allIds.length }} permissions selected</span>
      <v-btn v-if="!readonly" size="small" variant="text" color="primary" @click="toggleAll">{{ allSelected ? 'Clear all' : 'Select all' }}</v-btn>
    </div>
    <div v-for="group in groups" :key="group.module_name" class="permission-matrix__row">
      <div class="permission-matrix__module">
        <v-checkbox-btn
          :model-value="groupState(group).all"
          :indeterminate="groupState(group).some"
          :disabled="readonly"
          density="compact"
          color="primary"
          @update:model-value="toggleGroup(group)"
        />
        <span>{{ group.module_name }}</span>
      </div>
      <div class="permission-matrix__actions">
        <v-chip
          v-for="permission in group.permissions"
          :key="permission.id"
          :color="selected.has(permission.id) ? 'primary' : undefined"
          :variant="selected.has(permission.id) ? 'flat' : 'outlined'"
          size="small"
          :class="{ 'permission-matrix__chip--readonly': readonly }"
          @click="toggle(permission.id)"
        >
          {{ actionLabel(permission.permission_key) }}
        </v-chip>
      </div>
    </div>
    <div v-if="!groups.length" class="text-muted-sm pa-4">No permissions available.</div>
  </div>
</template>

<style scoped>
.permission-matrix {
  border: 1px solid #e7e7ea;
  border-radius: 10px;
  max-height: 420px;
  overflow-y: auto;
}
.permission-matrix__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  background: #fafafa;
  font-size: 13px;
  color: #6b7280;
  position: sticky;
  top: 0;
  z-index: 1;
  border-bottom: 1px solid #e7e7ea;
}
.permission-matrix__row {
  display: grid;
  grid-template-columns: 220px 1fr;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-bottom: 1px solid #f1f1f3;
}
.permission-matrix__module {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
}
.permission-matrix__module :deep(.v-selection-control) {
  flex: 0 0 auto;
}
.permission-matrix__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.permission-matrix__chip--readonly {
  pointer-events: none;
}
@media (max-width: 600px) {
  .permission-matrix__row {
    grid-template-columns: 1fr;
  }
}
</style>
