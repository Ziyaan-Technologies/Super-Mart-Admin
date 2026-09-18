<script setup lang="ts">
import { RouterView } from 'vue-router';
import VerticalSidebarVue from './vertical-sidebar/VerticalSidebar.vue';
import VerticalHeaderVue from './vertical-header/VerticalHeader.vue';
import Customizer from './customizer/Customizer.vue';
import { useCustomizerStore } from '../../stores/customizer';
import { SettingsIcon } from 'vue-tabler-icons';
const customizer = useCustomizerStore();
const drawerIsMiniVariant = true;
</script>

<template>
    <!-----RTL LAYOUT------->
    <v-locale-provider v-if="customizer.setRTLLayout" rtl>
        <v-app
            :theme="customizer.actTheme"
            :class="[
                customizer.actTheme,
                customizer.mini_sidebar ? 'mini-sidebar' : '',
                customizer.setBorderCard ? 'cardBordered' : '',
                customizer.inputBg ? 'inputWithbg' : ''
            ]"
        >
            <!---Customizer location left side--->
            <v-navigation-drawer app temporary elevation="10" location="left" v-model="customizer.Customizer_drawer" width="320" class="left-customizer">
                <Customizer />
            </v-navigation-drawer>
            <VerticalSidebarVue />
            <VerticalHeaderVue />

            <v-main>
                <v-container fluid class="page-wrapper pb-sm-15 pb-10">
                    <div :class="'maxWidth'">
                        <RouterView />
                        <v-btn
                            class="customizer-btn"
                            size="large"
                            icon
                            variant="flat"
                            color="primary"
                            @click.stop="customizer.SET_CUSTOMIZER_DRAWER(!customizer.Customizer_drawer)"
                        >
                            <SettingsIcon />
                        </v-btn>
                    </div>
                </v-container>
            </v-main>
        </v-app>
    </v-locale-provider>

    <!-----LTR LAYOUT------->
    <v-locale-provider v-else>
        <v-app
            :theme="customizer.actTheme"
            :class="[
                customizer.actTheme,
                customizer.mini_sidebar ? 'mini-sidebar' : '',
                customizer.setBorderCard ? 'cardBordered' : '',
                customizer.inputBg ? 'inputWithbg' : ''
            ]"
        >
            <!---Customizer location right side--->
            <v-navigation-drawer app temporary elevation="10" location="right" v-model="customizer.Customizer_drawer" width="320">
                <Customizer />
            </v-navigation-drawer>
            <VerticalSidebarVue />
            <VerticalHeaderVue />
            <v-main>
                <v-container fluid class="page-wrapper pb-sm-15 pb-10">
                    <div :class="'maxWidth'">
                        <RouterView />
                        <v-btn
                            class="customizer-btn"
                            size="large"
                            icon
                            variant="flat"
                            color="primary"
                            @click.stop="customizer.SET_CUSTOMIZER_DRAWER(!customizer.Customizer_drawer)"
                        >
                            <SettingsIcon />
                        </v-btn>
                    </div>
                </v-container>
            </v-main>
        </v-app>
    </v-locale-provider>
</template>
