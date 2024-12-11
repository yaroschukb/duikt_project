const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const firefox = require("selenium-webdriver/firefox");

(async function testApplication() {
  const browsers = ["chrome", "firefox"]; // Тестування в Chrome і Firefox

  for (let browser of browsers) {
    console.log(`Testing in ${browser}...`);

    let driver;

    try {
      // Налаштування headless-режиму для кожного браузера
      if (browser === "chrome") {
        const options = new chrome.Options();
        options.addArguments(
          "--headless",
          "--disable-gpu",
          "--window-size=1920,1080"
        );
        driver = await new Builder()
          .forBrowser("chrome")
          .setChromeOptions(options)
          .build();
      } else if (browser === "firefox") {
        const options = new firefox.Options();
        options.addArguments(
          "--headless",
          "--disable-gpu",
          "--window-size=1920,1080",
          "--no-remote"
        );
        driver = await new Builder()
          .forBrowser("firefox")
          .setFirefoxOptions(options)
          .build();
      }

      // Перевірка завантаження сторінки
      await driver.get("http://localhost:4200");
      const title = await driver.getTitle();
      console.log(`Page title: ${title}`);
      console.log("Page loaded successfully.");

      // Перевірка завантаження фото
      const uploadBtn = await driver.findElement(By.css(".upload-btn"));
      await uploadBtn.click(); // Натискаємо кнопку "Start Upload"
      await driver.wait(until.elementLocated(By.css("img.test-image")), 5000);
      console.log("Photo uploaded successfully.");

      // Перевірка форми Sign Up
      const signUpBtn = await driver.findElement(By.css(".sign-in-btn"));
      await signUpBtn.click(); // Натискаємо "Sign Up"
      await driver.wait(until.elementLocated(By.css(".signUpForm")), 5000);
      console.log("Sign Up form opened.");
      // Закриваємо модальне вікно реєстрації
      const closeSignUpModal = await driver.findElement(
        By.css(".ant-modal-close")
      );
      await closeSignUpModal.click();
      console.log("Sign Up modal closed.");

      // Перевірка форми Log In
      const logInBtn = await driver.findElement(By.css(".log-in-btn"));
      await logInBtn.click();
      await driver.wait(until.elementLocated(By.css(".logInForm")), 5000);
      console.log("Log In form opened.");
      // Закриваємо модальне вікно входу
      const closeLogInModal = await driver.findElement(
        By.css(".ant-modal-close")
      );
      await closeLogInModal.click();
      console.log("Log In modal closed.");
    } catch (error) {
      console.error(`Error during tests in ${browser}:`, error);
    } finally {
      if (driver) {
        await driver.quit();
      }
    }
  }
})();
