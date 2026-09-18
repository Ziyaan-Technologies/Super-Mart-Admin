import { ref } from 'vue';
import axios from 'axios';

export const toOptions = (list: any[], label = 'name', value = 'id') =>
    (list || []).map((item) => ({ label: item[label], value: item[value] }));

export function useLookups() {
    const vendors = ref<any[]>([]);
    const stores = ref<any[]>([]);
    const countries = ref<any[]>([]);
    const cities = ref<any[]>([]);
    const areas = ref<any[]>([]);
    const units = ref<any[]>([]);

    async function loadVendors() {
        vendors.value = (await axios.get('vendors/list')).data;
    }

    async function loadStores(vendorId?: number | null) {
        stores.value = (await axios.get('clientstores/list', { params: { vendor_id: vendorId || undefined } })).data;
    }

    async function loadCountries() {
        countries.value = (await axios.get('countries/list')).data;
    }

    async function loadCities(countryId?: number | null) {
        cities.value = (await axios.get('cities/list', { params: { country_id: countryId || undefined } })).data;
    }

    async function loadAreas(cityId?: number | null) {
        areas.value = cityId ? (await axios.get('areas/list', { params: { city_id: cityId } })).data : [];
    }

    async function loadUnits() {
        units.value = (await axios.get('units/list')).data;
    }

    return {
        vendors,
        stores,
        countries,
        cities,
        areas,
        units,
        loadVendors,
        loadStores,
        loadCountries,
        loadCities,
        loadAreas,
        loadUnits,
    };
}
