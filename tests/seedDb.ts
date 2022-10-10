/**
 * The process for creating the baseline test data.
 */
import { expect, Locator, Page } from '@playwright/test'

export class DemoDataPage {
  readonly page: Page
  readonly checkAll: Locator
  readonly checkAccounts: Locator
  readonly createButton: Locator
  readonly alert: Locator

  constructor(page: Page) {
    this.page = page
    this.checkAll = page.getByRole('checkbox', { name: 'Create All' })
    this.checkAccounts = page.getByRole('checkbox', { name: 'Create Accounts' })
    this.createButton = page.getByRole('button', { name: 'Create' })
    this.alert = this.page.getByRole('alert')
  }

  async goto() {
    await this.page.goto('http://localhost:9200/#/demoData')
  }

  //   async clickCreateAll() {
  //     await this.checkAll.click()
  //   }

  //   async clickCreate() {
  //     await this.createButton.click()
  //   }

  async createAccounts() {
    await this.checkAccounts.click()
    await this.createButton.click()
  }

  async waitForAlert() {
    this.alert.waitFor()
  }
}
