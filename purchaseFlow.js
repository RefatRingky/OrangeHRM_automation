import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';

async function slow(ms = 1200) {
  await new Promise(resolve => setTimeout(resolve, ms));
}

(async function purchaseFlowTest() {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    // ------------------ STABILITY SETTINGS ------------------
    await driver.manage().setTimeouts({
      implicit: 0,
      pageLoad: 30000,
      script: 30000
    });

    // ------------------ LOGIN ------------------
    await driver.get('https://www.saucedemo.com/');
    await driver.manage().window().maximize();

    await driver.findElement(By.id('user-name')).sendKeys('standard_user');
    await slow();

    await driver.findElement(By.id('password')).sendKeys('secret_sauce');
    await slow();

    await driver.findElement(By.id('login-button')).click();

    await driver.wait(
      until.urlIs('https://www.saucedemo.com/inventory.html'),
      15000
    );
    await slow(2000);

    // ------------------ RESET APP STATE ------------------
    await openMenu(driver);
    await clickMenuItem(driver, 'reset_sidebar_link');
    await slow(2000);

    // ------------------ ADD 3 PRODUCTS ------------------
    const products = [
      'add-to-cart-sauce-labs-backpack',
      'add-to-cart-sauce-labs-bike-light',
      'add-to-cart-sauce-labs-bolt-t-shirt'
    ];

    for (const id of products) {
      const btn = await driver.wait(until.elementLocated(By.id(id)), 10000);
      await driver.executeScript("arguments[0].click();", btn);
      await slow();
    }

    // ------------------ CART ------------------
    // ------------------ GO TO CART ------------------
const cartIcon = await driver.wait(
  until.elementLocated(By.className('shopping_cart_link')),
  15000
);

await driver.wait(until.elementIsVisible(cartIcon), 15000);
await driver.executeScript("arguments[0].click();", cartIcon);

await slow(2000);

// Verify cart page loaded
await driver.wait(
  until.elementLocated(By.id('checkout')),
  15000
);


    // ------------------ CHECKOUT ------------------
    await driver.findElement(By.id('checkout')).click();
    await slow();

    await driver.findElement(By.id('first-name')).sendKeys('John');
    await driver.findElement(By.id('last-name')).sendKeys('Doe');
    await driver.findElement(By.id('postal-code')).sendKeys('1207');
    await slow();

    await driver.findElement(By.id('continue')).click();
    await slow(2000);

    // ------------------ VERIFY TOTAL ------------------
    const totalText = await driver.findElement(By.className('summary_total_label')).getText();
    console.log('Total Price:', totalText);
    assert.ok(totalText.includes('$'), 'Total price should be displayed');

    // ------------------ FINISH ORDER ------------------
    await driver.findElement(By.id('finish')).click();
    await slow(2000);

    const successMsg = await driver.findElement(By.className('complete-header')).getText();
    assert.strictEqual(successMsg, 'Thank you for your order!');

    console.log(' Order placed successfully');

    // ------------------ RESET AGAIN & LOGOUT ------------------
    await openMenu(driver);
await clickMenuItem(driver, 'reset_sidebar_link');
await slow(1500);

await openMenu(driver);
await clickMenuItem(driver, 'logout_sidebar_link');
// Verify logout success (login button visible)
await driver.wait(
  until.elementLocated(By.id('login-button')),
  15000
);

console.log(' App state reset & logged out successfully');


  } catch (error) {
    console.error(' TEST FAILED:', error);
  } finally {
    await slow(3000);
    await driver.quit();
  }
})();


// ------------------ HELPER FUNCTIONS ------------------

async function openMenu(driver) {
//   await driver.wait(until.urlContains('inventory'), 15000);
  await driver.sleep(1500);

  const menuBtn = await driver.wait(
    until.elementLocated(By.id('react-burger-menu-btn')),
    15000
  );
    // JS click avoids animation issues
  await driver.executeScript("arguments[0].click();", menuBtn);
  await driver.sleep(1200);
}



async function clickMenuItem(driver, id) {
  const item = await driver.wait(
    until.elementLocated(By.id(id)),
    15000
  );
  await driver.executeScript("arguments[0].click();", item);
  await driver.sleep(1200);

//   await driver.wait(until.elementIsVisible(item), 15000);
//   await driver.executeScript("arguments[0].click();", item);
}
