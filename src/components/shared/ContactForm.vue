<script setup lang="ts">
import { ref } from 'vue';
import UiTextfieldPrimary from '@/components/shared/UiTextfieldPrimary.vue';

const emit = defineEmits(['close']);

const formData = ref({
  supportEmail: 'Vendors@email.com',
  supportContact: '+92 333 3434343',
  stripeKeyHash: '',
  stripeApiKey: '',
  firebaseApiKey: '',
  firebaseJson: '',
  googleApiKey: '',
  xApiKey: '',
  facebookApiKey: '',
  facebookPageUrl: '',
  instagramPageUrl: '',
  xPageUrl: '',
  androidAppUrl: '',
  appleAppUrl: '',
  websiteUrl: '',
  appVersion: '',
  updated: '08/05/2026  09:30 PM',
});
</script>

<template>
  <div class="cf-card">
    <!-- Header -->
    <div class="cf-header">
      <span class="cf-title">Contact</span>
      <button class="cf-close" @click="emit('close')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <!-- Body -->
    <div class="cf-body">

      <!-- Read-only support fields -->
      <div class="cf-support-row">
        <div class="cf-readonly-block">
          <span class="cf-readonly-label">Support Email</span>
          <span class="cf-readonly-value">{{ formData.supportEmail }}</span>
        </div>
        <div class="cf-readonly-block">
          <span class="cf-readonly-label">Support Contact</span>
          <span class="cf-readonly-value">{{ formData.supportContact }}</span>
        </div>
      </div>

      <!-- Input grid: 3 columns -->
      <div class="cf-grid">
        <UiTextfieldPrimary title="Stripe key hash"     v-model="formData.stripeKeyHash" />
        <UiTextfieldPrimary title="Stripe API key"      v-model="formData.stripeApiKey" />
        <UiTextfieldPrimary title="Firebase API key"    v-model="formData.firebaseApiKey" />
        <UiTextfieldPrimary title="Firebase Json"       v-model="formData.firebaseJson" />
        <UiTextfieldPrimary title="Google API Key"      v-model="formData.googleApiKey" />
        <UiTextfieldPrimary title="X API Key"           v-model="formData.xApiKey" />
        <UiTextfieldPrimary title="Facebook API Key"    v-model="formData.facebookApiKey" />
        <UiTextfieldPrimary title="Facebook page URL"   v-model="formData.facebookPageUrl" />
        <UiTextfieldPrimary title="Instagram URL Page"  v-model="formData.instagramPageUrl" />
        <UiTextfieldPrimary title="X Page URL"          v-model="formData.xPageUrl" />
        <UiTextfieldPrimary title="Android App URL"     v-model="formData.androidAppUrl" />
        <UiTextfieldPrimary title="Apple App URL"       v-model="formData.appleAppUrl" />

        <!-- Row 5: Website URL | App Version | Updated -->
        <UiTextfieldPrimary title="Website URL"  v-model="formData.websiteUrl" />
        <UiTextfieldPrimary title="App Version"  v-model="formData.appVersion" />

        <!-- Updated block occupies the 3rd slot -->
        <div class="cf-updated-block">
          <span class="cf-updated-label">Updated</span>
          <span class="cf-updated-value">{{ formData.updated }}</span>
        </div>
      </div>

    </div>
  </div>
</template>