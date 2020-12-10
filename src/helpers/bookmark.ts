interface Bookmark {
    paragraph: number,
    node: number,
    character: number,
    content?: string,
}

const insertBookmark = (content :string, bookmark: Bookmark) :string => {
    // create a Template to parse easily
    var template = document.createElement('template');
    template.innerHTML = content;

    // get the textNode that bookmark points to
    var bookmarkNode = template.content.childNodes[bookmark.node];
    if (bookmarkNode == null || bookmarkNode.textContent == null) {
        console.log('Invalid bookmark. Node with index' + bookmark.node + 'does not exist');
        return content;
    }

    // slice the node to get the specific chracter that bookmark points to
    var sliceUntilBookmark = document.createTextNode(bookmarkNode.textContent.slice(0, bookmark.character));
    var charAtBookmark = document.createTextNode(bookmarkNode.textContent[bookmark.character]);
    var sliceAfterBookmark = document.createTextNode(bookmarkNode.textContent.slice(bookmark.character+1));

    if (!charAtBookmark) {
        console.log('Invalid bookmark. Character with index' + bookmark.character + 'does not exist');
        return content;
    }

    var newBookmark = document.createElement('span') as HTMLElement;
    newBookmark.appendChild(charAtBookmark);
    newBookmark.style.backgroundColor = "red";

    // repiece the nodes together
    var bookmarkFragment = document.createDocumentFragment();
    if (sliceUntilBookmark != null) {
        bookmarkFragment.appendChild(sliceUntilBookmark);
    }
    bookmarkFragment.appendChild(newBookmark);
    if (sliceUntilBookmark != null) {
        bookmarkFragment.appendChild(sliceAfterBookmark);
    }
    template.content.replaceChild(bookmarkFragment, bookmarkNode);
    return template.innerHTML;
}

export {
    Bookmark,
    insertBookmark,
}