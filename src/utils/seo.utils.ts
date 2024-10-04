import type { MetaFunction } from '@remix-run/node'

// from: https://gist.github.com/ryanflorence/ec1849c6d690cfbffcb408ecd633e069
// This function makes it easy to set meta tags in nested routes.
// It will override matching parent meta tags.
export const mergeMeta = <T>(leafMetaFn: MetaFunction<T>): MetaFunction<T> => {
  return (arg) => {
    const leafMeta = leafMetaFn(arg)

    return arg.matches.reduceRight((acc, match) => {
      for (const parentMeta of match.meta) {
        const index = acc.findIndex(
          (meta) =>
            ('name' in meta &&
              'name' in parentMeta &&
              meta.name === parentMeta.name) ||
            ('property' in meta &&
              'property' in parentMeta &&
              meta.property === parentMeta.property) ||
            ('title' in meta && 'title' in parentMeta),
        )
        if (index == -1) {
          // Parent meta not found in acc, so add it
          acc.push(parentMeta)
        }
      }
      return acc
    }, leafMeta)
  }
}

export const generateTags = (
  title: string,
  description?: string,
  imageUrl?: string,
) => {
  const tags = [
    { title: title },
    {
      property: 'og:title',
      content: title,
    },
    {
      name: 'twitter:title',
      content: title,
    },
  ]

  if (description) {
    tags.push({ name: 'description', content: description })

    tags.push({
      property: 'og:description',
      content: description,
    })
    tags.push({
      name: 'twitter:description',
      content: description,
    })
  }

  if (imageUrl) {
    tags.push({
      property: 'og:image',
      content: imageUrl,
    })
    tags.push({
      name: 'twitter:image',
      content: imageUrl,
    })
  }

  return tags
}
