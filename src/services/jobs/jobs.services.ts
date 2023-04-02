import puppeteer from "puppeteer";
import config from "config";
import { scrapeInfiniteScrollItems } from "../../utils/scrapeInfiniteScrollItems";
import { generateGoogleJobsUrl } from "../../utils/generateGoogleJobsUrl";
import { GOOGLE_SELECTORS } from "../../constants";

const minimal_args = [
  "--autoplay-policy=user-gesture-required",
  "--disable-background-networking",
  "--disable-background-timer-throttling",
  "--disable-backgrounding-occluded-windows",
  "--disable-breakpad",
  "--disable-client-side-phishing-detection",
  "--disable-component-update",
  "--disable-default-apps",
  "--disable-dev-shm-usage",
  "--disable-domain-reliability",
  "--disable-extensions",
  "--disable-features=AudioServiceOutOfProcess",
  "--disable-hang-monitor",
  "--disable-ipc-flooding-protection",
  "--disable-notifications",
  "--disable-offer-store-unmasked-wallet-cards",
  "--disable-popup-blocking",
  "--disable-print-preview",
  "--disable-prompt-on-repost",
  "--disable-renderer-backgrounding",
  "--disable-setuid-sandbox",
  "--disable-speech-api",
  "--disable-sync",
  "--hide-scrollbars",
  "--ignore-gpu-blacklist",
  "--metrics-recording-only",
  "--mute-audio",
  "--no-default-browser-check",
  "--no-first-run",
  "--no-pings",
  "--no-sandbox",
  "--no-zygote",
  "--password-store=basic",
  "--use-gl=swiftshader",
  "--use-mock-keychain",
];

export async function getJobList(
  searchQuery: string,
  resultsCount = 10,
  location?: string
) {
  const browser = await puppeteer.launch({
    args: minimal_args,
    // userDataDir: "./.cache/path",
    headless: true,
    // executablePath:
    //   process.env.NODE_ENV === "production"
    //     ? process.env.PUPPETEER_EXECUTABLE_PATH
    //     : puppeteer.executablePath(),
  });

  const page = await browser.newPage();
  const url = generateGoogleJobsUrl(searchQuery, location);

  await page.setUserAgent(config.get<string>("ua"));
  await page.goto(url, { waitUntil: "domcontentloaded" });

  const jobList = await scrapeInfiniteScrollItems(
    page,
    extractJobsList,
    GOOGLE_SELECTORS.scrollableItem,
    resultsCount
  );

  await browser.close();
  return jobList;
}

function extractJobsList() {
  const components = document.querySelectorAll<HTMLElement>(".KGjGe");

  const jobList: JobType[] = [];
  components.forEach((item) => {
    const details = item.querySelectorAll(".sMzDkb");
    const job = {
      id: item.dataset.encodedDocId || "",
      jobTitle: item.querySelector(".KLsYvd")?.innerHTML || "",
      logo: item.querySelector(".ZUeoqc")?.querySelector("img")?.src,
      companyName: details[0].textContent || "",
      location: details[1].textContent || "",
      extensions: Array.from(item.querySelectorAll(".LL4CDc")).map(
        (e) => e.textContent || ""
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
