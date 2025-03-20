import { Breadcrumbs as BreadcrumbsComponent } from 'oa-components'
import { Box } from 'theme-ui'

import type { ILibrary } from 'oa-shared'
import type { Question } from 'src/models/question.model'
import type { ResearchItem } from 'src/models/research.model'

type Step = { text: string; link?: string }
type Content = ResearchItem | Question | ILibrary.Item
type Variant = 'research' | 'question' | 'library'

interface BreadcrumbsProps {
  steps?: Step[]
  content: Content
  variant: Variant
}

const generateSteps = (content: Content, variant: Variant) => {
  const steps: Step[] = []
  if (variant == 'research') {
    const item = content as ResearchItem
    steps.push({ text: 'Research', link: '/research' })

    if (item.category) {
      steps.push({
        text: item.category.name,
        link: `/research?category=${item.category.id}`,
      })
    }

    steps.push({ text: item.title })
  } else if (variant == 'question') {
    const item = content as Question
    steps.push({ text: 'Question', link: '/questions' })

    if (item.category) {
      steps.push({
        text: item.category.name,
        link: `/questions?category=${item.category.id}`,
      })
    }

    steps.push({ text: item.title })
  } else if (variant == 'library') {
    const item = content as ILibrary.Item
    steps.push({ text: 'Library', link: '/library' })

    if (item.category) {
      steps.push({
        text: item.category.label,
        link: `/library?category=${item.category._id}`,
      })
    }

    steps.push({ text: item.title })
  }
  return steps
}

export const Breadcrumbs = ({ steps, content, variant }: BreadcrumbsProps) => {
  const breadcrumbsSteps = steps ?? generateSteps(content, variant)
  return (
    <Box sx={{ paddingLeft: [2, 0, 0] }}>
      <BreadcrumbsComponent steps={breadcrumbsSteps} />
    </Box>
  )
}
