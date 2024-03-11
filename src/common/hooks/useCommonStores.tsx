import React from 'react'

import { RootStore } from '../../stores/RootStore'

import type { IRootStore } from '../../stores/RootStore'

const rootStore = new RootStore()

export const rootStoreContext = React.createContext<IRootStore>(rootStore)

/**
 * Additional store and db exports for use in modern context consumers
 * @example const {userStore} = useCommonStores().stores
 */
export const useCommonStores = () =>
  React.useContext<RootStore>(rootStoreContext)
