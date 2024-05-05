import { MemberBadge } from 'oa-components'
import VerifiedBadgeIcon from 'src/assets/icons/icon-verified-badge.svg'
import { filterMapPinsByType } from 'src/stores/Maps/filter'
import { Image } from 'theme-ui'

import { transformSpecialistWorkspaceTypeToWorkspace } from './transformSpecialistWorkspaceTypeToWorkspace'

import type { IPinGrouping } from 'oa-shared'
import type { IMapGrouping, IMapPin, WorkspaceType } from 'src/models'
import type { ProfileTypeLabel } from 'src/modules/profile/types'

const ICON_SIZE = 30

const asOptions = (mapPins, items: Array<IMapGrouping>): FilterGroupOption[] =>
  (items || [])
    .filter((item) => {
      return !item.hidden
    })
    .map((item) => {
      const filterType =
        (item.type as string) === 'verified'
          ? ['verified']
          : item.subType
          ? item.subType.split(' ')
          : item.type.split(' ')

      const value = item.subType ? item.subType : item.type

      return {
        label: item.displayName,
        value,
        number: filterMapPinsByType(mapPins, filterType).length,
        imageElement:
          (item.type as string) === 'verified' ? (
            <Image src={VerifiedBadgeIcon} width={ICON_SIZE} />
          ) : (
            <MemberBadge
              size={ICON_SIZE}
              profileType={transformSpecialistWorkspaceTypeToWorkspace(value)}
            />
          ),
      }
    })
    .filter(({ number }) => !!number) //LADEBUG

type FilterGroupOption = {
  label: string
  value: WorkspaceType | ProfileTypeLabel
  number: number
  imageElement: JSX.Element
}

export type FilterGroup = {
  label: string
  options: FilterGroupOption[]
}

type FilterItem = {
  grouping: string
  displayName: string
  type: ProfileTypeLabel | 'verified'
}

export const transformAvailableFiltersToGroups = (
  mapPinList: IMapPin[],
  availableFilters: FilterItem[],
): FilterGroup[] => {
  const reducedItems = availableFilters.reduce((accumulator, current) => {
    const { grouping } = current
    if (accumulator[grouping] === undefined) {
      accumulator[grouping] = []
    }
    accumulator[grouping].push(current)
    return accumulator
  }, {} as Record<IPinGrouping, Array<IMapGrouping>>)

  return Object.keys(reducedItems).map((item) => {
    let label = item === 'place' ? 'All Workspaces' : 'Others'

    if (item === 'verified-filter') {
      label = ''
    }

    return {
      label,
      options: asOptions(mapPinList, reducedItems[item]),
    }
  })
}
