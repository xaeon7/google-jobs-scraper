import { Page } from "puppeteer";

export async function scrapeInfiniteScrollItems<T>(
  page: Page,
  extractItems: () => T[],
  scrollElement = "document.body",
  itemCount: number,
  scrollDelay = 800
) {
  let items: T[] = [];
  try {
    let previousHeight;
    let previousCount = items.length;
    let numberOfTrials = 0;

    while (items.length < itemCount && numberOfTrials < 2) {
      items = await page.evaluate(extractItems);

      previousHeight = await page.evaluate(`${scrollElement}.scrollHeight`);
      await page.evaluate(
        `${scrollElement}.scrollTo(0, ${scrollElement}.scrollHeight)`
      );
      await page.waitForFunction(
        `${scrollElement}.scrollHeight > ${previousHeight}`
      );

      await new Promise((resolve) => setTimeout(resolve, scrollDelay));

      if (previousCount + 10 > items.length) {
        numberOfTrials++;
        return items;
      } else {
        previousCount = items.length;
      }
    }
  } catch (e) {}
  return items;
}
