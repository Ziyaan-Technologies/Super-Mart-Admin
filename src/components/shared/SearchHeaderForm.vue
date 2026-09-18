<template>
  <div ref="container" class="search-header">
    <div class="search-header__bar">
      <template v-for="filter in visibleFilters" :key="filter.key">
        <!-- Use DatePickerRange activator slot to replace the default dropdown button when Custom is selected -->
        <DatePickerRange 
          v-if="filter.key === 'dateRange' && filters[filter.key] === 'Custom'"
          @update:selectedDates="handleCustomDate" 
          @clear:dates="clearFilter('dateRange')" 
        >
          <template #activator="{ props }">
            <div class="search-header__filter" v-bind="props">
              <span class="search-header__icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </span>
              <span class="search-header__label">
                {{ filters.customStartDate && filters.customEndDate ? `${filters.customStartDate} - ${filters.customEndDate}` : 'Custom' }}
              </span>
              <span class="search-header__clear" @click.stop="clearFilter(filter.key)">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </span>
              <span class="search-header__chevron" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </div>
          </template>
        </DatePickerRange>
        
        <div v-else class="search-header__filter" @click="toggleDropdown(filter.key, $event)">
          <span class="search-header__icon" aria-hidden="true">
            <svg v-if="filter.icon === 'date'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <svg v-else-if="filter.icon === 'type'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 6h16M4 12h10M4 18h7" />
            </svg>
            <svg v-else-if="filter.icon === 'status'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            <svg v-else-if="filter.icon === 'store'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l1.5-4h15L21 9" />
              <path d="M4 9h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9z" />
              <path d="M9 21v-7h6v7" />
            </svg>
            <svg v-else-if="filter.icon === 'country'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <svg v-else-if="filter.icon === 'vendor'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <svg v-else-if="filter.icon === 'city'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <svg v-else-if="filter.icon === 'module'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <svg v-else-if="filter.icon === 'payment'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
          </span>

          <span class="search-header__label">{{ getFilterLabel(filter) }}</span>

          <span v-if="hasActiveValue(filter.key)" class="search-header__clear" @click.stop="clearFilter(filter.key)">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </span>

          <span class="search-header__chevron" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>

          <div
            v-if="openDropdown === filter.key"
            class="search-header__dropdown"
            :class="{ 'search-header__dropdown--right': filter.align === 'right' }"
            :style="getDropdownStyle(filter.key, filter.align)"
          >
            <div class="search-header__dropdown-search" @click.stop>
              <input
                :ref="(el) => setSearchInputRef(filter.key, el)"
                v-model="optionSearch[filter.key]"
                type="text"
                class="search-header__option-search-input"
                :placeholder="`Search ${filter.label.toLowerCase()}...`"
                @click.stop
                @keydown.space.stop
              />
              <span
                v-if="optionSearch[filter.key]"
                class="search-header__option-search-clear"
                @click.stop="optionSearch[filter.key] = ''"
              >
                ✕
              </span>
            </div>
            <div class="search-header__options-list">
              <button
                v-for="option in getFilteredOptions(filter.key)"
                :key="getOptionKey(option)"
                type="button"
                class="search-header__option"
                :class="{ 'search-header__option--active': isSelected(filter.key, option) }"
                @click.stop="selectFilter(filter.key, option)"
              >
                {{ getOptionLabel(option) }}
              </button>
              <div v-if="!getFilteredOptions(filter.key).length" class="search-header__empty">No options found</div>
            </div>
          </div>
        </div>
      </template>

      <div class="search-header__search">
        <input
          v-model="searchKey"
          type="text"
          class="search-header__search-input"
          :placeholder="searchText"
          @keyup.enter="emitSearch"
        />
        <button
          v-if="searchKey"
          type="button"
          class="search-header__search-clear"
          @click="clearSearch"
          aria-label="Clear search"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <button type="button" class="search-header__search-btn" @click="emitSearch" aria-label="Search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>

      <div v-if="showSort" class="search-header__filter search-header__filter--sort" @click="toggleDropdown('sortBy', $event)">
        <span class="search-header__label search-header__label--sort">Sort by: {{ getSelectedLabel('sortBy') }}</span>
        <span class="search-header__chevron" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>

        <div
          v-if="openDropdown === 'sortBy'"
          class="search-header__dropdown search-header__dropdown--right"
          :style="getDropdownStyle('sortBy', 'right')"
        >
          <div class="search-header__dropdown-search" @click.stop>
            <input
              :ref="(el) => setSearchInputRef('sortBy', el)"
              v-model="optionSearch['sortBy']"
              type="text"
              class="search-header__option-search-input"
              placeholder="Search sort..."
              @click.stop
              @keydown.space.stop
            />
            <span
              v-if="optionSearch['sortBy']"
              class="search-header__option-search-clear"
              @click.stop="optionSearch['sortBy'] = ''"
            >
              ✕
            </span>
          </div>
          <div class="search-header__options-list">
            <button
              v-for="option in getFilteredOptions('sortBy')"
              :key="getOptionKey(option)"
              type="button"
              class="search-header__option"
              :class="{ 'search-header__option--active': isSelected('sortBy', option) }"
              @click.stop="selectFilter('sortBy', option)"
            >
              {{ getOptionLabel(option) }}
            </button>
            <div v-if="!getFilteredOptions('sortBy').length" class="search-header__empty">No options found</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import DatePickerRange from './DatePickerRange.vue';

