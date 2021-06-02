# html2pdf-service

This service provides a simple API to print out PDF from HTML documents over a Restful API.
The rendering is using [puppeteer] as its core.

[puppeteer]: https://pptr.dev/

## The Appvantage distinction

Appvantage has spent 10 years in the Automotive industry with a variety of key companies globally.
With projects spanning across from Sales to After-Sales in the customer lifecycle, we have the knowledge
and capability to ensure quality and quick-to-market delivery.

**[Join us!][join] View our available positions.**

[join]: https://www.appvantage.co/career/

## Getting started

Pull the docker image to run the service

```bash
docker pull docker.pkg.github.com/appvantageasia/html2pdf-service/api:latest
```

Then launch a container

```bash
docker run --rm -p 3000:3000 docker.pkg.github.com/appvantageasia/html2pdf-service/api:latest
```

The web server will by default listen on the port 3000, it may be changed with the environment variable `PORT`.

You may now call the [API](api.md)
