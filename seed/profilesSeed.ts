import type { profilesChildInputs, profilesScalars } from '@snaplet/seed'

const _PROFILES_BASE: (tenant_id: string) => Partial<profilesScalars> = (
  tenant_id: string,
) => ({
  tenant_id,
  type: 'member',
  roles: [],
  photo: null,
  patreon: null,
  impact: null,
  is_blocked_from_messaging: false,
  is_contactable: true,
  total_views: 0,
})

export const profilesSeed = (tenant_id: string): profilesChildInputs => [
  {
    ..._PROFILES_BASE(tenant_id),
    username: 'jereerickson92',
    display_name: 'Jere Erickson',
    country: 'Portugal',
    about:
      "Passionate about creating meaningful connections and exploring new experiences. Whether it's traveling to new destinations, trying new foods, or diving into fresh hobbies, I'm all about embracing the adventure in life. Let's chat and share our stories!",
  },
  {
    ..._PROFILES_BASE(tenant_id),
    username: 'aldaplaskett48',
    display_name: 'Alda Plaskett',
    country: 'Spain',
    about:
      "Tech enthusiast, avid reader, and coffee lover. I spend my days coding, learning about the latest trends, and finding ways to innovate. Always up for a deep conversation or a good book recommendation. Let's connect and exchange ideas!",
  },
  {
    ..._PROFILES_BASE(tenant_id),
    username: 'sampathpini67',
    display_name: 'Sampath Pini',
    country: 'France',
    about:
      "Fitness junkie who believes in the power of mental and physical health. When I'm not in the gym, you can find me hiking, practicing yoga, or experimenting with healthy recipes. Looking for like-minded people who value balance and growth. Let's inspire each other!",
  },
  {
    ..._PROFILES_BASE(tenant_id),
    username: 'galenagiugovaz15',
    display_name: 'Galena Giugovaz',
    country: 'Sudan',
    about:
      "Curious traveler with a passion for photography and storytelling. Exploring the world, one city at a time, while capturing moments that tell unique stories. I believe that life is all about experiences and the memories we create. Let's share the journey!",
  },
  {
    ..._PROFILES_BASE(tenant_id),
    username: 'veniaminjewell33',
    display_name: 'Veniamin Jewell',
    country: 'Tuvalu',
    about:
      "Creative soul with a love for design and innovation. I'm always experimenting with new ways to bring ideas to life—whether it's through art, technology, or writing. Let's collaborate and create something beautiful together!",
  },
  {
    ..._PROFILES_BASE(tenant_id),
    username: 'cortneybrown81',
    display_name: 'Cortney Brown',
    country: 'Ukraine',
    about:
      "Outgoing and energetic, I'm always looking for new adventures and opportunities to grow. Whether it's trying a new hobby or tackling an exciting project, I'm up for anything. Join me on my journey, and let's make the most out of every moment!",
  },
  {
    ..._PROFILES_BASE(tenant_id),
    username: 'melisavang56',
    display_name: 'Melisa Vang',
    country: 'Uruguay',
    about:
      "Music is my life, and I'm constantly seeking out new sounds and genres to explore. From playing instruments to attending live shows, I live and breathe rhythm. If you're passionate about music or just want to chat about the latest trends, let's connect!",
  },
  {
    ..._PROFILES_BASE(tenant_id),
    username: 'lianabegam24',
    display_name: 'Liana Begam',
    country: 'United States',
    about:
      "Outdoor enthusiast and nature lover who finds peace in hiking, camping, and exploring the great outdoors. When I'm not soaking up the beauty of nature, you'll find me sharing my love for the environment with others. Looking to meet fellow adventurers!",
  },
  {
    ..._PROFILES_BASE(tenant_id),
    username: 'akromstarkova72',
    display_name: 'Akrom Stárková',
    country: 'Yemen',
    about:
      "Ambitious and driven, I strive to make the most out of every opportunity. Whether it's working on personal projects or helping others achieve their goals, I believe in continuous growth and learning. Let's build a community of success together!",
  },
  {
    ..._PROFILES_BASE(tenant_id),
    username: 'mirzoblazkova19',
    display_name: 'Mirzo Blažková',
    country: 'Zimbabwe',
    about:
      "Bookworm with a passion for storytelling and deep discussions. I'm always immersed in a good novel or seeking out new perspectives on life. Looking to connect with fellow book lovers or anyone interested in meaningful conversations. Let's dive into the world of words together!",
  },
]
