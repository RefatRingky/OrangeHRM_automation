// import webdriver from "selenium-webdriver";

// const { Builder, By, Key, Browser } = webdriver;

// const driver = new Builder()
//     .forBrowser(Browser.CHROME)
//     .build();
//  const partialData =["Product Management","Data Engineering","Business"];
//  const ProductManagementText =["UI","UX","Design","Management"];   

// async function run() {
//     await driver.manage().window().maximize();
//     await driver.get("https://ostad.app/");
//     await driver.sleep(5000);
//     await driver.findElement(By.xpath(`(//p[contains(text(),'${partialData[0]}')])[1]`)).click();
//     const getCourseName = await driver.findElements(By.xpath("//a[@id='home_courses_course_card']/div/div[contains(@class,'w-full')]/div/p"));
//     for(let i= 0; i<getCourseName.length; i++){
//         console.log( await getCourseName[i].getText());
//     }
    
//     await driver.sleep(4000);
//     await driver.quit();
   
    
// }

// run();
