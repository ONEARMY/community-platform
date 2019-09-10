const endpoint = 'https://testwp.onearmy.world/wp-json/aam/v1/authenticate'
import axios from 'axios'
import { firebaseAdmin } from '../Firebase/admin'
// tslint:disable no-implicit-dependencies
import { IUser } from '@OAModels/user.models'

export const DHLogin = async (username: string, password: string) => {
  const dhJWT = await DHGetJWTToken(username, password)
  const userId = dhJWT.user.data.user_login
  const claims = mergeDhData(dhJWT)
  return firebaseAdmin.auth().createCustomToken(userId, claims)
}

// Use AAM plugin on DH site to generate JWT token from DH site
// User credentials are validated and a JWT token passed back on successful user login
const DHGetJWTToken = async (username: string, password: string) => {
  const body = { username, password }
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
  const res = await axios.post(endpoint, body, { headers: headers })
  const token: IDHTokenResponse = res.data
  return token
}

// when logging in via dh site a JWT token is returned with a variety of user profile information
// want to extract data from token and format in way consistent with other users (OpenIDConnect)
// and fields that will be used in the platform
const mergeDhData = (dhJWT: IDHTokenResponse) => {
  const oidcClaims = {
    email: dhJWT.user.data.user_email,
    name: dhJWT.user.data.display_name,
  }
  const additionalUserClaims: Partial<IUser> = {
    DHSite_id: dhJWT.user.ID,
    DHSite_mention_name: dhJWT.user.data.user_login,
  }
  return { ...oidcClaims, ...additionalUserClaims }
}

/********************************************************************************************************
 *  Interfaces and Mocks
 *********************************************************************************************************/
interface IDHTokenResponse {
  token: string
  token_expires: string
  user: {
    data: {
      ID: string
      user_login: string
      user_pass: string
      user_nicename: string
      user_email: string
      user_url: string
      user_registered: string
      user_activation_key: string
      user_status: string
      display_name: string
    }
    ID: number
    caps: {
      subscriber: boolean
    }
    cap_key: string
    roles: string[]
    allcaps: {
      read: boolean
      level_0: boolean
      subscriber: boolean
    }
    filter: null
  }
}

const LOGIN_MOCK: IDHTokenResponse = {
  token:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NjgxMjcxNzQsImlzcyI6Imh0dHA6XC9cL3Rlc3R3cC5vbmVhcm15LndvcmxkIiwiZXhwIjoiMDlcLzExXC8yMDE5LCAxNDo1MiArMDAwMCIsImp0aSI6ImM2OGE1YWViLWJjZjQtNDNmOS1iYjJiLTFmODVmNDc2YTEyNSIsInVzZXJJZCI6MiwicmV2b2NhYmxlIjp0cnVlLCJyZWZyZXNoYWJsZSI6ZmFsc2V9.4yxRenweWSJ69gNg_2RhqxpMozBN29FGODcx82L5a7A',
  token_expires: '09/11/2019, 14:52 +0000',
  user: {
    data: {
      ID: '2',
      user_login: 'testwp',
      user_pass: '$P$Bw2/hfTcHvHXLKawFMST3OSE5CxmIN0',
      user_nicename: 'testwp',
      user_email: 'testwp@test.com',
      user_url: '',
      user_registered: '2019-09-10 11:55:34',
      user_activation_key: '',
      user_status: '0',
      display_name: 'testwp',
    },
    ID: 2,
    caps: {
      subscriber: true,
    },
    cap_key: 'wp_capabilities',
    roles: ['subscriber'],
    allcaps: {
      read: true,
      level_0: true,
      subscriber: true,
    },
    filter: null,
  },
}
