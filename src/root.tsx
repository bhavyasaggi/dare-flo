import '@mantine/core/styles.css'
import '@mantine/nprogress/styles.css'
import '@mantine/dropzone/styles.css'

import './styles/styles.css'

import { SiReactrouter, SiMantine } from '@icons-pack/react-simple-icons'
import {
  AppShell,
  Box,
  Center,
  ColorSchemeScript,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  Loader,
  MantineProvider,
  Text,
  mantineHtmlProps,
} from '@mantine/core'
import { NavigationProgress, nprogress } from '@mantine/nprogress'
import React, { useEffect } from 'react'
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from 'react-router'

import Link from './components/Link'

import type { Route } from './+types/root'

export const links: Route.LinksFunction = () => [
  { href: 'https://fonts.googleapis.com', rel: 'preconnect' },
  {
    crossOrigin: 'anonymous',
    href: 'https://fonts.gstatic.com',
    rel: 'preconnect',
  },
  { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: '/favicon-32x32.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: '/favicon-16x16.png',
  },
  { rel: 'manifest', href: '/site.webmanifest' },
]

export function Layout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang='en' {...mantineHtmlProps}>
      <head>
        <meta charSet='utf-8' />
        <meta content='width=device-width, initial-scale=1' name='viewport' />
        <ColorSchemeScript />
        <Meta />
        <Links />
      </head>
      <body>
        <MantineProvider>
          <NavigationProgress />
          <AppShell header={{ height: 72 }}>
            <AppShell.Header style={{ overflow: 'hidden' }}>
              <Group py='sm' component={Container} wrap='nowrap'>
                <Image
                  src='/apple-touch-icon.png'
                  fallbackSrc='data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
                  height='48'
                  width='48'
                  fit='contain'
                  style={{ height: 48, width: 48 }}
                />
                <Text fz='h2' fw='bold'>
                  Dare (Flo)
                </Text>
              </Group>
            </AppShell.Header>
            <AppShell.Main>{children}</AppShell.Main>
            <Divider my='md' />
            <AppShell.Section>
              <Container>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 8 }}>
                    <Box>
                      <Text component='span' fz='lg'>
                        Built with 🫀 for&nbsp;
                      </Text>
                      <Link
                        to='https://floenergy.sg/'
                        style={{ verticalAlign: 'middle' }}
                      >
                        <Image
                          src='https://floenergy.sg/apple-touch-icon.png'
                          alt='Flo Energy'
                          title='Flo Energy'
                          height='28'
                          width='28'
                          display='inline-block'
                          fit='contain'
                          w='auto'
                        />
                      </Link>
                    </Box>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Text>Powered By</Text>
                    <Flex gap='xs' mt='xs'>
                      <Link to='https://reactrouter.com/'>
                        <SiReactrouter color='default' size={28} />
                      </Link>
                      <Link to='https://mantine.dev/'>
                        <SiMantine color='default' size={28} />
                      </Link>
                    </Flex>
                  </Grid.Col>
                </Grid>
                <Divider my='md' />
                <Box ta='end' pb='xl'>
                  <Text fz='sm'>Copyright 20XX</Text>
                </Box>
              </Container>
            </AppShell.Section>
          </AppShell>
        </MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  const { state: navigationState } = useNavigation()

  useEffect(() => {
    if (navigationState === 'idle') {
      nprogress.complete()
    } else {
      nprogress.start()
    }
  }, [navigationState])

  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className='pt-16 p-4 container mx-auto'>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack ? (
        <pre className='w-full p-4 overflow-x-auto'>
          <code>{stack}</code>
        </pre>
      ) : undefined}
    </main>
  )
}

export function HydrateFallback() {
  return (
    <Center mih='50vh'>
      <Loader size='xl' />
    </Center>
  )
}
