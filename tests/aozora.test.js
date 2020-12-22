const kutenkara = require('../src/helpers/aozora').kutenkara

test('kutenkara', () => {
  expect(kutenkara('※［＃「言＋墟のつくり」、第4水準2-88-74］')).toBe('譃');
  expect(kutenkara('※［＃「飮のへん＋稻のつくり」、第4水準2-92-68］')).toBe('饀');
  expect(kutenkara('※［＃「足へん＋厨」、第3水準1-92-39］')).toBe('蹰');
  expect(kutenkara('※［＃「陷のつくり＋炎」、第3水準1-87-64］')).toBe('燄');
  expect(kutenkara('※［＃小書き片仮名ヒ、1-6-84］')).toBe('ㇶ');
});