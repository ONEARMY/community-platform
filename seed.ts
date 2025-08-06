import { createSeedClient } from '@snaplet/seed'
import * as allData from 'oa-shared/mocks/data'

import libraryJson from './.snaplet/library.json'
import questionsJson from './.snaplet/questions.json'
import { profilesSeed } from './seed/profilesSeed'
import { usersSeed } from './seed/usersSeed'
import { convertToSlug } from './src/utils/slug'

import type {
  categoriesChildInputs,
  categoriesScalars,
  map_pinsScalars,
  newsScalars,
  profile_badges_relationsScalars,
  profile_badgesScalars,
  profilesInputs,
  profilesScalars,
  project_stepsChildInputs,
  projectsScalars,
  questionsChildInputs,
  questionsScalars,
  researchScalars,
  subscribersChildInputs,
  subscribersScalars,
  tagsChildInputs,
  tagsScalars,
  useful_votesChildInputs,
  useful_votesScalars,
} from '@snaplet/seed'

const tenant_id = `precious-plastic`

const MOCK_DATA = {
  ...allData,
}

const _QUESTIONS_BASE: Partial<questionsScalars> = {
  tenant_id,
  moderation: 'accepted',
  legacy_id: null,
  previous_slugs: [],
  images: [],
  deleted: false,
  tags: [],
}

const _PROJECT_BASE: Partial<projectsScalars> = {
  tenant_id,
  moderation: 'accepted',
  legacy_id: null,
  previous_slugs: [],
  deleted: false,
  tags: [],
  is_draft: false,
  file_download_count: 0,
  total_views: 0,
  comment_count: 0,
}

const _PROJECT_STEP_BASE = {
  tenant_id,
  images: null,
  video_url: null,
}

const _CATEGORIES_BASE: Partial<categoriesScalars> = {
  tenant_id,
  legacy_id: null,
}

const _TAGS_BASE: Partial<tagsScalars> = {
  tenant_id,
  legacy_id: null,
}

const _SUBSCRIBERS_BASE: Partial<subscribersScalars> = {
  tenant_id,
  content_type: 'questions',
}

const _USEFUL_VOTES_BASE: Partial<useful_votesScalars> = {
  tenant_id,
  content_type: 'questions',
}

const _BADGES_BASE: Partial<profile_badgesScalars> = {
  tenant_id,
}

const _BADGES_RELATIONS_BASE: Partial<profile_badges_relationsScalars> = {
  tenant_id,
}

const seedTags = (): tagsChildInputs => [{ ..._TAGS_BASE, name: 'tag 1' }]

// const seedProfileTags = (): profile_tagsChildInputs =>
//   MOCK_DATA.profileTags.map((tag) => ({
//     ...tag,
//     tenant_id,
//   }))

const seedBadges = (): Partial<profile_badgesScalars>[] => [
  { ..._BADGES_BASE, name: 'supporter', display_name: 'Supporter' },
  { ..._BADGES_BASE, name: 'pro', display_name: 'PRO' },
]

/// populates badges: 2/3 of profiles to have: 1 and 2 badges, others remain with no badge
const seedBadgesRelations = (
  profiles: profilesScalars[],
  badges: profile_badgesScalars[],
): Partial<profile_badges_relationsScalars>[] => {
  const relations: Partial<profile_badges_relationsScalars>[] = []

  const profilesPerGroup = Math.ceil(profiles.length / 3)
  const oneBadgeGroup = profiles.slice(profilesPerGroup, profilesPerGroup * 2)
  const twoBadgesGroup = profiles.slice(profilesPerGroup * 2)

  // 1 badge each
  for (const profile of oneBadgeGroup) {
    relations.push({
      ..._BADGES_RELATIONS_BASE,
      profile_id: profile.id,
      profile_badge_id: badges[0].id,
    })
  }

  // all (2) badges each
  for (const profile of twoBadgesGroup) {
    for (let i = 0; i < badges.length; i++) {
      relations.push({
        ..._BADGES_RELATIONS_BASE,
        profile_id: profile.id,
        profile_badge_id: badges[i].id,
      })
    }
  }

  return relations
}

