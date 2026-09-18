<script setup lang="ts">
import { ref, watch } from 'vue';
import axios from 'axios';
import { toast } from 'vue3-toastify';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import UiPageHeader from '@/components/shared/UiPageHeader.vue';
import UiTextfieldPrimary from '@/components/shared/UiTextfieldPrimary.vue';
import UiImagePicker from '@/components/shared/UiImagePicker.vue';
import { useAuthStore } from '@/stores/auth';
import { notifyError, uploadImage } from '@/utils/api';

const authStore = useAuthStore();
const breadcrumbs = [
  { text: 'Dashboard', disabled: false, href: '/dashboard/analytical' },
  { text: 'My Profile', disabled: true, href: '#' },
];
const form = ref({ full_name: '', phone: '', image_url: '' });
const imageFile = ref<File | null>(null);
const saving = ref(false);

watch(() => authStore.user, (user) => {
  form.value = { full_name: user?.full_name || '', phone: user?.phone || '', image_url: user?.image_url || '' };
}, { immediate: true });

async function save() {
  if (!form.value.full_name.trim() || !form.value.phone.trim()) {
    toast.error('Name and phone are required');
    return;
  }
  saving.value = true;
  try {
    const image = await uploadImage('admin', imageFile.value);
    const response = await axios.put('auth/me/profile', { ...form.value, image_url: image || form.value.image_url || undefined });
    authStore.setUser({ ...response.data, token: authStore.user.token });
    imageFile.value = null;
    toast.success('Profile updated');
  } catch (error) {
    notifyError(error);
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <UiPageHeader title="My Profile" :breadcrumbs="breadcrumbs" :show-export="false" />
  <UiParentCard title="Account Details">
    <div class="pa-6">
      <div class="form-grid mb-6">
        <UiTextfieldPrimary title="Full Name" v-model="form.full_name" />
        <UiTextfieldPrimary title="Phone" v-model="form.phone" />
        <UiTextfieldPrimary title="Email" :model-value="authStore.user?.email" disabled />
        <UiTextfieldPrimary title="Role" :model-value="authStore.user?.role?.name" disabled />
        <UiImagePicker v-model="imageFile" label="Photo" placeholder="Choose Photo" :existing-image-url="form.image_url" />
      </div>
      <div class="d-flex justify-end">
        <v-btn color="primary" :loading="saving" @click="save">Save Changes</v-btn>
      </div>
    </div>
  </UiParentCard>
</template>
