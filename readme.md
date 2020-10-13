###UTF Encodings

Encoding/decoding UTF16 and UTF32 is trivial in javascript because
charCodeAt return already a UTF16 unit point.
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt

UTF-8 is a variable width encoding and uses 1 to 4 bytes to encode code points therefor is more complicated but use less space
___

#### ENCODE
Let's seperate the logic in for 4 steps. One step for each byte sequence.
  ![byte_sequence](https://github.com/g45t345rt/unicode/blob/master/utf8_byte_sequence.jpg?raw=true)

#####STEP 1 - From 0 to 127 unit points

Since the value can be store in 1 byte we don't encode anything and return it

#####STEP 2 - From 128 to 2048 unit points

We want to seperate the value to return 2 bytes and we use bitwize operators to do that (>>, &, |, <<).

`>> -> shift the bits to the right`  
`| -> compare each bit and return 1 if one or both is 1`  
`& -> compare  each bit and return 1 if both are 1`  

Let's use 756 unit points as an example for every folowing steps

`756 = 1011110100 in binary`  

From the byte sequence table we can store 5 bits in the first byte and 6 bits in the second byte

The first byte must start with 110 and the second with 10 (for decoding)

###### 1 byte

Shift right 6 bits  
`1011`110100  
Use OR with 110 to merge both bits  
`11001011`  

###### 2 byte
Use AND to get first 6 bits  
1011`110100`  
Use OR with 10 to merge both bits  
`10110100`  

Include both bytes in the array  
`[11001011, 10110100]`  
`[203, 180] in decimal`  


TODO other steps but I'm not very good at explaining. Anyway for the other steps you just have to follow the same logic above and for decoding you have to check if the first bits match the specific pattern and use the reverse logic to get the unit point of the character.
