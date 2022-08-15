/**
 * Parses ledger-cli reports
 */
export class LedgerOutputParser {
  /**
   * Returns the array of lines containing totals from the ledger output.
   * @param {Array} lines
   */
  getTotalLines(lines) {
    // Extract the total lines from the output,
    // unless there is only one account, in which case use the complete output
    let result = []
    let totalLine = null
    let nextLineIsTotal = false

    if (lines.length == 1) {
      // No income is an array with an empty string ['']
      if (lines[0] == '') {
        totalLine = '0'
      } else {
        // One-line results don't have totals
        totalLine = lines[0]
      }
      result.push(totalLine)
    } else {
      for (let i = 0; i < lines.length; i++) {
        if (nextLineIsTotal) {
          totalLine = lines[i]
          result.push(totalLine)
        } else {
          if (lines[i].includes('------')) {
            nextLineIsTotal = true
          }
        }
      }
    }

    if (totalLine == '') {
      throw new Error('No total received!')
    }

    return result
  }
}
