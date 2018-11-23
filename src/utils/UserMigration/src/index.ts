import csvtojson from 'csvtojson'
import { writeFile } from 'fs'

/*
A few quick and messy functions to parse legacy user csv,
split into chunks of 10,000, and save as json

requires data/one-army-users.csv which should be formatted
with the column headings shown below
*/

const legacyDataFormats = {
  legacy_id: 'number',
  login: 'string',
  password: 'string',
  password_alg: 'string',
  email: 'string',
  legacy_registered: 'string',
  display_name: 'string',
  first_name: 'string',
  last_name: 'string',
  nickname: 'string',
  country: 'string',
}

const init = async () => {
  const json = await csvtojson({
    colParser: legacyDataFormats,
    checkType: true,
  }).fromFile('src/data/one-army-users.csv')
  createUserFileChunks(json)
}

const createUserFileChunks = (users: any[]) => {
  console.log('creating file chunks')
  const chunkSize = 10000
  const chunks = Math.floor(users.length / chunkSize)
  for (let i = 0; i <= chunks; i++) {
    const chunkEnd = Math.min(users.length, chunkSize * (i + 1))
    const subset = [...users.slice(chunkSize * i, chunkEnd)]
    writeFile(`src/data/subset_${i}.json`, JSON.stringify(subset), () => null)
    console.log('subset size', subset.length)
  }
}

init()
