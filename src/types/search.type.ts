export interface SearchField {
  key: string
  label: string
  type?: 'text' | 'number'
  validator?: (value: string) => boolean
}

export interface SearchConfig {
  searchFields: SearchField[]
  allowPartialMatch?: boolean
  caseSensitive?: boolean
  minQueryLength?: number
  placeholder?: string
  searchOnType?: boolean
}

export interface SearchResult {
  results: any[]
  totalCount: number
  filteredCount: number
  isActive: boolean
  query: string
}

export interface SearchProps {
  data: any[]
  config: SearchConfig
  modelValue?: string
}

export interface TrackedSatellite {
  name: string
  noradCatId: string
  countryCode: string
}