const seedMapPins = (
  profiles: profilesScalars[],
): Partial<map_pinsScalars>[] => {
  const pins: Partial<map_pinsScalars>[] = []

  const pinsSeed = MOCK_DATA.mapPins
  const minLength = Math.min(pinsSeed.length, profiles.length)

  for (let i = 0; i < minLength; i++) {
    pins.push({
      ...pinsSeed[i],
      tenant_id,
      profile_id: profiles[i].id,
    })
  }

  return pins
}

const seedCategories = (): categoriesChildInputs => [
  { ..._CATEGORIES_BASE, name: 'Questions', type: 'questions' },
  { ..._CATEGORIES_BASE, name: 'Research', type: 'research' },
  { ..._CATEGORIES_BASE, name: 'Guides', type: 'projects' },
  { ..._CATEGORIES_BASE, name: 'Machines', type: 'projects' },
  { ..._CATEGORIES_BASE, name: 'Moulds', type: 'projects' },
  { ..._CATEGORIES_BASE, name: 'Products', type: 'projects' },
  { ..._CATEGORIES_BASE, name: 'Important Updates', type: 'news' },
]

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

const seedQuestions = (profile: profilesInputs): questionsChildInputs =>
  questionsJson[profile.username!.toString()]?.map((q) => ({
    ..._QUESTIONS_BASE,
    slug: convertToSlug(q.title),
    title: q.title,
    description: q.description,
    comment_count: q.comments?.length || 0,
  })) || []

const seedSubscribers = (
  questions: questionsScalars[],
): subscribersChildInputs =>
  questions.map((question) => ({
    ..._SUBSCRIBERS_BASE,
    content_id: question.id,
  }))

const seedUsefulVotes = (
  questions: questionsScalars[],
): useful_votesChildInputs =>
  questions.map((question) => ({
    ..._USEFUL_VOTES_BASE,
    content_id: question.id,
  }))

const bigBlockOfMarkdown = `# h1 Heading 8-)

## h2 Heading

### h3 Heading

#### h4 Heading

##### h5 Heading

###### h6 Heading

## Horizontal Rule

***

## Typographic replacements

Enable typographer option to see result.

(c) (C) (r) (R) (tm) (TM) (p) (P) +-

test.. test... test..... test?..... test!....

!!!!!! ???? ,,  -- ---

"Smartypants, double quotes" and 'single quotes'

![Image](https://firebasestorage.googleapis.com/v0/b/precious-plastics-v4-dev.appspot.com/o/uploads%2Fusers%2Fbenfurber%2F_DSC4756-19271d67d1f-19610bd3504.jpg?alt=media&token=27751401-8000-4592-9f7e-800497463dce)

## Emphasis

**This is bold text**

**This is bold text**

*This is italic text*

*This is italic text*

~~Strikethrough~~

## Blockquotes

> Blockquotes can also be nested...> ...by using additional greater-than signs right next to each other...> ...or with spaces between arrows.

## Lists

Unordered

* Sub-lists are made by indenting 2 spaces:
  * Marker character change forces new list start:
    * Ac tristique libero volutpat at
    - Facilisis in pretium nisl aliquet
    * Nulla volutpat aliquam velit
* Very easy!

Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa
4. You can use sequential numbers...

Start numbering with offset:

1. foo
2. bar

| ddd  | ddd | 333 |
| ---- | --- | --- |
| rthd | dfb | rr  |
| fbnv | gf  | r   |

## Links

[link text](http://dev.nodeca.com)

[link with title](http://nodeca.github.io/pica/demo/ "title text!")

Autoconverted link [https://github.com/nodeca/pica](https://github.com/nodeca/pica) (enable linkify to see)
`

const base_news: Partial<newsScalars> = {
  comment_count: 0,
  hero_image: null,
  moderation: null,
  previous_slugs: [],
  tenant_id,
  total_views: 0,
}