type PageContext = 'search' | 'orders' | 'quickeats-orders' | 'vendors' | 'clients' | 'client-stores' | 'categories' | 'products' | 'addons' | 'ingredients' | 'sizes' | 'area' | 'cities' | 'country' | 'users' | 'roles' | 'permissions' | 'admins' | 'delivery-rates' | 'order-statuses' | 'service-fees' | 'rider-tips' | 'store-timings' | 'clientstore-meta' | 'reports' | 'payment-methods' | 'payment-method-logs' | 'discounts' | 'push-logs' | 'topic-push-logs' | 'promotions' | 'promotions-filters' | 'brands' | 'clientstore-areas' | 'customer-feedbacks' | 'devices' | 'addresses' | 'driver' | 'drivers' | 'units' | 'vendor-catalog' | 'stock-overview';
type FilterKey = 'dateRange' | 'type' | 'status' | 'store' | 'area' | 'country' | 'vendor' | 'paymentMethod' | 'client' | 'business' | 'city' | 'module' | 'day' | 'admin' | 'category';

type OptionItem = string | number | Record<string, any>;

type FilterPayload = {
  dateRange: string | null;
  customStartDate?: string | null;
  customEndDate?: string | null;
  type: any;
  status: any;
  store: any;
  area: any;
  day: any;
  admin: any;
  country: any;
  vendor: any;
  paymentMethod: any;
  client: any;
  business: any;
  city: any;
  module: any;
  category: any;
  sortBy: any;
};

const props = withDefaults(defineProps<{
  pageContext?: PageContext;
  searchText?: string;
  initialDateRange?: string | null;
  dateRanges?: OptionItem[];
  typeOptions?: OptionItem[];
  statusOptions?: OptionItem[];
  storeOptions?: OptionItem[];
  areaOptions?: OptionItem[];
  dayOptions?: OptionItem[];
  adminOptions?: OptionItem[];
  countryOptions?: OptionItem[];
  vendorOptions?: OptionItem[];
  paymentMethodOptions?: OptionItem[];
  clientOptions?: OptionItem[];
  businessOptions?: OptionItem[];
  cityOptions?: OptionItem[];
  moduleOptions?: OptionItem[];
  categoryOptions?: OptionItem[];
  sortOptions?: OptionItem[];
}>(), {
  pageContext: 'search',
  searchText: 'Search',
  initialDateRange: null,
  dateRanges: () => ['Today', 'This Week', 'This Month', 'Last Month', 'Custom'],
  typeOptions: () => [],
  statusOptions: () => [],
  storeOptions: () => [],
  areaOptions: () => [],
  dayOptions: () => [],
  adminOptions: () => [],
  countryOptions: () => [],
  vendorOptions: () => [],
  paymentMethodOptions: () => [],
  clientOptions: () => [],
  businessOptions: () => [],
  cityOptions: () => [],
  moduleOptions: () => [],
  categoryOptions: () => [],
  sortOptions: () => [],
});

const emit = defineEmits<{
  (event: 'onSearch', value: string): void;
  (event: 'filterChange', value: FilterPayload): void;
}>();

const searchKey = ref('');
const openDropdown = ref<FilterKey | 'sortBy' | null>(null);
const dropdownPosition = ref({ top: 0, left: 0, right: 0 });
const container = ref<HTMLElement | null>(null);
const optionSearch = ref<Record<string, string>>({});
const searchInputRefs = ref<Record<string, HTMLInputElement | null>>({});

