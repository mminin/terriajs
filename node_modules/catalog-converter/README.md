# Catalog Converter

A library with utility functions and a CLI for converting a TerriaJS v7 catalog to a TerriaJS v8 catalog.

A hosted version of this is available at https://catalog-converter.terria.io/ with the source code via https://github.com/TerriaJS/catalog-converter-ui

Bootstrapped with https://github.com/alexjoverm/typescript-library-starter.git

## Convert

Install, build:

```bash
npm install
npm run build:code
```

Convert v7 to v8 catalog:

```bash
./bin/catalog-converter mapconfig-input-v7.json mapconfig-output-v8.json
```

Run help to see the supported command line arguments:

```bash
./bin/catalog-converter --help
```

## Trouble converting your v7 catalog to v8?

While we have tried our best to translate most of the v7 catalog configuration to equivalent v8, we could still have missed out many. If you find warnings about unknown or unsupported properties when running this script, you may:

- Check the v8 documentation on [connecting to data](https://docs.terria.io/guide/connecting-to-data/) to see if the properties you are after (or its equivalent) are available in v8.
- You can reach out to us on [TerriaJS Discussions](https://github.com/TerriaJS/terriajs/discussions) forum and we'll be happy to help!
