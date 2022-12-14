var express = require('express');
var request = require('request-promise');
const axios = require('axios');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
var generate_source = require('../controllers/generatepld.js');

const SCOPES = ['https://www.googleapis.com/auth/documents'];
const TOKEN_PATH = 'token.json';
var _generate = new generate_source();

function GoogleDoc() {
  this.oAuth2Client = undefined;
  this.token = undefined;
}

GoogleDoc.prototype.setupToken = function(code) {
  this.oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        return console.error('Error retrieving access token', err);
      }
      this.oAuth2Client.setCredentials(token);
      this.token = token;
      try {
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
      } catch (err) {
        console.error(err);
      }
  });
}

GoogleDoc.prototype.authorize = async function (data) {
  var credentials_content = fs.readFileSync('credentials.json');
  const {client_secret, client_id, redirect_uris} = JSON.parse(credentials_content).web;
  this.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  try {
    this.token = fs.readFileSync(TOKEN_PATH);
  } catch (err) {
    var authUrl = this.oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES});
    return authUrl;
  }
  this.oAuth2Client.setCredentials(JSON.parse(this.token));
}

GoogleDoc.prototype.updatePLD = async function(data, description_version, rapport, rapport_titre, newSprint) {
  const client = google.docs({version: 'v1', auth: this.oAuth2Client});

  await _generate.setup(newSprint == "on" ? true : false);

  let requests = [];

  let part_9 = JSON.parse(fs.readFileSync("./textStyle/bug.json"));
  requests = requests.concat(part_9.requests);

  let part_8 = await _generate.generateRapport(rapport, rapport_titre);
  requests = requests.concat(part_8);

  let part_7 = await _generate.generateStories(data);
  requests = requests.concat(part_7);

  let part_6 = await _generate.generateCartoLivrable(data);
  requests = requests.concat(part_6);

  let part_5 = await _generate.generateIndividual(data);
  requests = requests.concat(part_5);

  let part_4 = await _generate.generateOrgaLivrable();
  requests = requests.concat(part_4.requests);

  let part_3 = await _generate.generateVersionDescription(data);
  requests = requests.concat(part_3);

  let part_2 = await _generate.generateRevision(description_version);
  requests = requests.concat(part_2);

  let part_1 = await _generate.generateDescription();
  requests = requests.concat(part_1.requests);

  let header = await _generate.generateHeader(data);
  requests = requests.concat(header);

  const createResponse = await client.documents.batchUpdate({
    documentId: "1NG2ViBgQLfks--woCi28jM1dYt-9lZgb6Mgm8q9Zni8",
    requestBody: {
      requests: requests
    }
  });
}

module.exports = GoogleDoc;
