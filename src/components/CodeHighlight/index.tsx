/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import '@mantine/code-highlight/styles.css'

import {
  CodeHighlight as CodeHighlightImport,
  CodeHighlightControl,
  type CodeHighlightProps,
  CodeHighlightAdapterProvider,
  createShikiAdapter,
} from '@mantine/code-highlight'
import { notifications } from '@mantine/notifications'
import { IconDownload } from '@tabler/icons-react'
import { useState } from 'react'

// Shiki requires async code to load the highlighter
async function loadShiki() {
  const { createHighlighter } = await import('shiki')
  const shiki = await createHighlighter({
    langs: ['sql'],
    themes: [],
  })

  return shiki
}

const shikiAdapter = createShikiAdapter(loadShiki)

export default function CodeHighlight(
  props: Pick<
    CodeHighlightProps,
    'code' | 'language' | 'className' | 'style'
  > & { disabled?: boolean | undefined }
) {
  const [expanded, setExpanded] = useState(false)

  return (
    <CodeHighlightAdapterProvider adapter={shikiAdapter}>
      <CodeHighlightImport
        expanded={expanded}
        onExpandedChange={setExpanded}
        withCopyButton={true}
        withExpandButton={true}
        controls={[
          <CodeHighlightControl
            key='download'
            tooltipLabel='Download as file'
            onClick={() => {
              // Important: Remember to revoke to avoid memory-overflow
              const url = URL.createObjectURL(
                new Blob([props.code], { type: 'text/plain' })
              )
              const link = document.createElement('a')
              link.href = url
              link.download = `download.${(props.language || 'txt') as string}`
              link.click()
              URL.revokeObjectURL(url)
              // Trigger a in-browser notification
              notifications.show({
                autoClose: true,
                message: 'File download started.',
              })
            }}
          >
            <IconDownload />
          </CodeHighlightControl>,
        ]}
        code={expanded ? props.code : String(props.code).slice(0, 200)}
        language={props.language}
        className={props.className}
        style={props.style}
      />
    </CodeHighlightAdapterProvider>
  )
}
