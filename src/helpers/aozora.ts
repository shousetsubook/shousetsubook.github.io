import shiftJIS from "./sjis-0213-2004-std";

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
    var jiskuten = /※［＃(.*)、?(?:第(\d+?)水準)?(\d+?)-(\d+?)-(\d+?)］/g
    // logic for kutenToBytes here: https://ja.wikipedia.org/wiki/Shift_JIS-2004#%E8%A8%88%E7%AE%97%E6%96%B9%E6%B3%95
    const kutenToBytes = function(m :number, k :number, t :number) :number {
        var s1, s2 :number
        if (m == 1 && 1 <= k && k <= 62) {
            s1 = Math.floor((k + 257)/2);
        } else if (m == 1 && 63 <= k && k <= 94) {
            s1 = Math.floor((k + 385)/2);
        } else if (m == 2 && (
            k == 1 ||
            k == 3 ||
            k == 4 ||
            k == 5 ||
            k == 8 ||
            k == 12 ||
            k == 13 ||
            k == 14 ||
            k == 15 )) {
            s1 = Math.floor((k + 479)/2) - Math.floor(k/8)*3;
        } else if (m == 2 && 78 <= k && k <= 94) {
            s1 = Math.floor((k + 411)/2)
        } else {
            s1 = NaN;
        }
        if (k % 2 == 1 && 1 <= t && t <= 63) {
            s2 = t + 63;
        } else if (k % 2 == 1 && 64 <= t && t <= 94) {
            s2 = t + 64;
        } else if (k % 2 == 0) {
            s2 = t + 158;
        } else {
            s2 = NaN;
        }
        if (isNaN(s1) || isNaN(s2)) {
            console.error("Invalid kuten code")
            return 0x81A6 //※: this is Aozora's fill-in character for non JIS X 0208 kanji
        } else {
            console.debug(`s1: ${s1} s2: ${s2}`);
            console.debug(`h1: ${s1.toString(16)} h2: ${s2.toString(16)}`);
            console.debug(`${((s1 << 8) + s2).toString(16)}`)
            // assuming big endian is fine because the generated mapping also uses big endian
            return (s1 << 8) + s2;
        }
    }
    return text.replace(jiskuten, function(match, _comment, _suijun, m, k, t) {
        console.debug(`Matched ${match}`)
        console.debug(`m: ${m}, k: ${k}, t: ${t}`)
        const bytes = kutenToBytes(parseInt(m),parseInt(k),parseInt(t));
        const char = shiftJIS[bytes];
        console.debug(char)
        return char 
    })
}

const midasi = function(text :string) {
    var midasipattern = /(.+?)［＃「\1」は([大中小])見出し］/g
    return text.replace(midasipattern, function(_match, p1, p2) {
        switch(p2) {
            case "大":
                return '<h1>' + p1 + '</h1>';
            case "中":
                return '<h2>' + p1 + '</h2>';
            case "小":
                return '<h3>' + p1 + '</h3>';
        }
        console.error('Error replacing midasi pattern. Text: ' + text)
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
