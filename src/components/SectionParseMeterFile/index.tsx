import { Box, Button, LoadingOverlay, Paper, Stack, Text } from '@mantine/core'
import React, { useEffect, useState } from 'react'

import InputDropzone from '@/components/InputDropzone'
import { useNem12Parser } from '@/modules/NEM12Parser'

import Link from '../Link'

export default function SectionParseMeterFile() {
  const [meterFile, setMeterFile] = useState<File | undefined>()
  const [dataFile, { isProcessing, isError }] = useNem12Parser(meterFile)

  const [dataFileUrl, setDataFileUrl] = useState<string | undefined>()
  useEffect(() => {
    // This is in effect because URL.createObjectUrl is a Browser-API.
    setDataFileUrl(dataFile ? URL.createObjectURL(dataFile) : undefined)
  }, [dataFile])
  useEffect(() => {
    // Clear URL.revokeObjectUrl to prevent memory-leakage.
    return () => {
      if (dataFileUrl) {
        URL.revokeObjectURL(dataFileUrl)
      }
    }
  }, [dataFileUrl])

  if (isError || dataFileUrl) {
    return (
      <Paper
        pos='relative'
        withBorder
        radius='md'
        style={{ overflow: 'hidden' }}
      >
        <LoadingOverlay visible={isProcessing} />
        <Stack py='md' px='lg' align='center' justify='center' gap='xs'>
          {isError ? (
            <React.Fragment>
              <Text>Something went wrong.</Text>
              <Button
                onClick={() => {
                  setMeterFile(undefined)
                }}
              >
                Try Again?
              </Button>
            </React.Fragment>
          ) : undefined}
          {!isError && dataFileUrl ? (
            <React.Fragment>
              <Box>
                You may download your SQL Dump{' '}
                <Link href={dataFileUrl || '#'} download='download.sql'>
                  here
                </Link>
              </Box>
              <Text>or</Text>
              <Button
                onClick={() => {
                  setMeterFile(undefined)
                }}
              >
                Try Again?
              </Button>
            </React.Fragment>
          ) : undefined}
        </Stack>
      </Paper>
    )
  }

  return (
    <InputDropzone
      loading={isProcessing}
      disabled={isProcessing}
      maxFiles={1}
      multiple={false}
      onDrop={(files) => {
        setMeterFile(files[0])
      }}
    />
  )
}