function setSearchInputRef(key: string, el: any) {
  if (el) {
    searchInputRefs.value[key] = el as HTMLInputElement;
  }
}

function getFilteredOptions(key: FilterKey | 'sortBy') {
  const options = key === 'sortBy' ? props.sortOptions : getOptions(key);
  const query = (optionSearch.value[key] || '').trim().toLowerCase();
  if (!query) return options;
  return options.filter((option) =>
    getOptionLabel(option).toLowerCase().includes(query)
  );
}

const filters = ref<FilterPayload>({
  dateRange: props.initialDateRange || null,
  customStartDate: null,
  customEndDate: null,
  type: null,
  status: null,
  store: null,
  area: null,
  day: null,
  admin: null,
  country: null,
  vendor: null,
  paymentMethod: null,
  client: null,
  business: null,
  city: null,
  module: null,
  category: null,
  sortBy: null,
});

const filterDefinitions = computed(() => {
  const definitions: Array<{
    key: FilterKey;
    label: string;
    icon: string;
    options: OptionItem[];
    align?: 'left' | 'right';
  }> = [];

  if (props.pageContext !== 'permissions' && props.pageContext !== 'store-timings' && props.pageContext !== 'discounts') {
    definitions.push({ key: 'dateRange', label: 'Date Range', icon: 'date', options: props.dateRanges });
  }

  if (props.pageContext === 'orders' || props.pageContext === 'quickeats-orders') {
    definitions.push({ key: 'type', label: 'All Types', icon: 'type', options: props.typeOptions });
    definitions.push({ key: 'status', label: 'All Statuses', icon: 'status', options: props.statusOptions });
    definitions.push({ key: 'store', label: 'All Stores', icon: 'store', options: props.storeOptions });
    definitions.push({ key: 'paymentMethod', label: 'Payment Method', icon: 'payment', options: props.paymentMethodOptions });
  }

  if (props.pageContext === 'vendors') {
    if (props.countryOptions && props.countryOptions.length > 0) {
      definitions.push({ key: 'country', label: 'All Countries', icon: 'country', options: props.countryOptions });
    }
    definitions.push({ key: 'status', label: 'All Status', icon: 'status', options: props.statusOptions });
  }

  if (props.pageContext === 'clients') {
    definitions.push({ key: 'vendor', label: 'All Clients', icon: 'vendor', options: props.vendorOptions });
    definitions.push({ key: 'store', label: 'All Stores', icon: 'store', options: props.storeOptions });
    definitions.push({ key: 'status', label: 'All Statuses', icon: 'status', options: props.statusOptions });
  }

  if (props.pageContext === 'client-stores') {
    definitions.push({ key: 'vendor', label: 'All Clients', icon: 'vendor', options: props.vendorOptions });
    definitions.push({ key: 'status', label: 'All Statuses', icon: 'status', options: props.statusOptions });
  }

  if (props.pageContext === 'categories') {
    definitions.push({ key: 'status', label: 'All Statuses', icon: 'status', options: props.statusOptions });
    definitions.push({ key: 'store', label: 'All Stores', icon: 'store', options: props.storeOptions });
  }

  if (props.pageContext === 'products') {
    definitions.push({ key: 'status', label: 'All Statuses', icon: 'status', options: props.statusOptions });
    definitions.push({ key: 'store', label: 'All Stores', icon: 'store', options: props.storeOptions });
    if (filters.value.store) {
      definitions.push({ key: 'category', label: 'All Categories', icon: 'module', options: props.categoryOptions || [] });
    }
  }

  if (props.pageContext === 'addons') {
    definitions.push({ key: 'store', label: 'All Stores', icon: 'store', options: props.storeOptions });
    definitions.push({ key: 'status', label: 'All Statuses', icon: 'status', options: props.statusOptions });
  }

  if (props.pageContext === 'ingredients') {
    definitions.push({ key: 'store', label: 'All Stores', icon: 'store', options: props.storeOptions });
    definitions.push({ key: 'status', label: 'All Statuses', icon: 'status', options: props.statusOptions });
  }

  if (props.pageContext === 'sizes') {
    definitions.push({ key: 'store', label: 'All Stores', icon: 'store', options: props.storeOptions });
    definitions.push({ key: 'status', label: 'All Statuses', icon: 'status', options: props.statusOptions });
  }

  if (props.pageContext === 'area') {
    definitions.push({ key: 'type', label: 'All Areas', icon: 'type', options: props.typeOptions });
    definitions.push({ key: 'city', label: 'All Cities', icon: 'city', options: props.cityOptions });
    definitions.push({ key: 'country', label: 'All Countries', icon: 'country', options: props.countryOptions });
    definitions.push({ key: 'status', label: 'All Statuses', icon: 'status', options: props.statusOptions });
  }

  if (props.pageContext === 'cities') {
    definitions.push({ key: 'type', label: 'All Cities', icon: 'city', options: props.typeOptions });
    definitions.push({ key: 'country', label: 'All Countries', icon: 'country', options: props.countryOptions });
    definitions.push({ key: 'status', label: 'All Statuses', icon: 'status', options: props.statusOptions });
  }

  if (props.pageContext === 'country') {
    definitions.push({ key: 'type', label: 'All Countries', icon: 'country', options: props.typeOptions });
    definitions.push({ key: 'status', label: 'All Statuses', icon: 'status', options: props.statusOptions });
  }

  if (props.pageContext === 'users') {
    definitions.push({ key: 'vendor', label: 'Vendors', icon: 'vendor', options: props.vendorOptions });
    definitions.push({ key: 'status', label: 'All Statuses', icon: 'status', options: props.statusOptions });
  }

  if (props.pageContext === 'roles') {
    definitions.push({ key: 'type', label: 'All Types', icon: 'type', options: props.typeOptions });
    definitions.push({ key: 'vendor', label: 'All Clients', icon: 'vendor', options: props.vendorOptions });
  }

  if (props.pageContext === 'units') {
    definitions.push({ key: 'type', label: 'All Types', icon: 'type', options: props.typeOptions });
    definitions.push({ key: 'status', label: 'All Statuses', icon: 'status', options: props.statusOptions });
  }

  if (props.pageContext === 'vendor-catalog') {
    definitions.push({ key: 'vendor', label: 'All Clients', icon: 'vendor', options: props.vendorOptions });
    definitions.push({ key: 'status', label: 'All Statuses', icon: 'status', options: props.statusOptions });
  }

  if (props.pageContext === 'stock-overview') {
    definitions.push({ key: 'vendor', label: 'All Clients', icon: 'vendor', options: props.vendorOptions });
    definitions.push({ key: 'store', label: 'All Stores', icon: 'store', options: props.storeOptions });
    definitions.push({ key: 'type', label: 'All Stock', icon: 'status', options: props.typeOptions });
  }

  if (props.pageContext === 'permissions') {
    definitions.push({ key: 'module', label: 'All Modules', icon: 'module', options: props.moduleOptions });
    definitions.push({ key: 'type', label: 'All Types', icon: 'type', options: props.typeOptions });
  }

  if (props.pageContext === 'admins') {
    definitions.push({ key: 'status', label: 'All Statuses', icon: 'status', options: props.statusOptions });
  }

  if (props.pageContext === 'payment-methods') {
    if (props.countryOptions && props.countryOptions.length > 0) {
      definitions.push({ key: 'country', label: 'All Countries', icon: 'country', options: props.countryOptions });
    }
    if (props.statusOptions && props.statusOptions.length > 0) {
      definitions.push({ key: 'status', label: 'All Statuses', icon: 'status', options: props.statusOptions });
    }
  }

  if (props.pageContext === 'payment-method-logs') {
    if (props.countryOptions && props.countryOptions.length > 0) {
      definitions.push({ key: 'country', label: 'All Countries', icon: 'country', options: props.countryOptions });
    }
  }

  if (props.pageContext === 'delivery-rates' || props.pageContext === 'service-fees' || props.pageContext === 'rider-tips') {
    definitions.push({ key: 'store', label: 'All Stores', icon: 'store', options: props.storeOptions });
  }

  if (props.pageContext === 'store-timings') {
    definitions.push({ key: 'store', label: 'All Stores', icon: 'store', options: props.storeOptions });
  }

  if (props.pageContext === 'clientstore-meta') {
    definitions.push({ key: 'store', label: 'All Stores', icon: 'store', options: props.storeOptions });
  }

  if (props.pageContext === 'discounts') {
    definitions.push({ key: 'store', label: 'All Stores', icon: 'store', options: props.storeOptions });
  }

  if (props.pageContext === 'reports') {
    definitions.push({ key: 'admin', label: 'Admins', icon: 'vendor', options: props.adminOptions });
    definitions.push({ key: 'status', label: 'All Statuses', icon: 'status', options: props.statusOptions });
  }

  if (props.pageContext === 'push-logs') {
    definitions.push({ key: 'vendor', label: 'All Clients', icon: 'vendor', options: props.vendorOptions });
    definitions.push({ key: 'store', label: 'All Stores', icon: 'store', options: props.storeOptions });
    definitions.push({ key: 'status', label: 'All Statuses', icon: 'status', options: props.statusOptions });
  }

  if (props.pageContext === 'topic-push-logs') {
    definitions.push({ key: 'vendor', label: 'All Clients', icon: 'vendor', options: props.vendorOptions });
    definitions.push({ key: 'status', label: 'All Statuses', icon: 'status', options: props.statusOptions });
  }

  if (props.pageContext === 'order-statuses') {
    // Intentionally empty or remove if no filters are needed
  }

  if (props.pageContext === 'promotions-filters') {
    definitions.push({ key: 'status', label: 'All Statuses', icon: 'status', options: props.statusOptions });
    definitions.push({ key: 'store', label: 'All Stores', icon: 'store', options: props.storeOptions });
  }

  if (['brands', 'customer-feedbacks', 'drivers', 'devices', 'addresses'].includes(props.pageContext)) {
    definitions.push({ key: 'store', label: 'All Stores', icon: 'store', options: props.storeOptions });
  }

  if (props.pageContext === 'addresses') {
    definitions.push({ key: 'city', label: 'All Cities', icon: 'city', options: props.cityOptions });
  }

  if (props.pageContext === 'clientstore-areas') {
    definitions.push({ key: 'store', label: 'All Stores', icon: 'store', options: props.storeOptions });
  }

  return definitions;
});

