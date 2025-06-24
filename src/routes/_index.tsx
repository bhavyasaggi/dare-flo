import { Box, Container, Divider, Skeleton, Stack, Title } from '@mantine/core'
import { lazy, Suspense } from 'react'

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

export default function RouteIndex() {
  return (
    <>
      <Box py='xl'>
        <Container>
          <Title order={1}>NEM12 CSV to SQL Parser</Title>
        </Container>
      </Box>
      <Divider />
      <Container my='md'>
        <Suspense
          fallback={
            <Stack>
              <Skeleton height={106} radius='md' />
              <Skeleton height={64} radius='md' />
            </Stack>
          }
        >
          <SectionParseMeterFile />
        </Suspense>
      </Container>
    </>
  )
}
