const axios = require('axios').default;
var CryptoJS = require("crypto-js");


const ENCRYPTION_KEYS_URL =
    'https://raw.githubusercontent.com/justfoolingaround/animdl-provider-benchmarks/master/api/gogoanime.json';

let iv = '3134003223491201';
let key = '37911490979715163134003223491201';
let second_key = '54674138327930866480207815084989';

const fetch_keys = async() => {
    const response = await axios.get(ENCRYPTION_KEYS_URL);
    const res = response.data;
    return {
        iv: CryptoJS.enc.Utf8.parse(res.iv),
        key: CryptoJS.enc.Utf8.parse(res.key),
        second_key: CryptoJS.enc.Utf8.parse(res.second_key),
    };
};

/**
 * Parses the embedded video URL to encrypt-ajax.php parameters
 * @param {cheerio} $ Cheerio object of the embedded video page
 * @param {string} id Id of the embedded video URL
 */
async function generateEncryptAjaxParameters($, id) {
    const keys = await fetch_keys();
    iv = keys.iv;
    key = keys.key;
    second_key = keys.second_key;

    // encrypt the key
    const encrypted_key = CryptoJS.AES['encrypt'](id, key, {
        iv: iv,
    });

    const script = $("script[data-name='episode']").data().value;
    const token = CryptoJS.AES['decrypt'](script, key, {
        iv: iv,
    }).toString(CryptoJS.enc.Utf8);

    return 'id=' + encrypted_key + '&alias=' + id + '&' + token;
}
/**
 * Decrypts the encrypted-ajax.php response
 * @param {object} obj Response from the server
 */
function decryptEncryptAjaxResponse(obj) {

    key = CryptoJS.enc.Utf8.parse('93422192433952489752342908585752')
    iv= CryptoJS.enc.Utf8.parse('9262859232435825')
    const decrypted = CryptoJS.AES.decrypt(obj.data, key, {
        iv: iv,
    }).toString(CryptoJS.enc.Utf8);
    console.log(decrypted);
    return 1;
}

(async () => {
    const download = require("node-hls-downloader").download;

    await download({
        quality: "best",
        concurrency: 5,
        outputFile: "video.mp4",
        streamUrl: "https://hlsx03.dracache.com/newvideos/newhls/vW6tTGQWO1j1tSXNAHAASg/1659034230/338642_203.210.131.51/f1a22734e09a28f8494a6055e1d48ea9/ep.18.v0.1659024164.m3u8",
    });
})();