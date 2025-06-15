import axios from 'axios'
import {
  type SatelliteQueryParams,
  type SatelliteData,
  ObjectType,
  Attribute,
  Sort,
  type SortDirection,
} from '@/types/home.types'
import { useProjectStore } from '@/stores/project'

const getSatellitesData = async (params?: SatelliteQueryParams): Promise<SatelliteData[]> => {
  try {
    useProjectStore().setIsLoadingSatellite(true)
    const objectTypes =
      params?.objectTypes && params?.objectTypes?.length !== 0
        ? params?.objectTypes
        : Object.values(ObjectType)
    const attributes =
      params?.attributes && params?.attributes?.length !== 0
        ? params?.attributes
        : Object.values(Attribute)

    const response = await axios.get('/v1/satellites', {
      params: {
        objectTypes: objectTypes?.join(','),
        attributes: attributes?.join(','),
      },
    })
    useProjectStore().setAllSatellites(response?.data?.data)
    return response?.data?.data || []
  } catch (error) {
    throw error
  } finally {
    useProjectStore().setIsLoadingSatellite(false)
  }
}

const cleanOrbitCode = (orbitCode: string) => (orbitCode ? orbitCode.replace(/[{}]/g, '') : '')

const getFiltersFromLocalStorage = () => {
  const filterFromLS = JSON.parse(localStorage.getItem('selectedFilters') as string)
  if (
    filterFromLS &&
    (filterFromLS.selectedObjectTypes.length !== 0 || filterFromLS.selectedOrbitCodes.length !== 0)
  ) {
    return filterFromLS
  }
  return null
}

const handleSort = (
  key: keyof SatelliteData,
  direction: SortDirection,
  allSatellites: SatelliteData[],
) => {
  const dir = direction === Sort.ASC ? 1 : -1
  const sorted = [...allSatellites].sort((a, b) => {
    const av = a[key]
    const bv = b[key]
    if (av == null && bv == null) return 0
    if (av == null) return -dir
    if (bv == null) return dir
    return av === bv ? 0 : av > bv ? dir : -dir
  })
  return sorted
}

export default {
  getSatellitesData,
  getFiltersFromLocalStorage,
  cleanOrbitCode,
  handleSort,
}
