import { Breadcrumbs as BreadcrumbsComponent } from 'oa-components'

import type { IHowto, IQuestion, IResearch } from 'oa-shared'

type Step = { text: string; link?: string }

interface BreadcrumbsProps {
  steps?: Step[]
  content?: IResearch.ItemDB | IQuestion.Item | IHowto
  variant?: 'research' | 'question' | 'howto'
}

const generateSteps = (
  content: IResearch.ItemDB | IQuestion.Item | IHowto | undefined,
  variant: 'research' | 'question' | 'howto' | undefined,
) => {
  const steps: Step[] = []
  if (variant == 'research') {
    const item = content as IResearch.ItemDB
    steps.push({ text: 'Research', link: '/research' })

    if (item.researchCategory) {
      steps.push({
        text: item.researchCategory.label,
        link: `/research?category=${item.researchCategory._id}`,
      })
    }

    steps.push({ text: item.title })
  } else if (variant == 'question') {
    const item = content as IQuestion.Item
    steps.push({ text: 'Question', link: '/questions' })

    if (item.questionCategory) {
      steps.push({
        text: item.questionCategory.label,
        link: `/questions?category=${item.questionCategory._id}`,
      })
    }

    steps.push({ text: item.title })
  } else if (variant == 'howto') {
    const item = content as IHowto
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
  return <BreadcrumbsComponent steps={breadcrumbsSteps} />
}
