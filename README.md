# Anuroop Jayan — Portfolio

A single-page portfolio for a Computer Science student at York University. The contact form saves submissions to a Google Sheet through a Google Apps Script web app.

## Features

- Responsive single-page layout (hero with terminal panel, about, skills, contact, footer)
- Mobile navigation with keyboard support (Esc closes the menu)
- Active section highlighting while scrolling
- Scroll-reveal animations (disabled when the user prefers reduced motion)
- Copy-to-clipboard email address
- Contact form with inline validation, saved to Google Sheets

## Project structure

```
anuroop-portfolio/
├── index.html            # Page markup
├── css/
│   └── styles.css        # All styles (design tokens live in :root)
├── js/
│   └── main.js           # Navigation, reveal, copy, and contact form logic
├── apps-script/
│   └── Code.gs           # Google Apps Script backend (paste into Apps Script)
├── .editorconfig
├── .gitignore
├── LICENSE
└── README.md
```

## Running locally

No build step is needed. Open `index.html` in a browser, or serve the folder:

```bash
# Python 3
python3 -m http.server 8000
# then visit http://localhost:8000
```

Note: the contact form only works when the Apps Script endpoint is deployed and reachable. Opening the page from `file://` also works because the form uses a GET request with `mode: "no-cors"`.

## Setting up the contact form

### 1. Create the Google Sheet backend

1. Create or open a Google Sheet.
2. Go to **Extensions → Apps Script**.
3. Replace the default code with the contents of `apps-script/Code.gs`.
4. Either:
   - leave `SPREADSHEET_ID` empty (the script is bound to the sheet), or
   - paste your Sheet ID into `SPREADSHEET_ID` (the part of the sheet URL between `/d/` and `/edit`).
5. Click **Deploy → New deployment → Web app**:
   - **Execute as:** Me
   - **Who has access:** Anyone
6. Copy the Web app URL.

The script creates a `Responses` tab with `Timestamp`, `Name`, `Email`, and `Message` columns when the first submission arrives.

### 2. Connect the page to the script

In `js/main.js`, set `SCRIPT_URL` to the Web app URL:

```js
var SCRIPT_URL = "https://script.google.com/macros/s/XXXX/exec";
```

### 3. Test

Open this URL in a browser (replace `SCRIPT_URL`):

```
SCRIPT_URL?name=Test&email=test@example.com&message=hello
```

You should see `{"success":true}` and a new row in the sheet.

### Updating the backend

Apps Script changes take effect only after a new deployment: **Deploy → Manage deployments → Edit → Version: New version → Deploy**. The URL stays the same.

## Customizing

- **Colors, fonts, spacing:** edit the design tokens in `:root` at the top of `css/styles.css`.
- **Text content:** edit `index.html`.
- **Email and social links:** placeholders are in `index.html` (`anuroop.jayan@example.com`, `github.com`, `linkedin.com`, and the Resume `#` link). Replace them with your real values.

## Deployment

The site is static. It can be hosted on GitHub Pages, Netlify, or Vercel:

- **GitHub Pages:** Settings → Pages → Deploy from a branch → `main` / root.

## License

MIT. See [LICENSE](LICENSE).
