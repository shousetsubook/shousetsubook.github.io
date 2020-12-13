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

const removeBookmark = (content :string) :string => {
    // create a Template to parse easily
    var template = document.createElement('template');
    template.innerHTML = content;

    // todo: multiple bookmarking
    var span = template.content.querySelector(`.${BOOKMARK_CLASS}`);
    if (span) {
        var spanContents = document.createTextNode(span.innerHTML);
        template.content.replaceChild(spanContents,span);
        // the inner nodes will still be fragmented so this should combine them
        var temp = template.innerHTML;
        template.innerHTML = temp;
        return template.innerHTML;
    } else {
        console.log("Couldn't remove bookmark")
        return content;
    }

}

const insertBookmark = (content :string, bookmark: Bookmark) :string => {
    // create a Template to parse easily
    var template = document.createElement('template');
    template.innerHTML = content;

    // get the textNode that bookmark points to
    var bookmarkNode = template.content.childNodes[bookmark.node];
    if (bookmarkNode == null || bookmarkNode.textContent == null) {
        console.log(`Invalid bookmark. Node with index ${bookmark.node} does not exist`);
        return content;
    }

    // slice the node to get the specific chracter that bookmark points to
    var sliceUntilBookmark = bookmarkNode.textContent.slice(0, bookmark.character);
    var charAtBookmark = bookmarkNode.textContent[bookmark.character];
    var sliceAfterBookmark = bookmarkNode.textContent.slice(bookmark.character+1);

    if (charAtBookmark == null) {
        console.log(`Invalid bookmark. Character with index ${bookmark.character} does not exist`);
        return content;
    }

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
    template.content.replaceChild(bookmarkFragment, bookmarkNode);
    return template.innerHTML;
}

export {
    BOOKMARK_CLASS,
    Bookmark,
    insertBookmark,
    idFromBookmark,
    removeBookmark,
    bookmarkFromHash,
}