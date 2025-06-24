import { Box, Group, Text } from '@mantine/core'
import { Dropzone, type DropzoneProps } from '@mantine/dropzone'
import { IconUpload, IconFileTypeCsv, IconX } from '@tabler/icons-react'

export default function InputDropzone(
  props: Pick<
    DropzoneProps,
    | 'accept'
    | 'disabled'
    | 'loading'
    | 'maxFiles'
    | 'maxSize'
    | 'multiple'
    | 'onDrop'
    | 'onReject'
    | 'className'
    | 'style'
  >
) {
  return (
    <Dropzone {...props} accept={['text/csv']} maxFiles={1}>
      <Group
        gap='xl'
        justify='center'
        mih={72}
        style={{ pointerEvents: 'none' }}
      >
        <Dropzone.Accept>
          <IconUpload color='var(--mantine-color-blue-6)' size={48} />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX color='var(--mantine-color-red-6)' size={48} />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconFileTypeCsv color='var(--mantine-color-dimmed)' size={48} />
        </Dropzone.Idle>
        <Box>
          <Text inline size='xl'>
            Drag CSV file here or click to select file
          </Text>
          <Text inline c='dimmed' mt={7} size='sm'>
            Attach a CSV files in NEM12 format
          </Text>
        </Box>
      </Group>
    </Dropzone>
  )
}
