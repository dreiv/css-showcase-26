import { ref } from 'vue'
import type { SortKey, SortDir } from './types'

export function useSort() {
  const sortKey = ref<SortKey>('name')
  const sortDir = ref<SortDir>('asc')

  function toggleSort(key: SortKey) {
    if (sortKey.value === key) {
      sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortKey.value = key
      sortDir.value = 'asc'
    }
  }

  function ariaSort(key: SortKey) {
    if (sortKey.value !== key) return 'none'
    return sortDir.value === 'asc' ? 'ascending' : 'descending'
  }

  return {
    sortKey,
    sortDir,
    toggleSort,
    ariaSort,
  }
}
