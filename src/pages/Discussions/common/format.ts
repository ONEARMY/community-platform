import differenceInDays from 'date-fns/difference_in_days'
export const durationSincePosted = (postDate: string) =>
  `${differenceInDays(new Date(), new Date(postDate))} days`
