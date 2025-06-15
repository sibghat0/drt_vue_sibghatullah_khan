import type { SatelliteData } from '@/types/home.types'
import type { TrackedSatellite } from '@/types/search.type'

export const searchConfig = {
  searchFields: [
    {
      key: 'name' as keyof SatelliteData,
      label: 'Name',
      type: 'text' as const,
    },
    {
      key: 'noradCatId' as keyof SatelliteData,
      label: 'NORAD ID',
      type: 'number' as const,
      validator: (value: string) => /^\d+$/.test(value.trim()),
    },
  ],
  allowPartialMatch: true,
  caseSensitive: false,
  minQueryLength: 1,
  searchOnType: false,
}

export const searchConfigSelected = {
  searchFields: [
    {
      key: 'name' as keyof TrackedSatellite,
      label: 'Name',
      type: 'text' as const,
    },
    {
      key: 'noradCatId' as keyof TrackedSatellite,
      label: 'NORAD ID',
      type: 'number' as const,
      validator: (value: string) => /^\d+$/.test(value.trim()),
    },
    {
      key: 'countryCode' as keyof TrackedSatellite,
      label: 'Country Code',
      type: 'text' as const,
    },
  ],
  allowPartialMatch: true,
  caseSensitive: false,
  minQueryLength: 1,
  searchOnType: true,
  placeholder: 'Search tracked satellites by name, NORAD ID, or country...',
}
