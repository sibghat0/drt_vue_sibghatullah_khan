<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification'

import {
  ObjectType,
  OrbitCode,
  type SatelliteData,
  type SatelliteQueryParams,
  type Filters,
} from '@/types/home.types'

import { useProjectStore } from '@/stores/project'

import { Filter, X, LoaderCircle } from 'lucide-vue-next'

import homeService from '@/service/home.service'

const emit = defineEmits<{
  filteredSatellitesChanged: [satellites: SatelliteData[]]
}>()

const toast = useToast()
const projectStore = useProjectStore()
const { allSatellites, selectedItems, isFullDataFetched, isLoadingSatellite, isFilterActivated } =
  storeToRefs(projectStore)

const openFilter = ref<boolean>(false)
const selectedObjectTypes = ref<Set<ObjectType>>(new Set())
const selectedOrbitCodes = ref<Set<OrbitCode>>(new Set())
const showFilter = ref<string[]>([])
const isLoading = ref<boolean>(false)
const previousObjectTypes = ref<Set<ObjectType>>(new Set())

const orbitCodes = Object.values(OrbitCode)
const objectTypes = Object.values(ObjectType)

const selectedFilterList = computed(() => {
  return [...selectedObjectTypes.value, ...selectedOrbitCodes.value]
})

const previewCount = computed(() => {
  return filterSatelliteData(allSatellites.value).length
})

/**
 * Filters satellite data based on selected object types and orbit codes
 *
 * @param {SatelliteData[]} satelliteData - Array of satellite data to filter
 * @returns Filtered array of satellites matching criteria
 */
const filterSatelliteData = (satelliteData: SatelliteData[]) => {
  return satelliteData.filter((row) => {
    const typeOk =
      !selectedObjectTypes.value.size || selectedObjectTypes.value.has(row.objectType as ObjectType)
    const orbitOk =
      !selectedOrbitCodes.value.size ||
      selectedOrbitCodes.value.has(
        homeService.cleanOrbitCode(row.orbitCode as OrbitCode) as OrbitCode,
      )
    return typeOk && orbitOk
  })
}

/**
 * Checks if the selected object types have changed since the last filter application
 *
 * @returns {boolean} True if object types have changed, false otherwise
 */
const hasObjectTypesChanged = () => {
  if (previousObjectTypes.value.size !== selectedObjectTypes.value.size) {
    return true
  }

  for (const type of selectedObjectTypes.value) {
    if (!previousObjectTypes.value.has(type)) {
      return true
    }
  }

  return false
}

/**
 * Toggles the presence of a value in a Set
 *
 * @param {Set<any>} set - The Set to modify
 * @param {any} val - The value to toggle in the Set
 */
const toggleSet = (set: Set<any>, val: any) => {
  set.has(val) ? set.delete(val) : set.add(val)
}

/**
 * Updates localStorage with current filter state and manages filter activation status
 */
const updateLocalStorage = () => {
  const filters: Filters = {
    selectedObjectTypes: Array.from(selectedObjectTypes.value),
    selectedOrbitCodes: Array.from(selectedOrbitCodes.value),
  }

  if (filters.selectedObjectTypes.length > 0 || filters.selectedOrbitCodes.length > 0) {
    localStorage.setItem('selectedFilters', JSON.stringify(filters))
    projectStore.setIsFilterActivated(showFilter.value.length)
  } else {
    localStorage.removeItem('selectedFilters')
    projectStore.setIsFilterActivated(0)
  }
}

/**
 * Stores filtered data in both ref and Pinia store, and emits to parent
 *
 * @param {SatelliteData[]} filteredData - The filtered satellite data
 */
const storeFilteredData = (filteredData: SatelliteData[]) => {
  projectStore.setDisplayedSatellites(filteredData)
  emit('filteredSatellitesChanged', filteredData)
}

/**
 * Resets all filter-related state to initial values
 */
const resetFilterState = () => {
  selectedObjectTypes.value.clear()
  selectedOrbitCodes.value.clear()
  previousObjectTypes.value.clear()
  showFilter.value = []
}

/**
 * Fetches satellite data from the API with optional query parameters
 *
 * @param {SatelliteQueryParams} [payload] - Optional query parameters for filtering
 * @returns Promise resolving to array of satellite data
 */
const fetchSatelliteData = async (payload?: SatelliteQueryParams) => {
  isLoading.value = true
  try {
    const response = await homeService.getSatellitesData(payload)
    return response
  } catch (error) {
    toast.error('Error fetching satellite data:')
    throw error
  } finally {
    isLoading.value = false
  }
}