const visibleFilters = computed(() => filterDefinitions.value.filter((definition) => definition.options.length > 0));
const showSort = computed(() => ['orders', 'quickeats-orders', 'vendors', 'clients', 'client-stores', 'categories', 'products', 'addons', 'ingredients', 'sizes', 'area', 'cities', 'country', 'users', 'roles', 'admins', 'delivery-rates', 'order-statuses', 'service-fees', 'rider-tips', 'reports', 'payment-methods', 'payment-method-logs', 'clientstore-meta', 'push-logs', 'topic-push-logs', 'promotions-filters', 'brands', 'clientstore-areas', 'customer-feedbacks', 'devices', 'addresses', 'driver', 'drivers', 'units', 'vendor-catalog', 'stock-overview'].includes(props.pageContext));

watch(
  () => props.sortOptions,
  (options) => {
    if (!filters.value.sortBy && options.length) {
      filters.value.sortBy = getOptionValue(options[0]);
    }
  },
  { immediate: true }
);

function resolvePayload(f: FilterPayload) {
  let startDate: string | null = null;
  let endDate: string | null = null;
  let computedDateRange = f.dateRange;

  if (f.dateRange) {
    const today = new Date();
    const fmt = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    if (f.dateRange === 'Today') {
      startDate = fmt(today);
      endDate = fmt(today);
      computedDateRange = `${startDate} - ${endDate}`;
    } else if (f.dateRange === 'This Week' || f.dateRange === 'This week') {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      startDate = fmt(startOfWeek);
      endDate = fmt(today);
      computedDateRange = `${startDate} - ${endDate}`;
    } else if (f.dateRange === 'This Month' || f.dateRange === 'This month') {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      startDate = fmt(startOfMonth);
      endDate = fmt(today);
      computedDateRange = `${startDate} - ${endDate}`;
    } else if (f.dateRange === 'Last Month' || f.dateRange === 'Last month') {
      const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      startDate = fmt(startOfLastMonth);
      endDate = fmt(endOfLastMonth);
      computedDateRange = `${startDate} - ${endDate}`;
    } else if (f.dateRange === 'This Year' || f.dateRange === 'This year') {
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      startDate = fmt(startOfYear);
      endDate = fmt(today);
      computedDateRange = `${startDate} - ${endDate}`;
    } else if (f.dateRange === 'Custom') {
      if (f.customStartDate && f.customEndDate) {
        startDate = f.customStartDate;
        endDate = f.customEndDate;
        computedDateRange = `${startDate} - ${endDate}`;
      } else {
        startDate = null;
        endDate = null;
      }
    } else if (f.dateRange.includes(' - ')) {
      const dates = f.dateRange.split(' - ');
      startDate = dates[0];
      endDate = dates[1];
    }
  }

  return {
    ...f,
    dateRange: computedDateRange,
    selectedDateRange: f.dateRange,
    startDate,
    endDate
  };
}

