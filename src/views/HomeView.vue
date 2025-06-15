<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useProjectStore } from '@/stores/project'
import { Sort, type SatelliteData, type SortDirection } from '@/types/home.types'
import homeService from '@/service/home.service'

import { CircleAlert } from 'lucide-vue-next'

import SelectedSatellite from '@/components/SelectedSatellite/SelectedSatellite.vue'
import FilterPanel from '@/components/Filter/Filter.vue'
import SearchBar from '@/components/SearchBar/SearchBar.vue'
import SatelliteTable from '@/components/SatelliteTable/SatelliteTable.vue'

const itemsPerBatch = 40

const projectStore = useProjectStore()
const { allSatellites, displayedSatellites, selectedItems, isFilterActivated, isLoadingSatellite } =
  storeToRefs(projectStore)

const searchBarRef = ref<InstanceType<typeof SearchBar>>()
const satelliteTableRef = ref<InstanceType<typeof SatelliteTable>>()
const initialLoading = ref<boolean>(false)
const dataLoaded = ref<boolean>(false)
const originalSatellites = ref<SatelliteData[]>([])
const currentIndex = ref<number>(0)
const sortKey = ref<keyof SatelliteData | null>(null)
const sortDir = ref<SortDirection | undefined>(Sort.ASC)
const selectionError = ref<string>('')
const showSelectionError = ref<boolean>(false)

const statusText = computed(() => {
  if (isLoadingSatellite.value) return 'Loading satellites...'
  return displayedSatellites.value.length > 0
    ? `Showing ${displayedSatellites.value.length} satellites`
    : 'No satellite data available'
})

const selectionStatusText = computed(() => {
  const count = selectedItems.value.length
  if (count === 0) return 'No satellites selected'
  if (count === 1) return '1 satellite selected'
  return `${count} satellites selected`
})

const selectionStatusClass = computed(() => {
  const count = selectedItems.value.length
  if (count >= 10) return 'text-red-500'
  if (count >= 8) return 'text-orange-400'
  if (count >= 6) return 'text-yellow-400'
  return 'text-blue-400'
})

/**
 * Loads all satellite data from the API
 *
 * @returns {Promise<void>} Promise that resolves when data loading is complete
 */
const loadAllData = async () => {
  initialLoading.value = true
  try {
    const response = await homeService.getSatellitesData()
    projectStore.setIsFullDataFetched(true)
    originalSatellites.value = [...response]
    projectStore.setAllSatellites([...response])
    currentIndex.value = 0
    dataLoaded.value = true
    loadNextBatch()
  } catch (error) {
    projectStore.setIsFullDataFetched(false)
    dataLoaded.value = false
  } finally {
    initialLoading.value = false
  }
}

/**
 * Loads the next batch of satellites for virtual scrolling
 */
const loadNextBatch = () => {
  if (
    !dataLoaded.value ||
    allSatellites.value.length === 0 ||
    currentIndex.value >= allSatellites.value.length
  ) {
    return
  }

  const start = currentIndex.value
  const end = start + itemsPerBatch
  const nextItems = allSatellites.value.slice(start, end)
  const updated = [...displayedSatellites.value, ...nextItems]
  projectStore.setDisplayedSatellites(updated)
  currentIndex.value = end
}

/**
 * Handles search bar clear event
 */
const handleSearchCleared = () => {
  projectStore.setAllSatellites([...originalSatellites.value])
  projectStore.setDisplayedSatellites([])
  currentIndex.value = 0
  if (dataLoaded.value) {
    loadNextBatch()
  }
}

/**
 * Displays an error message to the user with auto-hide functionality
 *
 * @param {string} message - The error message to display
 */
const showError = (message: string) => {
  selectionError.value = message
  showSelectionError.value = true
  setTimeout(() => {
    showSelectionError.value = false
  }, 3000)
}

/**
 * Handles checkbox click events for satellite selection
 *
 * @param {SatelliteData} selectedItem - The satellite item being selected/deselected
 * @param {Event} event - The click event object
 */
const handleCheckboxClick = (selectedItem: SatelliteData, event: Event) => {
  const currentSelected = selectedItems.value
  const isSelected = new Set(selectedItems.value.map((item) => item.noradCatId)).has(
    selectedItem.noradCatId,
  )

  if (isSelected) {
    const updated = currentSelected.filter((item) => item.noradCatId !== selectedItem.noradCatId)
    projectStore.setSelectedItems(updated)
  } else {
    if (currentSelected.length >= 10) {
      event.preventDefault()
      showError('Maximum 10 satellites can be selected')
      return
    }
    projectStore.setSelectedItems([...currentSelected, selectedItem])
  }
}

/**
 * Clears all selected satellites from the selection
 */
const clearAllSelections = () => {
  projectStore.setSelectedItems([])
}

/**
 * Handles scroll events for infinite scrolling functionality
 */
