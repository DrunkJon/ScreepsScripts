
var word_array = ['hello', 'World', 'abc', 'foo', 'fool', 'fuck']

function prio(txt){
    return txt.length * (txt[0] === 'f')? 1000 : 1
}