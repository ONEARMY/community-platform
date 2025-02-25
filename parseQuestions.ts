import questionsJson from './questions.json'

// Access questions from user 'aldaplaskett48'
// const profile = 'aldaplaskett48'
// console.log(questionsJson[profile])

// Access comments from user 'aldaplaskett48'
const profile = 'aldaplaskett48'
const hold = Object.values(questionsJson).flatMap((qu) =>
  qu.flatMap((q) => Object.entries(q.comments || {})),
)
// console.log(
//   Object.values(questionsJson)
//     .flat()
//     .flatMap((q) => ({
//       title: q?.title,
//       comment: q?.comments.map((c) => c?.[profile]),
//     })),
// )

console.log(
    Object.values(questionsJson)
      .flat()
      .flatMap((q) => q?.comments?.map((c) => c?.[profile])),
  )