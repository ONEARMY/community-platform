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
  text: string;
}

export const FormFieldWrapper = (props: IProps) => {
  const { children, description, htmlFor, required, text } = props;

  const heading = required ? `${text} *` : text;

  return (
    <Flex sx={{ flexDirection: 'column' }}>
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
