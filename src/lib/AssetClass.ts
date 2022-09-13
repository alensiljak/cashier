import { Account } from 'src/model'

export class AssetClass {
  fullname: string
  allocation
  allocatedValue
  currentAllocation
  currentValue
  diff
  diffAmount
  diffPerc
  currency
  symbols

  constructor() {
    this.fullname = ''
    this.allocation = null
    this.symbols = null
    // this.level = null; // the depth level, with root Allocation = 0
    this.currentValue = null
    this.currency = null
  }

  /**
   * Represents the class depth in the allocation tree.
   * The root element (Allocation) is 0. This is effectively the number of parents.
   */
  get depth() {
    if (!this.parentName) return 0

    let parents = this.parentName.split(':')
    return parents.length
  }

  //   get fullname() {
  //     return this.full_name;
  //   }

  //   set fullname(value) {
  //     this.full_name = value;

  //     //
  //     let parts = value.split(":");
  //     let lastIndex = parts.length - 1;
  //     this.name = parts[lastIndex];
  //     parts.splice(lastIndex, 1);

  //     this.parentname = parts.join(":");
  //   }

  get name() {
    let parts = this.fullname.split(':')
    let lastIndex = parts.length - 1
    return parts[lastIndex]
  }

  get parentName() {
    let parts = this.fullname.split(':')
    let lastIndex = parts.length - 1
    // this.name = parts[lastIndex];
    parts.splice(lastIndex, 1)
    return parts.join(':')
  }
}

export interface StockSymbol {
  name: string
  accounts: Account[]
  analysis: any
}
