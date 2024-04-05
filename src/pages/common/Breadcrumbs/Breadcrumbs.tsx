import { Breadcrumbs as BreadcrumbsComponent } from 'oa-components'

import type { IHowto,IQuestion, IResearch } from 'src/models'

type step = { text: string; link?: string } | null

interface BreadcrumbsProps {
  steps?: Array<step>
  content?: IResearch.ItemDB | IQuestion.Item | IHowto
  variant?: 'research' | 'question' | 'howto'
}

const generateSteps = (
  content: IResearch.ItemDB | IQuestion.Item | IHowto | undefined,
  variant: 'research' | 'question' | 'howto' | undefined,
) => {
  let steps: Array<step> = []
  if (variant == 'research') {
    const item = content as IResearch.ItemDB
    steps = [
      {
        text: 'Research',
        link: '/research',
      },
      item.researchCategory
        ? {
            text: item.researchCategory.label,
            link: `/research?category=${item.researchCategory.label}`,
          }
        : null,
      {
        text: item.title,
      },
    ]
  } else if (variant == 'question') {
    const item = content as IQuestion.Item
    steps = [
      {
        text: 'Question',
        link: '/questions',
      },
      item.questionCategory
        ? {
            text: item.questionCategory.label,
            link: `/questions?category=${item.questionCategory.label}`,
          }
        : null,
      {
        text: item.title,
      },
    ]
  } else if (variant == 'howto') {
    const item = content as IHowto
    steps = [
      {
        text: 'How To',
        link: '/how-to',
      },
      item.category
        ? {
            text: item.category.label,
            link: `/how-to?category=${item.category.label}`,
          }
        : null,
      {
        text: item.title,
      },
    ]
  }
  return steps
}

export const Breadcrumbs = ({ steps, content, variant }: BreadcrumbsProps) => {
  const breadcrumbsSteps = steps ?? generateSteps(content, variant)
  return <BreadcrumbsComponent steps={breadcrumbsSteps} />
}
