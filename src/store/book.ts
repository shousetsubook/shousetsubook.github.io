import { aozora } from '../helpers/aozora'
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
    loadFromFile (context :BookContext, payload :BookFile) {
        return new Promise<void>((resolve) => {
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
        var paragraphIndex = 0;
        for (i = metadataEnd + 1; i < state.rawLines.length; i++) {
            // the text props we will pass to the BookParagraph component
            var text :TextComponent = {
                jisage: jisage,
                index: paragraphIndex,
                content: "",
                textType: 'BookParagraph',
                hLevel: 0,
            }
            var content = state.rawLines[i]
            // line break
            if (content === "") {
                text.textType = 'BookLineBreak';
                texts.push(text);
                paragraphIndex++;
                continue;
            }

            // first, check if it's a formatting line
            var sagepattern = /^［＃(ここから)?([０-９]+?)字下げ.*］/
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
            content = aozora(content)

            // add bookmark if available
            if (state.bookmark.paragraph === i) {
                content = insertBookmark(content, state.bookmark);
            }

            if (content) {
                text.content = content
                texts.push(text);
                paragraphIndex++;
            }
        }
        state.textComponents = texts;
    },

    loadContent (state :BookState, payload :{index:number, content:string}) {
        var textComponent = state.textComponents[payload.index];
        if (textComponent != null) {
            textComponent.content = payload.content;
        } else {
            console.error(`index ${payload.index} out of range for state.textComponents`)
        }
    },

    removeBookmark (state :BookState) {
        if (state.bookmark.content != null) {
            state.textComponents[state.bookmark.paragraph].content = state.bookmark.content;
            let emptyBookmark = {paragraph:0,node:0,character:0,content:null};
            Object.assign(state.bookmark,emptyBookmark)
        } else {
            // bookmark doesn't exist
        }
    },

    loadBookmark (state :BookState, bookmark :Bookmark) {
        if (state.bookmark.content == null) {
            var cleanTextComponent = state.textComponents[bookmark.paragraph]
            if (cleanTextComponent == null) {
                console.error(`Bookmark paragraph  ${bookmark.paragraph} out of range`)
                return
            }
            var cleanContent = cleanTextComponent.content;
            cleanTextComponent.content = insertBookmark(cleanContent, bookmark);
            bookmark.content = cleanContent;
            Object.assign(state.bookmark, bookmark);
        } else {
            console.error("Error, bookmark already loaded. Please remove it first")
            return;
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