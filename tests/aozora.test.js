const kutenkara = require('../src/helpers/aozora').kutenkara
const accentify = require('../src/helpers/aozora').accentify

test('kutenkara', () => {
  expect(kutenkara('※［＃「言＋墟のつくり」、第4水準2-88-74］')).toBe('譃');
  expect(kutenkara('※［＃「飮のへん＋稻のつくり」、第4水準2-92-68］')).toBe('饀');
  expect(kutenkara('※［＃「足へん＋厨」、第3水準1-92-39］')).toBe('蹰');
  expect(kutenkara('※［＃「陷のつくり＋炎」、第3水準1-87-64］')).toBe('燄');
  expect(kutenkara('※［＃小書き片仮名ヒ、1-6-84］')).toBe('ㇶ');
});
test('accentify', () => {
  expect(accentify('〔AE&ae&s&OEo&oe&〕')).toBe('ÆæßOEo̊œ');
  expect(accentify('〔AE&ae&s&OEo&oe&〕')).toBe('ÆæßOEo̊œ');
  expect(accentify('〔a\'〕')).toBe('á');
  expect(accentify('〔a^〕')).toBe('â');
  expect(accentify('〔a~〕')).toBe('ã');
  expect(accentify('〔a:〕')).toBe('ä');
  expect(accentify('〔a&〕')).toBe('å');
  expect(accentify('〔a_〕')).toBe('ā');
  expect(accentify('〔c,〕')).toBe('ç');
  expect(accentify('〔c\'〕')).toBe('ć');
  expect(accentify('〔c^〕')).toBe('ĉ');
  expect(accentify('〔d/〕')).toBe('đ');
  expect(accentify('〔e`〕')).toBe('è');
  expect(accentify('〔e\'〕')).toBe('é');
  expect(accentify('〔e^〕')).toBe('ê');
  expect(accentify('〔e:〕')).toBe('ë');
  expect(accentify('〔e_〕')).toBe('ē');
  expect(accentify('〔e~〕')).toBe('ẽ');
  expect(accentify('〔g^〕')).toBe('ĝ');
  expect(accentify('〔h^〕')).toBe('ĥ');
  expect(accentify('〔h/〕')).toBe('ħ');
  expect(accentify('〔i`〕')).toBe('ì');
  expect(accentify('〔i\'〕')).toBe('í');
  expect(accentify('〔i^〕')).toBe('î');
  expect(accentify('〔i:〕')).toBe('ï');
  expect(accentify('〔i_〕')).toBe('ī');
  expect(accentify('〔i/〕')).toBe('ɨ');
  expect(accentify('〔i~〕')).toBe('ĩ');
  expect(accentify('〔j^〕')).toBe('ĵ');
  expect(accentify('〔l/〕')).toBe('ł');
  expect(accentify('〔l\'〕')).toBe('ĺ');
  expect(accentify('〔m\'〕')).toBe('ḿ');
  expect(accentify('〔n`〕')).toBe('ǹ');
  expect(accentify('〔n~〕')).toBe('ñ');
  expect(accentify('〔n\'〕')).toBe('ń');
  expect(accentify('〔o`〕')).toBe('ò');
  expect(accentify('〔o\'〕')).toBe('ó');
  expect(accentify('〔o^〕')).toBe('ô');
  expect(accentify('〔o~〕')).toBe('õ');
  expect(accentify('〔o:〕')).toBe('ö');
  expect(accentify('〔o/〕')).toBe('ø');
  expect(accentify('〔o_〕')).toBe('ō');
  expect(accentify('〔r\'〕')).toBe('ŕ');
  expect(accentify('〔s\'〕')).toBe('ś');
  expect(accentify('〔s,〕')).toBe('ş');
  expect(accentify('〔s^〕')).toBe('ŝ');
  expect(accentify('〔t,〕')).toBe('ţ');
  expect(accentify('〔u`〕')).toBe('ù');
  expect(accentify('〔u\'〕')).toBe('ú');
  expect(accentify('〔u^〕')).toBe('û');
  expect(accentify('〔u:〕')).toBe('ü');
  expect(accentify('〔u_〕')).toBe('ū');
  expect(accentify('〔u&〕')).toBe('ů');
  expect(accentify('〔u~〕')).toBe('ũ');
  expect(accentify('〔y\'〕')).toBe('ý');
  expect(accentify('〔y:〕')).toBe('ÿ');
  expect(accentify('〔z\'〕')).toBe('ź');
  expect(accentify('〔A`〕')).toBe('À');
  expect(accentify('〔A\'〕')).toBe('Á');
  expect(accentify('〔A^〕')).toBe('Â');
  expect(accentify('〔A~〕')).toBe('Ã');
  expect(accentify('〔A:〕')).toBe('Ä');
  expect(accentify('〔A&〕')).toBe('Å');
  expect(accentify('〔A_〕')).toBe('Ā');
  expect(accentify('〔C,〕')).toBe('Ç');
  expect(accentify('〔C\'〕')).toBe('Ć');
  expect(accentify('〔C^〕')).toBe('Ĉ');
  expect(accentify('〔D/〕')).toBe('Đ');
  expect(accentify('〔E`〕')).toBe('È');
  expect(accentify('〔E\'〕')).toBe('É');
  expect(accentify('〔E^〕')).toBe('Ê');
  expect(accentify('〔E:〕')).toBe('Ë');
  expect(accentify('〔E_〕')).toBe('Ē');
  expect(accentify('〔E~〕')).toBe('Ẽ');
  expect(accentify('〔G^〕')).toBe('Ĝ');
  expect(accentify('〔H^〕')).toBe('Ĥ');
  expect(accentify('〔I`〕')).toBe('Ì');
  expect(accentify('〔I\'〕')).toBe('Í');
  expect(accentify('〔I^〕')).toBe('Î');
  expect(accentify('〔I:〕')).toBe('Ï');
  expect(accentify('〔I_〕')).toBe('Ī');
  expect(accentify('〔I~〕')).toBe('Ĩ');
  expect(accentify('〔J^〕')).toBe('Ĵ');
  expect(accentify('〔L/〕')).toBe('Ł');
  expect(accentify('〔L\'〕')).toBe('Ĺ');
  expect(accentify('〔M\'〕')).toBe('Ḿ');
  expect(accentify('〔N`〕')).toBe('Ǹ');
  expect(accentify('〔N~〕')).toBe('Ñ');
  expect(accentify('〔N\'〕')).toBe('Ń');
  expect(accentify('〔O`〕')).toBe('Ò');
  expect(accentify('〔O\'〕')).toBe('Ó');
  expect(accentify('〔O^〕')).toBe('Ô');
  expect(accentify('〔O~〕')).toBe('Õ');
  expect(accentify('〔O:〕')).toBe('Ö');
  expect(accentify('〔O/〕')).toBe('Ø');
  expect(accentify('〔O_〕')).toBe('Ō');
  expect(accentify('〔R\'〕')).toBe('Ŕ');
  expect(accentify('〔S\'〕')).toBe('Ś');
  expect(accentify('〔S,〕')).toBe('Ş');
  expect(accentify('〔S^〕')).toBe('Ŝ');
  expect(accentify('〔T,〕')).toBe('Ţ');
  expect(accentify('〔U`〕')).toBe('Ù');
  expect(accentify('〔U\'〕')).toBe('Ú');
  expect(accentify('〔U^〕')).toBe('Û');
  expect(accentify('〔U:〕')).toBe('Ü');
  expect(accentify('〔U_〕')).toBe('Ū');
  expect(accentify('〔U&〕')).toBe('Ů');
  expect(accentify('〔U~〕')).toBe('Ũ');
  expect(accentify('〔Y\'〕')).toBe('Ý');
  expect(accentify('〔Z\'〕')).toBe('Ź');
  expect(accentify('〔Z\'〕')).toBe('Ź');
});
