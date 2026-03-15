import { Loader, Pagination } from 'oa-components';
import type { Question } from 'oa-shared';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { logger } from 'src/logger';
import { Card, Flex, Heading } from 'theme-ui';
import useDrafts from '../common/Drafts/useDraftsSupabase';
import { listing } from './labels';
import { QuestionListHeader } from './QuestionListHeader';
import { QuestionListItem } from './QuestionListItem';
import type { QuestionSortOption } from './QuestionSortOptions';
import { questionService } from './question.service';

export const QuestionListing = () => {
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const { draftCount, isFetchingDrafts, drafts, showDrafts, handleShowDrafts } =
    useDrafts<Question>({
      getDraftCount: questionService.getDraftCount,
      getDrafts: questionService.getDrafts,
    });

  const [total, setTotal] = useState<number>(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') as QuestionSortOption;
  const pageNumber = parseInt(searchParams.get('page') || '0');
  const itemsPerPage = 21;

  useEffect(() => {
    if (!sort) {
      // ensure sort is set
      const params = new URLSearchParams(searchParams.toString());

      if (q) {
        params.set('sort', 'MostRelevant');
      } else {
        params.set('sort', 'Newest');
      }
      setSearchParams(params, { replace: true });
    } else {
      // search only when sort is set (avoids duplicate requests)
      const skip = pageNumber * itemsPerPage;
      fetchQuestions(skip);
    }
  }, [q, category, sort, pageNumber]);

  const fetchQuestions = async (skip: number = 0) => {
    setIsFetching(true);

    try {
      const result = await questionService.search(q, category, sort, skip);

      if (result) {
        setQuestions(result.items);
        setTotal(result.total);
      }
    } catch (error) {
      logger.error('error fetching questions', error);
    }

    setIsFetching(false);
  };

  const showLoadMore = !isFetching && questions && questions.length > 0 && questions.length < total;

  const questionsList = showDrafts ? drafts : questions;

  const updatePageNumber = (value: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', value.toString());
    setSearchParams(params, { replace: true });
  };

  return (
    <Flex sx={{ flexDirection: 'column', gap: [2, 3] }}>
      <QuestionListHeader
        itemCount={isFetching ? undefined : total}
        draftCount={isFetchingDrafts ? undefined : draftCount}
        handleShowDrafts={handleShowDrafts}
        showDrafts={showDrafts}
      />

      {questions?.length === 0 && !isFetching && (
        <Heading as="h1" sx={{ marginTop: 4 }}>
          {listing.noQuestions}
        </Heading>
      )}

      {questionsList && questionsList.length > 0 && (
        <Card
          as="ul"
          sx={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            marginBottom: 2,
            background: 'lightGrey',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}
          variant="responsive"
        >
          {questionsList.map((question, index) => (
            <QuestionListItem key={index} question={question} query={q} />
          ))}
        </Card>
      )}

      {showLoadMore && (
        <Flex sx={{ justifyContent: 'center' }}>
          <Pagination
            totalPages={Math.ceil(total / itemsPerPage)}
            onPageChange={updatePageNumber}
            page={pageNumber}
          />
        </Flex>
      )}

      {(isFetching || isFetchingDrafts) && <Loader />}
    </Flex>
  );
};
