<script setup lang="ts">
import { computed, ref } from 'vue'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { tableConfig } from '@/constants/tableConfig'
import type {
  SatelliteData,
  SortDirection,
  TableColumn,
  TableProps,
  TableEmits,
} from '@/types/home.types'
import SortUI from '@/ui/SortUI/SortUI.vue'

const props = defineProps<TableProps>()
const emit = defineEmits<TableEmits>()

const parentRef = ref<HTMLElement | null>(null)

const rowVirtualizer = useVirtualizer({
  count: props.displayedSatellites.length,
  getScrollElement: () => parentRef.value,
  estimateSize: () => 40,
  overscan: 5,
})

const selectedIds = computed(() => {
  return new Set(props.selectedItems.map((item) => item.noradCatId))
})

const visibleColumns = computed(() => tableConfig.filter((col) => col.visible))

/**
 * Retrieves the display value for a table cell
 *
 * @param {SatelliteData} row - The satellite data row
 * @param {TableColumn} column - The column configuration
 * @returns The formatted cell value or raw value
 */
const getCellValue = (row: SatelliteData, column: TableColumn) => {
  if (column.type === 'custom' && column.formatter)
    return column.formatter(row[column.key as keyof SatelliteData], row)
  return row[column.key as keyof SatelliteData]
}

/**
 * Checks if a satellite item is currently selected
 *
 * @param {SatelliteData} item - The satellite item to check
 * @returns True if the item is selected, false otherwise
 */
const isItemSelected = (item: SatelliteData) => {
  return selectedIds.value.has(item.noradCatId)
}

/**
 * Checks if selection is at limit and item is not already selected
 *
 * @param {SatelliteData} item - The satellite item to check
 * @returns True if at selection limit and item not selected
 */
const isAtSelectionLimit = (item: SatelliteData) => {
  return props.selectedItems.length >= 10 && !selectedIds.value.has(item.noradCatId)
}

/**
 * Handles scroll events for infinite scrolling functionality
 */
const handleScroll = () => {
  emit('scroll')
}

/**
 * Handles checkbox click events for satellite selection
 *
 * @param {SatelliteData} selectedItem - The satellite item being selected/deselected
 * @param {Event} event - The click event object
 */
const handleCheckboxClick = (selectedItem: SatelliteData, event: Event) => {
  emit('checkboxClick', selectedItem, event)
}

/**
 * Handles table sorting
 *
 * @param {keyof SatelliteData} key - The column key to sort by
 * @param {SortDirection} direction - The sort direction (ASC or DESC)
 */
const tableSort = (key: keyof SatelliteData, direction: SortDirection) => {
  emit('sort', key, direction)
}

defineExpose({
  rowVirtualizer,
  parentRef,
})
</script>
<template>
  <div
    ref="parentRef"
    class="overflow-auto bg-gray-900"
    :class="selectedItems.length > 0 ? 'h-[77.2vh] 2xl:h-[88vh]' : 'h-[81.2vh] 2xl:h-[92vh]'"
    @scroll="handleScroll"
  >
    <div
      class="w-full min-w-fit"
      :class="{ 'h-full': !isLoadingSatellite && displayedSatellites.length === 0 }"
    >
      <div
        class="grid bg-gray-800 sticky top-0 z-10 shadow border-b border-gray-700 min-w-fit"
        style="grid-template-columns: 3rem 12rem 12rem 12rem 12rem 12rem 12rem"
      >
        <div
          v-for="columnHeader in visibleColumns"
          :key="columnHeader.key"
          class="px-3 py-2 text-gray-400 text-xs font-semibold uppercase tracking-wide flex items-center text-left"
        >
          <div class="flex items-center gap-2 overflow-hidden min-w-0">
            <span v-if="columnHeader.type !== 'checkbox'" class="truncate">{{
              columnHeader.label
            }}</span>
            <SortUI
              v-if="columnHeader.sortable"
              class="flex-shrink-0"
              :column="columnHeader.key as keyof SatelliteData"
              :active-sort-key="sortKey"
              :active-sort-dir="sortDir"
              @sort="tableSort"
            />
          </div>
        </div>
      </div>
      <div class="relative min-w-fit" :style="{ height: rowVirtualizer.getTotalSize() + 'px' }">
        <div
          v-for="rowData in rowVirtualizer.getVirtualItems()"
          :key="rowData.key as string"
          :style="{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            minWidth: 'fit-content',
            transform: `translateY(${rowData.start}px)`,
          }"
          class="grid transition-colors duration-150 hover:bg-gray-800 border-b border-gray-800 min-w-fit"
          style="grid-template-columns: 3rem 12rem 12rem 12rem 12rem 12rem 12rem"
          :class="{
            'bg-blue-900/60': isItemSelected(displayedSatellites[rowData.index]),
          }"
        >
          <div
            v-for="col in visibleColumns"
            :key="col.key"
            :class="[
              'px-3 py-2 border-r border-gray-800 last:border-r-0 min-w-0 text-left',
              col.key === 'objectType' ? 'text-gray-300 text-xs' : 'text-white text-sm',
              col.key === 'name' && 'font-medium',
            ]"
            :title="getCellValue(displayedSatellites[rowData.index], col) ?? undefined"
          >
            <div v-if="col.type === 'checkbox'" class="flex justify-center items-center h-full">
              <input
                type="checkbox"
                :checked="isItemSelected(displayedSatellites[rowData.index])"
                @click="handleCheckboxClick(displayedSatellites[rowData.index], $event)"
                :class="[
                  'w-4 h-4 accent-blue-400 cursor-pointer',
                  isAtSelectionLimit(displayedSatellites[rowData.index]) ? 'opacity-60' : '',
                ]"
              />
            </div>
            <div v-else class="truncate whitespace-nowrap">
              {{ getCellValue(displayedSatellites[rowData.index], col) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
