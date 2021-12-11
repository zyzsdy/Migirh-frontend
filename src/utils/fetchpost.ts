import hmacSha1 from 'crypto-js/hmac-sha1';
import encBase64 from 'crypto-js/enc-base64';
import { GlobalState } from '../Contexts/globalStore';

function hmacSha1Encode(text: string, pass: string) {
    let encrypted = hmacSha1(text, pass);
    let res = encBase64.stringify(encrypted);
    return res;
}

export function fetchPost(globalState: GlobalState, endpoint: string, data: object) {
    let dataBody = JSON.stringify(data);
    let url = `${globalState?.apiRoot ?? ""}/${endpoint}`;

    return fetch(url, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: dataBody
    });
}

export function fetchPostWithSign(globalState: GlobalState, endpoint: string, data: object) {
    let dataBody = JSON.stringify(data);
    let ts = Date.now();
    let unsignedString = `${dataBody}&ts=${ts}`;
    let sk = globalState?.loginUser?.sk ?? "";
    let sign = hmacSha1Encode(unsignedString, sk);
    let url = `${globalState?.apiRoot ?? ""}/${endpoint}`;

    return fetch(url, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "user-token": globalState?.loginUser?.token ?? "",
            "x-auth-token": `Migirh-Auth ${ts} ${sign}`
        },
        body: dataBody
    });
}