const handleScroll = () => {
  if (isFilterActivated.value > 0) {
    if (
      displayedSatellites.value.length === 0 ||
      currentIndex.value >= displayedSatellites.value.length
    ) {
      return
    }
  } else {
    if (allSatellites.value.length === 0 || currentIndex.value >= allSatellites.value.length) {
      return
    }
  }

  const el = satelliteTableRef.value?.parentRef
  if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
    loadNextBatch()
  }
}

/**
 *
 * @param {keyof SatelliteData} key - The column key to sort by
 * @param {SortDirection} direction - The sort direction (ASC or DESC)
 */
const tableSort = (key: keyof SatelliteData, direction: SortDirection) => {
  sortKey.value = key
  sortDir.value = direction
  const allSatellites = projectStore.allSatellites
  const sortedData = homeService.handleSort(key, direction, allSatellites)
  projectStore.setDisplayedSatellites(sortedData)
}

watch(
  () => displayedSatellites.value,
  () => {
    if (satelliteTableRef.value?.rowVirtualizer) {
      satelliteTableRef.value.rowVirtualizer.setOptions({
        ...satelliteTableRef.value.rowVirtualizer.options,
        count: displayedSatellites.value.length,
      })
    }
  },
)

watch(
  () => allSatellites.value,
  () => {
    if (allSatellites.value.length > 0 && !isLoadingSatellite.value) {
      projectStore.setDisplayedSatellites([])
      currentIndex.value = 0
      loadNextBatch()
    }
  },
)

onMounted(async () => {
  const localStorageFilter = homeService.getFiltersFromLocalStorage()

  if (localStorageFilter === null) await loadAllData()
  projectStore.setDisplayedSatellites(allSatellites.value)
})
</script>

<template>
  <div class="flex w-full h-screen flex-col lg:flex-row">
    <div class="bg-gray-900 w-full font-sans border border-gray-700 overflow-hidden">
      <div
        class="flex w-full items-start bg-gray-800 border-b border-gray-700 pb-1"
        :class="{ 'flex-col sm:flex-row': isFilterActivated > 0 }"
      >
        <SearchBar ref="searchBarRef" @searchCleared="handleSearchCleared" />
        <div
          class="px-4 flex justify-end sm:w-fit"
          :class="isFilterActivated > 0 ? 'sm:pr-4 sm:pt-4 w-full pb-2' : 'pt-4'"
        >
          <FilterPanel />
        </div>
      </div>
      <div
        v-if="selectedItems.length > 0"
        class="bg-gray-800/70 border-b border-gray-700 px-4 py-2"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span :class="['text-sm font-medium', selectionStatusClass]">
              {{ selectionStatusText }}
            </span>
            <span v-if="selectedItems.length >= 8" class="text-xs text-gray-400">
              ({{ 10 - selectedItems.length }} remaining)
            </span>
          </div>
          <button
            @click="clearAllSelections"
            class="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-700"
          >
            Clear All
          </button>
        </div>
      </div>
      <div
        v-if="showSelectionError"
        class="fixed top-4 right-4 z-50 bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2"
      >
        <CircleAlert :size="16" />
        <span class="text-sm font-medium">{{ selectionError }}</span>
      </div>

      <div
        v-if="initialLoading || isLoadingSatellite"
        class="h-[81.2vh] bg-gray-900 flex items-center justify-center"
      >
        <div class="flex flex-col items-center gap-4">
          <div
            class="animate-spin w-8 h-8 border-4 border-gray-600 border-t-blue-400 rounded-full"
          ></div>
          <div class="text-white text-lg">Loading satellite data...</div>
          <div class="text-gray-400 text-sm">Please wait while we fetch the latest information</div>
        </div>
      </div>

      <SatelliteTable
        v-else-if="(!initialLoading || isLoadingSatellite) && displayedSatellites.length"
        ref="satelliteTableRef"
        :displayed-satellites="displayedSatellites"
        :selected-items="selectedItems"
        :is-loading-satellite="isLoadingSatellite"
        :sort-key="sortKey"
        :sort-dir="sortDir"
        @scroll="handleScroll"
        @checkbox-click="handleCheckboxClick"
        @sort="tableSort"
      />

      <div
        v-if="!isLoadingSatellite && displayedSatellites.length === 0"
        class="text-white text-sm flex justify-center items-center h-[81.2vh] 2xl:h-[92vh] w-full px-4 py-4 text-center"
      >
        No satellite data founded.
      </div>
      <div
        class="px-4 py-3 bg-gray-800/50 border-t border-gray-700 flex items-center justify-center gap-2"
      >
        <div
          v-if="isLoadingSatellite"
          class="animate-spin w-4 h-4 border-2 border-gray-600 border-t-blue-400 rounded-full"
        ></div>
        <div v-else class="w-2 h-2 rounded-full bg-green-400"></div>
        <span class="text-sm text-gray-300">{{ statusText }}</span>
      </div>
    </div>
    <div v-if="selectedItems.length" class="max-w-full w-full lg:max-w-xs">
      <SelectedSatellite />
    </div>
  </div>
</template>
