<script setup lang="ts">
import { ref, defineEmits, watch, nextTick, computed, onMounted } from "vue";
import moment from 'moment-timezone';

const emit = defineEmits(["update:selectedDates", "clear:dates"]);
const menu = ref<boolean>(false);

onMounted(() => {
  menu.value = true;
});

const today = moment().tz('Asia/Karachi').format('YYYY-MM-DD');

const selectedRange = ref<[string] | [string, string] | []>([]);
const now = new Date();

// const pickerKey = ref(Date.now());
const pickerKey = ref(today);

const formatDate = (value: string | Date) => {
  if (value instanceof Date) {
    const yyyy = value.getFullYear();
    const mm = String(value.getMonth() + 1).padStart(2, "0");
    const dd = String(value.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  return value;
};

const formattedRange = computed(() => {
  if (selectedRange.value.length === 1) {
    return `${formatDate(selectedRange.value[0])} -`;
  } else if (selectedRange.value.length === 2) {
    return `${formatDate(selectedRange.value[0])} - ${formatDate(selectedRange.value[1])}`;
  }
  return '';
});


watch(selectedRange, (range) => {
  if (!Array.isArray(range)) return;

  if (range.length >= 2) {
    const sorted = [...range].map(r => new Date(r)).sort((a, b) => a.getTime() - b.getTime());
    const startDate = sorted[0];
    const endDate = sorted[sorted.length - 1];

    emit("update:selectedDates", {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    });

    // Populate all dates in between so they are highlighted in blue
    const allDates: Date[] = [];
    let curr = new Date(startDate);
    while (curr <= endDate) {
      allDates.push(new Date(curr));
      curr.setDate(curr.getDate() + 1);
    }

    if (range.length !== allDates.length) {
      setTimeout(() => {
        selectedRange.value = allDates as any;
      }, 50);
    }
  } else if (range.length === 1) {
    emit("update:selectedDates", {
      startDate: formatDate(range[0]),
      endDate: "",
    });
  } else {
    emit("update:selectedDates", { startDate: "", endDate: "" });
  }
});

const clearDates = () => {
  selectedRange.value = [];
  emit("update:selectedDates", { startDate: "", endDate: "" });
  emit("clear:dates");
};
</script>

<template>
  <v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="290px">
    <template v-slot:activator="{ props }">
      <slot name="activator" :props="props">
        <v-text-field v-bind="props" prepend-inner-icon="mdi-calendar" append-inner-icon="mdi-chevron-down" readonly
          :model-value="formattedRange" placeholder="Select date range" variant="outlined" @click:clear="clearDates"
          class="custom-text-field hide-details" clearable />
      </slot>
    </template>

    <v-card>
      <v-date-picker v-model="selectedRange" :key="pickerKey" color="primary" :max="today" multiple range
        title="Select Date Range" />
    </v-card>
  </v-menu>
</template>

<style scoped>
.custom-text-field {
  padding-top: 18px;
}

.custom-text-field .v-field__input {
  padding-bottom: 0 !important;
}
</style>
