export interface BPMember {
  id: number
  name: string
  email: string
  user_login: string
  link: string
  member_types: []
  xprofile: {
    groups: {
      '1': {
        name: 'Base'
        fields: {
          '1': {
            name: 'Name'
            value: string
          }
          '8': {
            name: 'Birthday'
            value: string
          }
          '38': {
            name: 'Website'
            value: string
          }
          '42': {
            name: 'Location'
            value: string
          }
          '667': {
            name: 'About'
            value: string
          }
          '1055': {
            name: 'Your love'
            value: [string[]]
          }
        }
      }
      '2': {
        name: 'Additional information'
        fields: {
          '1264': {
            name: 'Country'
            value: string
          }
        }
      }
    }
  }
  mention_name: 'fernandochacon'
  avatar_urls: {
    full: string
    thumb: string
  }
  _links: {
    self: [
      {
        href: string
      }
    ]
    collection: [
      {
        href: string
      }
    ]
  }
}
