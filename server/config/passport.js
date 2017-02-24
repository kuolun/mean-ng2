// 載入需要的module
var FacebookStrategy = require('passport-facebook').Strategy;

//載入User model
var User = require('../app/models/user');

//載入auth variables
var configAuth = require('./auth');

module.exports = function(passport) {


    // =========================================================================
    // passport session 設定 ==================================================
    // =========================================================================
    // required for persistent login sessions (持續性login session)
    // passport needs ability to serialize and unserialize users out of session

    // 用來serialize user.id給session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // FacebookStrategy ========================================================
    // =========================================================================
    passport.use(
        new FacebookStrategy({
                // 從auth.js抓app id跟 app secret
                clientID: configAuth.facebookAuth.clientID,
                clientSecret: configAuth.facebookAuth.clientSecret,
                callbackURL: configAuth.facebookAuth.callbackURL,
                profileFields: ['id', 'emails', 'displayName']
            },
            // facebook will send back the token and profile
            // refreshToken是token快expire時，用來refresh access並拿到新的token
            function(token, refreshToken, profile, done) {
                // find the user in the database based on their facebook id
                User.findOne({
                    'facebook': profile.id
                }, function(err, user) {
                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err) {
                        console.log('DB error');
                        return done(err);
                    }
                    // if the user is found, then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        // 如果facebook id找不到user, 就建立一個新的user
                        var newUser = new User();
                        console.log(profile);
                        //profile是FB回傳的資訊
                        // set all of the facebook information in our user model
                        // set the users facebook id
                        newUser.facebook = profile.id;
                        newUser.token = token;
                        // look at the passport user profile to see how names are returned         
                        newUser.profile.username = profile.displayName;
                        // facebook會回傳多個email
                        newUser.email = profile.emails[0].value;
                        newUser.profile.picture = 'https://graph.facebook.com/' + profile.id + '/picture?width=10';
                        // save our user to the database
                        newUser.save(function(err) {
                            if (err) {
                                console.log('save error');
                                throw err;
                            }
                            // if successful, return the new user
                            return done(null, newUser);
                        });
                    }
                });
            })
    );


};