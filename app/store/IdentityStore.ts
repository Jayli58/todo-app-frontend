'use client';

import { create } from 'zustand';
import {IdentityInfo} from "../dataType/IdentityInfo";

interface IdentityState {
    identity: IdentityInfo | null;
    setIdentity: (identity: IdentityInfo) => void;
}

export const useIdentityStore = create<IdentityState>((set) => ({
    identity: null,
    setIdentity: (identity) => set({ identity }),
}));
