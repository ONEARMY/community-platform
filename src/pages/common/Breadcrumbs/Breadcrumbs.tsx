/* eslint-disable no-case-declarations */
import { Breadcrumbs as BreadcrumbsComponent } from 'oa-components'
import { Box } from 'theme-ui'

import type { ILibrary, News, Question, ResearchItem } from 'oa-shared'

type Step = { text: string; link?: string }
type Content = ResearchItem | Question | ILibrary.Item | News
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
      const research = content as ResearchItem
      steps.push({ text: 'Research', link: '/research' })

      if (research.category) {
        steps.push({
          text: research.category.name,
          link: `/research?category=${research.category.id}`,
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
