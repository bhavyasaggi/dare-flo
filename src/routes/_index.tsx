import {
  Box,
  Code,
  Container,
  Divider,
  Skeleton,
  Text,
  Title,
} from '@mantine/core'
import React, { lazy, Suspense } from 'react'

import type { Route } from './+types/_index'

const SectionParseMeterFile = lazy(
  () => import('@/components/SectionParseMeterFile')
)

export function meta(_arguments: Route.MetaArgs) {
  return [
    { title: 'Dare (Flo)' },
    { name: 'description', content: 'A Tech Assessment for Flo!' },
  ]
}

const meterReadingsTableSQL = `
CREATE TABLE meter_readings (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  "nmi" varchar(10) NOT NULL,
  "timestamp" TIMESTAMP NULL NULL,
  "consumption" NUMERIC NOT NULL,
  constraint meter_readings_pk PRIMARY KEY (id),
  constraint meter_readings_unique_consumption UNIQUE ("nmi", "timestamp")
);
`

export default function RouteIndex() {
  return (
    <React.Fragment>
      <Box py='xl'>
        <Container>
          <Title order={1}>NEM12 CSV to SQL Parser</Title>
        </Container>
      </Box>
      <Divider />
      <Container my='md'>
        <Suspense fallback={<Skeleton height={106} radius='md' />}>
          <SectionParseMeterFile />
        </Suspense>
        <Divider my='md' />
        <Title order={2}>Reference:</Title>
        <Text c='dimmed'>
          SQL DUMP (INSERT) would be generated for &lsquo;meter_readings&rsquo;
          Table
        </Text>
        <Code block>{meterReadingsTableSQL}</Code>
      </Container>
    </React.Fragment>
  )
}