const seedNews: Partial<newsScalars>[] = [
  {
    ...base_news,
    title: 'First news article!',
    body: bigBlockOfMarkdown,
    slug: 'first-news-article',
    summary: 'The first',
  },
]

const seedLibrary = (): Partial<projectsScalars>[] => [
  ...libraryJson.map((p: any) => ({
    ..._PROJECT_BASE,
    slug: convertToSlug(p.title),
    title: p.title,
    description: p.description,
    difficulty_level: p.difficulty_level,
    time: p.time,
    moderation: p.moderation,
    file_link: p.file_link,
    comment_count: p.comments?.length || 0,
  })),
]

const seedProjectSteps = (
  projects: projectsScalars[],
): project_stepsChildInputs => {
  const steps: any[] = []

  libraryJson.forEach((p: any, index: number) => {
    if (p.steps && Array.isArray(p.steps)) {
      p.steps.forEach((step: any) => {
        steps.push({
          ..._PROJECT_STEP_BASE,
          project_id: projects[index]?.id,
          title: step.title,
          description: step.description,
          images: step.images || null,
          video_url: step.video_url || null,
        })
      })
    }
  })

  return steps
}

const baseResearch: Partial<researchScalars> = {
  status: 'in-progress',
  previous_slugs: [],
  tenant_id,
  total_views: 0,
  collaborators: [],
}

const seedResearch: Partial<researchScalars>[] = [
  {
    ...baseResearch,
    title: 'The First Big Old Research Topic',
    description: 'This is a super important area to investigate.',
    slug: 'the-first-big-old-research-topic',
  },
]

const main = async () => {
  const seed = await createSeedClient()

  await seed.$resetDatabase()

  await seed.buckets([
    {
      name: tenant_id,
      public: true,
      allowed_mime_types: [''],
    },
    { name: `${tenant_id}-documents` },
  ])

  await seed.tenant_settings([
    {
      site_name: 'Local Development Community',
      site_url: 'http://localhost:3000',
      message_sign_off: 'The Dev Team',
      email_from: 'platform@onearmy.earth',
      site_image:
        'https://wbskztclbriekwpehznv.supabase.co/storage/v1/object/public/precious-plastic/pp-logo.png',
      tenant_id,
    },
  ])

  const { users } = await seed.users(usersSeed())
  // await seed.profile_tags(seedProfileTags())

  const { profiles } = await seed.profiles(
    (profilesSeed(tenant_id) as Array<any>).map(
      (profile: profilesInputs, index) => ({
        ...profile,
        auth_id: users[index].id,
      }),
    ),
  )

  const { profile_badges } = await seed.profile_badges(seedBadges())
  await seed.profile_badges_relations(
    seedBadgesRelations(profiles, profile_badges),
  )

  await seed.map_pins(seedMapPins(profiles))
  const { tags } = await seed.tags(seedTags())
  const { categories } = await seed.categories(seedCategories())

  const questionsAcc: questionsScalars[] = []

  for (const profile of profiles) {
    const { questions } = await seed.questions(seedQuestions(profile), {
      connect: { profiles: [profile] },
    })
    questionsAcc.push(...questions)
  }

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

  await seed.news(
    seedNews.map((item) => ({
      ...item,
      category: categories.find((cat) => cat.type === 'news')?.id,
      created_by: profiles[0].id,
      tags: [tags[0].id],
    })),
  )

  const { projects } = await seed.projects(
    seedLibrary().map((item) => ({
      ...item,
      category: categories.find((cat) => cat.type === 'projects')?.id,
      created_by: profiles[0].id,
      tags: [tags[0].name],
    })),
  )

  await seed.project_steps(seedProjectSteps(projects))

  await seed.research(
    seedResearch.map((item) => ({
      ...item,
      category: categories.find((cat) => cat.type === 'research')?.id,
      created_by: profiles[0].id,
      tags: [tags[0].id.toString()],
    })),
  )

  process.exit()
}

main()
