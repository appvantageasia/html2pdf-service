# API

The API is a simple route on `/` expecting a request on `POST` method with a JSON payload.
By default, the response is a PDF file (`application/pdf`). Set `options.output` to `Image` to return a screenshot instead.

The CURL request could be as the following:

```bash
curl -i \
    -H "Content-Type: application/json" \
    -X POST \
    -d "{\"html\":\"<div>hello world</div>\"}" \
    http://localhost:3000/
```

To render an image instead of a PDF:

```bash
curl -i \
    -H "Content-Type: application/json" \
    -X POST \
    -d "{\"html\":\"<div>hello world</div>\",\"options\":{\"output\":\"Image\"}}" \
    http://localhost:3000/
```

The JSON payload should be as the following object

| Path                         | Type    | Description                                                                                   |
| ---------------------------- | ------- | --------------------------------------------------------------------------------------------- |
| `html`                       | String  | HTML to render (mandatory)                                                                    |
| `options`                    | Object  | Rendering settings (optional)                                                                 |
| `options.output`             | String  | Output kind: `Pdf` (default) or `Image`                                                       |
| `options.emulateScreenMedia` | Boolean | Emulate screen media (default: true)                                                          |
| `options.viewport`           | Object  | [Viewport settings][viewport] (default: 1600x1200)                                            |
| `options.waitUntil`          | String  | [Wait until setting][goto] (default: networkidle2)                                            |
| `options.pdf`                | Object  | [PDF settings][pdf] (default: A4 with background, only for `Pdf` output)                      |
| `options.selector`           | String  | CSS selector for an element to capture (optional, only for `Image` output)                    |
| `options.screenshot`         | Object  | [Screenshot settings][screenshot] (default: PNG, only for `Image` output)                     |

For `Image` output, the response content type matches the screenshot type, such as `image/png`, `image/jpeg`, or `image/webp`. If `options.selector` is provided and matches an element, only that element is captured; otherwise the full page is captured.

[viewport]: https://pptr.dev/#?product=Puppeteer&version=v8.0.0&show=api-pagesetviewportviewport
[goto]: https://pptr.dev/#?product=Puppeteer&version=v8.0.0&show=api-pagegotourl-options
[pdf]: https://pptr.dev/#?product=Puppeteer&version=v8.0.0&show=api-pagepdfoptions
[screenshot]: https://pptr.dev/api/puppeteer.screenshotoptions
