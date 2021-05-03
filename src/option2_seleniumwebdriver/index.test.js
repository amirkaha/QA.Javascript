const { Builder, By, until } = require('selenium-webdriver')
require('chromedriver')
jest.setTimeout(30000)

var url = 'http://localhost:3000';
var username = 'Katharina_Bernier';
var password = 's3cret';
var amount = 100;
var builder = new Builder().forBrowser('chrome')
var driver = builder.build()

var topNewCss = '[data-test="nav-top-new-transaction"]'; //locators (xpath/css/classname)
var firstPersonCss = '[data-test="user-list-item-qywYp6hS0U"]';
var submitPaymentCss = '[data-test="transaction-create-submit-payment"]';
var userNameXPath = "//*[@id=\"root\"]/div/div/div/div[1]/div[2]/h6[2]";
var balanceCss = '[data-test="sidenav-user-balance"]';
var displayMessageXPath = "//*[@id=\"root\"]/div/main/div[2]/div/div/div[2]/div[2]/div/div/h2";
var step2IconClass = "MuiSvgIcon-root MuiStepIcon-root MuiStepIcon-active";

// TODO: Complete the Login and Payment flow tests
describe('Payment Tests', () => {
    beforeAll (async() => { //enter in credentials before tests
        await driver.get(url)
        await typeInById('username',username)
        await typeInById('password',password)
        await clickOnById('[data-test=signin-submit]')
    })

    afterAll (async() => { //close the driver after tests
        await driver.quit()
    })

        it('Url should be correct', async () => {
            expect(await driver.getCurrentUrl()).toContain(url) //ensures current url matches
        })

        it('Displayed username is correct', async () => { //ensures displayed username is katharina bernier
            const userNameEl = await getElementByXpath(driver, userNameXPath)
            const userNameActual = await userNameEl.getText()
                expect(userNameActual).toContain("@Katharina_Bernier")
        })

        it('Step 2 icon should be highlighted blue', async () => { //ensures step 2 icon is not greyed out
            const topNew = await getElementByCss(driver,topNewCss)
            topNew.click()
            const firstPerson = await getElementByCss(driver, firstPersonCss)
            firstPerson.click()
                expect(await driver.findElement(By.className(step2IconClass)).isDisplayed()).toBeTruthy()
        })

        it('Balance should be updated with correct amount after payment', async () => {
            var balance = await driver.findElement(By.css(balanceCss)).getText()
            var beforeBalance = Number(balance.replace(/[^0-9.-]+/g,""))

            typeInById('amount',amount)
            typeInById('transaction-create-description-input','Testing')

            const submitPayment = await getElementByCss(driver, submitPaymentCss)
            submitPayment.click()

            const balanceEl = await getElementByCss(driver, balanceCss)
            balance = await balanceEl.getText()
            var afterBalance = Number(balance.replace(/[^0-9.-]+/g,"")) //converts string to double
                expect(beforeBalance - afterBalance).toEqual(amount) //ensures balance is updated
        })

        it('Correct message is displayed after payment', async () => { //ensures correct message is displayed
            const displayMessageEl = await getElementByXpath(driver, displayMessageXPath)
            const displayMessage = await displayMessageEl.getText()
                expect(displayMessage).toContain("Paid $" + amount + ".00 for Testing")
        })
})

function typeInById(id,text) { //functions to type in text and click
    driver.findElement(By.id(id)).sendKeys(text)
}

function clickOnById(id) {
    driver.findElement(By.css(id)).click()
}

const getElementByCss = async (driver, css, timeout = 10000) => { //locator functions with waits
  const el = await driver.wait(until.elementLocated(By.css(css)), timeout);
  return await driver.wait(until.elementIsVisible(el), timeout);
};

const getElementByXpath = async (driver, xpath, timeout = 10000) => {
  const el = await driver.wait(until.elementLocated(By.xpath(xpath)), timeout);
  return await driver.wait(until.elementIsVisible(el), timeout);
};







