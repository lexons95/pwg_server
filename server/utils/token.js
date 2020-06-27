import { sign, verify } from "jsonwebtoken";
const dotenv = require('dotenv');
dotenv.config();

const access_token_key = process.env.ACCESS_TOKEN_KEY;
const refresh_token_key = process.env.REFRESH_TOKEN_KEY;

export const createToken = async (obj, expiresIn=null) => {
    const sevenDays = 60 * 60 * 24 * 7 * 1000;
    const mins_30 = 60 * 30 * 1000;

    const accessDuration = 60 * 30 * 1000; // 30 min
    const refreshDuration = 60 * 60 * 24 * 3 * 1000; // 3 days

    let expiresInResult = expiresIn ? expiresIn : accessDuration;

    const accessToken = await sign(
        { data: obj },
        access_token_key,
        { expiresIn: expiresInResult }
    )
    const refreshToken = await sign(
        { data: obj },
        refresh_token_key,
        { expiresIn: refreshDuration }
    )
    return { accessToken, refreshToken };
}

export const tokenCookies = ({ accessToken, refreshToken }) => {
    const cookieOptions = {
        httpOnly: true,
        // secure: true, //for HTTPS only
        // domain: "your-website.com",
        promo_shown: 1,
        SameSite: 'Strict'
    };
    return {
        access: ["access-saas", accessToken, cookieOptions],
        refresh: ["refresh-saas", refreshToken, cookieOptions]
    };
}

export const validateAccessToken = (token) => {
    try {
        return verify(token, access_token_key);
    } catch (e) {
        return null;
    }
}

export const validateRefreshToken = (token) => {
    try {
        return verify(token, refresh_token_key);
    } catch (e) {
        return null;
    }
}

/*
when signUp/signIn create token in server
then pass to client to save in local storage

only do storing the token in clinet side
and always pass token into headers

server always check headers
if not found mean not logged in
depends on what mutation called, create token for login or continue function that doesnt require auth

if found then continue function

server to client after signIn/signUp (passed as obj with {accessToken,refreshToken})
client to server (passed in headers as x-a-token, x-r-token)

*/