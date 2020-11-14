# shousetsubook.github.io
https://shousetsubook.github.io/

Online E-Reader for Aozora Bunko texts.

## Features
- 縦書き
- furigana ruby
- bookmarking*
- works with Yomichan
- entire app is a single HTML page which you can save
\*bookmarking is still super basic, see [Usage](#usage)

## Usage
Drag and drop an unzipped Aozora Buko text file to start reading.

Ctrl+click to bookmark at the mouse position. This will add a bookmark position to the URL. When you load the page with the same book next time with the same URL, it should jump to your bookmark.

Inspired by https://animebook.github.io

## Roadmap
- robust bookmarking at the character level (currently it's at the pixel level which can change based resolution, viewport size, etc.)
- render Aozora Bunko indentation properly
- themes/fonts
- toggleable 縦書き or 横書き

### Maybe
- stateful bookmarking
- unzip files in browser