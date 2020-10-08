const { encodeUTF8, decodeUTF8, encodeUTF16, encodeUTF32, stringToBytes, Format } = require('./unicode')

test('encode UTF-8', () => {
  expect(encodeUTF8('$')).toEqual(Uint8Array.from([36])) // 1 byte
  expect(encodeUTF8('¢')).toEqual(Uint8Array.from([194, 162])) // 2 bytes
  expect(encodeUTF8('ह')).toEqual(Uint8Array.from([224, 164, 185])) // 3 bytes
  expect(encodeUTF8('한')).toEqual(Uint8Array.from([0xed, 0x95, 0x9c]))
  expect(encodeUTF8('𐍈')).toEqual(Uint8Array.from([240, 144, 141, 136])) // 4 bytes
  expect(encodeUTF8('😩')).toEqual(Uint8Array.from([0xf0, 0x9f, 0x98, 0xa9]))
})

test('decode UTF-8', () => {
  expect(decodeUTF8([36])).toEqual('$')
  expect(decodeUTF8([194, 162])).toEqual('¢')
  expect(decodeUTF8([224, 164, 185])).toEqual('ह')
  expect(decodeUTF8([240, 144, 141, 136])).toEqual('𐍈')
  expect(decodeUTF8([0xf0, 0x9f, 0x98, 0xa9])).toEqual('😩')
  expect(decodeUTF8([72, 101, 108, 108, 111, 32, 109, 121, 32, 110, 97, 109, 101, 32, 105, 115, 32, 102, 114, 101, 100, 46, 32, 240, 159, 152, 169, 240, 159, 152, 142, 32, 194, 162, 194, 162, 194, 162, 224, 164, 185])).toEqual('Hello my name is fred. 😩😎 ¢¢¢ह')
})

test('encode UTF-16', () => {
  expect(encodeUTF16('$')).toEqual(Uint16Array.from([0x0024]))
  expect(encodeUTF16('€')).toEqual(Uint16Array.from([0x20ac]))
  expect(encodeUTF16('𐐷')).toEqual(Uint16Array.from([0xd801, 0xdc37]))
  expect(encodeUTF16('𤭢')).toEqual(Uint16Array.from([0xd852, 0xdf62]))
  expect(encodeUTF16('😩')).toEqual(Uint16Array.from([0xd83d, 0xde29]))
})

test('encode UTF-32', () => {
  expect(encodeUTF32('%')).toEqual(Uint32Array.from([0x0025]))
  expect(encodeUTF32('Ÿ')).toEqual(Uint32Array.from([0x0178]))
  expect(encodeUTF32('߷')).toEqual(Uint32Array.from([0x07f7]))
  expect(encodeUTF32('😩')).toEqual(Uint32Array.from([0x1f629]))
})

test('using stringToBytes', () => {
  expect(stringToBytes('$')).toEqual(Uint8Array.from([36]))
  expect(stringToBytes('$', Format.UTF16)).toEqual(Uint16Array.from([0x0024]))
  expect(stringToBytes('%', Format.UTF32)).toEqual(Uint32Array.from([0x0025]))
})

test('testing size', () => {
  const str = 'Hello this is just a simple message to check the size of each encoding. 🍞'
  const b1 = encodeUTF8(str)
  const b2 = encodeUTF16(str)
  const b3 = encodeUTF32(str)
  console.log(`Encoding: ${str}`)
  console.log(`UTF8: ${b1.byteLength} bytes; UTF16: ${b2.byteLength} bytes; UTF32: ${b3.byteLength} bytes`)
})