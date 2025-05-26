# Scan JS Errors

Scan a batch of URLs for JavaScript errors using Playwright.

## Setup

Install dependencies:

```bash
npm install
```

## Usage

Create a line separated file with URLs to scan.

```
https://example.com
https://example.org
```

Save as `urls.txt` in the /data directory

Run the script:

```bash
npm start -- data/urls.txt
```
