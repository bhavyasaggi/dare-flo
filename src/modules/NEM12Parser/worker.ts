import * as Comlink from 'comlink'

import type { NEM12Parser } from './types'

const parser: NEM12Parser = {
  // TODO: Enhancement: Read file as a readable-stream, apply transformation, push to a writeable-stream.
  // Notes: May use papaparse and TransformStream for better memory management.
  // TODO: Enhancement: Provide progress updates
  async processCSV(csvFile: File) {
    const csvText = await csvFile.text()
    const lines = csvText.split(/\r?\n/)
    const sqlStatements: string[] = []

    let currentNMI: string | undefined
    let intervalLength: number = 0
    let creationTimestamp: Date | undefined

    for (const line of lines) {
      const parts = line.split(',')
      if (parts[0] === '100') {
        if (currentNMI) {
          throw new Error('NMI already exists.')
        }
        //
        const fileFormat = String(parts[1]).trim().toUpperCase()
        if (fileFormat !== 'NEM12') {
          throw new Error('Invalid Meter File Format.')
        }
        const fileDatetime = String(parts[2]).trim()
        creationTimestamp = new Date(
          Number.parseInt(fileDatetime.slice(0, 4), 10),
          Number.parseInt(fileDatetime.slice(4, 6), 10) - 1,
          Number.parseInt(fileDatetime.slice(6, 8), 10),
          Number.parseInt(fileDatetime.slice(8, 10), 10),
          Number.parseInt(fileDatetime.slice(10, 12), 10),
          Number.parseInt(fileDatetime.slice(12, 14), 10)
        )
      }

      if (parts[0] === '200') {
        currentNMI = parts[1]
        intervalLength = Number.parseInt(parts[8], 10) || 0
      }

      if (parts[0] === '300' && currentNMI) {
        const dateString = parts[1] || ''
        const baseTimestamp = new Date(
          Number.parseInt(dateString.slice(0, 4), 10),
          Number.parseInt(dateString.slice(4, 6), 10) - 1,
          Number.parseInt(dateString.slice(6, 8), 10)
        )

        for (let index = 2; index < parts.length; index += 1) {
          const valueString = parts[index]
          if (!valueString) {
            continue
          }

          const value = Number.parseFloat(valueString)
          if (Number.isNaN(value)) {
            continue
          }

          const timestamp = new Date(baseTimestamp)
          timestamp.setMinutes(timestamp.getMinutes() + index * intervalLength)

          sqlStatements.push(
            `INSERT INTO meter_readings (nmi, timestamp, consumption) VALUES ('${
              currentNMI
            }', '${timestamp.toISOString()}', ${String(value)});`
          )
        }
      }

      if (parts[0] === '900') {
        currentNMI = ''
        intervalLength = 0
      }
    }

    const returnBlob = new File([sqlStatements.join('\n')], 'download.sql', {
      type: 'text/plain',
      lastModified: creationTimestamp?.getTime(),
    })
    return returnBlob
  },
}

Comlink.expose(parser)
