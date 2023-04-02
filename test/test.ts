const dappeteer = require("../src/index")
import puppeteer from "puppeteer"
import path from 'path'

async function __main__() {
  const { metaMask, browser } = await dappeteer.bootstrap({
    seed: "proof hurt wedding taxi room dynamic olive hire sea balance arctic margin",
    password: "12345678",
    showTestNets: true,
    metaMaskVersion: "v10.25.0",
    metaMaskPath: path.resolve('metamask/v10.25.0'),
    automation: "playwright",
    headless: false,
    userDataDir: path.resolve('userdata'),
    puppeteerOptions: {
      executablePath: puppeteer.executablePath("chrome"),
      slowMo: 1000,
      ignoreHTTPSErrors: true
    },
    playwrightOptions: {
      executablePath: puppeteer.executablePath("chrome"),
      slowMo: 1000
    }
  })

  // create a new page and visit your dapp
  const dappPage = await browser.newPage()
  await dappPage.goto("http://www.baidu.com")

  // you can change the network if you want
  await metaMask.switchNetwork("goerli")

  // do something in your dapp that prompts MetaMask to add a Token
  const addTokenButton = await dappPage.$("#add-token")
  await addTokenButton.click()
  // instruct MetaMask to accept this request
  await metaMask.acceptAddToken()

  // do something that prompts MetaMask to confirm a transaction
  // const payButton = await dappPage.$("#pay-with-eth")
  // await payButton.click()

  // await metaMask.confirmTransaction()
}

__main__()
