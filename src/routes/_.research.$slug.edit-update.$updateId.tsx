import { json, useLoaderData } from '@remix-run/react'
import { isPreciousPlastic } from 'src/config/config'
import { AuthRoute } from 'src/pages/common/AuthRoute'
import { RESEARCH_EDITOR_ROLES } from 'src/pages/Research/constants'
import EditUpdate from 'src/pages/Research/Content/EditUpdate'
import { researchService } from 'src/pages/Research/research.service'

import type { LoaderFunctionArgs } from '@remix-run/node'
import type { IResearchDB } from 'oa-shared'

export async function loader({ params }: LoaderFunctionArgs) {
  const research = await researchService.getBySlug(params.slug as string)

  return json({ research, updateId: params.updateId as string })
}
export default function Index() {
  const data = useLoaderData<typeof loader>()
  const research = data.research as IResearchDB
  const roles = isPreciousPlastic() ? [] : RESEARCH_EDITOR_ROLES

  return (
    <AuthRoute roleRequired={roles}>
      <EditUpdate research={research} updateId={data.updateId} />
    </AuthRoute>
  )
}
