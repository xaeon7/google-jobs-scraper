const SECRET_LIST =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
  "abcdefghijklmnopqrstuvwxyz" +
  "0123456789" +
  "-" +
  "_";

function uule(city: string) {
  const secret = SECRET_LIST[city.length % 64];
  const hashed = Buffer.from(city).toString("base64").replace(/=+$/, "");
  return `w+CAIQICI${secret}${hashed}`;
}

export function generateGoogleJobsUrl(
  searchQuery: string,
  location = "New York, USA",
  lang = "en5"
) {
  searchQuery = searchQuery.replace(/ /g, "+");
  location = uule(location);
  return `https://www.google.com/search?q=${searchQuery}&ibp=htl%3Bjobs&uule=${location}&hl=${lang}&gl=us#htivrt=jobs`;
}

export function generateGoogleJobDetailsUrl(id: string, lang = "en") {
  return `https://www.google.com/search?q=google&ibp=htl%3Bjobs&hl=${lang}&gl=us#htivrt=jobs&${encodeURIComponent(
    id
  )}=&htidocid=${encodeURIComponent(id)}&fpstate=tldetail`;
}
