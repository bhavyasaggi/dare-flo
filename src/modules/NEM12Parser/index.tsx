import * as Comlink from 'comlink'
import { useEffect, useRef, useState } from 'react'

import type { NEM12Parser } from './types'

const Nem12Worker = new Worker(new URL('worker', import.meta.url), {
  type: 'module',
})
const Nem12WorkerApi = Comlink.wrap<NEM12Parser>(Nem12Worker)

export function useNem12Parser(file?: File) {
  const fileRef = useRef<File | undefined>(undefined)
  const [isProcessing, setProcessing] = useState(Boolean(file))
  const [isError, setError] = useState(false)
  const [data, setData] = useState<string | undefined>()

  useEffect(() => {
    let isStale = false
    fileRef.current = file
    if (fileRef.current) {
      setProcessing(true)
      Nem12Worker.terminate()
      Nem12WorkerApi.processCSV(fileRef.current)
        .then((data) => {
          if (!isStale) {
            // parse file data
            setData(data.join('\n'))
          }
        })
        .catch(() => {
          if (!isStale) {
            //
            setError(true)
          }
        })
        .finally(() => {
          if (!isStale) {
            setProcessing(false)
          }
        })
    }
    return () => {
      isStale = true
    }
  }, [file])

  // TODO: return objectUrl generated via WebWorker, and preview-data
  return [
    data,
    {
      isProcessing: isProcessing || fileRef.current !== file,
      isError,
    },
  ] as const
}
