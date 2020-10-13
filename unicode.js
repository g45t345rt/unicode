// Understanding unicode encoding

// Unicode is a standard and consistent encoding representing text expressed in most of the writing system available.
// More than 143000 characters covering modern and historic scripts as well as multiple symbol sets like emoji.
// Unicode can be implemented by multiple character encoding. The standard are UTF-8, UTF-16, UTF-32.
// Most common used encodings are UTF-8 & UTF-16 as well as UCS02 (precusor of UTF-16 without all unicode).
// UTF-8 is dominant and uses 1-byte for the first 128 code points (ASCII) and up to 4-bytes for other characters.
// UTF-16 uses 1-2 bytes per code points and cannot encode surrogates
// UTF-32 uses 4-bytes to encode any given codepoint and therefor takes significantly more space than other encodings.

const Format = {
  UTF8: 'utf8',
  UTF16: 'utf16',
  UTF32: 'utf32'
}

function stringToBytes (str, format = Format.UTF8) {
  if (format === Format.UTF32) return encodeUTF32(str)
  if (format === Format.UTF16) return encodeUTF16(str)
  return encodeUTF8(str)
}

function bytesToString (bytes, format = Format.UTF8) {
  if (format === Format.UTF32) return decodeUTF32(bytes)
  if (format === Format.UTF16) return decodeUTF16(bytes)
  return decodeUTF8(bytes)
}

// UTF-8
// encode code points in one to four bytes depending on the number of significant bits of the code point

function encodeUTF8 (str) {
  const bytes = []
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i) // return UTF-16 unicode

    // 1 byte unicode
    if (charCode < 0x0080) {
      bytes.push(charCode)
    } else if (charCode < 0x0800) {
      bytes.push(
        194 | (charCode >> 6),
        128 | (charCode & 63)
      )
    } else if (charCode < 0xD800 || charCode > 0xdfff) {
      // 3 bytes unicode
      bytes.push(
        224 | (charCode >> 12),
        128 | ((charCode >> 6) & 63),
        128 | (charCode & 63)
      )
    } else {
      // Supplementary planes as two 16-bit code units
      // 4 bytes unicode

      i++
      const nextCharCode = str.charCodeAt(i)
      const w1 = charCode - 0xD800
      const w2 = nextCharCode - 0xDC00
      const u = (w1 << 10) | w2
      const unicode = u + 0x10000

      bytes.push(
        240 | (unicode >> 18),
        128 | ((unicode >> 12) & 63),
        128 | ((unicode >> 6) & 63),
        128 | (unicode & 63)
      )
    }
  }

  return Uint8Array.from(bytes)
}

function decodeUTF8 (bytes) {
  let str = ''
  for (let i = 0; i < bytes.length; i++) {
    const v = bytes[i]
    if (v >> 7 === 0) {
      str += String.fromCodePoint(v)
    } else if (v >> 5 === 6) {
      const v1 = v & 31
      const v2 = bytes[++i] & 63
      str += String.fromCodePoint(v1 << 6 | v2)
    } else if (v >> 4 === 14) {
      const v1 = v & 15
      const v2 = bytes[++i] & 63
      const v3 = bytes[++i] & 63
      str += String.fromCodePoint((v1 << 6 | v2) << 6 | v3)
    } else {
      const v1 = v & 7
      const v2 = bytes[++i] & 63
      const v3 = bytes[++i] & 63
      const v4 = bytes[++i] & 63
      str += String.fromCodePoint((((v1 << 6) | v2) << 6 | v3) << 6 | v4)
    }
  }
  return str
}

// UTF-16
// encoding of variable length as code points are one or two 16-bit code units
// 

function encodeUTF16 (str) {
  const arr = new Uint16Array(str.length)
  for (let i = 0; i < str.length; i++) {
    arr[i] = str.charCodeAt(i)
  }
  return arr
}

function decodeUTF16 (bytes) {
  // fromCharCode returns a string from specified sequence of UTF-16
  let str = ''
  for (let i = 0; i < bytes.length; i++) {
    str += String.fromCharCode(bytes[i])
  }
  return str
}

// UTF-32
// fixed length encoding that is exactly 4-bytes per code point
// leading bits must be zero as there are fewer unicode points
// each 32-bit value represents one code point and is exactly that code point's numerical value - they are directly indexed
// code points are directly indexed but it is space inefficient using 4-bytes per code point including 11 bits that are zeros
// twice the size of UTF-16 and four times the size of UTF-8

// 00000000 00000000 00000000 00000000

// string length counts code units instead of characters in UTF-16
function characterLength (str) {
  return [...str].length
}

function encodeUTF32 (str) {
  const strLength = characterLength(str)
  const arr = new Uint32Array(strLength)
  for (let i = 0; i < strLength; i++) {
    arr[i] = str.codePointAt(i)
  }
  return arr
}

function decodeUTF32 (bytes) {
  // fromCodePoint returns a string from specified sequence
  let str = ''
  for (let i = 0; i < bytes.length; i++) {
    str += String.fromCodePoint(bytes[i])
  }
  return str
}

module.exports = {
  Format,
  stringToBytes,
  bytesToString,
  encodeUTF32,
  decodeUTF32,
  encodeUTF16,
  decodeUTF16,
  encodeUTF8,
  decodeUTF8
}