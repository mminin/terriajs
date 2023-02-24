import Requestor from './Requestor'
import { parseUrl } from './urlParsingBrowser'

import threddsCatalogCrawler from './main'

export default async function entry (url, options) {
    options = options == null ? {} : options
    if ('proxy' in options) {
        options.proxy = options.proxy.slice(-1) === '/' ? options.proxy : options.proxy + '/'
    }

    const requestor = new Requestor(parseUrl, options, DOMParser)
    const c = await threddsCatalogCrawler(url, requestor)
    return c
}
