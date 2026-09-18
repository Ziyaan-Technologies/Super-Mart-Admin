import axios from 'axios';
import { toast } from 'vue3-toastify';

export function apiError(error: any, fallback = 'Something went wrong') {
    const message = error?.response?.data?.message;
    if (Array.isArray(message)) {
        return message.join('\n');
    }
    return message || error?.message || fallback;
}

export function notifyError(error: any, fallback?: string) {
    toast.error(apiError(error, fallback));
}

export async function uploadImage(folder: string, file: File | null | undefined) {
    if (!file) {
        return null;
    }
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`files/${folder}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.url as string;
}

export async function downloadExport(path: string, payload: any, fileName: string) {
    const response = await axios.post(path, payload, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}

export function formatDate(value?: string | Date | null) {
    if (!value) {
        return '—';
    }
    const date = new Date(value);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatNumber(value?: number | string | null, digits = 2) {
    const number = Number(value || 0);
    return number.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: digits });
}

export const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
];

export const sortOptions = ['Newest', 'Oldest'];
