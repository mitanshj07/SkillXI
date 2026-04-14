import codecs
with codecs.open('assets/js/main.js', 'r', 'utf-8') as f:
    text = f.read()

# Fix literal backslashes escaping backticks and dollars and quotes
text = text.replace('\\`', '`')
text = text.replace('\\${', '${')
text = text.replace('\\"', '"')

with codecs.open('assets/js/main.js', 'w', 'utf-8') as f:
    f.write(text)
print("File fixed.")