/**
 * Fetches full satellite dataset if not already loaded
 *
 * @returns Promise resolving to full satellite dataset
 */
const fetchFullDataIfNeeded = async () => {
  if (!isFullDataFetched.value) {
    const response = await fetchSatelliteData()
    projectStore.setAllSatellites(response)
    storeFilteredData(response)
    projectStore.setIsFullDataFetched(true)
    return response
  }
  return allSatellites.value
}

/**
 * Fetches filtered data from API if object types have changed and full data isn't loaded
 *
 * @returns  Promise resolving to satellite data (filtered or existing)
 */
const fetchFilteredDataIfNeeded = async () => {
  const objectTypesChanged = hasObjectTypesChanged()

  if (objectTypesChanged && !isFullDataFetched.value && selectedObjectTypes.value.size > 0) {
    const payload = {
      objectTypes: Array.from(selectedObjectTypes.value),
      attributes: [],
    }
    const response = await fetchSatelliteData(payload)
    projectStore.setAllSatellites(response)
    return response
  }

  return allSatellites.value
}

/**
 * Applies filters to the current dataset and updates UI state
 */
const applyFiltersLocally = () => {
  const filtered = filterSatelliteData(allSatellites.value)
  storeFilteredData(filtered)
  showFilter.value = selectedFilterList.value
  updateLocalStorage()
}

/**
 * Main filter application function that coordinates data fetching and local filtering
 *
 * @returns Promise that resolves when filters are applied
 */
const applyFilters = async () => {
  try {
    await fetchFilteredDataIfNeeded()
    previousObjectTypes.value = new Set(selectedObjectTypes.value)
    applyFiltersLocally()
    openFilter.value = false
  } catch (error) {
     toast.error('Failed to apply filters:')
  }
}

/**
 * Removes a specific filter value and reapplies remaining filters
 *
 * @param {string} filterValue - The filter value to remove
 */
const removeFilter = (filterValue: string) => {
  if (Object.values(ObjectType).includes(filterValue as ObjectType)) {
    selectedObjectTypes.value.delete(filterValue as ObjectType)
  }

  if (Object.values(OrbitCode).includes(filterValue as OrbitCode)) {
    selectedOrbitCodes.value.delete(filterValue as OrbitCode)
  }
  updateLocalStorage()
  applyFiltersLocally()
}

/**
 * Clears all active filters and resets to show all satellite data
 *
 * @returns  Promise that resolves when all filters are cleared
 */
const clearFilter = async () => {
  resetFilterState()
  localStorage.removeItem('selectedFilters')
  projectStore.setIsFilterActivated(0)

  openFilter.value = false
  try {
    const fullData = await fetchFullDataIfNeeded()
    storeFilteredData(fullData)
  } catch (error) {
    toast.error('Error fetching full satellite data:')
    storeFilteredData([])
    openFilter.value = true
  }
}

/**
 * Initializes filter state from localStorage on component mount
 *
 * @returns - Promise that resolves when filters are initialized
 */
const initializeFiltersFromStorage = async () => {
  const localStorageFilter = homeService.getFiltersFromLocalStorage()

  if (!localStorageFilter) return

  try {
    const payload: SatelliteQueryParams = {
      objectTypes: localStorageFilter.selectedObjectTypes,
      attributes: [],
    }

    selectedObjectTypes.value = new Set(localStorageFilter.selectedObjectTypes)
    selectedOrbitCodes.value = new Set(localStorageFilter.selectedOrbitCodes)
    previousObjectTypes.value = new Set(localStorageFilter.selectedObjectTypes)

    const response = await fetchSatelliteData(payload)
    showFilter.value = selectedFilterList.value
    projectStore.setIsFilterActivated(showFilter.value.length)
    const filteredData = filterSatelliteData(response)
    storeFilteredData(filteredData)
  } catch (error) {
    toast.error('Failed to initialize filters from storage:')
    resetFilterState()

    try {
      const fallbackData = await fetchSatelliteData()
      projectStore.setIsFullDataFetched(true)
      storeFilteredData(fallbackData)
    } catch (fallbackError) {
      projectStore.setIsFullDataFetched(false)
      storeFilteredData([])
    }
  }
}

onMounted(() => {
  initializeFiltersFromStorage()
})
</script>

