import { createContext, useContext } from 'react'

export class AdminStore {}

/**
 * Export an empty context object to be shared with components
 * The context will be populated with the researchStore in the module index
 * (avoids cyclic deps and ensure shared module ready)
 */
export const AdminStoreContext = createContext<AdminStore>(null as any)
export const useAdminStore = () => useContext(AdminStoreContext)
