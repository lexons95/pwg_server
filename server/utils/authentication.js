import { combineResolvers, skip } from 'graphql-resolvers';
import { AuthenticationError } from "apollo-server-express";
import { createToken, tokenCookies, validateAccessToken, validateRefreshToken } from "./token";
import UserModel from '../model/user';

const accessTokenHeaderLabel = "access-saas";
const refreshTokenHeaderLabel = "refresh-saas";
// validate token and find user using the token from request headers for every request from client
export const validateTokensMiddleware = async (req, res, next) => {

    const accessToken = req.cookies[accessTokenHeaderLabel];
    const refreshToken = req.cookies[refreshTokenHeaderLabel];

    if (!accessToken && !refreshToken) return next();

    const decodedAccessToken = validateAccessToken(accessToken);
    if (decodedAccessToken && decodedAccessToken.data) {
        req.user = decodedAccessToken.data;
        return next();
    }

    const decodedRefreshToken = validateRefreshToken(refreshToken);

    if (!refreshToken) {
        return next();
    }

    if (!decodedRefreshToken || !decodedRefreshToken.data) {
        return next();
    }

    const db_base = await global.connection.useDb("base");
    const collection_user = await db_base.model("User",UserModel.schema,'user');
    let authResult = await collection_user.findOneUser({_id: decodedRefreshToken._id});

    let user = null;
    if (authResult.success && authResult.data) {
        user = userFoundRespond.data;
    }
    
    // valid user and user token not invalidated
    if (!user || user.tokenCount !== decodedRefreshToken.data.tokenCount)
    return next();
    // refresh the tokens
    const userTokens = createToken(user);
    const cookies = tokenCookies(userTokens);

    context.res.cookie(...cookies.access);
    context.res.cookie(...cookies.refresh);
    req.user = decodedRefreshToken.data;

    next();
}

// // check logged in or not
// export const isAuthenticated = async (_, args={}, { req }) => {
//     return req.user ? skip : new AuthenticationError('Not authenticated as user.');
// }
  
// // check if the logged in user is admin
// export const isAdmin = combineResolvers(
//     isAuthenticated,
//     (_, args={}, { req }) => {
//         let userObj = req.user;
//         return userObj.role == 'ADMIN'
//             ? skip
//             : new AuthenticationError('Not authorized as admin.')
//     }
// );

export const requiresRole = roles => resolver => {
    return (parent, args, context, info) => {
        if (context.req.user && (!roles || roles.indexOf(context.req.user.role) >= 0)) {
            return resolver(parent, args, context, info)
        } else {
            // return {
            //     success: false,
            //     message: "Unauthorized",
            //     data: {}
            // }
            throw new AuthenticationError('Unauthorized')
        }
    }
}

export const tenantOnly = requiresRole(['TENANT'])
export const editorOnly = requiresRole(['TENANT', 'ADMIN'])

//   const membersOnly = requiresRole('MEMBER')
//   const adminsOnly = requiresRole('ADMIN')
//   const requiresLogin = requiresRole(null)