import { useEffect, useRef, useState } from 'react';
import { Form } from 'react-final-form';
import { useLocation } from 'react-router';
import { observer } from 'mobx-react';
import { UserContactError } from 'src/pages/User/contact';
import { form } from 'src/pages/UserSettings/labels';
import { profileService } from 'src/services/profileService';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { Flex, Heading, Text } from 'theme-ui';

import {
  sortImpactYearDisplayFields,
  transformImpactData,
  transformImpactInputs,
} from '../../utils';
import { ImpactYearField } from '../fields/ImpactYear.field';
import { ImpactYearDisplayField } from '../fields/ImpactYearDisplay.field';

import type { IImpactDataField, IImpactYear } from 'oa-shared';
import type { SubmitResults } from 'src/pages/User/contact/UserContactError';
import type { ThemeUIStyleObject } from 'theme-ui';

interface Props {
  year: IImpactYear;
}

export const ImpactYearSection = observer(({ year }: Props) => {
  const [impact, setImpact] = useState<IImpactDataField[] | undefined>(undefined);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [submitResults, setSubmitResults] = useState<SubmitResults | null>(null);

  const impactDivRef = useRef<HTMLInputElement>(null);
  const { hash } = useLocation();
  const { profile } = useProfileStore();

  const formId = `impactForm-${year}`;
  const sx = {
    backgroundColor: 'background',
    borderRadius: 2,
    gap: 1,
    marginBottom: 2,
    padding: 2,
    flexDirection: 'column',
  } as ThemeUIStyleObject;

  useEffect(() => {
    const fetchImpact = () => {
      const impact = profile?.impact;
      if (impact && impact[year]) {
        setImpact(impact[year]);
      }
    };

    fetchImpact();
  }, []);

  useEffect(() => {
    const anchor = `#year_${year}`;

    const openEditMode = () => {
      if (hash === anchor) {
        setTimeout(() => {
          const section = document.querySelector(anchor);
          // the delay is needed, otherwise the scroll is not happening in Firefox
          section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);

        return setIsEditMode(true);
      }
      return setIsEditMode(false);
    };

    openEditMode();
  }, [hash]);

  const onSubmit = async (values) => {
    setSubmitResults(null);
    try {
      const fields = transformImpactInputs(values);
      await profileService.updateImpact(year, fields);
      setSubmitResults({ type: 'success', message: form.saveSuccess });
      setIsEditMode(false);
      setImpact(sortImpactYearDisplayFields(fields));
    } catch (error) {
      setSubmitResults({ type: 'error', message: error.message });
    }
  };

  return (
    <Flex sx={sx} id={`year_${year}`}>
      <UserContactError submitResults={submitResults} />

      <Heading as="h3" variant="small" ref={impactDivRef}>
        {year}
      </Heading>
      <Text as="h4" variant="quiet" sx={{ marginBottom: 2 }}>
        All fields optional
      </Text>

      <Form
        id={formId}
        initialValues={impact ? transformImpactData(impact) : undefined}
        onSubmit={onSubmit}
        render={({ handleSubmit, values, submitting }) => {
          return isEditMode ? (
            <ImpactYearField formId={formId} handleSubmit={handleSubmit} submitting={submitting} />
          ) : (
            <ImpactYearDisplayField
              fields={sortImpactYearDisplayFields(transformImpactInputs(values))}
              formId={formId}
              setIsEditMode={setIsEditMode}
            />
          );
        }}
      />
    </Flex>
  );
});
