import puppeteer from "puppeteer";
import config from "config";
import { scrapeInfiniteScrollItems } from "../../utils/scrapeInfiniteScrollItems";
import {
  generateGoogleJobsUrl,
  generateGoogleJobDetailsUrl,
} from "../../utils/generateGoogleJobsUrl";
import { GOOGLE_SELECTORS } from "../../constants";
import { bypassGooglePrompt } from "../../utils/bypassGooglePrompt";
import { openBrowser } from "../../utils/openBrowser";
import { redisClient } from "../..";

export async function getJobList(
  searchQuery: string,
  resultsCount = 10,
  location?: string
) {
  const url = generateGoogleJobsUrl(searchQuery, location);
  const { browser, page } = await openBrowser(url, "domcontentloaded");

  await bypassGooglePrompt(page);

  const jobList = await scrapeInfiniteScrollItems(
    page,
    extractJobsList,
    GOOGLE_SELECTORS.scrollableItem,
    resultsCount
  );

  await browser.close();
  redisClient.setEx(
    `${searchQuery}_${resultsCount}`,
    3600,
    JSON.stringify(jobList)
  );
  return jobList;
}

function extractJobsList() {
  const components = document.querySelectorAll<HTMLElement>(".KGjGe");

  const jobList: JobType[] = [];
  components.forEach((item) => {
    const details = item.querySelectorAll(".sMzDkb");
    const job = {
      id: item.dataset.encodedDocId || "",
      jobTitle: item.querySelector(".KLsYvd")?.textContent || "",
      logo: item.querySelector(".ZUeoqc")?.querySelector("img")?.src,
      companyName: details[0]?.textContent || "",
      location: details[1]?.textContent || "",
      extensions: Array.from(item.querySelectorAll(".LL4CDc")).map(
        (e) => e?.textContent || ""
      ),
    };

    jobList.push(job);
  });

  return jobList;
}

type JobType = {
  id: string;
  jobTitle: string;
  logo?: string;
  companyName: string;
  location: string;
  extensions: string[];
};

export async function getJobDetails(id: string) {
  const url = generateGoogleJobDetailsUrl(id);
  const { browser, page } = await openBrowser(url, "networkidle2");
  bypassGooglePrompt(page);

  const jobDetails = await page.evaluate(
    (id, GOOGLE_SELECTORS) => {
      const item = document.querySelector<HTMLElement>(
        `[data-encoded-doc-id="${id}"]`
      );
      const details = item.querySelectorAll(GOOGLE_SELECTORS.detailsContainer);
      const platform = item.querySelector(
        GOOGLE_SELECTORS.applyPlatformContainer
      );
      const jobHighlights = item.querySelectorAll(
        GOOGLE_SELECTORS.jobHighlightsContainer
      );

      const jobDetails = {
        id: item.dataset.encodedDocId,
        jobTitle: item.querySelector(GOOGLE_SELECTORS.jobTitle)?.textContent,
        logo: item.querySelector(GOOGLE_SELECTORS.logo)?.querySelector("img")
          ?.src,
        companyName: details[0]?.textContent,
        location: details[1]?.textContent,
        platform: {
          name: platform?.querySelector(GOOGLE_SELECTORS.applyPlatformName)
            ?.textContent,
          href: platform?.querySelector("a")?.href,
        },
        extensions: Array.from(
          item.querySelectorAll(GOOGLE_SELECTORS.extensions)
        ).map((e: Element) => e?.textContent),
        description: item.querySelector(GOOGLE_SELECTORS.description)
          ?.textContent,
        jobHighlights: {
          qualifications:
            jobHighlights.length > 0
              ? Array.from(
                  jobHighlights[0].querySelectorAll(
                    GOOGLE_SELECTORS.jobHighlights
                  )
                ).map((e: Element) => e?.textContent)
              : [],
          responsibilities:
            jobHighlights.length > 1
              ? Array.from(
                  jobHighlights[1].querySelectorAll(
                    GOOGLE_SELECTORS.jobHighlights
                  )
                ).map((e: Element) => e?.textContent)
              : [],
        },
      };

      return jobDetails;
    },
    id,
    GOOGLE_SELECTORS
  );

  await browser.close();

  return { jobDetails, url };
}
