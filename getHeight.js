import { Builder, By, until, Key } from "selenium-webdriver";
import firefox from "selenium-webdriver/firefox.js";

// Firefox options
// We enable the headless mode to run firefox without a GUI. 
// This is helpfull when we setup the project on a server
const options = new firefox.Options().headless(); 

// Sleep function to stop the runtime execution
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const getHeight = async (search) => {
  // Build the web driver
  const driver = await new Builder()
    .forBrowser("firefox")
    // .setFirefoxOptions(options)
    .build();

  // Go to starwars databank
  await driver.get("https://www.starwars.com/databank");

  await sleep(1000);

  try {
    // await until the search bar is on the webpage
    await driver.wait(until.elementLocated(By.id("searchField_SRP")));

    // Get the search bar component
    const searchBar = await driver.findElement(By.id("searchField_SRP"));

    // write the search query in the search bar
    searchBar.sendKeys(search);

    // click enter to start searching
    searchBar.sendKeys(Key.ENTER);

    await sleep(1500);

    // Get all the results by the class result-items
    const items = await driver.findElements(By.className("result-item"));

    // We need to know hoy many results we have and what are his names
    const titleItems = [];

    // Vars tha will storage the right character data when we iterate througth titleItems
    let characterAnchor;
    let characterTitle = "";

    // Vars that will change when we iterate througth titleItems
    let currentAnchor;
    let currentTitle = "";

    //   We iterate throught items
    items.forEach(async (item, index) => {
      // currentAnchor = await item.findElement(By.className("title-link"));
      currentAnchor = await item.findElement(By.xpath("div[2]/div[2]/a"));
      currentTitle = await currentAnchor.getText();

      // Push the text inside the anchor with the tag title-link
      titleItems.push(
        await item.findElement(By.className("title-link")).getText()
      );

      // If the index is equal to 0 then we assign the data of the current index to the character data
      if (index === 0) {
        characterTitle = currentTitle;
        characterAnchor = currentAnchor;
        return;
      }
      // We need to check the lenght of the current item. If the lenght of this is less than the character title 
      // we need to update the character data with the current data.
      if (currentTitle.length < characterTitle.length) {
        console.log(currentTitle);
        return (characterAnchor = currentAnchor);
      }
    });

    await sleep(1000);

    // Once we have the correct characterAnchor we need to click in these
    characterAnchor.click();

    await sleep(1000);

    // Finilly we need to find the height of the character in the document so we search by xpath
    const text = await driver
      .findElement(
        By.xpath(
          "//div[@class='property-name' and starts-with(text(), 'Height:')]"
        )
      )
      .getText();
    
    // Return the result with only the height
    return text.replace("Height: ", "");
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    // With this line we close the browser
    driver.quit();
  }
};

export default getHeight;
