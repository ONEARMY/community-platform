/* eslint-disable no-case-declarations */
import { Breadcrumbs as BreadcrumbsComponent } from 'oa-components'
import { Box } from 'theme-ui'

import type { ILibrary, IResearch, News, Question } from 'oa-shared'

type Step = { text: string; link?: string }
type Content = IResearch.ItemDB | Question | ILibrary.Item | News
type Variant = 'research' | 'question' | 'library' | 'news'

interface BreadcrumbsProps {
  steps?: Step[]
  content: Content
  variant: Variant
}

const generateSteps = (content: Content, variant: Variant) => {
  const steps: Step[] = []

  switch (variant) {
    case 'research':
      const research = content as IResearch.ItemDB
      steps.push({ text: 'Research', link: '/research' })

      if (research.researchCategory) {
        steps.push({
          text: research.researchCategory.label,
          link: `/research?category=${research.researchCategory._id}`,
        })
      }

      steps.push({ text: research.title })
      break
    case 'question':
      const question = content as Question
      steps.push({ text: 'Question', link: '/questions' })

      if (question.category) {
        steps.push({
          text: question.category.name,
          link: `/questions?category=${question.category.id}`,
        })
      }

      steps.push({ text: question.title })
      break
    case 'library':
      const project = content as ILibrary.Item
      steps.push({ text: 'Library', link: '/library' })

      if (project.category) {
        steps.push({
          text: project.category.label,
          link: `/library?category=${project.category._id}`,
        })
      }

      steps.push({ text: project.title })
      break
    case 'news':
      const news = content as News
      steps.push({ text: 'News', link: '/news' })

      // if (news.category) {
      //   steps.push({
      //     text: news.category.name,
      //     link: `/news?category=${news.category.id}`,
      //   })
      // }

      steps.push({ text: news.title })
      break
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
