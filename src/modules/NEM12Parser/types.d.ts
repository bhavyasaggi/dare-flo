export type NEM12Parser = {
  processCSV: (fileCSV: File) => Promise<string[]>
}
