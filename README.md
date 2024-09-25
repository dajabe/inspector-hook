# Inspector Hook

Simple application to recieve a webhook and then display it on a webpage.

## Why?

Sometimes I just want to be able to look at something. This was a quick and easy way to make that happen while I'm developing

## How?

Clone this repo:

```
git clone git@github.com:dajabe/inspector-hook.git
```

Start it up
```
deno task dev
```

Point your webhooks at `http://localhost:8000` or wherever you change it to serve this

Send a webhook and load the webpage `http://localhost:8000`

Automatic reload of the json file doesn't happen at this stage. A webhook is recieved and the written to webhooks.json in the project root directory. Might add a SQLite DB later and automatic reload of the webhook data when a new hook comes through.

Feel free to send me any adjustments you think it could use.
