<script setup lang="ts">
import { computed, getCurrentInstance, ref } from 'vue';
import { useRouter } from 'vue-router';
import { SearchIcon } from 'vue-tabler-icons';
import sidebarItems from '../vertical-sidebar/sidebarItem';
import { filterMenuByAbility } from '@/utils/filterMenuByAbility';

const router = useRouter();
const instance = getCurrentInstance();
const ability = instance?.appContext.config.globalProperties.$ability;
const selected = ref<string | null>(null);

const pages = computed(() => {
  if (!ability?.value) return [];
  return filterMenuByAbility(sidebarItems, ability.value)
    .filter((item) => item.to)
    .map((item) => ({ title: item.title, value: item.to }));
});

const go = (path: string | null) => {
  if (!path) return;
  router.push(path);
  selected.value = null;
};
</script>

<template>
    <v-autocomplete
        v-model="selected"
        :items="pages"
        placeholder="Jump to a page..."
        variant="solo"
        flat
        density="compact"
        hide-details
        single-line
        hide-no-data
        class="header-search"
        @update:model-value="go"
    >
        <template #prepend-inner>
            <SearchIcon size="20" class="header-search__icon" />
        </template>
    </v-autocomplete>
</template>

<style scoped>
.header-search {
    max-width: 420px;
    min-width: 200px;
    width: 100%;
}
@media (max-width: 600px) {
    .header-search {
        display: none;
    }
}

.header-search :deep(.v-field) {
    border-radius: 9999px;
    border: 1px solid #e7e7ea;
    background: #ffffff;
    box-shadow: none;
    min-height: 42px;
}

.header-search :deep(.v-field__input) {
    min-height: 42px;
    padding-top: 0;
    padding-bottom: 0;
    font-size: 14px;
}

.header-search :deep(.v-field__input::placeholder) {
    color: #9aa0a6;
    opacity: 1;
}

.header-search__icon {
    color: #9aa0a6;
    margin-inline: 2px 4px;
}
</style>
