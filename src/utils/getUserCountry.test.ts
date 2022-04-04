import { IUser } from 'src/models'
import { getUserCountry } from './getUserCountry'

const user: IUser = {
  _authID: '1',
  userName: 'testUser',
  displayName: 'test user',
  moderation: 'accepted',

  verified: true,
  coverImages: [],
  links: [],

  country: null,
  location: null,
}

describe('getUserCountry', () => {
  it('get user without country and location', () => {
    expect(getUserCountry(user)).toBe('')
  })

  it('get user without country but with location', () => {
    user.location = {
      name: '',
      country: 'uk',
      countryCode: 'uk',
      administrative: '',
      latlng: {
        lat: 1,
        lng: 1,
      },
      postcode: '',
      value: '',
    }
    expect(getUserCountry(user)).toBe('uk')
  })

  it('get user with country', () => {
    user.location = null
    user.country = 'uk'

    expect(getUserCountry(user)).toBe('uk')
  })

})
