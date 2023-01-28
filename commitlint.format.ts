import type { Formatter, FormattableReport } from '@commitlint/types'

// Custom formatter for commitlint message
export const formatter: Formatter = function (report, options) {
  const { results, valid } = report as IFormatReport
  if (results && !valid) {
    console.log('\nCommit needs to be formatted as conventional commit')
    console.log('\n<type>[optional scope]: <description>\n')
    for (const result of results) {
      if (result.errors) {
        for (const error of result.errors) {
          console.log(result.input)
          console.log('\x1b[31m%s\x1b[0m', '✖   ' + error.message)
        }
      }
    }
  }
  console.log('\n')
  console.log(options.helpUrl)
  console.log('\n')
  return ''
}

module.exports = formatter

// Fix type definition for formattable report
interface IFormatReport extends FormattableReport {
  errorCount: number
  valid: boolean
  warningCount: number
}
