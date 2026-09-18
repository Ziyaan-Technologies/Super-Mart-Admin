<script setup>
import Icon from '../Icon.vue';
import { useAuthStore } from '@/stores/auth';

const props = defineProps({ item: Object, level: Number });
const authStore = useAuthStore();

async function handleClick() {
    if (props.item.type === 'logout') {
        try {
            await authStore.logout();
        } catch (e) {
            console.error('Logout failed', e);
        }
    }
}
</script>

<template>
    <!---Single Item-->
    <v-list-item
        :to="item.type === 'external' || item.type === 'logout' ? '' : item.to"
        :href="item.type === 'external' ? item.to : ''"
        rounded
        class="mb-1"
        :disabled="item.disabled"
        :target="item.type === 'external' ? '_blank' : ''"
        v-scroll-to="{ el: '#top' }"
        @click="handleClick"
    >
        <!---If icon-->
        <template v-slot:prepend>
            <Icon :item="item.icon" :level="level" />
        </template>
        <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
        <!---If Caption-->
        <v-list-item-subtitle v-if="item.subCaption" class="text-caption mt-n1 hide-menu">
            {{ item.subCaption }}
        </v-list-item-subtitle>
        <!---If any chip or label-->
        <template v-slot:append v-if="item.chip">
            <v-chip
                :color="item.chipColor"
                :class="'sidebarchip hide-menu bg-' + item.chipBgColor"
                :size="item.chipIcon ? 'small' : 'small'"
                :variant="item.chipVariant"
                :prepend-icon="item.chipIcon"
            >
                {{ item.chip }}
            </v-chip>
        </template>
    </v-list-item>
</template>
