# shousetsubook.github.io
https://shousetsubook.github.io/

Online E-Reader for Aozora Bunko texts.

## Features
- 縦書き
- furigana ruby
- aozora formatting (boten, indentation, ruby furigana)
- click to bookmark position
- works with Yomichan



## Usage
Drag and drop an unzipped Aozora Buko text file to start reading.

For bookmarking, click anywhere on the text to create a bookmark at that character. This will create a bookmark position in the URL. If you leave or reload the page with the bookmarked URL, you will need to load the Aozora Bunko file again, but upon loading it will return to your bookmark.


## Roadmap
- render all aozora bunko formatting. Todo:
    - non-JIS kanji
    - subscript/superscript
    - specific 横書き
- basic navigation (chapters, table of contents)
- themes/fonts
- toggleable 縦書き or 横書き

### Maybe
- persist book in local storage
- stateful bookmarking
- unzip files in browser
- fetch files from URL

Inspired by https://animebook.github.io
