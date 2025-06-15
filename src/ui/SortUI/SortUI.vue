<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import { useProjectStore } from '@/stores/project'

import { Sort, type SatelliteData, type SortDirection } from '@/types/home.types'

import { ChevronUp, ChevronDown } from 'lucide-vue-next'

const props = defineProps<{
  column: keyof SatelliteData
  activeSortKey?: keyof SatelliteData | null
  activeSortDir?: SortDirection
}>()

const emit = defineEmits<{
  sort: [key: keyof SatelliteData, direction: SortDirection]
}>()

const projectStore = useProjectStore()
const { isLoadingSatellite } = storeToRefs(projectStore)

const isActive = computed(() => props.activeSortKey === props.column)
const isAscending = computed(() => isActive.value && props.activeSortDir === Sort.ASC)
const isDescending = computed(() => isActive.value && props.activeSortDir === Sort.DESC)

/**
 * Toggles the sort direction for a given column and emits the sort event.
 *
 * @param {keyof SatelliteData} col - The column key to sort by.
 */
const toggleSort = (col: keyof SatelliteData) => {
  if (isLoadingSatellite.value) return
  let newDirection: SortDirection = Sort.ASC

  if (props.activeSortKey === col) {
    newDirection = props.activeSortDir === Sort.ASC ? Sort.DESC : Sort.ASC
  } else {
    newDirection = Sort.ASC
  }

  emit('sort', col, newDirection)
}
</script>

<template>
  <span
    :disabled="isLoadingSatellite"
    class="inline-flex flex-col items-center justify-center ml-1 cursor-pointer select-none"
    :class="{ 'text-blue-600': isActive }"
    @click="toggleSort(props.column)"
  >
    <ChevronUp
      :size="14"
      :class="{ 'text-blue-600': isAscending, 'text-gray-400': !isAscending }"
    />
    <ChevronDown
      :size="14"
      :class="{ 'text-blue-600': isDescending, 'text-gray-400': !isDescending }"
    />
  </span>
</template>
