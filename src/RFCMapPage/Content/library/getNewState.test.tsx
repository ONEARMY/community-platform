import { getFixedTestsPins } from './testHelpers'
import { IMapPin, IMapControllerState } from '../../types'
import { unGroupPins, getGroupKey } from './utils'

import { getNewState } from './getNewState'

describe('getNewState', () => {
  describe('SET_DATA', () => {
    it('with empty data', async () => {
      // Arrange
      const testsData: IMapPin[] = []
      const beforeState: IMapControllerState = {
        mapPinsGrouped: {},
        filters: {},
        filteredPins: []
      }

      // Act
      const act = getNewState(beforeState, { type: "SET_DATA", payload: testsData })

      // Assert
      expect(act).toStrictEqual(beforeState)
    })

    it('with empty state before', async () => {
      // Arrange
      const testsData = getFixedTestsPins()
      const beforeState: IMapControllerState = {
        mapPinsGrouped: {},
        filters: {},
        filteredPins: []
      }

      // Act
      const act = getNewState(beforeState, { type: "SET_DATA", payload: testsData })

      // Assert
      expect(Object.keys(act.mapPinsGrouped)).toStrictEqual(testsData.map(p => getGroupKey(p)))
      expect(unGroupPins(act.mapPinsGrouped).map(f => f._id)).toStrictEqual(testsData.map(f => f._id))
      expect(Object.keys(act.mapPinsGrouped)).toStrictEqual(Object.keys(act.filters))
      expect(Object.values(act.filters).map(f => f._count)).toStrictEqual([1, 1])
      expect(act.filteredPins.map(f => f._id)).toStrictEqual(testsData.map(f => f._id))
    })

    it('with full state before', async () => {
      // Arrange
      const testsData = getFixedTestsPins()
      const emptyState: IMapControllerState = {
        mapPinsGrouped: {},
        filters: {},
        filteredPins: []
      }
      const beforeState = getNewState(emptyState, { type: "SET_DATA", payload: testsData })

      // Act
      const act = getNewState(beforeState, { type: "SET_DATA", payload: testsData })

      // Assert
      expect(Object.keys(act.mapPinsGrouped)).toStrictEqual(testsData.map(p => getGroupKey(p)))
      expect(unGroupPins(act.mapPinsGrouped).map(f => f._id)).toStrictEqual(testsData.map(f => f._id))
      expect(Object.keys(act.mapPinsGrouped)).toStrictEqual(Object.keys(act.filters))
      expect(Object.values(act.filters).map(f => f._count)).toStrictEqual([1, 1])
      expect(act.filteredPins.map(f => f._id)).toStrictEqual(testsData.map(f => f._id))
    })

    describe('SET_FILTER', () => {
      it('unselect & select', () => {
        // Arrange
        const testsData = getFixedTestsPins()
        const initialState: IMapControllerState = {
          mapPinsGrouped: {},
          filters: {},
          filteredPins: []
        }
        const beforeAct = getNewState(initialState, { type: "SET_DATA", payload: testsData })
        const filtersNames = Object.keys(beforeAct.filters)
        
        expect(filtersNames.length).toBe(2)
        expect(Object.values(beforeAct.filters).map(f => f.active)).toStrictEqual([true, true])
        expect(beforeAct.filteredPins.map(f => f._id)).toStrictEqual(testsData.map(f => f._id))

        // Act 1
        let newFilter = {
          name: filtersNames[0],
          active: false
        }
        const act_1 = getNewState(beforeAct, { type: "SET_FILTER", payload: newFilter })

        // Assert 1
        expect(act_1.mapPinsGrouped).toStrictEqual(beforeAct.mapPinsGrouped)
        expect(Object.values(act_1.filters).map(f => f.active)).toStrictEqual([false, true])
        expect(act_1.filteredPins.length).toBe(1)
        expect(act_1.filteredPins[0]._id).toStrictEqual(testsData[1]._id)

        // Act 2
        newFilter = {
          name: filtersNames[1],
          active: false
        }
        const act_2 = getNewState(act_1, { type: "SET_FILTER", payload: newFilter })

        // Assert 2
        expect(Object.values(act_2.filters).map(f => f.active)).toStrictEqual([false, false])
        expect(act_2.filteredPins.length).toBe(0)

        // Act 3
        newFilter = {
          name: filtersNames[1],
          active: true
        }
        const act_3 = getNewState(act_2, { type: "SET_FILTER", payload: newFilter })

        // Assert 3
        expect(Object.values(act_3.filters).map(f => f.active)).toStrictEqual([false, true])
        expect(act_3.filteredPins.length).toBe(1)
        expect(act_3.filteredPins[0]._id).toStrictEqual(testsData[1]._id)
      })

    })
  })
})