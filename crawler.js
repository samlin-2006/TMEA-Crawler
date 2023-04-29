const axios = require("axios");
const cheerio = require("cheerio");
const robotsParser = require("robots-parser");
const robots = robotsParser({
  userAgent: "Googlebot", // The default user agent to use when looking for allow/disallow rules, if this agent isn't listed in the active robots.txt, we use *.
  allowOnNeutral: false, // The value to use when the robots.txt rule's for allow and disallow are balanced on whether a link can be crawled.
});

async function crawl(current, keyword) {
  flag = false;
  for (let i = 3280; i < 3900; i++) {
    //remove the last four characters from the url
    current = current.substring(0, current.length - 4);
    //add the next page number to the url
    current = current + i;
    console.log(current);
    try {
      const response = await axios.get(current);
      const html = response.data;
      const $ = cheerio.load(html);
      $("td").each((i, el) => {
        const item = $(el).text();
        if (item.includes(keyword)) {
          flag = true;
          return;
        }
      });
    } catch (error) {}
    if (flag == true) {
      console.log("Found it!");
      console.log(current);
      break;
    }
  }
  return;
}

(async () => {
  console.log("Testing for google");

  await crawl(
    "https://www.tmea.org/auditions/contest/audition-results/?Contest_ID=3291",
    "Seven Lakes"
  );
})();
