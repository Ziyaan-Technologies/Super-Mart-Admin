<script setup>
const props = defineProps({
    title: String,
    subtitle: String,
    breadcrumbs: Array ,
    icon: String,
    text: String
});
</script>

<template>
    <div class="page-breadcrumb mt-3 mb-6">
        <div class="d-flex justify-space-between">
            <div class="d-flex py-0 align-center">
                <div>
                    <v-breadcrumbs :items="breadcrumbs" class="text-h6 font-weight-regular pa-0 ml-n1">
                        <template v-slot:divider v-if="breadcrumbs">
                            <v-icon>mdi-chevron-right</v-icon>
                        </template>
                        <template v-slot:item="{ item }" v-if="breadcrumbs">
                            <li class="v-breadcrumbs-item" v-if="!item.disabled && !(item.href.includes('#') || item.href == '')"><router-link class="v-breadcrumbs-item--link" :to="item.href"><h6 class="text-h6">{{ item.text }}</h6></router-link></li>
                            <li class="v-breadcrumbs-item" v-else-if="!item.disabled && (item.href.includes('#') || item.href == '')"><h6 class="text-h6">{{ item.text }}</h6></li>
                            <li class="v-breadcrumbs-item v-breadcrumbs-item--disabled" v-if="item.disabled"><h6 class="text-h6">{{ item.text }}</h6></li>
                        </template>
                    </v-breadcrumbs>
                    <h3 class="text-h3 mb-2">{{ title }}</h3>
                    <p v-if="subtitle" class="page-breadcrumb__subtitle">{{ subtitle }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.page-breadcrumb {
    .v-toolbar {
        background: transparent;
    }

    .v-breadcrumbs,
    .v-breadcrumbs-item,
    .v-breadcrumbs-item--link,
    .v-breadcrumbs-item h6,
    .v-icon {
        color: #5b12d8;
    }

    h3 {
        color: #111111;
    }

    .page-breadcrumb__subtitle {
        color: #8a8d93;
        font-size: 15px;
        margin: 0;
    }
}
</style>



