<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'

import type { SearchResult, SearchProps } from '@/types/search.type'

import { useProjectStore } from '@/stores/project'

import { Search, X } from 'lucide-vue-next'

const props = withDefaults(defineProps<SearchProps>(), {
  modelValue: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [result: SearchResult]
  clear: []
}>()

const projectStore = useProjectStore()
const { isLoadingSatellite } = storeToRefs(projectStore)

const searchInput = ref<HTMLInputElement>()
const searchQuery = ref(props.modelValue)
const isSearchActive = ref(false)

const config = computed(() => ({
  allowPartialMatch: true,
  caseSensitive: false,
  minQueryLength: 1,
  searchOnType: false,
  ...props.config,
}))

const placeholder = computed(() => {
  if (config.value.placeholder) return config.value.placeholder

  const fields = config.value.searchFields.map((f) => f.label.toLowerCase())
  if (fields.length === 1) return `Search by ${fields[0]}`
  if (fields.length === 2) return `Search by ${fields.join(' or ')}`
  return `Search by ${fields.slice(0, -1).join(', ')}, or ${fields[fields.length - 1]}`
})

/**
 * Performs a search on the provided data based on the given query string.
 *
 * @param {string} query - The search query string.
 * @returns - The filtered array of items matching the search criteria.
 */
const performSearch = (query: string) => {
  const trimmedQuery = query.trim()

  if (!trimmedQuery || trimmedQuery.length < config.value.minQueryLength) {
    return [...props.data]
  }

  return props.data.filter((item) => {
    return config.value.searchFields.some((field) => {
      const itemValue = item[field.key]
      if (itemValue == null) return false
      if (field.validator && !field.validator(trimmedQuery)) {
        return false
      }
      if (field.type === 'number' && !/^\d+$/.test(trimmedQuery)) {
        return false
      }

      const itemStr = String(itemValue)
      const searchStr = config.value.caseSensitive ? trimmedQuery : trimmedQuery.toLowerCase()
      const compareStr = config.value.caseSensitive ? itemStr : itemStr.toLowerCase()

      return config.value.allowPartialMatch
        ? compareStr.includes(searchStr)
        : compareStr === searchStr
    })
  })
}

/**
 * Handles the search operation by performing a search with the current query
 */
const handleSearch = () => {
  const results = performSearch(searchQuery.value)
  const trimmedQuery = searchQuery.value.trim()

  isSearchActive.value = trimmedQuery.length > 0

  const searchResult: SearchResult = {
    results,
    totalCount: props.data.length,
    filteredCount: results.length,
    isActive: isSearchActive.value,
    query: trimmedQuery,
  }

  emit('search', searchResult)
}

/**
 * Clears the current search input and resets the search state.
 */
const clearSearch = () => {
  searchQuery.value = ''
  isSearchActive.value = false
  emit('clear')
  searchInput.value?.focus()
}

/**
 * Handles the keydown event on the input field.
 *
 * @param {KeyboardEvent} event - The keyboard event object.
 */
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleSearch()
  }
}

watch(
  () => props.modelValue,
  (newValue) => {
    searchQuery.value = newValue
  },
)

watch(searchQuery, (newValue) => {
  emit('update:modelValue', newValue)
  if (config.value.searchOnType) {
    handleSearch()
  }
})

defineExpose({
  focus: () => searchInput.value?.focus(),
  clear: clearSearch,
  search: handleSearch,
})
</script>

<template>
  <div class="px-4 flex w-full py-3">
    <div class="relative w-full">
      <div class="relative w-full">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search :size="16" class="text-primary-foreground" />
        </div>
        <input
          :disabled="isLoadingSatellite"
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          :placeholder="placeholder"
          class="block w-full pl-10 pr-12 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          :class="isLoadingSatellite && 'cursor-not-allowed'"
          @keydown="handleKeydown"
        />
        <button
          v-if="searchQuery.length > 0"
          @click="clearSearch"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors duration-200"
          type="button"
          aria-label="Clear search"
        >
          <X :size="20" />
        </button>
      </div>
      <div class="mt-2 text-xs text-gray-400 truncate">
        <span>{{ placeholder }} - Press Enter to search, Esc to clear</span>
      </div>
    </div>
  </div>
</template>
