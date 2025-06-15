import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { SatelliteData } from '@/types/home.types'

export const useProjectStore = defineStore('project', () => {
  const allSatellites = ref<SatelliteData[]>([])
  const displayedSatellites = ref<SatelliteData[]>([])
  const selectedItems = ref<SatelliteData[]>([])
  const isFilterActivated = ref<number>(0)
  const isFullDataFetched = ref<boolean>(false)
  const isLoadingSatellite = ref<boolean>(false)

  /**
   * Updates the `allSatellites` state with the provided array of satellite data.
   *
   * @param satellites - An array of `SatelliteData` objects to set as the current list of all satellites.
   */
  const setAllSatellites = (satellites: SatelliteData[]) => {
    allSatellites.value = satellites
  }

  /**
   * Updates the list of currently displayed satellites.
   *
   * @param satellites - An array of `SatelliteData` objects to be set as the currently displayed satellites.
   */
  const setDisplayedSatellites = (satellites: SatelliteData[]) => {
    displayedSatellites.value = satellites
  }

  /**
   * Updates the list of selected satellite items.
   *
   * @param items - An array of `SatelliteData` objects to set as the currently selected items.
   */
  const setSelectedItems = (items: SatelliteData[]) => {
    selectedItems.value = items
  }

  /**
   * Sets the activation state of the filter.
   *
   * @param value - A boolean indicating whether the filter should be activated (`true`) or deactivated (`false`).
   */
  const setIsFilterActivated = (value: number) => {
    isFilterActivated.value = value
  }

  /**
   * Sets the value indicating whether the full data has been fetched.
   *
   * @param value - A boolean indicating if the full data has been fetched (`true`) or not (`false`).
   */
  const setIsFullDataFetched = (value: boolean) => {
    isFullDataFetched.value = value
  }

  /**
   * Sets the value indicating whether the data has been loaded.
   *
   * @param value - A boolean indicating if the data has been loaded (`true`) or not (`false`).
   */
  const setIsLoadingSatellite = (value: boolean) => {
    isLoadingSatellite.value = value
  }

  return {
    allSatellites,
    setAllSatellites,
    displayedSatellites,
    setDisplayedSatellites,
    selectedItems,
    setSelectedItems,
    isFilterActivated,
    setIsFilterActivated,
    isFullDataFetched,
    setIsFullDataFetched,
    isLoadingSatellite,
    setIsLoadingSatellite,
  }
})
