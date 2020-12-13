import { todo, rubify, midasi, boutenify, kutenkara } from '../helpers/aozora'
import { Bookmark, insertBookmark } from '../helpers/bookmark'

export interface TextComponent {
    jisage: number,
    index: number,
    hLevel: number,
    content: string
    textType: string,
}

interface BookContext {
    commit: Function
    state: BookState
    dispatch: Function
}

export class BookState {
    bookFile: BookFile | null = null;
    bookmark: Bookmark = {
        paragraph: 0,
        node: 0,
        character: 0,
    };
    rawLines: string[] = [];
    textComponents: Array<TextComponent> = [];
}


export interface BookFile {
    file: File,
    encoding: string,
}

const state = () :BookState => new BookState();

// getters
const getters = {
    bookmark: (state :BookState) :Bookmark => {
        return state.bookmark
    },

    isLoaded: (state :BookState) :boolean => (
        state.rawLines.length > 0
    ),

    title: (state :BookState) :string => (
        state.rawLines.length >= 2 ? state.rawLines[0] : ''
    ),

    author: (state :BookState) :string => (
        state.rawLines.length >= 2 ? state.rawLines[1] : ''
    ),

    rawLines: (state :BookState) :Array<string> => {
        return state.rawLines;
    },

    textComponents: (state :BookState) :Array<TextComponent> => {
        return state.textComponents;
    }
}


// actions
const actions = {
    bookmarkClick (context :BookContext, payload :{e:MouseEvent} ) {
        var target = payload.e.target as HTMLElement
        if (target == null || target.id == null) {
            console.log('Invalid target. Logging event for debugging')
            console.log(payload.e)
            return 
        }
        if (!target.classList.contains('paragraph')) {
            // can only bookmark when clicking on the text. Todo, get nearest paragraph of click
            return
        }
        if (!target.id.startsWith('BookParagraph')) {
            // TODO: try bubbling up before just exiting, could have clicked on a child node
            // https://github.com/shousetsubook/shousetsubook.github.io/blob/50bd35b2abbecb2e82c766088082a88d3450bc07/src/components/BookBookmark.vue#L105
            console.log("didn't click on what we expected. Logging target for debug info")
            console.log(target)
            return
        }
        var paragraphIndexString = target.id.match(/(\d+)/)[0];
        if (paragraphIndexString == null) {
            console.log("couldn't get paragraph index from id. Logging target for debug info")
            console.log(target)
            return
        }
        var paragraphIndex = parseInt(paragraphIndexString);

        var textComponent :TextComponent;
        for (let i = 0; i < context.state.textComponents.length; i++) {
            if (context.state.textComponents[i].index == paragraphIndex) {
                textComponent = context.state.textComponents[i]
            }
        }
        if (textComponent == null) {
            console.log("something wrong with textComponent, logging paragraphIndex")
            console.log(paragraphIndexString)
            console.log(context.state.textComponents)
        }
        // TODO remove old bookmark, if it exists

        var range: Range | CaretPosition;
        var offset: number;
        var textNode: Node;
        if (document.caretPositionFromPoint) {    // Firefox
            range = document.caretPositionFromPoint(payload.e.x,payload.e.y) as CaretPosition;
            textNode = range.offsetNode;
            offset = range.offset;
        } else if (document.caretRangeFromPoint) {     // Chromium-based
            range = document.caretRangeFromPoint(payload.e.x,payload.e.y) as Range;
            textNode = range.startContainer;
            offset = range.startOffset;
        } else {
            console.log('unsupported browser')
            return
        }
        var nodeIndex: number = Array.prototype.indexOf.call(target.childNodes, textNode);
        var bookmark = {
            paragraph: paragraphIndex,
            node: nodeIndex,
            character: offset,
        }
        textComponent.content = insertBookmark(textComponent.content, bookmark)

    },
    loadFromFile (context :BookContext, payload :BookFile) {
        return new Promise((resolve) => {
            var reader = new FileReader();
            reader.onload = () => {
                var rawString = reader.result as string;
                context.commit('loadRawLines', rawString.split(/\r?\n/))
                context.commit('loadFile', payload)
                resolve();
            };
            reader.readAsText(payload.file, payload.encoding);
        });
    },
    reloadWithEncoding (context :BookContext, payload :string) {
        return new Promise((resolve, reject) => {
            var reader = new FileReader();
            reader.onload = () => {
                var rawString = reader.result as string;
                context.commit('loadRawLines', rawString.split(/\r?\n/))
                resolve();
            };
            if (context.state.bookFile != null) {
                reader.readAsText(context.state.bookFile.file, payload);
            } else {
                reject();
            }
        });
    },
}

// mutations
const mutations = {
    loadRawLines (state :BookState, payload :Array<string>) {
        state.rawLines = payload
        var texts = [];
        if (state.rawLines.length == 0) {
            state.textComponents = [];
        }

        // metadata
        var divisor = /^-----/;
        var metadataEnd = 4;
        // arbitrarily stop at 100 (or EOF). If we hit 100, something is wrong so just include the metadata
        for (var i = metadataEnd; i < 100 && i < state.rawLines.length; i++) {
            if (state.rawLines[i].match(divisor)) {
                metadataEnd = i
                break
            }
        }
        var jisage = 0;
        for (i = metadataEnd + 1; i < state.rawLines.length; i++) {
            // the text props we will pass to the BookParagraph component
            var text :TextComponent = {
                jisage: jisage,
                index: i,
                content: "",
                textType: 'BookParagraph',
                hLevel: 0,
            }
            var content = state.rawLines[i]
            // line break
            if (content === "") {
                text.textType = 'BookLineBreak';
                texts.push(text);
                continue;
            }

            // first, check if it's a formatting line
            var sagepattern = /^［＃(ここから)?([０-９]+?)字下げ］/
            var fullwidth = content.match(sagepattern)
            if (fullwidth) {
                var jisageString = String.fromCharCode(fullwidth[2].charCodeAt(0) - 0xFEE0)
                jisage = parseInt(jisageString)
                // if ここから then continue, else change jisage for the current line
                if (fullwidth[1]) {
                    continue
                } else {
                    text.jisage = jisage
                    jisage = 0
                    content.replace(sagepattern, "")
                }
            }
            var owaripattern = /^［＃ここで字下げ終わり］/
            var owari = content.match(owaripattern)
            if (owari) {
                jisage = 0
                continue
            }

            // next, do things like simple search and replace
            content = kutenkara(content)
            content = rubify(content)
            content = boutenify(content)
            content = midasi(content)
            content = todo(content)

            // add bookmark if available
            if (state.bookmark.paragraph === i) {
                content = insertBookmark(content, state.bookmark);
            }

            if (content) {
                text.content = content
                texts.push(text)
            }
        }
        state.textComponents = texts;
    },

    loadBookmark (state :BookState, bookmark :Bookmark) {
        // rawLines content
        var content = state.bookmark.content;

        // replace the old bookmark with the new bookmark. "state.bookmark.content" is gone
        state.bookmark = bookmark;
        for (var i = 0; i < state.textComponents.length; i++) {
            if (state.textComponents[i].index === bookmark.paragraph) {
                // if we have rawLines content stored
                // TODO: this doesn't feel that robust, try considering a cleaner solution
                if (content) {
                    state.textComponents[i].content = insertBookmark(content, bookmark);
                    state.bookmark.content = content;
                } else {
                    state.bookmark.content = state.textComponents[i].content
                    state.textComponents[i].content = insertBookmark(state.textComponents[i].content, bookmark)
                }
            }
        }
    },

    loadFile (state :BookState, payload :BookFile) {
        state.bookFile = payload ;
    },
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}