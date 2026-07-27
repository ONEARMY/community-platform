import { observer } from 'mobx-react';
import type { IImpactDataField, IImpactYear } from 'oa-shared';
import { useEffect, useRef, useState } from 'react';
import { Form } from 'react-final-form';
import { useLocation } from 'react-router';
import { useToast } from 'src/common/Toast';
import { profileService } from 'src/services/profileService';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import type { ThemeUIStyleObject } from 'theme-ui';
import { Flex, Heading, Text } from 'theme-ui';
import {
  sortImpactYearDisplayFields,
  transformImpactData,
  transformImpactInputs,
} from '../../utils';
import { ImpactYearField } from '../fields/ImpactYear.field';
import { ImpactYearDisplayField } from '../fields/ImpactYearDisplay.field';

interface Props {
  year: IImpactYear;
}

export const ImpactYearSection = observer(({ year }: Props) => {
  const [impact, setImpact] = useState<IImpactDataField[] | undefined>(undefined);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const impactDivRef = useRef<HTMLInputElement>(null);
  const { hash } = useLocation();
  const { profile, updateImpact } = useProfileStore();
  const toast = useToast();

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
    const fields = transformImpactInputs(values);
    const promise = profileService.updateImpact(year, fields);
    toast.promise(promise, {
      loading: 'Updating your impact...',
      success: (impact) => {
        updateImpact(impact);
        setIsEditMode(false);
        setImpact(sortImpactYearDisplayFields(fields));

        return 'Impact updated!';
      },
      error: (error) => `Error: ${error.message}`,
    });
  };

  return (
    <Flex sx={sx} id={`year_${year}`}>
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
