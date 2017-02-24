// expose our config directly to our application using module.exports
module.exports = {

     'facebookAuth': {
        // your App ID
        'clientID': '',
        // your App Secret
        'clientSecret': '',
        'callbackURL': 'http://localhost:3000/auth/facebook/callback'
    },
    // 作業
    'googleAuth': {
        'clientID': 'your-secret-clientID-here',
        'clientSecret': 'your-client-secret-here',
        'callbackURL': 'http://localhost:3000/auth/google/callback'
    }

};