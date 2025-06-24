import { Code, LoadingOverlay, Paper, Stack } from '@mantine/core'
import { useState } from 'react'

import CodeHighlight from '@/components/CodeHighlight'
import InputDropzone from '@/components/InputDropzone'
import { useNem12Parser } from '@/modules/NEM12Parser'

export default function SectionParseMeterFile() {
  const [meterFile, setMeterFile] = useState<File | undefined>()

  const [data, { isProcessing, isError }] = useNem12Parser(meterFile)

  return (
    <Stack>
      <InputDropzone
        loading={isProcessing}
        disabled={isProcessing}
        maxFiles={1}
        multiple={false}
        onDrop={(files) => {
          setMeterFile(files[0])
        }}
      />
      <Paper
        pos='relative'
        withBorder
        radius='md'
        style={{ overflow: 'hidden' }}
      >
        <LoadingOverlay visible={isProcessing} />
        {isError ? 'Something went wrong. Try again?' : undefined}
        {!isError && !meterFile ? (
          <Code block mih={64}>
            The SQL statements from CSV (NEM12 format) shall show up here.
          </Code>
        ) : undefined}
        {!isError && meterFile ? (
          <CodeHighlight code={data || '-'} language='sql' />
        ) : undefined}
      </Paper>
    </Stack>
  )
}
