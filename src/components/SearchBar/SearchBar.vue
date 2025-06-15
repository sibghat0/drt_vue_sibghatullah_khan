<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useProjectStore } from '@/stores/project'

import { searchConfig } from '@/constants/searchConfig'

import GenericSearch from '@/ui/GenericSearch/GenericSearch.vue'
import { watch } from 'vue'

const emit = defineEmits<{
  searchCleared: []
}>()

const projectStore = useProjectStore()
const { allSatellites, isFilterActivated } = storeToRefs(projectStore)

const searchQuery = ref<string>('')

/**
 * Handles the search results by updating the satellite data in the project store.
 *
 * @param {any} result - The search result object containing satellite data.
 */
const handleSearch = (result: any) => {
  projectStore.setDisplayedSatellites(result.results)
}

/**
 * Emits the 'searchCleared' event to notify parent components
 */
const handleSearchCleared = () => {
  emit('searchCleared')
}

watch(
  () => isFilterActivated.value,
  (val) => {
    if (val > 0) {
      searchQuery.value = ''
    }
  },
)
</script>

<template>
  <GenericSearch
    :data="allSatellites"
    :config="searchConfig"
    v-model="searchQuery"
    @search="handleSearch"
    @clear="handleSearchCleared"
  />
</template>
