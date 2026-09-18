<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useCustomizerStore } from '../../../stores/customizer';
import { Menu2Icon } from 'vue-tabler-icons';
import ProfileDD from './ProfileDD.vue';
import Searchbar from './Searchbar.vue';

const customizer = useCustomizerStore();
const isFullscreen = ref(false);

const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
};

const updateFullscreenState = () => {
    isFullscreen.value = !!document.fullscreenElement;
};

onMounted(() => {
    document.addEventListener('fullscreenchange', updateFullscreenState);
});

onUnmounted(() => {
    document.removeEventListener('fullscreenchange', updateFullscreenState);
});
</script>

<template>
    <v-app-bar elevation="0" height="64" color="white" id="top" border="b">
        <v-btn class="hidden-lg-and-up ml-2" icon variant="text" @click.stop="customizer.SET_SIDEBAR_DRAWER" size="small">
            <Menu2Icon size="25" />
        </v-btn>

        <Searchbar />

        <v-spacer />

        <v-btn icon variant="text" color="primary" class="mr-2" @click="toggleFullscreen">
            <v-icon v-if="!isFullscreen">mdi-fullscreen</v-icon>
            <v-icon v-else>mdi-fullscreen-exit</v-icon>
            <v-tooltip activator="parent" location="bottom">
                {{ isFullscreen ? 'Exit Fullscreen' : 'Fullscreen (F11)' }}
            </v-tooltip>
        </v-btn>

        <v-divider vertical class="header-divider mx-2 my-4" />

        <div class="ml-1 mr-2">
            <ProfileDD />
        </div>
    </v-app-bar>
</template>

<style scoped>
.header-divider {
    opacity: 0.4;
}
</style>
