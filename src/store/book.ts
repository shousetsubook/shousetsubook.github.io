import { todo, rubify, midasi, boutenify, kutenkara } from '../helpers/aozora'

export interface TextComponent {
    jisage: number,
    index: number,
    hLevel: number,
    content: string
    textType: string,
}

interface BookContext {
    commit: Function
    state: Object
    dispatch: Function
}

export class BookState {

    rawLines: string[] = [];
    textComponents: Array<TextComponent> = [];
    bookmark: {
        line: number,
        character: number,
    };

    constructor(rawLines: Array<string>, bookmark: {line :number,character :number}) {
        this.rawLines = [];
        this.bookmark = bookmark
    }
}


export interface BookFile {
    file: File,
    encoding: string,
}
const state = () :BookState => ({
    rawLines: [],
    textComponents: [],
    bookmark: {
        line: 0,
        character: 0,
    },
});

// getters
const getters = {
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

        var texts = [];
        if (state.rawLines.length == 0) {
            return []
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

            // format headers
            var midasipattern = /(.+?)［＃「\1」は([大中小])見出し］/g
            content = content.replace(midasipattern, function(match, p1, p2) {
                text.textType = 'BookHeader'
                switch(p2) {
                    case "大":
                        text.hLevel = 1;
                        break;
                    case "中":
                        text.hLevel = 2;
                        break;
                    case "小":
                        text.hLevel = 3;
                        break;
                    default:
                        text.hLevel = 1;
                }
                return p1;
            })

            // next, do things like simple search and replace
            content = kutenkara(content)
            content = rubify(content)
            content = boutenify(content)
            content = todo(content)

            if (content) {
                text.content = content
                texts.push(text)
            }
        }
        return texts;
    }
}


// actions
const actions = {
    loadFromFile (context :BookContext, payload :BookFile) {
        var reader = new FileReader();
        reader.readAsText(payload.file, payload.encoding);
        reader.onload = () => {
            var rawString = reader.result as string;
            context.commit('loadRawLines', rawString.split(/\r?\n/))
        };
    },
}

// mutations
const mutations = {
    loadRawLines (state :BookState, payload :Array<string>) {
        state.rawLines = payload
    }
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}