watch(
  filters,
  () => {
    emit('filterChange', resolvePayload(filters.value) as any);
  },
  { deep: true }
);

onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick);
});

function getOptionLabel(option: OptionItem) {
  if (option === null || option === undefined) return '';
  if (typeof option === 'string' || typeof option === 'number') return String(option);
  return String(
    option.label ??
      option.name ??
      option.store_name ??
      option.vendor_name ??
      option.bussiness_name ??
      option.title ??
      option.text ??
      option.value ??
      option.id ??
      ''
  );
}

function getOptionValue(option: OptionItem) {
  if (option === null || option === undefined) return null;
  if (typeof option === 'string' || typeof option === 'number') return option;
  return option.value ?? option.id ?? option.name ?? option.store_name ?? option.vendor_name ?? option.label ?? option.text ?? null;
}

function getOptionKey(option: OptionItem) {
  const value = getOptionValue(option);
  return value === null ? getOptionLabel(option) : String(value);
}

function getOptions(key: FilterKey) {
  const map: Record<FilterKey, OptionItem[]> = {
    dateRange: props.dateRanges,
    type: props.typeOptions,
    status: props.statusOptions,
    store: props.storeOptions,
    area: props.areaOptions,
    day: props.dayOptions,
    admin: props.adminOptions,
    country: props.countryOptions,
    vendor: props.vendorOptions,
    paymentMethod: props.paymentMethodOptions,
    client: props.clientOptions,
    business: props.businessOptions,
    city: props.cityOptions,
    module: props.moduleOptions,
    category: props.categoryOptions,
  };

  return map[key] ?? [];
}

