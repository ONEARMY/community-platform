import type { Project } from '../../models'

export const library: Project[] = [
  {
    moderation: 'accepted',
    id: 1,
    isDraft: false,
    author: {
      id: 4,
      displayName: 'test',
      isSupporter: false,
      isVerified: true,
      photoUrl: '',
      username: 'test',
    },
    tags: [
      {
        id: 1,
        createdAt: new Date('2018-11-29T12:56:47.901Z'),
        modifiedAt: new Date('2018-11-29T12:56:47.901Z'),
        name: 'test',
      },
    ],
    commentCount: 3,
    title: 'Make an interlocking brick',
    steps: [
      {
        id: 1,
        projectId: 1,
        title: 'step',
        description: 'description',
        videoUrl: null,
        images: null,
        order: 1,
      },
      {
        id: 2,
        projectId: 1,
        title: 'Idea and first drawing',
        images: [],
        videoUrl: 'https://www.youtube.com/embed/dP1s7viFZHY',
        description:
          'We wanted to develop a product that can have many functions. So we decided to figure out a shape that can be adapted or compliment one another to get a variety of uses. Finally we decided to draw a curved shape. The idea of this shape is to be attached to each other like a Lego. You can use this design as a plant pot or connect it as a partition and build a wall. Why not check out this super cool video?',
        order: 2,
      },
      {
        id: 3,
        projectId: 1,
        title: 'Make the 3D drawing',
        videoUrl: null,
        images: [],
        description:
          'First of all, we would like to tell you that our mould design is highly detailed and takes a lot of time to craft. The mould should be made from aluminum with CNC machine. To be easy for you all, please download our mould design above.',
        order: 3,
      },
      {
        id: 4,
        projectId: 1,
        title: 'Machining the mould',
        videoUrl: null,
        images: [],
        description:
          'Using the Sketchup file above to make the mould. We used the CNC Machine from a local manufacturer in Chiangmai. ',
        order: 4,
      },
      {
        id: 5,
        projectId: 1,
        images: [],
        description:
          'Tools you need for injecting:\nWrench\nBolt x 8 pieces\nNut x 8 pieces\nBolt & Nut for locking x 1 set\nElectric drill\nCutter\n',
        videoUrl: null,
        title: 'Prepare for injecting',
        order: 5,
      },
      {
        id: 6,
        projectId: 1,
        videoUrl: null,
        title: 'Prepare your material',
        images: [
          {
            id: '',
            publicUrl:
              'uploads/v2_howtos/me5Bq0wq5FdoJUY8gELN/howto-bope brick-1.jpg',
          },
          {
            id: '',
            publicUrl:
              'uploads/v2_howtos/me5Bq0wq5FdoJUY8gELN/howto-bope brick-1.jpg',
          },
        ],
        description:
          'Prepare your shredded plastic. For this product we use PP. For one brick you will need around 300 gram.',
        order: 6,
      },
      {
        id: 7,
        projectId: 1,
        videoUrl: null,
        title: 'Injection time!',
        images: [],
        description:
          'Turn on the Injection machine (180°C) and wait for it to heat up.\nWhen the temperature is ready, you can put the shredded PP into the Machine.',
        order: 7,
      },
      {
        id: 8,
        projectId: 1,
        videoUrl: null,
        images: [],
        description:
          'While waiting for the plastic to melt, you can assemble the mould.',
        title: 'Prepare the mould',
        order: 8,
      },
      {
        id: 9,
        projectId: 1,
        title: 'Press',
        images: [],
        description:
          'When both your machine and the mould are ready, connect the mould to the injection machine. Then press it!',
        videoUrl: null,
        order: 9,
      },
      {
        id: 10,
        projectId: 1,
        videoUrl: null,
        title: 'Detach the mould',
        images: [
          {
            id: '',
            publicUrl:
              'uploads/v2_howtos/me5Bq0wq5FdoJUY8gELN/howto-bope brick-1.jpg',
          },
          {
            id: '',
            publicUrl:
              'uploads/v2_howtos/me5Bq0wq5FdoJUY8gELN/howto-bope brick-1.jpg',
          },
        ],
        description:
          'Wait for the moudl to cool down. Then detach and carefully open the mould to take  out your freshly baked recycled plastic brick!\nRemove the injection channel with a little scissor or knife',
        order: 10,
      },
      {
        id: 11,
        projectId: 1,
        description: 'Last finishes.',
        title: 'Finish the product',
        images: [],
        videoUrl: null,
        order: 11,
      },
      {
        id: 12,
        projectId: 1,
        videoUrl: null,
        title: 'Explore the possibilities!',
        images: [
          {
            id: '',
            publicUrl:
              'uploads/v2_howtos/me5Bq0wq5FdoJUY8gELN/howto-bope brick-1.jpg',
          },
          {
            id: '',
            publicUrl:
              'uploads/v2_howtos/me5Bq0wq5FdoJUY8gELN/howto-bope brick-1.jpg',
          },
          {
            id: '',
            publicUrl:
              'uploads/v2_howtos/me5Bq0wq5FdoJUY8gELN/howto-bope brick-1.jpg',
          },
        ],
        description:
          'You can use  this for Flower Pots. Or You can make more & more for a partition or the wall. ',
        order: 12,
      },
    ],
    createdAt: new Date('2018-11-29T12:56:47.901Z'),
    modifiedAt: new Date('2018-11-29T12:56:47.901Z'),
    slug: 'make-an-interlocking-brick',
    previousSlugs: ['make-an-interlocking-brick'],
    deleted: false,
    time: '3-4 weeks',
    description: 'show you how to make a brick using the injection machine',
    coverImage: null,
    difficultyLevel: 'hard',
    files: [
      {
        id: '1',
        name: 'file.pdf',
        size: 123,
      },
      {
        id: '2',
        name: 'file2.pdf',
        size: 1234,
      },
    ],
    fileDownloadCount: 1234,
    category: {
      name: 'Machines',
      createdAt: new Date('2018-11-29T12:56:47.901Z'),
      modifiedAt: new Date('2018-11-29T12:56:47.901Z'),
      id: 1,
      type: 'projects',
    },
    subscriberCount: 0,
    totalViews: 0,
    usefulCount: 0,
    hasFileLink: false,
  },
  {
    slug: 'set-up-devsite-to-help-coding',
    previousSlugs: ['set-up-devsite-to-help-coding'],
    deleted: false,
    isDraft: false,
    time: '< 1 week',
    description:
      'Hello Coder! This is what we want to make https://build.onearmy.world/ The code of our platform can be found open-source on Github. There is still a lot of work to do and things to improve, we need a community of developers to help out improve it and fix issues. In this how-to i’ll show you how to download it and run it on your local computer so you can play around with the code, add modifications and share back to us.',
    coverImage: null,
    id: 59,
    difficultyLevel: 'easy',
    files: [],
    fileDownloadCount: 10,
    commentCount: 0,
    steps: [
      {
        id: 13,
        projectId: 59,
        title: 'Get the code',
        images: [],
        videoUrl: null,
        description:
          'First step go to Github, and download or clone our code. I’d recommend to install the Github app to add pull request in a later stage.\n',
        order: 1,
      },
      {
        id: 14,
        projectId: 59,
        title: 'Install install node js',
        images: [],
        videoUrl: null,
        description:
          'Pretty straight forward, download the files on their website and install. https://nodejs.org/en/#download\n',
        order: 2,
      },
      {
        id: 15,
        projectId: 59,
        title: 'Install Yarn in Terminal',
        images: [
          {
            id: '',
            publicUrl:
              'uploads/v2_howtos/me5Bq0wq5FdoJUY8gELN/howto-bope brick-1.jpg',
          },
          {
            id: '',
            publicUrl:
              'uploads/v2_howtos/me5Bq0wq5FdoJUY8gELN/howto-bope brick-1.jpg',
          },
          {
            id: '',
            publicUrl:
              'uploads/v2_howtos/me5Bq0wq5FdoJUY8gELN/howto-bope brick-1.jpg',
          },
        ],
        description:
          'Open up the terminal and install Yarn in the root directory.  \n1: Running the command “sudo npm i -g yarn”.\n2: Run the command “yarn” to install. \nTo make sure its installed in the root  type “cd” in terminal, drag the root folder on the terminal press enter. and then run “yarn”',
        videoUrl: null,
        order: 3,
      },
      {
        id: 16,
        projectId: 59,
        images: [],
        description:
          'In Terminal run command “yarn start” to run. Like above make sure it runs in the root folder\n',
        videoUrl: 'uniquei4zsc',
        title: 'Step Deploy local network',
        order: 4,
      },
      {
        id: 17,
        projectId: 59,
        images: [],
        description:
          "As you can see we currently in V0.4. Lot's of work to do and things to fix! Start coding and add your pull requests to Github, on Tuesday we review code :) \n*",
        videoUrl: 'uniquewrzq8q',
        title: 'Have fun 🤙',
        order: 5,
      },
    ],
    moderation: 'accepted',
    author: {
      id: 5,
      displayName: 'test',
      isSupporter: false,
      isVerified: true,
      photoUrl: '',
      username: 'test',
    },
    tags: [
      {
        id: 1,
        createdAt: new Date('2018-11-29T12:56:47.901Z'),
        modifiedAt: new Date('2018-11-29T12:56:47.901Z'),
        name: 'test',
      },
    ],
    category: {
      name: 'Machines',
      createdAt: new Date('2018-11-29T12:56:47.901Z'),
      modifiedAt: new Date('2018-11-29T12:56:47.901Z'),
      id: 1,
      type: 'projects',
    },
    title: 'Set up devsite to help coding!',
    modifiedAt: new Date('2018-11-29T12:56:47.901Z'),
    createdAt: new Date('2018-11-29T12:56:47.901Z'),
    hasFileLink: false,
    subscriberCount: 0,
    totalViews: 0,
    usefulCount: 0,
  },
  {
    difficultyLevel: 'medium',
    files: [],
    isDraft: false,
    commentCount: 2,
    steps: [
      {
        id: 18,
        projectId: 2,
        title: 'Gather your materials ',
        images: [
          {
            id: '',
            publicUrl:
              'uploads/v2_howtos/me5Bq0wq5FdoJUY8gELN/howto-bope brick-1.jpg',
          },
          {
            id: '',
            publicUrl:
              'uploads/v2_howtos/me5Bq0wq5FdoJUY8gELN/howto-bope brick-1.jpg',
          },
          {
            id: '',
            publicUrl:
              'uploads/v2_howtos/me5Bq0wq5FdoJUY8gELN/howto-bope brick-1.jpg',
          },
        ],
        description:
          'In order to make a jacket from plastic foils, you will first need to gather your tools and materials. These are:\n\nMaterials\n- plastic foils (see step 3), enough to make four large sheets (70cm x 170cm)\n- natural fabric such as cotton for the lining\n- a heat resistant sheet material such as teflon fabric as a base for ironing/pressing\n- baking paper which will also be used for ironing/pressing\n- optionally: fastening of some sort for the raincoat (buttons, zip etc)\n\nTools\n- iron or thermo press\n- sewing machine, thread and scissors\n\nSafety recommendations\n- respirator mask to prevent the inhalation of plastic fumes!',
        videoUrl: 'unique1',
        order: 1,
      },
      {
        id: 19,
        projectId: 2,
        description:
          'You will need to work out the required measurements for the jacket. The template below will provide you with a plan for taking and recording these measurements. \n(A) length of the arm\n(B) length from shoulder to shoulder\n(C) length from shoulder to the neck centre\n(D) body width\n(E) desired length of the raincoat',
        videoUrl: 'unique2',
        title: 'Choose your measurements ',
        images: [],
        order: 2,
      },
      {
        id: 20,
        projectId: 2,
        title: 'Collect and select your foils',
        images: [
          {
            id: '',
            publicUrl:
              'uploads/v2_howtos/me5Bq0wq5FdoJUY8gELN/howto-bope brick-1.jpg',
          },
          {
            id: '',
            publicUrl:
              'uploads/v2_howtos/me5Bq0wq5FdoJUY8gELN/howto-bope brick-1.jpg',
          },
        ],
        description:
          'This part will be a combination of your own design choice, as well as what plastic material is available around you. Collect your waste foils, which can include plastic bags and any small plastic foils, wrappers, and packaging. Try to make sure that you are using the same type of material (LDPE, HDPE, PP etc.). \n\nNow, use some artistic flair! From what you have, select a colour palette that you will work with. Your raincoat will have a much nicer finish if you ensure that any colours/patterns work well together. If you’re happy to use any combination of colours, then the coat will still be functional. ',
        videoUrl: 'unique3',
        order: 3,
      },
      {
        id: 21,
        projectId: 2,
        description:
          'Find the biggest plastic sheet you have, and make a base out of it. Foils from construction waste are often large and good for this purpose. If you don’t have something such as this to hand, then you can cut down the sides of a bag and spread it out flat on your working surface. ',
        videoUrl: 'uniquesjhjg',
        title: 'Make your base',
        images: [
          {
            id: '',
            publicUrl:
              'uploads/v2_howtos/me5Bq0wq5FdoJUY8gELN/howto-bope brick-1.jpg',
          },
          {
            id: '',
            publicUrl:
              'uploads/v2_howtos/me5Bq0wq5FdoJUY8gELN/howto-bope brick-1.jpg',
          },
          {
            id: '',
            publicUrl:
              'uploads/v2_howtos/me5Bq0wq5FdoJUY8gELN/howto-bope brick-1.jpg',
          },
        ],
        order: 4,
      },
      {
        id: 22,
        projectId: 2,
        title: 'Create a collage with your material',
        images: [],
        description:
          'Using your plastic bags and films, create a collage on top of your base sheet. This can be created however you like; from a methodical design of strips and shapes, to a more random spread of the films. This will create the design for the material that will form your finished raincoat. Reserve a little of the plastic to form a test piece (see step 6). ',
        videoUrl: 'uniquerlopr',
        order: 5,
      },
      {
        id: 23,
        projectId: 2,
        description:
          '❗️ Put on your respirator mask on!\n\nLayer a few pieces of your reserved plastic one above the other, as a test sample. Turn on your iron and set to the highest temperature. (If you are using a thermo press you may need apply different temperature settings). Lay your sample piece on top of the teflon fabric, and put a piece of baking paper on top to avoid the plastic from sticking to your iron or press. Now iron the sample piece to see how the material fuses together.',
        videoUrl: 'uniquea1lleb',
        title: 'Try out your fusing technique',
        images: [
          {
            id: '',
            publicUrl:
              'uploads/v2_howtos/me5Bq0wq5FdoJUY8gELN/howto-bope brick-1.jpg',
          },
          {
            id: '',
            publicUrl:
              'uploads/v2_howtos/me5Bq0wq5FdoJUY8gELN/howto-bope brick-1.jpg',
          },
        ],
        order: 6,
      },
      {
        id: 24,
        projectId: 2,
        title: 'Make your fused sheet',
        images: [
          {
            id: '',
            publicUrl:
              'uploads/v2_howtos/me5Bq0wq5FdoJUY8gELN/howto-bope brick-1.jpg',
          },
          {
            id: '',
            publicUrl:
              'uploads/v2_howtos/me5Bq0wq5FdoJUY8gELN/howto-bope brick-1.jpg',
          },
          {
            id: '',
            publicUrl:
              'uploads/v2_howtos/me5Bq0wq5FdoJUY8gELN/howto-bope brick-1.jpg',
          },
          {
            id: '',
            publicUrl:
              'uploads/v2_howtos/me5Bq0wq5FdoJUY8gELN/howto-bope brick-1.jpg',
          },
        ],
        description:
          'Once you are comfortable with your tests, go ahead and fuse together your big sheets, remembering to use teflon fabric below, and your baking parchment paper as an ironing surface above. You will need to make at least four big sheets, around 70cm x 170cm. \n\n💡 Fix holes: Once complete, look over your fused plastic sheets and find any holes or parts which are not fully melted or secure. You can fix these now with your iron/press and any scraps of plastic that you have left, but be very careful not to deconstruct the material when heating the sheets again. ',
        videoUrl: 'uniquefwi0xa',
        order: 7,
      },
      {
        id: 25,
        projectId: 2,
        description:
          'Come back to the template that we used in step 2. Apply your measurements to the following template, and decide on a size for measurement (F), the diameters of the hood. You can decide on this by drawing and cutting the hood construction pieces first with paper, and finding a desired size. ',
        videoUrl: 'uniquewtxz8t',
        title: 'Finalise your measurements',
        images: [],
        order: 8,
      },
      {
        id: 26,
        projectId: 2,
        title: 'Cut the materials',
        images: [
          {
            id: '',
            publicUrl:
              'uploads/v2_howtos/me5Bq0wq5FdoJUY8gELN/howto-bope brick-1.jpg',
          },
          {
            id: '',
            publicUrl:
              'uploads/v2_howtos/me5Bq0wq5FdoJUY8gELN/howto-bope brick-1.jpg',
          },
          {
            id: '',
            publicUrl:
              'uploads/v2_howtos/me5Bq0wq5FdoJUY8gELN/howto-bope brick-1.jpg',
          },
          {
            id: '',
            publicUrl:
              'uploads/v2_howtos/me5Bq0wq5FdoJUY8gELN/howto-bope brick-1.jpg',
          },
          {
            id: '',
            publicUrl:
              'uploads/v2_howtos/me5Bq0wq5FdoJUY8gELN/howto-bope brick-1.jpg',
          },
          {
            id: '',
            publicUrl:
              'uploads/v2_howtos/me5Bq0wq5FdoJUY8gELN/howto-bope brick-1.jpg',
          },
        ],
        description:
          'From your fused sheets you will now need to cut the template pieces (see step 8) for the construction of your raincoat. 1 back piece, 2 front pieces, 2x sleeves, and 3 parts for the hood. Add 2cm on the sides of each piece to allow room for sewing. If you are lacking material to cut the template, you may need to extend one or more of your sheets.\n\nAfter doing this, cut the same template again from your cotton (again allowing 2cm on every side). This will form the lining of the raincoat.  ',
        videoUrl: 'uniquedgh47',
        order: 9,
      },
      {
        id: 27,
        projectId: 2,
        images: [],
        description:
          'Using your cut plastic sheets, and the matching cotton pieces, sew the two templates together so that the outer and lining are attached to one another. This will help the process of further working with the material, and make it easier to create your raincoat. ',
        videoUrl: 'unique9s770y',
        title: 'Sew the outer and lining together',
        order: 10,
      },
      {
        id: 28,
        projectId: 2,
        images: [],
        description:
          'The construction of the jacket should start with the shoulders. Sew together your back and two front pieces (see step 8), as shown in the image below. Make sure to leave enough space for the attachment of the hood! This is where we will use the 2cm that we added for sewing. The join of the fabric should match the template exactly and the excess material from the join should only be visible from the interior of the jacket. We will trim this later. ',
        videoUrl: 'uniqueclwhcg',
        title: 'Construct the shoulders',
        order: 11,
      },
    ],
    moderation: 'accepted',
    author: {
      id: 4,
      displayName: 'test',
      isSupporter: false,
      isVerified: true,
      photoUrl: '',
      username: 'test',
    },
    tags: [
      {
        id: 1,
        createdAt: new Date('2018-11-29T12:56:47.901Z'),
        modifiedAt: new Date('2018-11-29T12:56:47.901Z'),
        name: 'test',
      },
    ],
    category: {
      name: 'Machines',
      createdAt: new Date('2018-11-29T12:56:47.901Z'),
      modifiedAt: new Date('2018-11-29T12:56:47.901Z'),
      id: 1,
      type: 'projects',
    },
    title: 'Make glass-like beams',
    createdAt: new Date('2018-11-29T12:56:47.901Z'),
    modifiedAt: new Date('2018-11-29T12:56:47.901Z'),
    slug: 'make-glass-like-beams',
    previousSlugs: ['make-glass-like-beams', 'make-glassy-beams'],
    deleted: false,
    coverImage: null,
    description: '',
    id: 2,
    time: '< 1 week',
    fileDownloadCount: 9,
    hasFileLink: false,
    subscriberCount: 10,
    totalViews: 10,
    usefulCount: 10,
  },
  {
    createdAt: new Date('2018-11-29T12:56:47.901Z'),
    modifiedAt: new Date('2018-11-29T12:56:47.901Z'),
    author: {
      id: 2,
      displayName: 'test',
      isSupporter: false,
      isVerified: true,
      photoUrl: '',
      username: 'test',
    },
    deleted: false,
    isDraft: false,
    id: 12,
    commentCount: 0,
    coverImage: null,
    description: 'Test1',
    difficultyLevel: 'medium',
    files: [],
    moderation: 'accepted',
    slug: 'testing-testing',
    previousSlugs: ['testing-testing'],
    steps: [
      {
        id: 30,
        projectId: 12,
        description: 'Test',
        title: 'Test',
        images: null,
        videoUrl: 'https://www.youtube.com/embed/dP1s7viFZHY',
        order: 1,
      },
    ],
    tags: [
      {
        id: 1,
        createdAt: new Date('2018-11-29T12:56:47.901Z'),
        modifiedAt: new Date('2018-11-29T12:56:47.901Z'),
        name: 'test',
      },
    ],
    time: '< 1 hour',
    title: 'Testing-testing',
    category: {
      name: 'Machines',
      createdAt: new Date('2018-11-29T12:56:47.901Z'),
      modifiedAt: new Date('2018-11-29T12:56:47.901Z'),
      id: 1,
      type: 'projects',
    },
    fileDownloadCount: 123,
    hasFileLink: true,
    subscriberCount: 12,
    totalViews: 132,
    usefulCount: 30,
  },
  {
    category: {
      name: 'Machines',
      createdAt: new Date('2018-11-29T12:56:47.901Z'),
      modifiedAt: new Date('2018-11-29T12:56:47.901Z'),
      id: 1,
      type: 'projects',
    },
    fileDownloadCount: 123,
    createdAt: new Date('2022-01-06T14:50:38.830Z'),
    author: {
      id: 1,
      displayName: 'test',
      isSupporter: false,
      isVerified: true,
      photoUrl: '',
      username: 'test',
    },
    deleted: true,
    isDraft: false,
    id: 10,
    modifiedAt: new Date('2022-01-06T14:50:38.830Z'),
    previousSlugs: ['deleted-how-to'],
    coverImage: null,
    description: 'deleted how to',
    difficultyLevel: 'medium',
    files: [],
    moderation: 'accepted',
    slug: 'deleted-how-to',
    steps: [
      {
        id: 31,
        projectId: 10,
        description: 'Test',
        title: 'Test',
        videoUrl: 'https://www.youtube.com/embed/dP1s7viFZHY',
        images: null,
        order: 1,
      },
    ],
    tags: [
      {
        id: 1,
        createdAt: new Date('2018-11-29T12:56:47.901Z'),
        modifiedAt: new Date('2018-11-29T12:56:47.901Z'),
        name: 'test',
      },
    ],
    time: '< 1 hour',
    title: 'Deleted how to',
    commentCount: 0,
    hasFileLink: true,
    subscriberCount: 30,
    totalViews: 1234,
    usefulCount: 12,
  },
]
