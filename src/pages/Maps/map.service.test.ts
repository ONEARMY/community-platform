import { mapPinService } from "./map.service";

describe('map.service', () => {
  describe('getMapPins', () => {
    it('fetches map pins', async () => {
      // prepare
      global.fetch = jest.fn().mockResolvedValue({
        json: () => Promise.resolve([{ _id: '1' }]),
      })

      // act
      const result = await mapPinService.getMapPins()

      // assert
      expect(result).toEqual([{ _id: '1' }])
    });

    it('handles errors', async () => {
      // prepare
      global.fetch = jest.fn().mockRejectedValue('error')

      // act
      const result = await mapPinService.getMapPins()

      // assert
      expect(result).toEqual([])
    });
  });

  describe('getMapPinByUserId', () => {
    it('fetches map pin by user id', async () => {
      // prepare
      global.fetch = jest.fn().mockResolvedValue({
        json: () => Promise.resolve({ _id: '1' }),
      })

      // act
      const result = await mapPinService.getMapPinByUserId('1', false)

      // assert
      expect(result).toEqual({ _id: '1' })
    });

    it('handles errors', async () => {
      // prepare
      global.fetch = jest.fn().mockRejectedValue('error')

      // act
      const result = await mapPinService.getMapPinByUserId('1', false)

      // assert
      expect(result).toBeNull()
    });
  });
});