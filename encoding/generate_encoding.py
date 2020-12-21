import csv
import unicodedata
""" based on http://x0213.org/codetable/sjis-0213-2004-std.txt
Creates a TS dict of [jis byte sequence] -> unicode string
Ignores ASCII characters. Can probably ignore more characters but we're being generous
"""

basename = "sjis-0213-2004-std"
output = """// jis x 0213 to unicode. This file is auto generated
const shiftJIS: {[index:number]: string} = {
"""
with open(f"encoding/{basename}.txt") as f:
    csv_reader = csv.reader((i for i in f if i[0] != '#'), delimiter='\t')
    line_count = 0
    for row in csv_reader:
        jis_hex = row[0]
        unicode = row[1]
        chars = unicode.split("+")
        if len(chars) == 1:
            continue
        elif len(chars) == 2:
            unicode_char = chr(int(chars[1],16))
        elif len(chars) == 3:
            unicode_char = chr(int(chars[1],16)) + chr(int(chars[2],16))
        if line_count % 5 == 4:
            output += "\n"
        if len(unicode_char) <= 1 and unicodedata.category(unicode_char) == 'Cc':
            continue
        if unicode_char.isascii():
            continue
        output += f"{jis_hex}:'{unicode_char}',"
        line_count += 1

output += """
};
export default shiftJIS;
"""

with open(f"src/helpers/{basename}.ts", "w+", encoding="utf-8") as f:
    f.write(output)


