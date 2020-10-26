/**
 * Price downloader from Morningstar
 */
import ky from 'ky'

class Morningstar {
    constructor() {
        this.url = "http://quotes.morningstar.com/stockq/c-header?t="
    }

    async download(symbol) {
        //let symbol = "XETR:EL4X"
        
        let url = this.url + encodeURI(symbol)
  
        let response = await ky.get(url)
        
        this.parsePrice(response.data)
      }

      parsePrice(html) {
        let parser = new DOMParser()
        let doc = parser.parseFromString(html, 'text/html')
  
        let priceEl = doc.getElementById('last-price-value')
        console.log(priceEl.innerText)
  
        let dateEl = doc.getElementById('asOfDate')
        console.log(dateEl.innerText)
  
        let currencyEl = doc.getElementById('curency')
        console.log(currencyEl.innerText)
  
        // console.log(html)
      }
  
}

export let morningstar = new Morningstar()