export const loader = ({ request }: { request: Request }) => {
  const { headers } = request
  const host = headers.get('host')
  let robotText = ''

  if (host?.includes('fly.dev')) {
    // disable for preview sites
    robotText = `User-agent: *
      Disallow: /`
  } else {
    const allModules = [
      'howto',
      'map',
      'research',
      'academy',
      'question',
      'news',
    ]
    const availableModules = process.env.VITE_SUPPORTED_MODULES?.split(',')

    robotText = 'User-agent: *'

    allModules.forEach((x) => {
      let pagePath = ''
      if (x === 'howto') {
        pagePath = '/library/'
      } else {
        pagePath = `/${x}/`
      }

      const permission = availableModules?.includes(x) ? 'Allow' : 'Disallow'

      robotText += `\n${permission}: ${pagePath}`
    })
  }

  return new Response(robotText, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
