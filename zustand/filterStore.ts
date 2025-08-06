import { create } from "zustand";

interface FilterState {
    showFilter: boolean;
    categoryFilter: string;
    setShowFilter: (visible: boolean) => void;
    setCategoryFilter: (category: string) => void;
}

const useFilterStore = create<FilterState>((set) => ({
    showFilter: false,
    categoryFilter: "전체",
    setShowFilter: (visible) => set({ showFilter: visible }),
    setCategoryFilter: (category) => set({ categoryFilter: category }),
}));

export default useFilterStore;
