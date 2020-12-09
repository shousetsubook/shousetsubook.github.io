const todo = function(text :string) {
    // TODO: these are the other formatting options that I haven't implemented yet, but just remove for now
    var comments = /［＃.+?］/g
    var accents = /[〔〕]/g
    text = text.replace(comments, "")
    text = text.replace(accents, "")
    return text
}
const rubify = function(text :string) {
    // hiragana katakana fw-roman hw-katakana unicodes:
    // \u3040-\u309f\u30a0-\u30ff\uff00-\uff9f
    //｜ is the kanji separator (different from ascii pipe |)
    var furigana = /｜?([々\u4e00-\u9faf\u3400-\u4dbf]+?)《(.+?)》/g;
    return text.replace(furigana, '<ruby>$1<rt>$2</rt></ruby>');
}
const boutenify = function(text :string) {
    var bouten = /(.+?)［＃「\1」に傍点］/g;
    return text.replace(bouten, '<span class="sesame-vertical">$1</span>')
}
const kutenkara = function(text :string) {
    // TODO: actually convert the jis kuten codes
    // TODO: non-kanji and unicode
    var jiskuten = /※［＃(?:「(.+?)」、)?第(\d+?)水準(\d+?)-(\d+?)-(\d+?)］/g
    return text.replace(jiskuten, "※")
}
const midasi = function(text :string) {
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
        console.log('Error replacing midasi pattern. Text: ' + text)
        return ''
    })
}
export {
    todo,
    rubify,
    midasi,
    kutenkara,
    boutenify,
}
