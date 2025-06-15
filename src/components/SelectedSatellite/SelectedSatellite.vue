<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { useProjectStore } from '@/stores/project'

import { X } from 'lucide-vue-next'

const router = useRouter()
const projectStore = useProjectStore()
const { selectedItems, isLoadingSatellite } = storeToRefs(projectStore)

/**
 * Clears all selected items in the project store.
 */
const clearAll = () => {
  projectStore.setSelectedItems([])
}

/**
 * Removes an item from the selectedItems list by its NORAD catalog ID.
 *
 * @param {string} id - The NORAD catalog ID of the item to remove.
 */
const removeItem = (id: string) => {
  const updated = selectedItems.value.filter((item) => item.noradCatId !== id)
  projectStore.setSelectedItems(updated)
}

/**
 * Handles the submission of selected satellite items.
 */
const handleSubmit = () => {
  if (isLoadingSatellite.value) return
  localStorage.setItem('selectedSatellite', JSON.stringify(selectedItems.value))
  projectStore.setSelectedItems([])
  router.push({ name: 'Selected' })
}
</script>

<template>
  <div
    class="w-full flex flex-col justify-between py-6 px-4 text-white bg-accent-foreground min-h-full"
  >
    <div class="w-full h-full">
      <div class="flex flex-col justify-between items-center border-b border-blue-400 pb-2 mb-4">
        <h2 class="text-white text-lg font-medium">Selected Assets</h2>
        <div
          class="flex whitespace-nowrap justify-between w-full pt-2 items-center text-sm text-gray-400 gap-2"
        >
          <span class="text-gray-400"> {{ selectedItems.length }} selected </span>
          <button
            @click="clearAll"
            class="hover:text-muted flex items-center gap-1 text-xs ml-2"
            title="Clear all"
          >
            Clear all
            <X :size="16" />
          </button>
        </div>
      </div>
      <div class="space-y-2 max-h-40 lg:max-h-dvh overflow-y-auto pr-1">
        <div
          v-for="item in selectedItems"
          :key="item.noradCatId"
          class="flex justify-between gap-3 items-center border-b border-gray-800 pb-1"
        >
          <div class="flex gap-4 min-w-0 text-sm items-center">
            <span class="text-gray-400 w-8 text-right">{{ item.noradCatId }}</span>
            <span class="text-white truncate w-full">{{ item.name }}</span>
          </div>
          <button
            @click="removeItem(item.noradCatId)"
            class="text-gray-400 hover:text-muted transition text-lg font-bold"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
    <button
      :disabled="isLoadingSatellite"
      v-if="selectedItems.length"
      class="mt-6 w-full bg-blue-500 hover:bg-blue-400 text-black font-semibold py-2 rounded transition"
      @click="handleSubmit"
    >
      PROCEED
    </button>
  </div>
</template>
