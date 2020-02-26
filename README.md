# Pubs importer - Google Chrome extension
Allows to import a paper from web browser directly to [pubs](https://github.com/pubs/pubs)

## Install
First make sure you have [pubs](https://github.com/pubs/pubs) installed and configured. Then, install the native host, which allows the chrome extension to connect to pubs. Start by cloning this repository. Then run the following from the repository root:
```
sh host/install_host.sh
```
Then clone this repository. Got to `chrome://extensions`, turn on developer mode and install the extension from the `extension` folder.

## Supported sources
Currently, only arxiv is supported.
