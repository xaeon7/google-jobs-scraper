import { Page } from "puppeteer";

// export async function scrapeInfiniteScrollItems<T>(
//   page: Page,
//   extractItems: () => T[],
//   scrollElement = "document.body",
//   itemCount: number,
//   scrollDelay = 800
// ) {
//   let items: T[] = [];
//   try {
//     let previousHeight;
//     let previousCount = items.length;
//     let numberOfTrials = 0;

//     while (items.length < itemCount && numberOfTrials < 2) {
//       items = await page.evaluate(extractItems);

//       previousHeight = await page.evaluate(
//         `${scrollElement}.scrollHeight`
//       );
//       await page.evaluate(
//         `${scrollElement}.scrollTo(0, ${scrollElement}.scrollHeight)`
//       );
//       await page.waitForFunction(
//         `${scrollElement}.scrollHeight > ${previousHeight}`
//       );

//       await new Promise((resolve) => setTimeout(resolve, scrollDelay));

//       if (previousCount + 10 > items.length) {
//         numberOfTrials++;
//         return items;
//       } else {
//         previousCount = items.length;
//       }
//     }
//   } catch (e) {}
//   return items;
// }

function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

export async function scrapeInfiniteScrollItems<T>(
  page: Page,
  extractItems: () => T[],
  scrollElement = "document.body",
  itemTargetCount: number,
  scrollDelay = 800
) {
  let items: T[] = [];
  try {
    let previousHeight;
    while (items.length < itemTargetCount) {
      const previousItemCount = items.length;
      items = await page.evaluate(extractItems);

      previousHeight = await page.evaluate(`${scrollElement}.scrollHeight`);

      await page.evaluate(
        `${scrollElement}.scrollTo(0, ${scrollElement}.scrollHeight)`
      );

      await page.waitForFunction(
        `${scrollElement}.scrollHeight > ${previousHeight}`,
        { timeout: 1000 }
      );

      await delay(scrollDelay);
      const currentItemCount = items.length;

      if (currentItemCount === previousItemCount) {
        return items;
      }
    }
  } catch (e) {
    console.error(e);
  }
  return items;
}
