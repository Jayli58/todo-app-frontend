'use client';

import { create } from 'zustand';
import {FilterType} from "../dataType/FilterTypes";

interface FilterState {
    filter: FilterType;
    setFilter: (filterType: FilterType) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
    filter: FilterType.ALL,
    setFilter: (filterType) => set({ filter: filterType }),
}));
