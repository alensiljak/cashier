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
  search(searchTerm) {
    // let expression = '^(?=.*\bjack\b)(?=.*\bjames\b).*$'
    let regex = this.getRegex(searchTerm);
    return regex.test(searchTerm);
  }

  getExpression(searchTerm) {
    // this is looking for whole words only
    // ^(?=.*\bjack\b)(?=.*\bjames\b).*$

    // split the search terms
    let searchTerms = searchTerm.split(" ");
    var expression = "^";
    for (let i = 0; i < searchTerms.length; i++) {
      if (!searchTerms[i]) continue;

      expression += "(?=.*" + searchTerms[i] + ")";
    }
    expression += ".*$";
    // let expression = searchTerms.join("");
    return expression;
  }

  getRegex(searchTerm) {
    let expression = this.getExpression(searchTerm);

    let regex = new RegExp(expression, "i");
    return regex;
  }
}
