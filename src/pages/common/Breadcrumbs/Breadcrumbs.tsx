import { Fragment } from 'react';
import { Link } from 'react-router';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

type BreadcrumbStep = { text: string; link?: string };

interface BreadcrumbsProps {
  steps: BreadcrumbStep[];
}

export const Breadcrumbs = ({ steps }: BreadcrumbsProps) => {
  return (
    <Breadcrumb className="w-full">
      <BreadcrumbList>
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          return (
            <Fragment key={index}>
              <BreadcrumbItem data-testid="breadcrumbsItem" data-cy="breadcrumbsItem">
                {isLast ? (
                  <BreadcrumbPage>{step.text}</BreadcrumbPage>
                ) : step.link ? (
                  <BreadcrumbLink render={<Link to={step.link} />}>{step.text}</BreadcrumbLink>
                ) : (
                  <span className="px-3 py-1 whitespace-nowrap">{step.text}</span>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator data-testid="breadcrumbsChevron" />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
