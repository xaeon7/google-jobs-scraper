import { Page } from "puppeteer";

export async function bypassGooglePrompt(page: Page) {
  const title = await page.title();

  if (title == "Before you continue to Google Search") {
    await page.$eval(
      "#yDmH0d > c-wiz > div > div > div > div.NIoIEf > div.G4njw > div.AIC7ge > div.CxJub > div.VtwTSb > form:nth-child(2) > div > div > button",
      (button) => button.click()
    );

    await page.waitForNavigation({ waitUntil: "domcontentloaded" });
  }
}
