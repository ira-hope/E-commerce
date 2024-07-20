const expressJwt = require('express-jwt');

function authJwt(api) {
    const secret = process.env.secret;
    
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            { url: /\/api\/v1\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
            `${api}/users/login`,
            `${api}/users/register`
        ]
    });
}

async function isRevoked(req, payload, done) {
    if (!payload.isAdmin) {
        return done(null, true); // Revoking access if not admin
    }
    done(); // Allow access if admin
}

module.exports = authJwt;
