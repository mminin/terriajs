
export default class Requestor {

    constructor (urlParser, options, domparser) {
        this.parseUrl = urlParser
        this.proxy = options.proxy ? options.proxy : null
        this.DOMParser = domparser
    }

    async getData (url) {
        url = this.proxy ? `${this.proxy}${url}` : url
        const xmlResponse = await fetch(url)
        const responseXml = await xmlResponse.text()
        const json = this.parseStringSync(responseXml)
        return json
    }

    parseStringSync (str) {
        return parseXML(str, false, this.DOMParser)
    }

}

function parseXML(xml, extended, DomParser) {
    if (!xml) return {};

    function parseXML(node, simple) {
        if (!node) return null;
        let txt = ''
        let obj = null
        let att = null
        if (node.childNodes) {
            if (node.childNodes.length > 0) {
                for (var n = 0; n < node.childNodes.length; ++n) {
                    const cn = node.childNodes[n]
                    const cnt = cn.nodeType
                    const cnn = jsVar(cn.localName || cn.nodeName)
                    const cnv = cn.text || cn.nodeValue || ''
                    if (cnt === 8) {
                        continue;
                    } else if (cnt === 3 || cnt === 4 || !cnn) {
                        if (cnv.match(/^\s+$/)) {
                            continue;
                        }
                        txt += cnv.replace(/^\s+/, '').replace(/\s+$/, '');
                    } else {
                        obj = obj || {};
                        if (obj[cnn]) {
                            if (!obj[cnn].length) obj[cnn] = myArr(obj[cnn]);
                            obj[cnn] = myArr(obj[cnn]);

                            obj[cnn][obj[cnn].length] = parseXML(cn, true);
                            obj[cnn].length = obj[cnn].length;
                        } else {
                            obj[cnn] = parseXML(cn);
                        }
                    }
                }
            }
        }
        if (node.attributes) {
            if (node.attributes.length > 0) {
                att = {};
                obj = obj || {};
                for (var a = 0; a < node.attributes.length; ++a) {
                    let at = node.attributes[a]
                    let atn = jsVar(at.name)
                    let atv = at.value
                    att[atn] = atv
                    if (obj[atn]) {
                        obj[cnn] = myArr(obj[cnn]);

                        obj[atn][obj[atn].length] = atv;
                        obj[atn].length = obj[atn].length;
                    } else {
                        obj[atn] = atv;
                    }
                }
            }
        }
        if (obj) {
            var newObj = txt !== '' ? new String(txt) : {};
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    newObj[prop] = obj[prop];
                }
            }
            obj = newObj;
            txt = obj.text ? [obj.text || ''].concat([txt]) : txt;
            if (txt) obj.text = txt;
            txt = '';
        }
        var out = obj || txt;
        if (extended) {
            if (txt) out = {};
            txt = out.text || txt || '';
            if (txt) out.text = txt;
            if (!simple) out = myArr(out);
        }
        return out;
    }

    var jsVar = function(s) {
        return String(s || '').replace(/-/g, '_');
    };

    var myArr = function(o) {
        if (!Array.isArray(o)) o = [o];
        o.length = o.length;
        return o;
    };

    if (typeof xml === 'string') {
        const parser = new DomParser()
        xml = parser.parseFromString(xml, 'text/xml')
    };

    if (!xml.nodeType) return;
    if (xml.nodeType === 3 || xml.nodeType === 4) return xml.nodeValue;

    var root = xml.nodeType === 9 ? xml.documentElement : xml;

    var out = parseXML(root, true);

    xml = null;
    root = null;

    return out;
}
