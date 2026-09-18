<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { toast } from 'vue3-toastify';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import UiPageHeader from '@/components/shared/UiPageHeader.vue';
import UiTextfieldPrimary from '@/components/shared/UiTextfieldPrimary.vue';
import { useAuthStore } from '@/stores/auth';
import { notifyError } from '@/utils/api';

const authStore = useAuthStore();
const breadcrumbs = [
  { text: 'Dashboard', disabled: false, href: '/dashboard/analytical' },
  { text: 'Update Password', disabled: true, href: '#' },
];
const form = ref({ current_password: '', new_password: '', confirm_password: '' });
const errors = ref<Record<string, string>>({});
const saving = ref(false);

async function save() {
  const next: Record<string, string> = {};
  if (!form.value.current_password) next.current_password = 'Current password is required';
  if (form.value.new_password.length < 6) next.new_password = 'At least 6 characters';
  if (form.value.new_password !== form.value.confirm_password) next.confirm_password = 'Passwords do not match';
  errors.value = next;
  if (Object.keys(next).length) return;
  saving.value = true;
  try {
    const response = await axios.put('auth/me/password', {
      current_password: form.value.current_password,
      new_password: form.value.new_password,
    });
    authStore.setUser({ ...authStore.user, token: response.data.token });
    form.value = { current_password: '', new_password: '', confirm_password: '' };
    toast.success('Password updated. Other sessions have been signed out.');
  } catch (error) {
    notifyError(error);
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <UiPageHeader title="Update Password" :breadcrumbs="breadcrumbs" :show-export="false" />
  <UiParentCard title="Change Password">
    <div class="pa-6" style="max-width: 520px">
      <UiTextfieldPrimary class="mb-4" title="Current Password" type="password" v-model="form.current_password" :error="!!errors.current_password" :errorMessage="errors.current_password" />
      <UiTextfieldPrimary class="mb-4" title="New Password" type="password" v-model="form.new_password" :error="!!errors.new_password" :errorMessage="errors.new_password" />
      <UiTextfieldPrimary class="mb-6" title="Confirm New Password" type="password" v-model="form.confirm_password" :error="!!errors.confirm_password" :errorMessage="errors.confirm_password" />
      <v-btn color="primary" :loading="saving" @click="save">Update Password</v-btn>
    </div>
  </UiParentCard>
</template>
