# API

The API is a simple route on `/` expecting a request on `POST` method with a JSON payload.
The response would be a PDF file.
The CURL request could be as the following :

```bash
curl -i \
    -H "Content-Type: application/json" \
    -X POST \
    -d "{\"html\":\"<div>hello world</div>\"}" \
    http://localhost:3000/
```

The JSON payload should be as the following object

| Path                         | Type    | Description                                        |
| ---------------------------- | ------- | -------------------------------------------------- |
| `html`                       | String  | HTML to print out as a PDF (mandatory)             |
| `options`                    | Object  | Settings for puppeter (optional)                   |
| `options.emulateScreenMedia` | Boolean | Emulate screen media (default: false)              |
| `options.viewport`           | Object  | [Viewport settings][viewport] (default: 1600x1200) |
| `options.waitUntil`          | String  | [Wait until setting][goto] (default: networkidle2) |
| `options.pdf`                | Object  | [PDF settings][pdf] (default: A4 with background)  |

[viewport]: https://pptr.dev/#?product=Puppeteer&version=v8.0.0&show=api-pagesetviewportviewport
[goto]: https://pptr.dev/#?product=Puppeteer&version=v8.0.0&show=api-pagegotourl-options
[pdf]: https://pptr.dev/#?product=Puppeteer&version=v8.0.0&show=api-pagepdfoptions