function getSelectedLabel(key: FilterKey | 'sortBy') {
  const value = key === 'sortBy' ? filters.value.sortBy : filters.value[key];
  if (value === null || value === undefined || value === '') return '';

  const options = key === 'sortBy' ? props.sortOptions : getOptions(key);
  const match = options.find((option) => getOptionValue(option) === value);
  return match ? getOptionLabel(match) : String(value);
}

function getFilterLabel(filter: { key: FilterKey; label: string }) {
  const selected = getSelectedLabel(filter.key);
  return selected || filter.label;
}

function hasActiveValue(key: FilterKey) {
  const value = filters.value[key];
  return value !== null && value !== undefined && value !== '';
}

function isSelected(key: FilterKey | 'sortBy', option: OptionItem) {
  const value = key === 'sortBy' ? filters.value.sortBy : filters.value[key];
  return value === getOptionValue(option);
}

function getDropdownStyle(key: FilterKey | 'sortBy', align?: 'left' | 'right') {
  const position = dropdownPosition.value;
  if (align === 'right' || key === 'sortBy') {
    return { top: `${position.top}px`, right: `${position.right}px` };
  }

  return { top: `${position.top}px`, left: `${position.left}px` };
}

function toggleDropdown(key: FilterKey | 'sortBy', event: MouseEvent) {
  const isOpening = openDropdown.value !== key;
  openDropdown.value = isOpening ? key : null;

  if (isOpening) {
    optionSearch.value[key] = '';
    if (event.currentTarget instanceof HTMLElement) {
      const rect = event.currentTarget.getBoundingClientRect();
      dropdownPosition.value = {
        top: rect.bottom + 6,
        left: rect.left,
        right: Math.max(window.innerWidth - rect.right, 0),
      };
    }
    nextTick(() => {
      const inputEl = searchInputRefs.value[key];
      if (inputEl) {
        inputEl.focus();
      }
    });
  }
}

function selectFilter(key: FilterKey | 'sortBy', option: OptionItem) {
  if (key === 'sortBy') {
    filters.value.sortBy = getOptionValue(option);
  } else {
    filters.value[key] = getOptionValue(option);
    if (key === 'vendor') {
      filters.value.store = null;
    }
    if (key === 'store') {
      filters.value.category = null;
    }
    if (key === 'dateRange') {
      filters.value.customStartDate = null;
      filters.value.customEndDate = null;
    }
  }
  optionSearch.value[key] = '';
  openDropdown.value = null;
}

