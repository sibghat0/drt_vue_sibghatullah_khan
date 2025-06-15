import homeService from '@/service/home.service'
import type { TableColumn } from '@/types/home.types'

export const tableConfig: TableColumn[] = [
  { key: 'select', label: '', type: 'checkbox', visible: true },
  {
    key: 'noradCatId',
    label: 'NORAD ID',
    type: 'text',
    visible: true,
    sortable: true,
  },
  {
    key: 'name',
    label: 'NAME',
    type: 'text',
    visible: true,
    sortable: true,
  },
  {
    key: 'orbitCode',
    label: 'ORBIT CODE',
    type: 'custom',
    visible: true,
    formatter: (v: string) => homeService.cleanOrbitCode(v),
  },
  {
    key: 'objectType',
    label: 'OBJECT TYPE',
    type: 'text',
    visible: true,
  },
  {
    key: 'countryCode',
    label: 'COUNTRY',
    type: 'text',
    visible: true,
    sortable: true,
  },
  {
    key: 'launchDate',
    label: 'LAUNCH DATE',
    type: 'text',
    visible: true,
    sortable: true,
  },
]
