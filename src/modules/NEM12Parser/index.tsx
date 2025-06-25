import * as Comlink from 'comlink'
import { useEffect, useRef, useState } from 'react'

import type { NEM12Parser } from './types'

export function useNem12Parser(file?: File) {
  const workerRef = useRef<Worker | undefined>(undefined)
  const fileRef = useRef<File | undefined>(undefined)

  const [isProcessing, setProcessing] = useState(Boolean(file))
  const [isError, setError] = useState(false)
  const [dataFile, setDataFile] = useState<Blob | undefined>()

  useEffect(() => {
    let isStale = false
    fileRef.current = file
    if (fileRef.current) {
      setProcessing(true)
      // Better to Nuke when in doubt.
      if (workerRef.current) {
        workerRef.current.terminate()
      }
      workerRef.current = new Worker(new URL('worker', import.meta.url), {
        type: 'module',
      })
      // Using comlink to avoid post-messaging
      Comlink.wrap<NEM12Parser>(workerRef.current)
        .processCSV(fileRef.current)
        .then((resultFile) => {
          if (!isStale) {
            setDataFile(resultFile)
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
    } else {
      if (workerRef.current) {
        workerRef.current.terminate()
      }
      setProcessing(false)
      setError(false)
      setDataFile(undefined)
    }
    return () => {
      isStale = true
    }
  }, [file])

  return [
    dataFile,
    {
      isProcessing: isProcessing || fileRef.current !== file,
      isError,
    },
  ] as const
}
