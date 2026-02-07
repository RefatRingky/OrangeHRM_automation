import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';

/* ===================== UTILITIES ===================== */

async function slow(ms = 1200) {
  await new Promise(resolve => setTimeout(resolve, ms));
}

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

/* ===================== Q1 ===================== */

async function questionOne(driver) {
  console.log('--- Q1: Locked Out User ---');

  await driver.get('https://www.saucedemo.com/');
  await driver.manage().window().maximize();

  await driver.findElement(By.id('user-name')).sendKeys('locked_out_user');
  await driver.findElement(By.id('password')).sendKeys('secret_sauce');
  await driver.findElement(By.id('login-button')).click();

  const errorMsg = await driver.wait(
    until.elementLocated(By.css('h3[data-test="error"]')),
    15000
  );

  const actualError = await errorMsg.getText();
  const expectedError = 'Epic sadface: Sorry, this user has been locked out.';
  assert.strictEqual(actualError, expectedError);

  console.log('✅ Q1 Passed');
}

/* ===================== Q2 ===================== */

async function questionTwo(driver) {
  console.log('--- Q2: Standard User Purchase Flow ---');

  await driver.get('https://www.saucedemo.com/');

  await driver.findElement(By.id('user-name')).sendKeys('standard_user');
  await driver.findElement(By.id('password')).sendKeys('secret_sauce');
  await driver.findElement(By.id('login-button')).click();

  await driver.wait(until.urlContains('inventory'), 15000);
  await slow(1500);

  await openMenu(driver);
  await clickMenuItem(driver, 'reset_sidebar_link');

  const products = [
    'add-to-cart-sauce-labs-backpack',
    'add-to-cart-sauce-labs-bike-light',
    'add-to-cart-sauce-labs-bolt-t-shirt'
  ];

  for (const id of products) {
    const btn = await driver.findElement(By.id(id));
    await driver.executeScript("arguments[0].click();", btn);
    await slow();
  }

  const cartIcon = await driver.findElement(By.className('shopping_cart_link'));
  await driver.executeScript("arguments[0].click();", cartIcon);

  await driver.wait(until.elementLocated(By.id('checkout')), 15000);
  await driver.findElement(By.id('checkout')).click();

  await driver.findElement(By.id('first-name')).sendKeys('John');
  await driver.findElement(By.id('last-name')).sendKeys('Doe');
  await driver.findElement(By.id('postal-code')).sendKeys('1207');
  await driver.findElement(By.id('continue')).click();

  const totalText = await driver.findElement(By.className('summary_total_label')).getText();
  assert.ok(totalText.includes('$'));
  console.log('Total Price:', totalText);

  await driver.findElement(By.id('finish')).click();

  const successMsg = await driver.findElement(By.className('complete-header')).getText();
  assert.strictEqual(successMsg, 'Thank you for your order!');

  await openMenu(driver);
  await clickMenuItem(driver, 'reset_sidebar_link');
  await openMenu(driver);
  await clickMenuItem(driver, 'logout_sidebar_link');

  await driver.wait(until.elementLocated(By.id('login-button')), 15000);
  console.log('✅ Q2 Passed');
}

/* ===================== Q3 ===================== */

async function questionThree(driver) {
  console.log('--- Q3: Performance Glitch User ---');

  await driver.get('https://www.saucedemo.com/');

  await driver.findElement(By.id('user-name')).sendKeys('performance_glitch_user');
  await driver.findElement(By.id('password')).sendKeys('secret_sauce');
  await driver.findElement(By.id('login-button')).click();

  await driver.wait(until.urlContains('inventory'), 20000);

  await openMenu(driver);
  await clickMenuItem(driver, 'reset_sidebar_link');

  const filter = await driver.findElement(By.className('product_sort_container'));
  await filter.sendKeys('za');
  await slow(1500);

  const firstProductName = await driver.findElement(By.className('inventory_item_name')).getText();
  const addBtn = await driver.findElement(By.css('.inventory_item button'));
  await driver.executeScript("arguments[0].click();", addBtn);

  const cartIcon = await driver.findElement(By.className('shopping_cart_link'));
  await driver.executeScript("arguments[0].click();", cartIcon);

  const cartProduct = await driver.findElement(By.className('inventory_item_name')).getText();
  assert.strictEqual(cartProduct, firstProductName);

  await driver.findElement(By.id('checkout')).click();

  await driver.findElement(By.id('first-name')).sendKeys('Refat');
  await driver.findElement(By.id('last-name')).sendKeys('Ringky');
  await driver.findElement(By.id('postal-code')).sendKeys('1207');
  await driver.findElement(By.id('continue')).click();

  const totalText = await driver.findElement(By.className('summary_total_label')).getText();
  assert.ok(totalText.includes('$'));

  await driver.findElement(By.id('finish')).click();

  const successMsg = await driver.findElement(By.className('complete-header')).getText();
  assert.strictEqual(successMsg, 'Thank you for your order!');

  await openMenu(driver);
  await clickMenuItem(driver, 'reset_sidebar_link');
  await openMenu(driver);
  await clickMenuItem(driver, 'logout_sidebar_link');

  await driver.wait(until.elementLocated(By.id('login-button')), 15000);
  console.log('✅ Q3 Passed');
}

/* ===================== EXECUTION ===================== */

(async function runAllTests() {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    await questionOne(driver);
    await slow(2000);

    await questionTwo(driver);
    await slow(2000);

    await questionThree(driver);
    await slow(2000);

    console.log('🎉 ALL QUESTIONS EXECUTED SUCCESSFULLY');

  } catch (err) {
    console.error('❌ TEST FAILED:', err);
  } finally {
    await driver.quit();
  }
})();
