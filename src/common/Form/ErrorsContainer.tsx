import { Box, Card, Flex, Text } from 'theme-ui';

import { headings } from './labels';

import type { IErrorsListSet } from './types';

interface IProps {
  clientErrors?: IErrorsListSet[];
  serverErrors?: string[];
}

export const ErrorsContainer = ({ clientErrors, serverErrors }: IProps) => {
  const hasClientErrors = clientErrors && clientErrors.length !== 0;
  const hasServerErrors =
    serverErrors && serverErrors.filter((error) => error != undefined).length !== 0;

  if (!hasClientErrors && !hasServerErrors) {
    return null;
  }

  return (
    <Card
      data-cy="errors-container"
      sx={{
        display: 'flex',
        padding: 3,
        flexDirection: 'column',
        fontSize: 1,
        backgroundColor: 'red2',
        borderColor: 'red',
        gap: 2,
      }}
    >
      <Text sx={{ fontSize: 2, fontWeight: 'bold' }}>{headings.errors}</Text>
      {hasServerErrors && (
        <ul style={{ padding: 0, margin: 0, listStylePosition: 'inside' }}>
          {serverErrors.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      )}
      {hasClientErrors &&
        clientErrors.map((errorsList, index) => {
          const { errors, title, keys, labels } = errorsList;

          return (
            <Flex key={index} sx={{ flexDirection: 'column' }}>
              {title && (
                <Box paddingBottom={1}>
                  <Text>{title}</Text>
                </Box>
              )}
              <ul style={{ padding: 0, margin: 0, listStylePosition: 'inside' }}>
                {keys.map((key, keyIndex) => {
                  return (
                    <li key={keyIndex}>
                      <strong>{labels[key].title}</strong>: {errors[key] as string}
                    </li>
                  );
                })}
              </ul>
            </Flex>
          );
        })}
    </Card>
  );
};