<template>
  <div class="flex w-full justify-end items-center gap-4">
    <div
      class="flex items-center gap-2 max-w-full sm:max-w-xs overflow-auto"
      :class="selectedItems.length ? 'lg:max-w-sm' : 'lg:max-w-lg'"
    >
      <div
        v-for="filter in showFilter"
        :key="filter"
        class="flex items-center justify-between mb-1"
      >
        <div
          class="flex items-center gap-2 justify-between whitespace-nowrap text-white text-xs bg-blue-600/80 hover:bg-blue-600 px-3 py-1.5 rounded-full transition-colors duration-200"
        >
          <span>{{ filter }}</span>
          <X
            :size="14"
            class="cursor-pointer text-white/80 hover:text-white transition-colors duration-200"
            @click="removeFilter(filter)"
          />
        </div>
      </div>
    </div>

    <button
      :disabled="isLoadingSatellite"
      class="flex relative items-start mb-2"
      :class="[
        isLoadingSatellite ? 'cursor-not-allowed' : 'cursor-pointer',
        { 'mt-3': showFilter.length === 0 },
      ]"
      @click="openFilter = true"
    >
      <Filter :size="18" class="text-gray-400 hover:text-blue-400 transition-colors duration-200" />
      <div
        v-if="showFilter.length"
        class="absolute bg-red-500 rounded-full -top-2 items-center justify-center flex left-3 w-4 h-4 text-xs text-white font-medium"
      >
        {{ showFilter.length }}
      </div>
    </button>
  </div>
  <div
    v-if="openFilter"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
  >
    <div
      class="bg-gradient-to-br from-gray-900 to-gray-800 w-full max-w-2xl rounded-xl shadow-2xl border border-gray-700/50"
    >
      <div class="flex items-center justify-between p-4 border-b border-gray-700/50">
        <div>
          <h2 class="text-white text-lg font-semibold">Filter Satellites</h2>
          <p class="text-gray-400 text-xs">Refine your satellite data</p>
        </div>
        <button
          class="p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
          :class="isLoadingSatellite && 'cursor-not-allowed'"
          @click="openFilter = false"
          :disabled="isLoadingSatellite"
        >
          <X :size="18" class="text-gray-400 hover:text-white" />
        </button>
      </div>

      <div class="p-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section>
            <h3 class="text-gray-200 text-sm font-semibold mb-2 flex items-center gap-2">
              <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
              Object Type
            </h3>
            <div class="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-2">
              <label
                v-for="type in objectTypes"
                :key="type"
                class="flex items-center gap-2 p-2 rounded-md bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer transition-colors duration-200 group"
              >
                <input
                  type="checkbox"
                  :value="type"
                  :checked="selectedObjectTypes.has(type)"
                  @change="toggleSet(selectedObjectTypes, type)"
                  class="w-3.5 h-3.5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-1"
                />
                <span
                  class="text-gray-200 text-xs group-hover:text-white transition-colors duration-200"
                >
                  {{ type }}
                </span>
              </label>
            </div>
          </section>

          <section>
            <h3 class="text-gray-200 text-sm font-semibold mb-2 flex items-center gap-2">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              Orbit Code
            </h3>
            <div class="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-2">
              <label
                v-for="orbitCode in orbitCodes"
                :key="orbitCode"
                class="flex items-center gap-1.5 p-2 rounded-md bg-gray-800/50 hover:bg-gray-700/50 cursor-pointer transition-colors duration-200 group"
              >
                <input
                  type="checkbox"
                  :value="orbitCode"
                  :checked="selectedOrbitCodes.has(orbitCode)"
                  @change="toggleSet(selectedOrbitCodes, orbitCode)"
                  class="w-3.5 h-3.5 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-1"
                />
                <span
                  class="text-gray-200 text-xs group-hover:text-white transition-colors duration-200"
                >
                  {{ orbitCode }}
                </span>
              </label>
            </div>
          </section>
        </div>
      </div>
      <div class="flex items-center justify-between p-4 border-t border-gray-700/50 bg-gray-800/30">
        <div class="flex items-center gap-4">
          <span class="text-gray-300 text-sm font-medium">
            {{ previewCount }} result<span v-if="previewCount !== 1">s</span>
          </span>
          <span class="text-gray-500 text-xs">
            {{ previewCount === allSatellites.length ? 'All satellites' : 'Filtered' }}
          </span>
        </div>
        <div class="flex gap-3">
          <button
            :disabled="isLoadingSatellite"
            :class="isLoadingSatellite && 'cursor-not-allowed'"
            class="px-3 py-1.5 text-xs font-medium text-gray-300 bg-gray-700/50 hover:bg-gray-600/50 rounded-md transition-colors duration-200"
            @click="clearFilter"
          >
            Clear All
          </button>
          <button
            :disabled="isLoadingSatellite"
            :class="isLoadingSatellite && 'cursor-not-allowed'"
            class="px-4 flex items-center gap-2 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-md transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
            @click="applyFilters"
          >
            <LoaderCircle v-if="isLoading" :size="16" class="animate-spin" />
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
