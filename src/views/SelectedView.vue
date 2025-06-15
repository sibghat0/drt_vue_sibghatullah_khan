<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import type { TrackedSatellite } from '@/types/search.type'
import { searchConfigSelected } from '@/constants/searchConfig'

import { ArrowLeft, Satellite, Globe } from 'lucide-vue-next'

import GenericSearch from '@/ui/GenericSearch/GenericSearch.vue'

const router = useRouter()

const selectedSatellites = ref<TrackedSatellite[]>([])
const filteredSatellites = ref<TrackedSatellite[]>([])

/**
 * Handles the search results by updating the filteredSatellites list.
 *
 * @param {any} result - The search result object containing a `results` property.
 */
const handleSearch = (result: any) => {
  filteredSatellites.value = result.results
}

/**
 * Clears the current search filter and resets the filteredSatellites list
 */
const handleSearchClear = () => {
  filteredSatellites.value = [...selectedSatellites.value]
}

/**
 * Navigates the user to the previous page in the browser history.
 */
const handleBack = () => {
  router.back() ?? router.push({ name: 'Home' })
}

onMounted(() => {
  const data = localStorage.getItem('selectedSatellite')
  if (data) {
    try {
      const parsed = JSON.parse(data)
      selectedSatellites.value = parsed.map((sat: any) => ({
        name: sat.name,
        noradCatId: sat.noradCatId,
        countryCode: sat.countryCode,
      }))

      filteredSatellites.value = [...selectedSatellites.value]
    } catch (error) {
      console.error('Invalid JSON in localStorage', error)
    }
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-900 px-4 py-8">
    <div
      class="flex items-center gap-2 cursor-pointer text-primary-foreground py-2 hover:text-gray-400 transition-colors"
      @click="handleBack"
    >
      <ArrowLeft :size="16" /> back
    </div>
    <div class="max-w-6xl mx-auto text-white">
      <h1 class="text-3xl font-bold mb-2">Tracked Satellites</h1>
      <p class="text-gray-400 mb-6">Below is a list of satellites selected for analysis.</p>

      <div v-if="selectedSatellites.length > 0" class="mb-6">
        <GenericSearch
          :data="selectedSatellites"
          :config="searchConfigSelected"
          @search="handleSearch"
          @clear="handleSearchClear"
        />
      </div>
      <div
        v-if="filteredSatellites.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <div
          v-for="sat in filteredSatellites"
          :key="sat.noradCatId"
          class="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 hover:from-gray-700/90 hover:to-gray-800/90 backdrop-blur-sm border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-300 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-cyan-400/10 transform hover:-translate-y-1 cursor-pointer"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
          <div class="relative z-10 flex items-start justify-between mb-4">
            <div class="p-2 bg-cyan-400/10 rounded-lg group-hover:bg-cyan-400/20 transition-colors">
              <Satellite :size="20" class="text-cyan-400" />
            </div>
            <div class="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full">
              ID: {{ sat.noradCatId }}
            </div>
          </div>
          <div class="relative z-10 mb-6">
            <h2
              class="text-lg font-bold text-white break-words leading-tight group-hover:text-cyan-100 transition-colors"
            >
              {{ sat.name }}
            </h2>
          </div>
          <div class="relative z-10 flex items-center gap-2 text-sm text-gray-300">
            <Globe :size="14" class="text-gray-400" />
            <span class="font-medium text-gray-400">Country:</span>
            <span class="text-white font-semibold">{{ sat.countryCode }}</span>
          </div>
          <div
            class="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <div class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
      <div
        v-else-if="selectedSatellites.length > 0 && filteredSatellites.length === 0"
        class="text-gray-400 flex justify-center items-center w-full mt-8"
      >
        No satellites match your search criteria.
      </div>

      <div v-else class="text-gray-400 flex justify-center items-center w-full mt-8">
        No satellites selected yet.
      </div>
    </div>
  </div>
</template>
