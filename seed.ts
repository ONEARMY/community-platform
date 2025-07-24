import { copycat } from '@snaplet/copycat'
import { createSeedClient } from '@snaplet/seed'
import { ProfileTypeList } from 'oa-shared'

import libraryJson from './.snaplet/library.json'
import questionsJson from './.snaplet/questions.json'
import { convertToSlug } from './src/utils/slug'

import type {
  categoriesChildInputs,
  categoriesScalars,
  newsScalars,
  profilesChildInputs,
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

const tenant_id = 'precious-plastic'

const _PROFILES_BASE: Partial<profilesScalars> = {
  tenant_id,
  type: ProfileTypeList.MEMBER,
  roles: [],
  photo: null,
  location: null,
  patreon: null,
  impact: null,
  is_verified: true,
  is_blocked_from_messaging: false,
  is_contactable: true,
  is_supporter: true,
  total_views: 0,
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

const seedTags = (): tagsChildInputs => [{ ..._TAGS_BASE, name: 'tag 1' }]

const seedUsers = () => [
  {
    email: 'jereerickson92@test.com',
    password: copycat.password({}),
  },
  {
    email: 'aldaplaskett48@test.com',
    password: copycat.password({}),
  },
  {
    email: 'sampathpini67@test.com',
    password: copycat.password({}),
  },
  {
    email: 'galenagiugovaz15@test.com',
    password: copycat.password({}),
  },
  {
    email: 'veniaminjewell33@test.com',
    password: copycat.password({}),
  },
  {
    email: 'cortneybrown81@test.com',
    password: copycat.password({}),
  },
  {
    email: 'melisavang56@test.com',
    password: copycat.password({}),
  },
  {
    email: 'lianabegam24@test.com',
    password: copycat.password({}),
  },
  {
    email: 'akromstarkova72@test.com',
    password: copycat.password({}),
  },
  {
    email: 'mirzoblazkova19@test.com',
    password: copycat.password({}),
  },
]

const seedProfiles = (): profilesChildInputs => [
  {
    ..._PROFILES_BASE,
    username: 'jereerickson92',
    display_name: 'Jere Erickson',
    country: 'Portugal',
    about:
      "Passionate about creating meaningful connections and exploring new experiences. Whether it's traveling to new destinations, trying new foods, or diving into fresh hobbies, I'm all about embracing the adventure in life. Let's chat and share our stories!",
  },
  {
    ..._PROFILES_BASE,
    username: 'aldaplaskett48',
    display_name: 'Alda Plaskett',
    country: 'Spain',
    about:
      "Tech enthusiast, avid reader, and coffee lover. I spend my days coding, learning about the latest trends, and finding ways to innovate. Always up for a deep conversation or a good book recommendation. Let's connect and exchange ideas!",
  },
  {
    ..._PROFILES_BASE,
    username: 'sampathpini67',
    display_name: 'Sampath Pini',
    country: 'France',
    about:
      "Fitness junkie who believes in the power of mental and physical health. When I'm not in the gym, you can find me hiking, practicing yoga, or experimenting with healthy recipes. Looking for like-minded people who value balance and growth. Let's inspire each other!",
  },
  {
    ..._PROFILES_BASE,
    username: 'galenagiugovaz15',
    display_name: 'Galena Giugovaz',
    country: 'Sudan',
    about:
      "Curious traveler with a passion for photography and storytelling. Exploring the world, one city at a time, while capturing moments that tell unique stories. I believe that life is all about experiences and the memories we create. Let's share the journey!",
  },
  {
    ..._PROFILES_BASE,
    username: 'veniaminjewell33',
    display_name: 'Veniamin Jewell',
    country: 'Tuvalu',
    about:
      "Creative soul with a love for design and innovation. I'm always experimenting with new ways to bring ideas to life—whether it's through art, technology, or writing. Let's collaborate and create something beautiful together!",
  },
  {
    ..._PROFILES_BASE,
    username: 'cortneybrown81',
    display_name: 'Cortney Brown',
    country: 'Ukraine',
    about:
      "Outgoing and energetic, I'm always looking for new adventures and opportunities to grow. Whether it's trying a new hobby or tackling an exciting project, I'm up for anything. Join me on my journey, and let's make the most out of every moment!",
  },
  {
    ..._PROFILES_BASE,
    username: 'melisavang56',
    display_name: 'Melisa Vang',
    country: 'Uruguay',
    about:
      "Music is my life, and I'm constantly seeking out new sounds and genres to explore. From playing instruments to attending live shows, I live and breathe rhythm. If you're passionate about music or just want to chat about the latest trends, let's connect!",
  },
  {
    ..._PROFILES_BASE,
    username: 'lianabegam24',
    display_name: 'Liana Begam',
    country: 'United States',
    about:
      "Outdoor enthusiast and nature lover who finds peace in hiking, camping, and exploring the great outdoors. When I'm not soaking up the beauty of nature, you'll find me sharing my love for the environment with others. Looking to meet fellow adventurers!",
  },
  {
    ..._PROFILES_BASE,
    username: 'akromstarkova72',
    display_name: 'Akrom Stárková',
    country: 'Yemen',
    about:
      "Ambitious and driven, I strive to make the most out of every opportunity. Whether it's working on personal projects or helping others achieve their goals, I believe in continuous growth and learning. Let's build a community of success together!",
  },
  {
    ..._PROFILES_BASE,
    username: 'mirzoblazkova19',
    display_name: 'Mirzo Blažková',
    country: 'Zimbabwe',
    about:
      "Bookworm with a passion for storytelling and deep discussions. I'm always immersed in a good novel or seeking out new perspectives on life. Looking to connect with fellow book lovers or anyone interested in meaningful conversations. Let's dive into the world of words together!",
  },
]

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

  const { users } = await seed.users(seedUsers())
  const { profiles } = await seed.profiles(
    (seedProfiles() as Array<any>).map((profile: profilesInputs, index) => ({
      ...profile,
      auth_id: users[index].id,
    })),
  )

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
