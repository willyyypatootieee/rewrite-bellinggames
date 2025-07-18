import type { EntryContext } from '@remix-run/node'
import { RemixServer } from '@remix-run/react'
import { renderToString } from 'react-dom/server'
import fs from 'fs'
import path from 'path'

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  return new Promise((resolve, reject) => {
    try {
      // Read the CSS file synchronously
      const cssPath = path.resolve(__dirname, 'tamagui.css')
      let tamaguiCSS = ''
      try {
        tamaguiCSS = fs.readFileSync(cssPath, 'utf8')
      } catch (e) {
        tamaguiCSS = ''
      }
      let markup = renderToString(
        <RemixServer context={remixContext} url={request.url} />
      )
      markup = markup.replace(
        '</head>',
        `<style id="tamagui">${tamaguiCSS}</style></head>`
      )

      responseHeaders.set('Content-Type', 'text/html')

      resolve(
        new Response('<!DOCTYPE html>' + markup, {
          headers: responseHeaders,
          status: responseStatusCode,
        })
      )
    } catch (error) {
      reject(error)
    }
  })
}
