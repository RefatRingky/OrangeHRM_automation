// import { Builder, By, until } from 'selenium-webdriver';
// import assert from 'assert';
// import { allure } from 'allure-mocha/runtime.js';


// describe('SauceDemo - Locked Out User', function () {
//   this.timeout(60000);
//   let driver;

//   before(async () => {
//     driver = await new Builder().forBrowser('chrome').build();
//   });

//   after(async () => {
//     await driver.quit();
//   });

//   it('should show error for locked out user', async () => {

//     allure.epic('SauceDemo');
//     allure.feature('Login');
//     allure.story('Locked Out User');
//     allure.severity('critical');

//     await driver.get('https://www.saucedemo.com/');
//     await driver.manage().window().maximize();

//     await driver.findElement(By.id('user-name'))
//       .sendKeys('locked_out_user');

//     await driver.findElement(By.id('password'))
//       .sendKeys('secret_sauce');

//     await driver.findElement(By.id('login-button')).click();

//     const errorMsg = await driver.wait(
//       until.elementLocated(By.css('h3[data-test="error"]')),
//       10000
//     );

//     const actualError = await errorMsg.getText();
//     const expectedError = 'Epic sadface: Sorry, this user has been locked out.';

//     assert.strictEqual(actualError, expectedError);
//   });
// });
