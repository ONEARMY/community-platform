import { useState } from 'react'
import { Icon, InternalLink, Tooltip } from 'oa-components'

import type { IResearch } from 'src/models'

interface IProps {
  research: IResearch.ItemDB
  update: IResearch.UpdateDB
}

const COPY_TO_CLIPBOARD = 'Copy link to update'
const IN_PROGRESS = '...Working on it...'
const SUCCESS = 'Nice. All done. Now share away...!'

export const ResearchLinkToUpdate = ({ research, update }: IProps) => {
  const [label, setLabel] = useState<string>(COPY_TO_CLIPBOARD)
  const { slug } = research
  const { _id } = update

  const copyURLtoClipboard = async (slug, _id) => {
    setLabel(IN_PROGRESS)
    try {
      await navigator.clipboard.writeText(
        `${location.origin}/research/${slug}#update_${_id}`,
      )
      setLabel(SUCCESS)
    } catch (error) {
      setLabel(error.message)
    }
  }

  return (
    <InternalLink
      to={`/research/${slug}#update_${_id}`}
      onClick={async () => copyURLtoClipboard(slug, _id)}
      data-cy="ResearchLinkToUpdate"
    >
      <Icon glyph="hyperlink" data-tip={label} size={30} />
      <Tooltip />
    </InternalLink>
  )
}