function clearFilter(key: FilterKey) {
  filters.value[key] = null;
  if (key === 'dateRange') {
    filters.value.customStartDate = null;
    filters.value.customEndDate = null;
  }
  optionSearch.value[key] = '';
  openDropdown.value = null;
}

function emitSearch() {
  emit('onSearch', searchKey.value.trim());
}

function clearSearch() {
  searchKey.value = '';
  emit('onSearch', '');
}

function handleOutsideClick(event: MouseEvent) {
  const target = event.target as Node | null;
  if (container.value && target && !container.value.contains(target)) {
    openDropdown.value = null;
  }
}

function handleCustomDate(dates: { startDate: string; endDate: string }) {
  filters.value.customStartDate = dates.startDate;
  filters.value.customEndDate = dates.endDate;
}
</script>

<style scoped lang="scss">
.search-header {
  background: #ffffff;
  border-radius: 10px;
  padding: 10px 0px;
  box-shadow: 0 1px 4px rgba(16, 24, 40, 0.06);
}

.search-header__bar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
  position: relative;
}

.search-header__filter {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 12px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  flex-shrink: 0;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.search-header__filter:hover {
  background: #fafafa;
  border-color: #c8c8c8;
}

.search-header__filter--sort {
  min-width: 130px;
}

.search-header__icon,
.search-header__chevron,
.search-header__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #667085;
  flex-shrink: 0;
}

.search-header__label {
  font-size: 13px;
  line-height: 1;
  color: #344054;
}

.search-header__label--sort {
  font-weight: 500;
}

.search-header__clear {
  color: #98a2b3;
}

.search-header__clear:hover {
  color: #475467;
}

.search-header__search {
  position: relative;
  flex: 1 1 auto;
  max-width: 276px;
  margin-left: auto;
}

.search-header__search-input {
  width: 100%;
  height: 38px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background: #fff;
  padding: 0 64px 0 12px;
  outline: none;
  font-size: 13px;
  color: #101828;
  transition: border-color 0.15s ease;
}

.search-header__search-input::placeholder {
  color: #98a2b3;
}

.search-header__search-input:focus {
  border-color: #98a2b3;
}

.search-header__search-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  color: #98a2b3;
  cursor: pointer;
  padding: 0;
}

.search-header__search-btn:hover {
  color: #344054;
}

.search-header__search-clear {
  position: absolute;
  right: 36px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  color: #98a2b3;
  cursor: pointer;
  padding: 0;
}

.search-header__search-clear:hover {
  color: #344054;
}

.search-header__dropdown {
  position: fixed;
  min-width: 180px;
  background: #fff;
  border: 1px solid #e4e7ec;
  border-radius: 10px;
  box-shadow: 0 10px 24px rgba(16, 24, 40, 0.12);
  z-index: 9999;
  max-height: 320px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.search-header__dropdown-search {
  position: relative;
  padding: 8px;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.search-header__option-search-input {
  width: 100%;
  height: 32px;
  border: 1px solid #d0d5dd;
  border-radius: 6px;
  padding: 0 24px 0 10px;
  font-size: 12px;
  color: #101828;
  outline: none;
  background: #fafafa;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.search-header__option-search-input:focus {
  border-color: #512da8;
  background: #ffffff;
}

.search-header__option-search-clear {
  position: absolute;
  right: 16px;
  cursor: pointer;
  color: #98a2b3;
  font-size: 12px;
  line-height: 1;
}

.search-header__option-search-clear:hover {
  color: #344054;
}

.search-header__options-list {
  max-height: 240px;
  overflow-y: auto;
}

.search-header__dropdown--right {
  min-width: 160px;
}

.search-header__option {
  width: 100%;
  display: block;
  text-align: left;
  border: 0;
  background: transparent;
  padding: 10px 14px;
  font-size: 13px;
  color: #344054;
  cursor: pointer;
  transition: background-color 0.12s ease, color 0.12s ease;
}

.search-header__option:hover {
  background: #f9fafb;
}

.search-header__option--active {
  background: #f2f4f7;
  color: #101828;
  font-weight: 500;
}

.search-header__empty {
  padding: 10px 14px;
  font-size: 13px;
  color: #98a2b3;
}

@media (max-width: 960px) {
  .search-header__bar {
    flex-wrap: wrap;
  }

  .search-header__search {
    min-width: 100%;
    order: 99;
  }
}
</style>
