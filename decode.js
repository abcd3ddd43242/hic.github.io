const axios = require('axios').default;

const nineAnimeKey = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
const cipherKey = "rTKp3auwu0ULA6II"

const encrypt = (input, key) => {
	let output = '';
	const lengInput = input.length;
	for (i = 0; i < lengInput; i += 3) {
		a = [...Array(4)].map(() => {
			return -1;
		});
		a[0] = input[i].charCodeAt() >> 2
		a[1] = (3 & input[i].charCodeAt()) << 4
		if (lengInput > i + 1) {
			a[1] = a[1] | (input[i + 1].charCodeAt() >> 4)
			a[2] = (15 & input[i + 1].charCodeAt()) << 2
		}
		if (lengInput > i + 2) {
			a[2] = a[2] | (input[i + 2].charCodeAt() >> 6)
			a[3] = 63 & input[i + 2].charCodeAt()
		}
		a.forEach(n => {
			if (n == -1) {
				output += '='
			} else if (n >= 0 && n <= 63) {
				output += key[n]
			}
		});
	}
	return output
}
const cipher = (key, text) => {
	let arr = [...Array(256).keys()];
	let output = ""
	let u = 0
	let r = 0
	arr2 = [...Array(arr.length).keys()];
	arr2.forEach(a => {
		u = (u + arr[a] + key[a % key.length].charCodeAt()) % 256
		r = arr[a]
		arr[a] = arr[u]
		arr[u] = r
	})
	u = 0
	let c = 0
	let arr3 = [...Array(text.length).keys()];
	console.log(arr3);
	arr3.forEach(f => {
		c = (c + 1) % 256
		u = (u + arr[c]) % 256
		r = arr[c]
		arr[c] = arr[u]
		arr[u] = r
		output += String.fromCharCode(text[f].charCodeAt() ^ arr[(arr[c] + arr[u]) % 256])
	})

	return output;
}
const decrypt =(input, key) => {
	t = input
	a = input.replace(/[\t\n\f\r]/g, "");
	if (a.length % 4 == 0) {
		t = a.replace(/==?$/, "");
		if (t.length % 4 == 1 || /[^+\/0-9A-Za-z]/.test(t)) {
			return null;
		}
	}

	let i = 0;
	let r = ""
	let e = 0
	let u = 0
	t.split("").forEach(o => {
		e = e <<= 6;
		i = key.indexOf(o);
		e |= i < 0 ? e : i;
		u += 6
		if (24 == u) {
			r += String.fromCharCode((16711680 & e) >> 16);
			r += String.fromCharCode((65280 & e) >> 8);
			r += String.fromCharCode((255 & e));
			e = 0
			u = 0
		}
	})
	if (12 == u) {
		e = e >> 4
		return r + String.fromCharCode(e)
	} else {
		if (18 == u) {
			e = e >> 2
			r += String.fromCharCode((65280 & e) >> 8);
			r += String.fromCharCode(((255) & e));
		}
		return r
	}
}
function encode(input) {
	return encodeURIComponent(input)
}
function decode(input) {
	return decodeURIComponent(input)
}
const encodeVrf = (text) => {
	let xxx = cipher(cipherKey, encode(text));
	console.log(xxx);
	return encode(encrypt(cipher(cipherKey, encode(text)), nineAnimeKey).replace(/=+$/, ""))
}
const decodeVrf =(text) => {
	return decode(cipher(cipherKey, decrypt(text, nineAnimeKey)))
}
const getVrf =(id, key) => {
	let reversed = encrypt(encode(id) + "0000000", key).slice(0, 6)
	reversed = [...reversed].reverse().join("");
	
	return reversed + encrypt(cipher(reversed, encode(id)), key).replace(/=+$/, "");
}
function getLink(url) {
	let i = url.slice(0, 6)
	let n = url.slice(6, url.lastIndex)
	const dec = decrypt(n, nineAnimeKey);
	return decode(cipher(i, dec))
}

const encodeVrfId = encodeVrf('13352');
const encodeVrfVidoeServer = encodeVrf('1045556');
const decodeVrfVideo = decodeVrf('FMUz9F8p\/Wzc1Ku1cyUmQbsgTn+H\/Iu7CzFEE0Q2eLqq34\/WO9fWnv4U\/+H27w');

// const jsonObj = JSON.parse(`{"url":"eeJma3HMcJ+D2dY3USgJdPwvwIrvqJnIiEll+bA460zc\/kABpTWrSHjSLE0Xb8Xxw7"}`);
// const decrypted = getLink(jsonObj.url);
 console.log(encodeVrfId);
 console.log(encodeVrfVidoeServer);
 console.log(decodeVrfVideo);

module.exports = {
    encode,
    encrypt,
    decrypt,
	getVrf,
	nineAnimeKey
}