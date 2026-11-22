import type { Image, UserCreatedDocs } from 'oa-shared';
import { Link } from 'react-router';
import { Card } from '@/components/ui/card';
import libraryIcon from '@/components/ui/icons/library.svg';
import questionsIcon from '@/components/ui/icons/questions.svg';
import researchIcon from '@/components/ui/icons/research.svg';
import { ProfileContributionItem } from './ProfileContributionItem';

const MAX_ITEMS = 3;

type Doc = {
  id?: number;
  slug?: string;
  title?: string;
  usefulCount?: number;
  commentCount?: number;
  acceptedAnswerId?: number | null;
};

const toItem = (doc: Doc, coverImage?: Image | null) => ({
  id: doc.id!,
  slug: doc.slug!,
  title: doc.title!,
  usefulCount: doc.usefulCount || 0,
  commentCount: doc.commentCount,
  coverImage: coverImage || undefined,
  hash: doc.acceptedAnswerId ? `comment:${doc.acceptedAnswerId}` : undefined,
});

interface IProps {
  docs: UserCreatedDocs;
  username: string;
}

export const ProfileContributions = ({ docs, username }: IProps) => {
  const sections = [
    {
      type: 'library',
      title: 'Projects',
      icon: libraryIcon,
      testId: 'library-contributions',
      items: docs.projects.map((doc) => toItem(doc, doc.coverImage)),
    },
    {
      type: 'research',
      title: 'Research',
      icon: researchIcon,
      testId: 'research-contributions',
      items: docs.research.map((doc) => toItem(doc, doc.image)),
    },
    {
      type: 'questions',
      title: 'Answers',
      icon: questionsIcon,
      testId: 'answer-contributions',
      items: docs.answers.map((doc) => toItem(doc, doc.images?.[0])),
    },
  ] as const;

  const visibleSections = sections.filter(({ items }) => items.length);

  if (!visibleSections.length) {
    return null;
  }

  return (
    <Card variant="elevated">
      <h2 className="m-0 font-heading text-3xl font-normal">Contributions</h2>
      {visibleSections.map(({ type, title, icon, testId, items }) => {
        const isAnswers = type === 'questions';
        const hasMore = !isAnswers && items.length > MAX_ITEMS;
        const layout = isAnswers ? 'horizontal' : 'vertical';
        const sorted = [...items].sort((a, b) => b.id - a.id);
        const visible = hasMore ? sorted.slice(0, MAX_ITEMS) : sorted;

        return (
          <section key={type} data-testid={testId} className="flex flex-col gap-3 font-sans">
            <h3 className="m-0 flex items-center gap-2 font-heading text-xl font-normal">
              <img src={icon} alt="" className="size-6 shrink-0" />
              {title}
            </h3>
            <div
              className={
                layout === 'horizontal' ? 'flex flex-col gap-2.5' : 'grid gap-2.5 sm:grid-cols-3'
              }
            >
              {visible.map((item) => (
                <ProfileContributionItem key={item.id} type={type} layout={layout} item={item} />
              ))}
            </div>
            {hasMore && (
              <Link
                to={`/${type}?q=${encodeURIComponent(username)}`}
                className="self-center text-sm hover:underline"
              >
                View more {title.toLowerCase()} <span aria-hidden="true">→</span>
              </Link>
            )}
          </section>
        );
      })}
    </Card>
  );
};
