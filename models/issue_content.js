var express = require('express');
var request = require('request-promise');
const axios = require('axios');

function IssueContent(id, item) {
  this._id = id;
  this._title = item.title;
  this._item = item;

  if (item.assignee.name == "Arakniid") {
    this._assignee = "Noémie";
  } if (item.assignee.name == "LalJoncoux-Aydin") {
    this._assignee = "Lal";
  } if (item.assignee.name == "CamilleSA") {
    this._assignee = "Camille";
  } if (item.assignee.name == "paraponera") {
    this._assignee = "Zoé";
  } if (item.assignee.name == "Rachid Lhasnaoui") {
    this._assignee = "Rachid";
  } if (item.assignee.name == "Jc Dg") {
    this._assignee = "JC";
  } if (item.assignee.name == "Louis Losson") {
    this._assignee = "Louis";
  }

  this._nb_jh = Number(this._item.description.split("Charge estimée:\n")[1]);
}

module.exports = IssueContent;
