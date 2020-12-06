<template>
<div class="the-book-wrapper">
    <div class="the-book">
        <BookBookmark/>
        <h1>{{test}}</h1>
        <h1>{{title}}</h1>
        <h2>{{author}}</h2>
        <component
            v-bind:key="text.index"
            v-bind:id="text.textType + '-' + text.index"
            v-for="text in textComponents"
            v-bind:is="text.textType"
            v-bind:text="text"
        ></component>
    </div>
</div>
</template>

<script>
import BookBookmark from './BookBookmark.vue'
import BookParagraph from './BookParagraph.vue'
import BookHeader from './BookHeader.vue'
import BookLineBreak from './BookLineBreak.vue'
import Vue from 'vue'
export default Vue.extend({
    name: 'TheBook',

    components: {
        BookBookmark: BookBookmark,
        BookParagraph: BookParagraph,
        BookHeader: BookHeader,
        BookLineBreak: BookLineBreak,
    },

    data: function() {
        return {
            position: 0,
            encoding: 'shift-jis',
        }
    },

    methods: {
        todo: function(text) {
            // TODO: these are the other formatting options that I haven't implemented yet, but just remove for now
            var comments = /［＃.+?］/g
            var accents = /[〔〕]/g
            text = text.replace(comments, "")
            text = text.replace(accents, "")
            return text
        },
        rubify: function(text) {
            // hiragana katakana fw-roman hw-katakana unicodes:
            // \u3040-\u309f\u30a0-\u30ff\uff00-\uff9f
            //｜ is the kanji separator (different from ascii pipe |)
            var furigana = /｜?([々\u4e00-\u9faf\u3400-\u4dbf]+?)《(.+?)》/g;
            return text.replace(furigana, '<ruby>$1<rt>$2</rt></ruby>');
        },
        boutenify: function(text) {
            var bouten = /(.+?)［＃「\1」に傍点］/g;
            return text.replace(bouten, '<span class="sesame-vertical">$1</span>')
        },
        kutenkara: function(text) {
            // TODO: non-kanji and unicode
            var jiskuten = /※［＃(?:「(.+?)」、)?第(\d+?)水準(\d+?)-(\d+?)-(\d+?)］/g
            return text.replace(jiskuten, "※")
        },
        midasi: function(text) {
            var midasipattern = /(.+?)［＃「\1」は([大中小])見出し］/g
            return text.replace(midasipattern, function(match, p1, p2) {
                switch(p2) {
                    case "大":
                        return '<h1>' + p1 + '</h1>';
                    case "中":
                        return '<h2>' + p1 + '</h2>';
                    case "小":
                        return '<h3>' + p1 + '</h3>';
                }
            })
        },
    },

    computed: {
        isLoaded: function() {
            return this.bookLines.length > 0;
        },
        bookLines: function() {
            var decoder = new TextDecoder(this.encoding, {fatal:true})
            return decoder.decode(this.bookBytes).split(/\r?\n/)
        },
        title: function () {
            return this.bookLines[0];
        },
        author: function() {
            return this.bookLines[1];
        },
        textComponents: function() {
            var texts = [];
            if (this.bookLines.length == 0) {
                return []
            }

            // metadata
            var divisor = /^-----/;
            var metadataEnd = 4;
            // arbitrarily stop at 100. If we hit 100, something is wrong so just include the metadata
            for (var i = metadataEnd; i < 100; i++) {
                if (this.bookLines[i].match(divisor)) {
                    metadataEnd = i
                    break
                }
            }
            var jisage = 0;
            for (i = metadataEnd + 1; i < this.bookLines.length; i++) {
                // the text props we will pass to the BookParagraph component
                var text = {
                    jisage: jisage,
                    index: i,
                    content: "",
                    textType: 'BookParagraph',
                }
                var content = this.bookLines[i]
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
                    jisage = String.fromCharCode(fullwidth[2].charCodeAt(0) - 0xFEE0)
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
                content = this.kutenkara(content)
                content = this.rubify(content)
                content = this.boutenify(content)
                content = this.todo(content)

                if (content) {
                    text.content = content
                    texts.push(text)
                }
            }
            return texts
        },
    },

    props: {
        bookBytes: ArrayBuffer,
        test: String,
    }
});
</script>

<style scoped>
.the-book-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    position:absolute;
}

.the-book {
    -ms-writing-mode: tb-rl;
    writing-mode: tb-rl;
    writing-mode: vertical-rl;
    text-orientation: upright;
    font-size:18px;
    height: 80vh;
}
</style>