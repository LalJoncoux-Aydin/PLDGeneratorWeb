const passport = require('passport');
const GitLabStrategy = require('passport-github2');

passport.use('gitlab', new GitLabStrategy(
  {
    clientID: keys.github.clientID,
    clientSecret: keys.github.clientSecret,
  },
  (accessToken, refreshToken, profile, done) =>
  {
    var options = {
        'url':'http://new_server_1:8080/Github/register_github_oauth ',
        'method': 'POST',
        'headers': {
          'Content-Type': 'application/json',
          'USER_TOKEN': sessionstorage.getItem('user_token'),
          'X-API-KEY': '49AFBA4044BA6F46739376E2AAC3B77CA3EDAEB531A3F13AB422C524E4D099A5',
        },
        'json': {
          "access_token": accessToken,
        }
    };

    axios.post('http://new_server_1:8080/Github/register_github_oauth ', options.json, {
          headers: options.headers
        })
        .then((res) => {
            sessionstorage.setItem('github', JSON.parse(res.config.data).access_token);
            done(null, res);
        })
        .catch((error) => {
            console.log("AXIOS ERROR: ", error);
            done(null, error);
        })
  })
