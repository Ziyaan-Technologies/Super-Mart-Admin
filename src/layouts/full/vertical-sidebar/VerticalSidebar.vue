<script setup lang="ts">
import { getCurrentInstance, computed } from 'vue'
import { useCustomizerStore } from '@/stores/customizer'
import { useDisplay } from 'vuetify'
import rawSidebarItems from './sidebarItem'
import NavGroup from './NavGroup/index.vue'
import NavItem from './NavItem/index.vue'
import NavCollapse from './NavCollapse/NavCollapse.vue'
import { LayoutSidebarLeftCollapseIcon } from 'vue-tabler-icons'
import type { menu } from './sidebarItem'
import { filterMenuByAbility } from '@/utils/filterMenuByAbility'

const customizer = useCustomizerStore()
const { mobile } = useDisplay()

const instance = getCurrentInstance()

const ability = instance?.appContext.config.globalProperties.$ability 
const abilityReady = instance?.appContext.config.globalProperties.$abilityReady

const sidebarMenu = computed(() => {
  if (!abilityReady?.value) return []
  if (!ability?.value) return []
  return filterMenuByAbility(rawSidebarItems, ability.value)
})

</script>

<template>
  <v-navigation-drawer
    left
    v-model="customizer.Sidebar_drawer"
    elevation="0"
    rail-width="75"
    app
    class="leftSidebar"
    :rail="!mobile && customizer.mini_sidebar"
    :expand-on-hover="!mobile"
    :permanent="!mobile"
    width="256"
  >
    <perfect-scrollbar class="scrollnavbar">
      <div class="sidebar-brand d-flex align-center justify-space-between px-5 py-5">
        <RouterLink to="/" class="brand-logo">
          <span class="mini-text">SUPER MART</span>
          <span class="mini-icon brand-logo-mark">S</span>
        </RouterLink>
        <v-btn
          variant="text"
          icon
          size="small"
          class="brand-collapse mini-text"
          @click="customizer.SET_MINI_SIDEBAR(!customizer.mini_sidebar)"
        >
          <LayoutSidebarLeftCollapseIcon size="22" />
        </v-btn>
      </div>

      <v-list class="py-4 px-4" >
        <template v-for="(item, i) in sidebarMenu" :key="i">
          <NavGroup :item="item" v-if="item.header" />
          <NavCollapse class="leftPadding" :item="item" :level="0" v-else-if="item.children" />
          <div v-else-if="item.divider" class="nav-spacer" />
          <NavItem :item="item" v-else class="leftPadding" />
        </template>
      </v-list>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>

<style scoped>
.nav-spacer {
  height: 94px;
}
</style>
