var express = require('express');
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
var Jimp = require('jimp');

function GenerateCarto(nb_subtitle, nb_max_content) {
  this.context = undefined;
  this.rect_width_content = 339;
  this.rect_height_content = 54;
  this.width = (this.rect_width_content + 36) * nb_subtitle;
  this.rect_width_title = this.width - 40;
  this.rect_height_title = 74;
  this.index_x = 20;
  this.index_y = 20;
  this.height = this.index_y + this.rect_height_title + 25 + ((this.rect_height_content + 20) * nb_max_content) + this.rect_height_content + 2;
}

GenerateCarto.prototype.generateContent = async function(title, color) {
  this.context.strokeStyle = 'black';
  this.context.strokeRect(this.index_x - 1, this.index_y - 1, this.rect_width_content + 2, this.rect_height_content + 2);
  this.context.fillStyle = color;
  this.context.fillRect(this.index_x, this.index_y, this.rect_width_content, this.rect_height_content);

  this.context.fillStyle = 'black';
  this.context.font = '10pt Menlo';
  this.context.textAlign = 'center';
  this.context.textBaseline = 'top';
  this.context.fillText(title, this.rect_width_content / 2 + this.index_x, this.rect_height_content / 2 + this.index_y - 10, this.rect_width_content);
  this.index_y += this.rect_height_content + 20;
}

GenerateCarto.prototype.generateTitle = async function(title) {
  this.context.strokeStyle = 'black';
  this.context.strokeRect(this.index_x - 1, this.index_y - 1, this.rect_width_title + 4, this.rect_height_title + 2);
  this.context.fillStyle = '#3AA6DD';
  this.context.fillRect(this.index_x, this.index_y, this.rect_width_title + 2, this.rect_height_title);

  this.context.fillStyle = 'black';
  this.context.font = '10pt Menlo';
  this.context.textAlign = 'center';
  this.context.textBaseline = 'top';
  this.context.fillText(title, this.rect_width_title / 2 + this.index_x, this.rect_height_title / 2 + this.index_y - 10);
  this.index_y += this.rect_height_title + 25;
}

GenerateCarto.prototype.generate = function(title, subtitle_list) {
  const canvas = createCanvas(this.width, this.height);
  this.context = canvas.getContext('2d');

  this.generateTitle(title);
  subtitle_list.forEach(function(subtitle) {
    this.generateContent(subtitle._title, "#99D2F2");
    subtitle._list_issue.forEach(function(issue) {
      if (issue._item.labels[0] == "To Do") {
        this.generateContent(issue._title, "#CCCCCC");
      } else if (issue._item.labels[0] == "Doing") {
        this.generateContent(issue._title, "#FC9432");
      } else if (issue._item.labels[0] == "Done") {
        this.generateContent(issue._title, "#54C45E");
      }
    }.bind(this))
    this.index_x += this.rect_width_content + 36;
    this.index_y = 20 + this.rect_height_title + 25;
  }.bind(this))

  const buffer = canvas.toBuffer('image/png');
  var before_path = "./public";
  var path = "/carto/";
  path = path.concat(title.replace('.', "-").replace(/ /g, '').replace('é', 'e'), ".png");
  fs.writeFileSync(before_path.concat(path), buffer);

  Jimp.read(before_path.concat(path), (err, img) => {
    if (err) console.log("ERROR");
    img
      .rotate(90, Jimp.RESIEZ_BEZIER)
      .write(before_path.concat(path)); // save
  });

  var url = "https://pld.agrothink.tech/"
  return url.concat(path);
}

module.exports = GenerateCarto;
