import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';

(async function lockedOutUserTest() {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get('https://www.saucedemo.com/');
    await driver.manage().window().maximize();

    await driver.findElement(By.id('user-name'))
      .sendKeys('locked_out_user');

    await driver.findElement(By.id('password'))
      .sendKeys('secret_sauce');

    await driver.findElement(By.id('login-button')).click();
    await driver.sleep(2000);
    const errorMsg = await driver.wait(
      until.elementLocated(By.css('h3[data-test="error"]')),
      70000
    );

    const actualError = await errorMsg.getText();
    const expectedError = 'Epic sadface: Sorry, this user has been locked out.';

    assert.strictEqual(actualError, expectedError);

    console.log(' Test Passed: Locked out user verified');

  } finally {
    await driver.quit();
  }
})();



