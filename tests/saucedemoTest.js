import { Builder, By, until } from 'selenium-webdriver';
import { expect } from 'chai';
import fs from 'fs-extra';
// import allure from 'allure-mocha/runtime';
import { allure } from 'allure-mocha/runtime.js';


function sleep(ms = 1200) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe('SauceDemo Automation', function () {
    this.timeout(120000);
    let driver;

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async () => {
        await driver.quit();
    });

    async function takeScreenshot(name) {
        const screenshot = await driver.takeScreenshot();
        const path = `allure-results/${name}.png`;
        await fs.outputFile(path, screenshot, 'base64');
        allure.attachment(name, fs.readFileSync(path), 'image/png');
    }

    async function openMenu() {
        const menuBtn = await driver.wait(until.elementLocated(By.id('react-burger-menu-btn')), 15000);
        await driver.executeScript("arguments[0].click();", menuBtn);
        await sleep(1200);
    }

    async function clickMenuItem(id) {
        const item = await driver.wait(until.elementLocated(By.id(id)), 15000);
        await driver.executeScript("arguments[0].click();", item);
        await sleep(1200);
    }

    it('Q1 - Locked Out User', async () => {
        try {
            allure.step('Open SauceDemo', async () => {
                await driver.get('https://www.saucedemo.com/');
                await driver.manage().window().maximize();
            });

            allure.step('Enter locked_out_user credentials', async () => {
                await driver.findElement(By.id('user-name')).sendKeys('locked_out_user');
                await driver.findElement(By.id('password')).sendKeys('secret_sauce');
                await driver.findElement(By.id('login-button')).click();
            });

            allure.step('Verify error message', async () => {
                const error = await driver.wait(until.elementLocated(By.css('h3[data-test="error"]')), 7000);
                const text = await error.getText();
                expect(text).to.equal('Epic sadface: Sorry, this user has been locked out.');
            });
        } catch (err) {
            await takeScreenshot('Q1_LockedOutUser_Error');
            throw err;
        }
    });

    it('Q2 - Standard User Purchase Flow', async () => {
        try {
            allure.step('Login as standard_user', async () => {
                await driver.get('https://www.saucedemo.com/');
                await driver.manage().window().maximize();
                await driver.findElement(By.id('user-name')).sendKeys('standard_user');
                await driver.findElement(By.id('password')).sendKeys('secret_sauce');
                await driver.findElement(By.id('login-button')).click();
                await driver.wait(until.urlContains('inventory'), 15000);
            });

            allure.step('Reset App State', async () => {
                await openMenu();
                await clickMenuItem('reset_sidebar_link');
            });

            allure.step('Add 3 products to cart', async () => {
                const products = [
                    'add-to-cart-sauce-labs-backpack',
                    'add-to-cart-sauce-labs-bike-light',
                    'add-to-cart-sauce-labs-bolt-t-shirt'
                ];
                for (const id of products) {
                    const btn = await driver.wait(until.elementLocated(By.id(id)), 10000);
                    await driver.executeScript("arguments[0].click();", btn);
                    await sleep();
                }
            });

            allure.step('Go to cart and checkout', async () => {
                const cartIcon = await driver.wait(until.elementLocated(By.className('shopping_cart_link')), 15000);
                await driver.executeScript("arguments[0].click();", cartIcon);
                await driver.findElement(By.id('checkout')).click();
                await driver.findElement(By.id('first-name')).sendKeys('John');
                await driver.findElement(By.id('last-name')).sendKeys('Doe');
                await driver.findElement(By.id('postal-code')).sendKeys('1207');
                await driver.findElement(By.id('continue')).click();
            });

            allure.step('Verify total price and finish order', async () => {
                const totalText = await driver.findElement(By.className('summary_total_label')).getText();
                expect(totalText).to.include('$');
                await driver.findElement(By.id('finish')).click();
                const success = await driver.findElement(By.className('complete-header')).getText();
                expect(success).to.equal('Thank you for your order!');
            });

            allure.step('Reset App State & Logout', async () => {
                await openMenu();
                await clickMenuItem('reset_sidebar_link');
                await openMenu();
                await clickMenuItem('logout_sidebar_link');
            });
        } catch (err) {
            await takeScreenshot('Q2_StandardUser_Error');
            throw err;
        }
    });

    it('Q3 - Performance Glitch User Flow', async () => {
        try {
            allure.step('Login as performance_glitch_user', async () => {
                await driver.get('https://www.saucedemo.com/');
                await driver.manage().window().maximize();
                await driver.findElement(By.id('user-name')).sendKeys('performance_glitch_user');
                await driver.findElement(By.id('password')).sendKeys('secret_sauce');
                await driver.findElement(By.id('login-button')).click();
                await driver.wait(until.urlContains('inventory'), 15000);
            });

            allure.step('Reset App State', async () => {
                await openMenu();
                await clickMenuItem('reset_sidebar_link');
            });

            allure.step('Filter products Z to A and add first product', async () => {
                const filter = await driver.findElement(By.className('product_sort_container'));
                await filter.sendKeys('za');
                const firstName = await driver.findElement(By.css('.inventory_item_name')).getText();
                const addBtn = await driver.findElement(By.css('.inventory_item button'));
                await driver.executeScript("arguments[0].click();", addBtn);
                return firstName;
            });

            allure.step('Checkout and verify total', async () => {
                const cart = await driver.findElement(By.className('shopping_cart_link'));
                await driver.executeScript("arguments[0].click();", cart);
                await driver.findElement(By.id('checkout')).click();
                await driver.findElement(By.id('first-name')).sendKeys('Refat');
                await driver.findElement(By.id('last-name')).sendKeys('Ringky');
                await driver.findElement(By.id('postal-code')).sendKeys('1207');
                await driver.findElement(By.id('continue')).click();
                const totalText = await driver.findElement(By.className('summary_total_label')).getText();
                expect(totalText).to.include('$');
                await driver.findElement(By.id('finish')).click();
                const success = await driver.findElement(By.className('complete-header')).getText();
                expect(success).to.equal('Thank you for your order!');
            });

            allure.step('Reset App State & Logout', async () => {
                await openMenu();
                await clickMenuItem('reset_sidebar_link');
                await openMenu();
                await clickMenuItem('logout_sidebar_link');
            });

        } catch (err) {
            await takeScreenshot('Q3_PerformanceUser_Error');
            throw err;
        }
    });

});
