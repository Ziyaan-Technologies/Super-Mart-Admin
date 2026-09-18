<script setup>
import { ref, defineProps, defineEmits } from "vue";

const searchQuery = ref("");
const serviceType = ref("");

const emit = defineEmits();

const props = defineProps({
  placeholder: {
    type: String,
    default: "Search or type anything here...", // Default placeholder if none is passed
  },
});

const onSearch = () => {
  if (searchQuery.value.trim() !== "") {
    // If search query is not empty, send the search value to the parent
    emit("onSearch", searchQuery.value.trim());
  } else {
    emit("onSearch", "");
  }
};
const clearSearch = () => {
  searchQuery.value = "";
  emit("onSearch", "");
};
</script>

<template>
  <v-container class="px-0">
    <!-- <v-row class="d-flex align-center"> -->
    <!-- Search Bar -->
    <!-- <v-col :cols="serviceTypes?.length ? 8 : 12"> -->
    <!-- <v-col> -->
    <div>
      <v-text-field v-model="searchQuery" density="comfortable" bg-color="white" rounded="pill"
        class="text-subtitle-1 h6" prepend-inner-icon="mdi-magnify" clear-icon="mdi-close-circle"
        :placeholder="props.placeholder" @input="onSearch" @click:clear="clearSearch" clearable
        hide-details></v-text-field>
    </div>
    <!-- </v-col>
    </v-row> -->
  </v-container>
</template>
