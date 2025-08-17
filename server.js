import express from "express";
import puppeteer from "puppeteer";

const app = express();
app.use(express.json());

app.post("/lead", async (req, res) => {
  const { firstName, lastName, email, phone } = req.body;

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();

  try {
    await page.goto("https://www.clubready.com/present/present.asp?id=50343LYJRWZ&uid=0&opby=0", {
      waitUntil: "networkidle2"
    });

    // ⚠️ You’ll need to replace these selectors with the real form field names
    await page.type("input[name='FirstName']", firstName || "");
    await page.type("input[name='LastName']", lastName || "");
    await page.type("input[name='Email']", email || "");
    await page.type("input[name='Phone']", phone || "");

    await Promise.all([
      page.click("input[type='submit']"),
      page.waitForNavigation({ waitUntil: "networkidle0" })
    ]);

    res.json({ success: true, message: "Lead submitted to ClubReady" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await browser.close();
  }
});

app.listen(process.env.PORT || 10000, () => {
  console.log("Server running on port " + (process.env.PORT || 10000));
});