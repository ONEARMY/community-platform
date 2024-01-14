export type availableGlyphs =
  | 'account-circle'
  | 'add'
  | 'arrow-back'
  | 'arrow-down'
  | 'arrow-forward'
  | 'arrow-full-down'
  | 'arrow-full-up'
  | 'bazar'
  | 'check'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-up'
  | 'close'
  | 'comment'
  | 'discord'
  | 'delete'
  | 'difficulty'
  | 'download'
  | 'download-cloud'
  | 'edit'
  | 'email'
  | 'email-outline'
  | 'employee'
  | 'external-link'
  | 'external-url'
  | 'facebook'
  | 'filter'
  | 'flag-unknown'
  | 'hide'
  | 'image'
  | 'instagram'
  | 'loading'
  | 'location-on'
  | 'lock'
  | 'machine'
  | 'mail-outline'
  | 'more-vert'
  | 'notifications'
  | 'pdf'
  | 'plastic'
  | 'revenue'
  | 'show'
  | 'slack'
  | 'social-media'
  | 'star'
  | 'star-active'
  | 'step'
  | 'supporter'
  | 'thunderbolt'
  | 'time'
  | 'turned-in'
  | 'update'
  | 'upload'
  | 'useful'
  | 'verified'
  | 'view'
  | 'volunteer'
  | 'website'

export type IGlyphs = { [k in availableGlyphs]: JSX.Element }