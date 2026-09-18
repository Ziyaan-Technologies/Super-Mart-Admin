<script setup lang="ts">
/**
 * UiPageHeader
 * Standard module page header: breadcrumb + title on the left, actions on the right.
 *
 * Common case — pass `addLabel` to get the "Export + Add New X" button pair:
 *   <UiPageHeader :title="page.title" :breadcrumbs="breadcrumbs"
 *                 add-label="Add New Store" @export="..." @add="..." />
 *
 * Custom right side (e.g. a "This month" dropdown) — use the #actions slot:
 *   <UiPageHeader :title="..." :breadcrumbs="...">
 *     <template #actions> … </template>
 *   </UiPageHeader>
 */
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';

withDefaults(defineProps<{
  title?: string;
  breadcrumbs?: any[];
  addLabel?: string;
  showExport?: boolean;
  showDownloadPdf?: boolean;
  exportLoading?: boolean;
  pdfLoading?: boolean;
}>(), {
  showExport: true,
  showDownloadPdf: false,
  exportLoading: false,
  pdfLoading: false,
});

defineEmits<{
  (e: 'export'): void;
  (e: 'download-pdf'): void;
  (e: 'add'): void;
}>();
</script>

<template>
  <div class="ui-page-header mb-4">
    <div class="d-flex justify-space-between align-center flex-wrap gap-4">
      <BaseBreadcrumb :title="title" :breadcrumbs="breadcrumbs" class="mb-0" />

      <div class="d-flex align-center gap-3">
        <slot name="actions">
          <v-btn
            v-if="showDownloadPdf"
            class="ui-download-pdf-btn"
            variant="flat"
            :loading="pdfLoading"
            @click="$emit('download-pdf')"
          >
            Download PDF
          </v-btn>

          <v-btn
            v-if="showExport"
            class="ui-export-btn"
            variant="outlined"
            :loading="exportLoading"
            @click="$emit('export')"
          >
            Export
            <template #append>
              <v-icon icon="mdi-export-variant" size="20" />
            </template>
          </v-btn>

          <v-btn
            v-if="addLabel"
            color="primary"
            variant="flat"
            class="ui-add-btn"
            prepend-icon="mdi-plus"
            @click="$emit('add')"
          >
            {{ addLabel }}
          </v-btn>
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ui-download-pdf-btn {
  min-height: 40px;
  min-width: 150px;
  padding-inline: 20px;
  border-radius: 10px;
  background: #4d2cbb;
  color: #fff;
  text-transform: none;
  letter-spacing: 0;
  font-weight: 500;
}

.ui-download-pdf-btn:hover {
  background: #432aa8;
}
</style>
