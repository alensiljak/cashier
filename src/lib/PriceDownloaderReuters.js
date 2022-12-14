/*
    Price downloader from Reuters.
    Won't work because of CORS. Has to be implemented outside the browser (i.e. Python).

    https://www.reuters.com/finance/stocks/overview/VMID.L
*/
import ky from 'ky'

class Reuters {
    constructor() {
        this.url = "https://www.reuters.com/finance/stocks/overview/"
    }

    async download(symbol) {
        let url = this.url + symbol

        let response = ky.get(url)

        let price = this.parsePrice(response.data)
        return price
    }

    // parsePrice(html) {
    //     return null
    // }
}

export let downloader = new Reuters()