var jwt = require('jsonwebtoken');
var dotenv = require('dotenv');

dotenv.load();

module.exports = {
    // Basic authorization
    verify: function(req, res, next) {
        var token = req.headers.authorization;
        if(!token) {
            return res.status(401).json({ error: 'No token provided.' });
        }
        
        var tokenParts = token.split(' ');
        if(tokenParts[0] == 'Bearer' && tokenParts[1]) {
            jwt.verify(tokenParts[1], process.env.SECRET_KEY, function(err, decoded) {
                if(err) {
                    return res.status(401).json({ error: 'Authentication failed.' });
                } else {
                    if(decoded._id) {
                        req.decoded = decoded;
                        next();
                    } else {
                        return res.status(403).json({ error: 'Unauthorized for this action.' });
                    }
                }
            });
        }
    },
    
    verifySuperAdmin: function(req, res, next) {
        var token = req.headers.authorization;
        if(!token) {
            return res.status(401).json({ error: 'No token provided.' });
        }
        
        var tokenParts = token.split(' ');
        if(tokenParts[0] == 'Bearer' && tokenParts[1]) {
            jwt.verify(tokenParts[1], process.env.SECRET_KEY, function(err, decoded) {
                if(err) {
                    return res.status(401).json({ error: 'Authentication failed.' });
                } else {
                    if(decoded.roles.includes('SuperAdmin')) {
                        req.decoded = decoded;
                        next();
                    } else {
                        return res.status(403).json({ error: 'Unauthorized for this action.' });
                    }
                }
            });
        } else {
            return res.status(401).json({ error: 'Invalid token.' });
        }
    },
    
    verifyAdmin: function(req, res, next) {
        var token = req.headers.authorization;
        if(!token) {
            return res.status(401).json({ error: 'No token provided.' });
        }
        
        var tokenParts = token.split(' ');
        if(tokenParts[0] == 'Bearer' && tokenParts[1]) {
            jwt.verify(tokenParts[1], process.env.SECRET_KEY, function(err, decoded) {
                if(err) {
                    return res.status(401).json({ error: 'Authentication failed.' });
                } else {
                    if(decoded.roles.includes('Admin')) {
                        req.decoded = decoded;
                        next();
                    } else {
                        return res.status(403).json({ error: 'Unauthorized for this action.' });
                    }
                }
            });
        } else {
            return res.status(401).json({ error: 'Invalid token.' });
        }
    },
    
    verifyAdminOrResourceOwner: function(req, res, next) {
        var token = req.headers.authorization;
        if(!token) {
            return res.status(401).json({ error: 'No token provided.' });
        }
        
        var tokenParts = token.split(' ');
        if(tokenParts[0] == 'Bearer' && tokenParts[1]) {
            jwt.verify(tokenParts[1], process.env.SECRET_KEY, function(err, decoded) {
                if(err) {
                    return res.status(401).json({ error: 'Authentication failed.' });
                } else {
                    if(req.params.userId == decoded._id || decoded.roles.includes('Admin')) {
                        req.decoded = decoded;
                        next();
                    } else {
                        return res.status(403).json({ error: 'Unauthorized for this action.' });
                    }
                }
            });
        }
    },
    
    verifyMember: function(req, res, next) {
        var token = req.headers.authorization;
        if(!token) {
            return res.status(401).json({ error: 'No token provided.' });
        }
        
        var tokenParts = token.split(' ');
        if(tokenParts[0] == 'Bearer' && tokenParts[1]) {
            jwt.verify(tokenParts[1], process.env.SECRET_KEY, function(err, decoded) {
                if(err) {
                    return res.status(401).json({ error: 'Authentication failed.' });
                } else {
                    var flag = false;
                    if(req.params.organizationId && req.params.organizationId == decoded.organizationId) {
                        flag = true;
                    } 
                    
                    if(req.params.roomId && req.params.roomId.split('_')[0] == decoded.organizationId) {
                        flag = true;
                    }
                    
                    if(req.params.deviceId && req.params.deviceId.split('_')[0] == decoded.organizationId) {
                        flag = true;
                    }
                    
                    if(flag == true) {
                        req.decoded = decoded;
                        next();
                    }  else {
                        return res.status(403).json({ error: 'Unauthorized for this action.' });
                    }
                }
            });
        } else {
            return res.status(401).json({ error: 'Invalid token.' });
        }
    },
    
    verifyResourceOwner: function(req, res, next) {
        var token = req.headers.authorization;
        if(!token) {
            return res.status(401).json({ error: 'No token provided.' });
        }
        
        var tokenParts = token.split(' ');
        if(tokenParts[0] == 'Bearer' && tokenParts[1]) {
            jwt.verify(tokenParts[1], process.env.SECRET_KEY, function(err, decoded) {
                if(err) {
                    return res.status(401).json({ error: 'Authentication failed.' });
                } else {
                    if(req.params.userId == decoded._id) {
                        req.decoded = decoded;
                        next();
                    } else {
                        return res.status(403).json({ error: 'Unauthorized for this action.' });
                    }
                }
            });
        } else {
            return res.status(401).json({ error: 'Invalid token.' });
        }
    }
}