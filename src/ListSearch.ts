/*
    Search through the list of items.
    Using regular expressions to search for parts of words sparated by space.
    i.e. search term "ba ca" should match "Assets:Bank:Cash".
*/

export class ListSearch {
  /**
   * Initialize the search with the data.
   * @param {Array} data An array of items to search through.
   */
  // constructor() {
  // this.searchTerm = searchTerm
  // data
  // this.data = data;
  // }

  /**
   * Search for the given term(s).
   * @param {string} searchTerm as typed by the user.
   * @returns A boolean indicating if there is a match.
   */
  search(searchTerm: string) {
    // let expression = '^(?=.*\bjack\b)(?=.*\bjames\b).*$'
    const regex = this.getRegex(searchTerm)
    return regex.test(searchTerm)
  }

  getExpression(searchTerm: string) {
    // this is looking for whole words only
    // ^(?=.*\bjack\b)(?=.*\bjames\b).*$

    // split the search terms
    const searchTerms = searchTerm.split(' ')
    let expression = '^'
    for (let i = 0; i < searchTerms.length; i++) {
      if (!searchTerms[i]) continue

      expression += '(?=.*' + searchTerms[i] + ')'
    }
    expression += '.*$'
    // let expression = searchTerms.join("");
    return expression
  }

  getRegex(searchTerm: string) {
    const expression = this.getExpression(searchTerm)

    const regex = new RegExp(expression, 'i')
    return regex
  }
}
