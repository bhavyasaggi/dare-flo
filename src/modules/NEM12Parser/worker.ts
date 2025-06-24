import * as Comlink from 'comlink'

import type { NEM12Parser } from './types'

const getRandomId = () => Math.random().toString(36).slice(2, 8)

const parser: NEM12Parser = {
  async processCSV(csvFile: File) {
    const csvText = await csvFile.text()
    const lines = csvText.split(/\r?\n/)
    const sqlStatements: string[] = []

    let currentNMI = ''
    let intervalLength = 30

    for (const line of lines) {
      const parts = line.split(',')
      if (parts[0] === '200') {
        currentNMI = parts[1]
        intervalLength = Number.parseInt(parts[8], 10)
      }

      if (parts[0] === '300') {
        const date = parts[1]
        const baseTimestamp = new Date(
          Number(date.slice(0, 4)),
          Number(date.slice(4, 6)) - 1,
          Number(date.slice(6, 8))
        )

        for (let index = 0; index < 48; index += 1) {
          const valueString = parts[2 + index]
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
            `INSERT INTO meter_readings (id, nmi, timestamp, consumption) VALUES ('${getRandomId()}', '${
              currentNMI
            }', '${timestamp.toISOString()}', ${String(value)});`
          )
        }
      }
    }

    return sqlStatements
  },
}

Comlink.expose(parser)
