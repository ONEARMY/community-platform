/* eslint-disable no-case-declarations */
import { Breadcrumbs as BreadcrumbsComponent } from 'oa-components';
import { Flex } from 'theme-ui';

import type { News, Project, Question, ResearchItem } from 'oa-shared';

// TODO: Refactor this component to not be coupled with Content items
type Step = { text: string; link?: string };
type Content = ResearchItem | Question | Project | News;
type Variant = 'research' | 'question' | 'library' | 'news';

interface BreadcrumbsProps {
  children?: React.ReactNode;
  content: Content;
  variant: Variant;
  steps?: Step[];
}

const generateSteps = (content: Content, variant: Variant) => {
  const steps: Step[] = [];

  switch (variant) {
    case 'research':
      const research = content as ResearchItem;
      steps.push({ text: 'Research', link: '/research' });

      if (research.category) {
        steps.push({
          text: research.category.name,
          link: `/research?category=${research.category.id}`,
        });
      }

      steps.push({ text: research.title });
      break;
    case 'question':
      const question = content as Question;
      steps.push({ text: 'Question', link: '/questions' });

      if (question.category) {
        steps.push({
          text: question.category.name,
          link: `/questions?category=${question.category.id}`,
        });
      }

      steps.push({ text: question.title });
      break;
    case 'library':
      const project = content as Project;
      steps.push({ text: 'Library', link: '/library' });

      if (project.category) {
        steps.push({
          text: project.category.name,
          link: `/library?category=${project.category.id}`,
        });
      }

      steps.push({ text: project.title });
      break;
    case 'news':
      const news = content as News;
      steps.push({ text: 'News', link: '/news' });
      steps.push({ text: news.title });
      break;
  }

  return steps;
};

export const Breadcrumbs = (props: BreadcrumbsProps) => {
  const { children, steps, content, variant } = props;

  const breadcrumbsSteps = steps ?? generateSteps(content, variant);

  return (
    <Flex
      sx={{
        alignItems: 'baseline',
        justifyContent: 'space-between',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 2,
        paddingLeft: [2, 0, 0],
      }}
    >
      <Flex sx={{ flex: ['none', 'none', 1], overflowX: 'auto', width: '100%' }}>
        <BreadcrumbsComponent steps={breadcrumbsSteps} />
      </Flex>

      {children}
    </Flex>
  );
};
