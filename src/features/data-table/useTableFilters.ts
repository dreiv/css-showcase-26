import { computed, ref } from "vue";
import { products } from "../../data/products";

export function useTableFilters() {
  const categories = [...new Set(products.map((p) => p.category))];
  const selectedCategories = ref<string[]>([...categories]);
  const inStockOnly = ref(false);
  const maxPrice = ref<number | null>(null);

  function clearFilters() {
    selectedCategories.value = [...categories];
    inStockOnly.value = false;
    maxPrice.value = null;
  }

  const activeFilterCount = computed(() => {
    let n = 0;
    if (selectedCategories.value.length !== categories.length) n++;
    if (inStockOnly.value) n++;
    if (maxPrice.value) n++;
    return n;
  });

  return {
    categories,
    selectedCategories,
    inStockOnly,
    maxPrice,
    clearFilters,
    activeFilterCount,
  };
}
