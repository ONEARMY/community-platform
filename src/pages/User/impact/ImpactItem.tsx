import type { IImpactDataField, IImpactYear, Profile } from 'oa-shared';
import { sortImpactYearDisplayFields } from 'src/pages/UserSettings/utils';
import { Box, Flex, Heading } from 'theme-ui';
import { IMPACT_REPORT_LINKS } from './constants';
import { ImpactField } from './ImpactField';
import { ImpactMissing } from './ImpactMissing';

interface Props {
  year: IImpactYear;
  fields: IImpactDataField[] | undefined;
  user: Profile | undefined;
}

export const ImpactItem = ({ fields, user, year }: Props) => {
  const outterBox = {
    flexBasis: ['100%', '100%', '50%'],
    padding: 2,
  };

  const innerBox = {
    backgroundColor: 'white',
    borderRadius: 1,
    height: '100%',
    padding: 2,
  };

  const sortedFields = sortImpactYearDisplayFields(fields);
  const visibleFields = sortedFields?.filter((field) => field.isVisible);
  const isReportYear = IMPACT_REPORT_LINKS[year];
  const hasData = fields && fields.length > 0;
  const hasImpact = visibleFields && visibleFields.length > 0;

  if (!isReportYear && !hasData) {
    return null;
  }

  return (
    <Box sx={outterBox} cy-data={`ImpactItem-${year}`}>
      <Box sx={innerBox}>
        <Heading as="h3" variant="small">
          {year}
        </Heading>
        {hasImpact ? (
          <>
            <Flex sx={{ flexDirection: 'column', gap: 2 }}>
              {visibleFields.map((field, index) => {
                return <ImpactField field={field} key={index} />;
              })}
            </Flex>
          </>
        ) : (
          <ImpactMissing fields={fields} owner={user} visibleFields={visibleFields} year={year} />
        )}
      </Box>
    </Box>
  );
};
