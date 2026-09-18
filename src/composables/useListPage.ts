import { computed, onMounted, ref, watch } from 'vue';
import axios from 'axios';
import { toast } from 'vue3-toastify';
import { downloadExport, notifyError } from '@/utils/api';

interface ListPageOptions {
    filters?: (filters: Record<string, any>) => Record<string, any>;
    kpis?: boolean;
    exportName?: string;
    listPath?: string;
    immediate?: boolean;
}

export function useListPage(resource: string, options: ListPageOptions = {}) {
    const items = ref<any[]>([]);
    const kpis = ref<Record<string, any>>({});
    const loading = ref(false);
    const kpiLoading = ref(false);
    const exportingExcel = ref(false);
    const exportingPdf = ref(false);
    const totalItems = ref(0);
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const search = ref('');
    const filters = ref<Record<string, any>>({});

    const pageCount = computed(() => Math.max(1, Math.ceil(totalItems.value / itemsPerPage.value)));

    const payload = () => ({
        page: currentPage.value,
        take: itemsPerPage.value,
        search: search.value || undefined,
        sortBy: filters.value.sortBy || 'Newest',
        status: filters.value.status || undefined,
        startDate: filters.value.startDate || undefined,
        endDate: filters.value.endDate || undefined,
        ...(options.filters ? options.filters(filters.value) : {}),
    });

    async function fetchData() {
        loading.value = true;
        try {
            const response = await axios.post(options.listPath || `${resource}/v1/list`, payload());
            items.value = response.data.data;
            totalItems.value = response.data.meta?.total || 0;
        } catch (error) {
            notifyError(error, 'Failed to load data');
        } finally {
            loading.value = false;
        }
    }

    async function fetchKpis() {
        if (options.kpis === false) {
            return;
        }
        kpiLoading.value = true;
        try {
            const response = await axios.post(`${resource}/v1/kpis`, payload());
            kpis.value = response.data;
        } catch (error) {
            console.error('Failed to load KPIs', error);
        } finally {
            kpiLoading.value = false;
        }
    }

    function refresh() {
        fetchData();
        fetchKpis();
    }

    function resetToFirstPage() {
        if (currentPage.value === 1) {
            refresh();
        } else {
            currentPage.value = 1;
            fetchKpis();
        }
    }

    function onSearch(key: string) {
        search.value = key;
        resetToFirstPage();
    }

    function onFilterChange(value: Record<string, any>) {
        filters.value = value || {};
        resetToFirstPage();
    }

    async function exportFile(format: 'excel' | 'pdf') {
        const flag = format === 'excel' ? exportingExcel : exportingPdf;
        const name = options.exportName || resource;
        flag.value = true;
        try {
            await downloadExport(`${resource}/export/${format}`, { ...payload(), page: 1 }, `${name}.${format === 'excel' ? 'xlsx' : 'pdf'}`);
            toast.success(`${format === 'excel' ? 'Excel' : 'PDF'} exported successfully`);
        } catch (error) {
            notifyError(error, 'Export failed');
        } finally {
            flag.value = false;
        }
    }

    watch([currentPage, itemsPerPage], () => fetchData());

    if (options.immediate !== false) {
        onMounted(refresh);
    }

    return {
        items,
        kpis,
        loading,
        kpiLoading,
        exportingExcel,
        exportingPdf,
        totalItems,
        currentPage,
        itemsPerPage,
        pageCount,
        search,
        filters,
        payload,
        fetchData,
        fetchKpis,
        refresh,
        onSearch,
        onFilterChange,
        exportFile,
    };
}
