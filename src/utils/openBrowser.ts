import puppeteer, { PuppeteerLifeCycleEvent } from "puppeteer";
import config from "config";

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

export async function openBrowser(
  url?: string,
  waitUntil:
    | PuppeteerLifeCycleEvent
    | PuppeteerLifeCycleEvent[] = "domcontentloaded"
) {
  const browser = await puppeteer.launch({
    args: minimal_args,
    userDataDir: "./.cache/path",
    headless: true,
  });

  const page = await browser.newPage();
  await page.setUserAgent(config.get<string>("ua"));

  if (url) await page.goto(url, { waitUntil });

  return { browser, page };
}
