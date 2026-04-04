import { Flex, Label, Text } from 'theme-ui';

const _labelStyle = {
  fontSize: 2,
  marginBottom: 1,
  display: 'block',
};

interface IProps {
  children: React.ReactNode;
  description?: string;
  htmlFor?: string;
  required?: boolean;
  flexDirection?: 'column' | 'row' | 'row-reverse' | 'column-reverse';
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  text: string;
}

export const FormFieldWrapper = (props: IProps) => {
  const {
    children,
    description,
    htmlFor,
    required,
    text,
    flexDirection = 'column',
    flexWrap = 'nowrap',
  } = props;

  const heading = required ? `${text} *` : text;

  return (
    <Flex sx={{ flexDirection, flexWrap }}>
      <Label sx={_labelStyle} htmlFor={htmlFor}>
        {heading}
      </Label>

      {description && (
        <Text variant="quiet" sx={{ fontSize: 2 }}>
          {description}
        </Text>
      )}

      <Flex sx={{ flexDirection: 'column' }}>{children}</Flex>
    </Flex>
  );
};
