import { combineResolvers, skip } from 'graphql-resolvers';
import { AuthenticationError } from "apollo-server-express";
import { createToken, tokenCookies, validateAccessToken, validateRefreshToken } from "./token";
import UserModel from '../model/user';

const accessTokenHeaderLabel = "access-saas";
const refreshTokenHeaderLabel = "refresh-saas";
// validate token and find user using the token from request headers for every request from client
export const validateTokensMiddleware = async (req, res, next) => {
  // console.log('validateTokensMiddleware',req)
  // console.log("reqqqq",req.cookies[accessTokenHeaderLabel])
    const accessToken = req.cookies[accessTokenHeaderLabel] ? req.cookies[accessTokenHeaderLabel] : null;
    const refreshToken = req.cookies[refreshTokenHeaderLabel] ? req.cookies[refreshTokenHeaderLabel] : null;
    // const accessToken = null;
    // const refreshToken = null;

    if (!accessToken && !refreshToken) return next();

    const decodedAccessToken = validateAccessToken(accessToken);
    if (decodedAccessToken && decodedAccessToken.data) {
        req.user = decodedAccessToken.data;
        return next();
    }

    const decodedRefreshToken = validateRefreshToken(refreshToken);

    if (decodedRefreshToken && decodedRefreshToken.data) {
        // valid refresh token
        const db_base = await global.connection.useDb("base");
        const collection_user = await db_base.model("User",UserModel.schema,'user');
        let authResult = await collection_user.authenticate({_id: decodedRefreshToken._id, username,password});
        let user = null;
        if (authResult.success && authResult.data) {
            user = userFoundRespond.data;
        }
        // valid user and user token not invalidated
        if (!user || user.tokenCount !== decodedRefreshToken.data.tokenCount)
        return next();
        req.user = decodedRefreshToken.data;
        // refresh the tokens
        const userTokens = createToken(user);
        const cookies = tokenCookies(userTokens);

        context.res.cookie(...cookies.access);
        context.res.cookie(...cookies.refresh);

        // let newRes = {}
        // newRes["Access-Control-Expose-Headers"] = accessTokenHeaderLabel + "," + refreshTokenHeaderLabel;
        // newRes[accessTokenHeaderLabel] = userTokens.accessToken;
        // newRes[refreshTokenHeaderLabel] = userTokens.refreshToken;

        res.set(newRes);
        return next();
    }
    next();
}

// check logged in or not
export const isAuthenticated = async (_, args={}, { req }) => {
    return req.user ? skip : new AuthenticationError('Not authenticated as user.');
}
  
// check if the logged in user is admin
export const isAdmin = combineResolvers(
    isAuthenticated,
    (_, args={}, { req }) => {
        let userObj = req.user;
        return userObj.role == 'ADMIN'
            ? skip
            : new AuthenticationError('Not authorized as admin.')
    }
);