import { copycat } from '@snaplet/copycat'
import { createSeedClient } from '@snaplet/seed'
import { ProfileTypeList } from 'oa-shared'

import { convertToSlug } from './src/utils/slug'
import questionsJson from './questions.json'

import type {
  categoriesChildInputs,
  categoriesScalars,
  commentsChildInputs,
  commentsScalars,
  profilesChildInputs,
  profilesInputs,
  profilesScalars,
  questionsChildInputs,
  questionsInputs,
  questionsScalars,
  subscribersChildInputs,
  subscribersScalars,
  tagsChildInputs,
  tagsScalars,
  useful_votesChildInputs,
  useful_votesScalars,
} from '@snaplet/seed'

/**
 * This script assumes the following database configuration.
 *
 * Totals:
 * - 10 users, 25 questions, 50 comments
 *
 * Distributions:
 * | Username         | Q? | Comments | Categories | Tags | Subscribers | Notes
 * | ------------------------------------------------------------------ | --------------------------------
 * | jereerickson92   | 10 | 10       | 0          | 0    | 9           | Has commented in every question
 * | aldaplaskett48   | 5  | 10       | 0          | 0    | 9           | Has commented a single question
 * | sampathpini67    | 4  | 5        | 0          | 0    | 9           | Has commented two questions
 * | galenagiugovaz15 | 3  | 5        | 0          | 0    | 9           | Has commented in response (only)
 * | veniaminjewell33 | 2  | 5        | 0          | 0    | 9           | Has commented in response of response
 * | cortneybrown81   | 1  | 5        | 0          | 0    | 9           |
 * | melisavang56     | 0  | 5        | 0          | 0    | 9           |
 * | lianabegam24     | 0  | 5        | 0          | 0    | 9           |
 * | akromstarkova72  | 0  | 0        | 0          | 0    | 9           |
 * | mirzoblazkova19  | 0  | 0        | 0          | 0    | 9           |
 */

//@ts-expect-error: Common properties (not default) + intellisense
const _PROFILES_BASE: profilesScalars = {
  /* text or text[] */
  tenant_id: 'precious-plastic',
  type: ProfileTypeList.MEMBER,
  roles: ['user'],
  tags: [],
  photo_url: null,
  /* json or json[] */
  links: null,
  location: null,
  notification_settings: null,
  patreon: null,
  impact: null,
  /* bool */
  is_verified: true,
  is_blocked_from_messaging: false,
  is_contactable: true,
  is_supporter: true,
  /* int4 or int8 */
  total_useful: 0,
  total_views: 0,
}

//@ts-expect-error: Common properties (not default) + intellisense
const _QUESTIONS_BASE: questionsScalars = {
  /* text or text[] */
  tenant_id: 'precious-plastic',
  moderation: 'accepted',
  legacy_id: null,
  previous_slugs: [],
  /* json or json[] */
  images: [],
  /* bool */
  deleted: false,
  /* int4 or int8 */
  tags: [],
}

//@ts-expect-error: Common properties (not default) + intellisense
const _COMMENTS_BASE: commentsScalars = {
  /* text or text[] */
  tenant_id: 'precious-plastic',
  legacy_id: null,
  source_id_legacy: null,
  /* int4 or int8 */
  parent_id: null,
  /* bool */
  deleted: false,
}

//@ts-expect-error: Common properties (not default) + intellisense
const _CATEGORIES_BASE: categoriesScalars = {
  /* text or text[] */
  tenant_id: 'precious-plastic',
  legacy_id: null,
}

//@ts-expect-error: Common properties (not default) + intellisense
const _TAGS_BASE: tagsScalars = {
  /* text or text[] */
  tenant_id: 'precious-plastic',
  legacy_id: null,
}

//@ts-expect-error: Common properties (not default) + intellisense
const _SUBSCRIBERS_BASE: subscribersScalars = {
  /* text or text[] */
  tenant_id: 'precious-plastic',
  /* custom */
  content_type: 'questions',
}

//@ts-expect-error: Common properties (not default) + intellisense
const _USEFUL_VOTES_BASE: useful_votesScalars = {
  /* text or text[] */
  tenant_id: 'precious-plastic',
  /* custom */
  content_type: 'questions',
}

/* prettier-ignore */
// TBD: What are tags for?
const seedTags = (): tagsChildInputs => [
  { ..._TAGS_BASE, name: 'tag 1' },
]
/* prettier-ignore-end */

