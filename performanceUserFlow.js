import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';

async function slow(ms = 1200) {
  await new Promise(resolve => setTimeout(resolve, ms));
}

(async function performanceUserTest() {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    // ---------------- LOGIN ----------------
    await driver.get('https://www.saucedemo.com/');
    await driver.manage().window().maximize();

    await driver.findElement(By.id('user-name')).sendKeys('performance_glitch_user');
    await slow();

    await driver.findElement(By.id('password')).sendKeys('secret_sauce');
    await slow();

    await driver.findElement(By.id('login-button')).click();

    await driver.wait(until.urlContains('inventory'), 20000);
    await slow(2000);

    // ---------------- RESET APP STATE ----------------
    await openMenu(driver);
    await clickMenuItem(driver, 'reset_sidebar_link');
    await slow(2000);

    // ---------------- FILTER Z → A ----------------
    const filter = await driver.findElement(By.className('product_sort_container'));
    await filter.sendKeys('za');
    await slow(2000);

    // ---------------- ADD FIRST PRODUCT ----------------
    const firstProductName = await driver
      .findElement(By.css('.inventory_item_name'))
      .getText();

    const addBtn = await driver.findElement(By.css('.inventory_item button'));
    await driver.executeScript("arguments[0].click();", addBtn);
    await slow(1500);

    // ---------------- CART ----------------
    const cartIcon = await driver.findElement(By.className('shopping_cart_link'));
    await driver.executeScript("arguments[0].click();", cartIcon);
    await slow(2000);

    // Verify product in cart
    const cartProduct = await driver.findElement(By.className('inventory_item_name')).getText();
    assert.strictEqual(cartProduct, firstProductName);

    // ---------------- CHECKOUT ----------------
    await driver.findElement(By.id('checkout')).click();
    await slow();

    await driver.findElement(By.id('first-name')).sendKeys('Refat');
    await driver.findElement(By.id('last-name')).sendKeys('Ringky');
    await driver.findElement(By.id('postal-code')).sendKeys('1207');
    await slow();

    await driver.findElement(By.id('continue')).click();
    await slow(2000);

    // ---------------- VERIFY FINAL PAGE ----------------
    const finalProduct = await driver.findElement(By.className('inventory_item_name')).getText();
    assert.strictEqual(finalProduct, firstProductName);

    const totalText = await driver.findElement(By.className('summary_total_label')).getText();
    console.log('Total Price:', totalText);
    assert.ok(totalText.includes('$'));

    // ---------------- FINISH ----------------
    await driver.findElement(By.id('finish')).click();
    await slow(2000);

    const successMsg = await driver.findElement(By.className('complete-header')).getText();
    assert.strictEqual(successMsg, 'Thank you for your order!');

    console.log(' Order placed successfully');

    // ---------------- RESET & LOGOUT ----------------
    await openMenu(driver);
    await clickMenuItem(driver, 'reset_sidebar_link');
    await slow(1500);

    await openMenu(driver);
    await clickMenuItem(driver, 'logout_sidebar_link');

    await driver.wait(until.elementLocated(By.id('login-button')), 15000);
    console.log(' Logged out successfully');

  } catch (err) {
    console.error(' TEST FAILED:', err);
  } finally {
    await slow(3000);
    await driver.quit();
  }
})();

// ----------- HELPERS (STABLE FOR SAUCEDEMO) -----------

async function openMenu(driver) {
  const menuBtn = await driver.wait(
    until.elementLocated(By.id('react-burger-menu-btn')),
    15000
  );
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
}
