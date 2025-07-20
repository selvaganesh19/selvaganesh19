const fs = require('fs');
const path = require('path');

async function updateQuote() {
  try {
    const quotes = require('./quotes.json');
    const readmePath = path.join(__dirname, 'README.md');
    let readmeContent = fs.readFileSync(readmePath, 'utf-8');

    // Match the current quote from the README
    const prevMatch = readmeContent.match(/quote=([^&]+)&author=([^&]+)&/);
    let randomIndex = Math.floor(Math.random() * quotes.length);
    let { quote, author } = quotes[randomIndex];

    // Prevent repeating the same quote
    if (prevMatch) {
      const prevQuote = decodeURIComponent(prevMatch[1]);
      let attempts = 0;
      while (quote === prevQuote && attempts < 10 && quotes.length > 1) {
        randomIndex = Math.floor(Math.random() * quotes.length);
        ({ quote, author } = quotes[randomIndex]);
        attempts++;
      }
    }

    console.log("✅ Selected Quote:", quote);
    console.log("🖋️  Author:", author);

    const cardDesign = `
<!--STARTS_HERE_QUOTE_CARD-->
<p align="center">
    <img src="https://readme-daily-quotes.vercel.app/api?author=${encodeURIComponent(author)}&quote=${encodeURIComponent(quote)}&theme=dark&bg_color=220a28&author_color=ffeb95&accent_color=c56a90">
</p>
<!--ENDS_HERE_QUOTE_CARD-->
`;

    // Replace the quote section
    readmeContent = readmeContent.replace(
      /<!--STARTS_HERE_QUOTE_CARD-->[\s\S]*?<!--ENDS_HERE_QUOTE_CARD-->/,
      cardDesign
    );

    fs.writeFileSync(readmePath, readmeContent, 'utf-8');
    console.log("✅ README updated successfully.");
  } catch (error) {
    console.error('❌ Error updating quote:', error);
  }
}

updateQuote();