/* prettier-ignore */
const seedProfiles = (): profilesChildInputs => [
  { ..._PROFILES_BASE, username: 'jereerickson92', display_name: 'Jere Erickson', country: 'Portugal', about: 'Passionate about creating meaningful connections and exploring new experiences. Whether it\'s traveling to new destinations, trying new foods, or diving into fresh hobbies, I\'m all about embracing the adventure in life. Let\'s chat and share our stories!' },
  { ..._PROFILES_BASE, username: 'aldaplaskett48', display_name: 'Alda Plaskett', country: 'Spain', about: 'Tech enthusiast, avid reader, and coffee lover. I spend my days coding, learning about the latest trends, and finding ways to innovate. Always up for a deep conversation or a good book recommendation. Let\'s connect and exchange ideas!' },
  { ..._PROFILES_BASE, username: 'sampathpini67', display_name: 'Sampath Pini', country: 'France', about: 'Fitness junkie who believes in the power of mental and physical health. When I\'m not in the gym, you can find me hiking, practicing yoga, or experimenting with healthy recipes. Looking for like-minded people who value balance and growth. Let\'s inspire each other!'  },
  { ..._PROFILES_BASE, username: 'galenagiugovaz15', display_name: 'Galena Giugovaz', country: 'Sudan', about: 'Curious traveler with a passion for photography and storytelling. Exploring the world, one city at a time, while capturing moments that tell unique stories. I believe that life is all about experiences and the memories we create. Let\'s share the journey!' },
  { ..._PROFILES_BASE, username: 'veniaminjewell33', display_name: 'Veniamin Jewell', country: 'Tuvalu', about: 'Creative soul with a love for design and innovation. I\'m always experimenting with new ways to bring ideas to life—whether it\'s through art, technology, or writing. Let\'s collaborate and create something beautiful together!' },
  { ..._PROFILES_BASE, username: 'cortneybrown81', display_name: 'Cortney Brown', country: 'Ukraine', about: 'Outgoing and energetic, I\'m always looking for new adventures and opportunities to grow. Whether it\'s trying a new hobby or tackling an exciting project, I\'m up for anything. Join me on my journey, and let\'s make the most out of every moment!' },
  { ..._PROFILES_BASE, username: 'melisavang56', display_name: 'Melisa Vang', country: 'Uruguay', about: 'Music is my life, and I\'m constantly seeking out new sounds and genres to explore. From playing instruments to attending live shows, I live and breathe rhythm. If you\'re passionate about music or just want to chat about the latest trends, let\'s connect!' },
  { ..._PROFILES_BASE, username: 'lianabegam24', display_name: 'Liana Begam', country: 'United States', about: 'Outdoor enthusiast and nature lover who finds peace in hiking, camping, and exploring the great outdoors. When I\'m not soaking up the beauty of nature, you\'ll find me sharing my love for the environment with others. Looking to meet fellow adventurers!' },
  { ..._PROFILES_BASE, username: 'akromstarkova72', display_name: 'Akrom Stárková', country: 'Yemen', about: 'Ambitious and driven, I strive to make the most out of every opportunity. Whether it\'s working on personal projects or helping others achieve their goals, I believe in continuous growth and learning. Let\'s build a community of success together!' },
  { ..._PROFILES_BASE, username: 'mirzoblazkova19', display_name: 'Mirzo Blažková', country: 'Zimbabwe', about: 'Bookworm with a passion for storytelling and deep discussions. I\'m always immersed in a good novel or seeking out new perspectives on life. Looking to connect with fellow book lovers or anyone interested in meaningful conversations. Let\'s dive into the world of words together!' },
]
/* prettier-ignore-end */

/* prettier-ignore */
const seedCategories = (): categoriesChildInputs => [
  { ..._CATEGORIES_BASE, name: 'Questions', type: 'questions' },
  { ..._CATEGORIES_BASE, name: 'Research', type: 'research' },
  { ..._CATEGORIES_BASE, name: 'Projects', type: 'projects' },
]
/* prettier-ignore-end */

// const seedComments = (
//   profile: profilesInputs,
//   questions: questionsInputs[],
// ): commentsChildInputs =>
//   Object.values(questionsJson)
//     .flat()
//     .flatMap((q) => q?.comments?.[profile.username!.toString()] ?? [])
//     .map((c) => ({
//       ..._COMMENTS_BASE,
//       comment: c,
//       source_id: questions.find((q) => q.id),
//     }))

// Do not set `created_by` this is will be automatic
const seedQuestions = (profile: profilesInputs): questionsChildInputs =>
  questionsJson[profile.username!.toString()]?.map((q) => ({
    ..._QUESTIONS_BASE,
    slug: convertToSlug(q.title),
    title: q.title,
    description: q.description,
    // TBD: Do replies also count to comment length?
    comment_count: q.comments?.length || 0,
  })) || []
// We need the empty array for users that don't have questions

/* prettier-ignore */
const seedSubscribers = (questions: questionsScalars[]): subscribersChildInputs =>
  questions.map((question) => (
    { ..._SUBSCRIBERS_BASE, content_id: question.id}
  ))
/* prettier-ignore-end */

/* prettier-ignore */
const seedUsefulVotes = (questions: questionsScalars[]): useful_votesChildInputs =>
  questions.map((question) => (
    { ..._USEFUL_VOTES_BASE, content_id: question.id }
  ))
/* prettier-ignore-end */

const main = async () => {
  const seed = await createSeedClient()

  await seed.$resetDatabase()

  const { profiles } = await seed.profiles(
    (seedProfiles() as Array<any>).map((profile: profilesInputs) => ({
      ...profile,
      // TBD: should this be null?
      firebase_auth_id: ({ seed }) => copycat.uuid(seed),
    })),
  )

  await seed.tags(seedTags())

  await seed.categories(seedCategories())

  /**
   * This should be interpreted as "What this user has related to him?" - what are his questions, comments, subscribers, etc.".
   */
  const questionsAcc: questionsScalars[] = []
  for (const profile of profiles) {
    const { questions } = await seed.questions(seedQuestions(profile), {
      connect: { profiles: [profile] },
    })
    questionsAcc.push(...questions)
  }

  // Assumption: all users are subscribed and voted to/in every category id (except their own categories)
  for (const profile of profiles) {
    const questionsExceptMine = questionsAcc.filter(
      (q) => q.created_by !== profile.id,
    )

    // await seed.comments(seedComments(profile, questionsExceptMine), {
    //   connect: { profiles: [profile] },
    // })

    await seed.subscribers(seedSubscribers(questionsExceptMine), {
      connect: { profiles: [profile] },
    })

    await seed.useful_votes(seedUsefulVotes(questionsExceptMine), {
      connect: { profiles: [profile] },
    })
  }

  process.exit()
}

main()
