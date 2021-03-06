interface Bookmark {
    paragraph: number,
    node: number,
    character: number,
    content?: string,
}

const BOOKMARK_CLASS = 'bookmark'

const idFromBookmark = (bookmark :Bookmark) :string => {
    return `p${bookmark.paragraph}n${bookmark.node}c${bookmark.character}`;
}

const bookmarkFromHash = (hash :string) :Bookmark => {
    var bookmark = {
        paragraph:0,
        node:0,
        character:0,
    }
    var indices = hash.match(/p(\d+)n(\d+)c(\d+)/)
    if (indices != null) {
        var paragraph = parseInt(indices[1]);
        var node = parseInt(indices[2]);
        var character = parseInt(indices[3]);
        if (!isNaN(paragraph)) {
            bookmark.paragraph = paragraph;
        }
        if (!isNaN(node)) {
            bookmark.node = node;
        }
        if (!isNaN(character)) {
            bookmark.character = character;
        }
    }
    return bookmark;
}

const insertBookmark = (content :string, bookmark: Bookmark) :string => {
    // create a Template to parse easily
    var template = document.createElement('template');
    template.innerHTML = content;

    // get the textNode that bookmark points to
    var bookmarkNode = template.content.childNodes[bookmark.node];
    
    // TODO: handle case with more than 1 child
    if (bookmarkNode.hasChildNodes()) {
        bookmarkNode = bookmarkNode.childNodes[0];
    }
    if (bookmarkNode == null || bookmarkNode.textContent == null) {
        console.error(`Invalid bookmark. Node with index ${bookmark.node} does not exist`);
        console.error(content);
        return content;
    }
    var charAtBookmark = bookmarkNode.textContent[bookmark.character];
    if (charAtBookmark == null) {
        // try the previous character
        charAtBookmark = bookmarkNode.textContent[bookmark.character-1];
        if (charAtBookmark == null) {
            console.error(`Invalid bookmark. Character with index ${bookmark.character} does not exist`);
            return content;
        } else {
            bookmark.character--;
        }
    }

    // slice the node at the bookmark
    var sliceUntilBookmark = bookmarkNode.textContent.slice(0, bookmark.character);
    var sliceAfterBookmark = bookmarkNode.textContent.slice(bookmark.character+1);

    var newBookmark = document.createElement('span') as HTMLElement;
    newBookmark.appendChild(document.createTextNode(charAtBookmark));
    // TODO: we can't rely on these being set if this function fails, but we're going to just assume it for now because it's easier.
    newBookmark.id = idFromBookmark(bookmark);
    newBookmark.classList.add(BOOKMARK_CLASS);
    newBookmark.style.backgroundColor = "red";

    // repiece the nodes together
    var bookmarkFragment = document.createDocumentFragment();
    if (sliceUntilBookmark != null) {
        bookmarkFragment.appendChild(document.createTextNode(sliceUntilBookmark));
    }
    bookmarkFragment.appendChild(newBookmark);
    if (sliceAfterBookmark != null) {
        bookmarkFragment.appendChild(document.createTextNode(sliceAfterBookmark));
    }
    // we know this isn't null because bookmarkNode is a child node
    bookmarkNode.parentNode!.replaceChild(bookmarkFragment, bookmarkNode);
    return template.innerHTML;
}

export {
    BOOKMARK_CLASS,
    Bookmark,
    insertBookmark,
    idFromBookmark,
    bookmarkFromHash,
}