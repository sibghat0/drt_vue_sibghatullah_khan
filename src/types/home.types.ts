export enum ObjectType {
  ROCKET_BODY = 'ROCKET BODY',
  DEBRIS = 'DEBRIS',
  UNKNOWN = 'UNKNOWN',
  PAYLOAD = 'PAYLOAD',
}

export enum Attribute {
  NORAD_CAT_ID = 'noradCatId',
  INTL_DES = 'intlDes',
  NAME = 'name',
  LAUNCH_DATE = 'launchDate',
  DECAY_DATE = 'decayDate',
  OBJECT_TYPE = 'objectType',
  LAUNCH_SITE_CODE = 'launchSiteCode',
  COUNTRY_CODE = 'countryCode',
  ORBIT_CODE = 'orbitCode',
}

export enum OrbitCode {
  LEO = 'LEO',
  LEO1 = 'LEO1',
  LEO2 = 'LEO2',
  LEO3 = 'LEO3',
  LEO4 = 'LEO4',
  MEO = 'MEO',
  GEO = 'GEO',
  HEO = 'HEO',
  IGO = 'IGO',
  EGO = 'EGO',
  NSO = 'NSO',
  GTO = 'GTO',
  GHO = 'GHO',
  HAO = 'HAO',
  MGO = 'MGO',
  LMO = 'LMO',
  UFO = 'UFO',
  ESO = 'ESO',
  UNKNOWN = 'UNKNOWN',
}

export interface SatelliteQueryParams {
  objectTypes?: ObjectType[]
  attributes?: Attribute[]
}

export interface SatelliteData {
  noradCatId: string
  intlDes: string
  name: string
  launchDate?: string
  decayDate?: string | null
  objectType?: ObjectType
  launchSiteCode?: string
  countryCode?: string
  orbitCode?: OrbitCode
}

export interface Filters {
  selectedObjectTypes: ObjectType[]
  selectedOrbitCodes: OrbitCode[]
}

export interface TableColumn {
  key: string
  label: string
  width?: string
  type?: 'text' | 'checkbox' | 'custom'
  formatter?: (value: any, row: SatelliteData) => string
  sortable?: boolean
  visible?: boolean
}

export enum Sort {
  ASC = 'asc',
  DESC = 'desc',
}

export type SortDirection = Sort.ASC | Sort.DESC

export interface TableProps {
  displayedSatellites: SatelliteData[]
  selectedItems: SatelliteData[]
  isLoadingSatellite: boolean
  sortKey: keyof SatelliteData | null
  sortDir: SortDirection | undefined
}

export interface TableEmits {
  (scroll: 'scroll'): void
  (check: 'checkboxClick', selectedItem: SatelliteData, event: Event): void
  (sort: 'sort', key: keyof SatelliteData, direction: SortDirection): void
}
