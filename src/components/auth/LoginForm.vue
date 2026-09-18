<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { Form } from 'vee-validate';

const valid = ref(false);
const password = ref('');
const username = ref('');
const showPassword = ref(false);

const passwordRules = ref([
    (v: string) => !!v || 'Password is required'
]);
const emailRules = ref([(v: string) => !!v || 'E-mail is required', (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid']);

function validate(values: any, { setErrors }: any) {
    const authStore = useAuthStore();
    return authStore.login(username.value.trim(), password.value)
                    .catch((error) => {
                        const errorMessage = error?.response?.data?.message || error.message || 'An unexpected error occurred. Please try again.';
                        setErrors({ apiError: errorMessage });
                    });
}
</script>

<template>
    <Form @submit="validate" v-slot="{ errors, isSubmitting }" class="premium-form mt-8">
        
        <div class="input-group mb-6">
            <v-label class="text-subtitle-2 font-weight-bold pb-2 text-textPrimary font-inter">Work Email</v-label>
            <VTextField
                v-model="username"
                :rules="emailRules"
                required
                hide-details="auto"
                variant="solo"
                elevation="0"
                bg-color="#f8f9fa"
                class="luxury-input"
                placeholder="name@company.com"
            ></VTextField>
        </div>
        
        <div class="input-group mb-8">
            <v-label class="text-subtitle-2 font-weight-bold pb-2 text-textPrimary font-inter">Password</v-label>
            <VTextField
                v-model="password"
                :rules="passwordRules"
                required
                hide-details="auto"
                :type="showPassword ? 'text' : 'password'"
                variant="solo"
                elevation="0"
                bg-color="#f8f9fa"
                class="luxury-input"
                placeholder="••••••••"
            >
                <template v-slot:append-inner>
                    <v-icon 
                        :icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" 
                        color="grey-darken-1"
                        @click="showPassword = !showPassword"
                        class="cursor-pointer icon-hover"
                        size="20"
                    ></v-icon>
                </template>
            </VTextField>
        </div>
        
        <v-btn
            :loading="isSubmitting"
            :disabled="valid"
            block
            type="submit"
            class="luxury-btn text-none font-weight-bold text-subtitle-1 mb-6"
            height="56"
        >
            Sign In
        </v-btn>

        <div class="d-flex align-center justify-center gap-2 text-caption text-medium-emphasis mt-2">
            <v-icon size="14" color="success">mdi-shield-check</v-icon>
            <span class="font-weight-medium">Secure enterprise authentication</span>
        </div>
        
        <div v-if="errors.apiError" class="mt-6 animate-fade-in">
            <v-alert color="error" variant="tonal" rounded="lg" class="text-body-2 font-weight-medium">
                {{ errors.apiError }}
            </v-alert>
        </div>
    </Form>
</template>

<style scoped lang="scss">
.font-inter {
    font-family: 'Inter', 'Plus Jakarta Sans', sans-serif !important;
}

.luxury-input {
    :deep(.v-field) {
        border-radius: 16px !important;
        box-shadow: inset 0 0 0 1px transparent !important;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        height: 56px;
        display: flex;
        align-items: center;
    }
    
    :deep(.v-field__input) {
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        min-height: auto !important;
        font-family: 'Inter', sans-serif;
        color: #1a1a1a;
    }

    :deep(.v-field:hover) {
        background-color: #f1f3f5 !important;
    }

    :deep(.v-field--active) {
        background-color: #ffffff !important;
        box-shadow: inset 0 0 0 2px #5B3DBD !important;
    }
}

.icon-hover {
    transition: color 0.2s ease;
    &:hover {
        color: #5B3DBD !important;
    }
}

.luxury-btn {
    border-radius: 16px !important;
    background: linear-gradient(135deg, #5B3DBD 0%, #7C5AF5 100%) !important;
    color: #ffffff !important;
    box-shadow: 0 8px 24px rgba(91, 61, 189, 0.25) !important;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
    letter-spacing: 0px !important;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 32px rgba(91, 61, 189, 0.35) !important;
    }

    &:active {
        transform: translateY(0);
        box-shadow: 0 4px 12px rgba(91, 61, 189, 0.2) !important;
    }
}

.animate-fade-in {
    opacity: 0;
    animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
    to { opacity: 1; }
}
</style>
