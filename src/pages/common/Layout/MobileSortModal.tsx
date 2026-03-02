import { Icon, Modal } from 'oa-components';
import { Box, Button, Flex, Text } from 'theme-ui';

export interface FilterSection {
  title: string;
  options: { label: string; value: string }[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

interface Props {
  isOpen: boolean;
  onDismiss: () => void;
  title: string;
  sections: FilterSection[];
  onApply: () => void;
  onReset: () => void;
}

export const MobileSortModal = (props: Props) => {
  const { isOpen, onDismiss, title, sections, onApply, onReset } = props;

  return (
    <Modal
      onDismiss={onDismiss}
      isOpen={isOpen}
      sx={{
        width: '90vw',
        maxHeight: '80vh',
        p: 0,
      }}
    >
      <Flex
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 3,
          py: 2,
          borderBottom: '2px solid',
          borderColor: 'muted',
        }}
      >
        <Box sx={{ width: 32 }} />
        <Text sx={{ fontSize: 4 }}>{title}</Text>
        <Button
          variant="outline"
          sx={{
            border: 'none',
            padding: 0,
            minWidth: 32,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            '&:hover': { backgroundColor: 'transparent' },
          }}
          onClick={onDismiss}
        >
          <Icon glyph="close-modal" size={20} />
        </Button>
      </Flex>

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
        }}
      >
        {sections.map((section, index) => (
          <Box key={section.title}>
            <Flex
              sx={{
                flexDirection: 'column',
                px: 3,
              }}
            >
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li>
                  <Flex
                    sx={{
                      paddingTop: '10px',
                      paddingBottom: '10px',
                      alignItems: 'center',
                      fontSize: 3,
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text>{section.title}</Text>
                  </Flex>
                </li>
                {section.options.map((option) => (
                  <li key={option.value}>
                    <Flex
                      onClick={() => section.onSelect(option.value)}
                      sx={{
                        cursor: 'pointer',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '10px',
                        paddingBottom: '10px',
                        fontSize: 2,
                      }}
                    >
                      {option.label}
                      <Flex
                        sx={{
                          width: 22,
                          height: 22,
                          flexShrink: 0,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {section.selectedValue === option.value ? (
                          <Icon glyph="check" color="green" size={22} />
                        ) : null}
                      </Flex>
                    </Flex>
                  </li>
                ))}
              </ul>
            </Flex>
            {index < sections.length - 1 && (
              <Box
                sx={{
                  borderTop: '2px solid',
                  borderColor: 'softgrey',
                }}
              />
            )}
          </Box>
        ))}
      </Box>

      <Flex
        sx={{
          gap: 2,
          borderTop: '2px solid',
          borderColor: 'muted',
          paddingTop: '10px',
          paddingBottom: '10px',
          px: 3,
        }}
      >
        <Button
          variant="primary"
          onClick={onApply}
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          Apply
        </Button>
        <Button
          variant="outline"
          sx={{
            border: 'none',
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={onReset}
        >
          Reset
        </Button>
      </Flex>
    </Modal>
  );
};
