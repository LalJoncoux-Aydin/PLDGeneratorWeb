var express = require('express');
const fs = require('fs');
var generate_element_source = require('./generate_element.js');
var generate_carto_source = require('./generate_carto.js');
var log_management_source = require('./log_management.js');

var generate_element = new generate_element_source();
var log_management = new log_management_source();

function GeneratePld() {
  this.date = undefined;
  this.version = undefined;
}

GeneratePld.prototype.setup = async function(isNewSprint) {
  var today_date = new Date();
  today_date.toLocaleString('en-US', { timeZone: 'Europe/Paris'});
  var day = ("0" + today_date.getDate()).slice(-2);
  var month = ("0" + (today_date.getMonth() + 1)).slice(-2);
  var year = today_date.getFullYear();
  this.date = day.concat("/").concat(month).concat("/").concat(year);

  this.version = parseFloat(fs.readFileSync("./logs/version.txt").toString());
  if (isNewSprint == true) {
    this.version += 1;
    this.version = parseInt(this.version).toString().concat(".0");
  } else {
    this.version = (((this.version * 10) + 1) / 10).toString();
  }
  fs.writeFileSync("./logs/version.txt", this.version);
}

GeneratePld.prototype.generateHeader = async function(list_issue) {
  var part_0_footer = JSON.parse(fs.readFileSync("./textStyle/textTitle1.json"));
  var part_0_content = [];

  part_0_content = generate_element.generateBlockOfText(part_0_content, true, 16, "I - Description du document\n", "START", false);
  part_0_content.push(generate_element.generateBreak("CONTINUOUS"));
  part_0_content = generate_element.generateBlockOfText(part_0_content, true, 16, "II - Tableau de révisions\n", "START", false);
  part_0_content.push(generate_element.generateBreak("CONTINUOUS"));
  part_0_content = generate_element.generateBlockOfText(part_0_content, true, 16, "III - Description de la version\n", "START", false);
  part_0_content.push(generate_element.generateBreak("CONTINUOUS"));
  part_0_content = generate_element.generateBlockOfText(part_0_content, true, 16, "IV - Organigramme des livrables\n", "START", false);
  part_0_content.push(generate_element.generateBreak("CONTINUOUS"));
  part_0_content = generate_element.generateBlockOfText(part_0_content, true, 16, "V - Tâches individuelles\n", "START", false);
  part_0_content.push(generate_element.generateBreak("CONTINUOUS"));

  part_0_content = generate_element.generateBlockOfText(part_0_content, false, 12, "\tCamille\n", "START", false);
  part_0_content.push(generate_element.generateBreak("CONTINUOUS"));
  part_0_content = generate_element.generateBlockOfText(part_0_content, false, 12, "\tLouis\n", "START", false);
  part_0_content.push(generate_element.generateBreak("CONTINUOUS"));
  part_0_content = generate_element.generateBlockOfText(part_0_content, false, 12, "\tZoé\n", "START", false);
  part_0_content.push(generate_element.generateBreak("CONTINUOUS"));
  part_0_content = generate_element.generateBlockOfText(part_0_content, false, 12, "\tJC\n", "START", false);
  part_0_content.push(generate_element.generateBreak("CONTINUOUS"));
  part_0_content = generate_element.generateBlockOfText(part_0_content, false, 12, "\tNoémie\n", "START", false);
  part_0_content.push(generate_element.generateBreak("CONTINUOUS"));
  part_0_content = generate_element.generateBlockOfText(part_0_content, false, 12, "\tRachid\n", "START", false);
  part_0_content.push(generate_element.generateBreak("CONTINUOUS"));
  part_0_content = generate_element.generateBlockOfText(part_0_content, false, 12, "\tLal\n", "START", false);
  part_0_content.push(generate_element.generateBreak("CONTINUOUS"));

  part_0_content = generate_element.generateBlockOfText(part_0_content, true, 16, "VI - Carte des livrables\n", "START", false);
  part_0_content.push(generate_element.generateBreak("CONTINUOUS"));

  list_issue.forEach(function(title) {
    var tab_ = "\t";
    var title_text = title._id.toString().concat(".", title._title, "\n");
    part_0_content = generate_element.generateBlockOfText(part_0_content, true, 12, tab_.concat(title_text), "START", false);
    part_0_content.push(generate_element.generateBreak("CONTINUOUS"));
  });

  part_0_content = generate_element.generateBlockOfText(part_0_content, true, 16, "VII - Tableaux stories\n", "START", false);
  part_0_content.push(generate_element.generateBreak("CONTINUOUS"));

  list_issue.forEach(function(title) {
    var tab_ = "\t";
    var title_text = title._id.toString().concat(".", title._title, "\n");
    part_0_content = generate_element.generateBlockOfText(part_0_content, true, 12, tab_.concat(title_text), "START", false);
    part_0_content.push(generate_element.generateBreak("CONTINUOUS"));

    title._issue_subtitle.forEach(function(subtitle) {
      var tab_ = "\t\t";
      var subtitle_text = title._id.toString().concat(".", subtitle._title, "\n");
      part_0_content = generate_element.generateBlockOfText(part_0_content, false, 12, tab_.concat(subtitle_text), "START", false);
      part_0_content.push(generate_element.generateBreak("CONTINUOUS"));

      subtitle._list_issue.forEach(function(issue) {
        var tab_ = "\t\t\t";
        var content_text = title._id.toString().concat(".", issue._title, "\n");
        part_0_content = generate_element.generateBlockOfText(part_0_content, false, 12, tab_.concat(content_text), "START", false);
        part_0_content.push(generate_element.generateBreak("CONTINUOUS"));
      });
    });
  });

  part_0_content = generate_element.generateBlockOfText(part_0_content, true, 16, "VIII - Rapports d’avancement\n", "START", false);
  part_0_content.push(generate_element.generateBreak("CONTINUOUS"));
  part_0_content = generate_element.generateBlockOfText(part_0_content, true, 16, "IX - Bêta\n", "START", false);
  part_0_content.push(generate_element.generateBreak("NEXT_PAGE"));

  var part_0 = part_0_content.reverse().concat(part_0_footer.requests);
  return part_0;
}

// PARTIE 1 DESCRIPTION
GeneratePld.prototype.generateDescription = async function() {
  var part_1 = JSON.parse(fs.readFileSync("./textStyle/description.json"));
  part_1.requests[2].insertText.text = this.version;
  part_1.requests[4].insertText.text = this.date;

  return part_1;
}


// PARTIE 2 REVISION
GeneratePld.prototype.generateRevision = async function(description) {
  var part_2_table_header = JSON.parse(fs.readFileSync("./textStyle/revision_table_header.json"));
  var part_2_table_footer = JSON.parse(fs.readFileSync("./textStyle/revision_table_footer.json"));

  // Add one line into revision_log
  var json = JSON.parse(fs.readFileSync("./logs/revision_log.json"));
  var to_add = generate_element.generateRevisionLog(description, this.date, this.version);
  json.log.push(to_add);
  fs.writeFileSync("./logs/revision_log.json", JSON.stringify(json));

  var part_2_content = [];
  var index = 16;
  var total_size = 49;

  json.log.forEach(function(item) {
      var content = [];

      content.push(generate_element.generateText(item.date, index));
      index += 2;
      content.push(generate_element.generateText(item.version, index));
      index += 2;
      content.push(generate_element.generateText(item.auteurs, index));
      index += 2;
      content.push(generate_element.generateText(item.sections, index));
      index += 2;
      content.push(generate_element.generateText(item.comment, index));
      index += 3;

      total_size += item.date.length;
      total_size += item.version.length;
      total_size += item.auteurs.length;
      total_size += item.sections.length;
      total_size += item.comment.length;

      part_2_content = part_2_content.concat(content);
  });

  part_2_table_header.requests[1].insertTable.rows = json.log.length + 1;
  part_2_table_footer.requests[6].updateTableCellStyle.tableRange.rowSpan = json.log.length;
  part_2_table_footer.requests[5].updateTextStyle.range.endIndex = total_size + index;

  var part_2 = part_2_table_header.requests.concat(part_2_content.reverse(), part_2_table_footer.requests);
  return part_2;
}


// PARTIE 3 DESCRIPTION
GeneratePld.prototype.generateVersionDescription = async function(data) {
  var part_3_footer = JSON.parse(fs.readFileSync("./textStyle/version.json"));
  var part_3_content = [];

  var modif_content = await log_management.modifiedLoggingGetDiff(data);
  modif_content.forEach(function(item) {
    var to_print = "- ";
    to_print = to_print.concat(item, "\n");
    part_3_content = generate_element.generateBlockOfText(part_3_content, true, 14, to_print, "START", false);
  });
  part_3_content.push(generate_element.generateBreak("NEXT_PAGE"));

  await log_management.versionIssuesLogging(data);

  var part_3 = part_3_content.reverse().concat(part_3_footer.requests);
  return part_3;
}


// PARTIE 4 ORGANIGRAMME LIVRABLES
GeneratePld.prototype.generateOrgaLivrable = async function() {
  var part_4 = JSON.parse(fs.readFileSync("./textStyle/orga_livrable.json"));

//  part_4.requests[4].insertInlineImage.uri = "https://pld.agrothink.tech/images_print/livrable.png";
//  part_4.requests[11].insertInlineImage.uri = "https://pld.agrothink.tech/images_print/old-PLD-livrable.png";

  return part_4;
}


// PARTIE 5 INDIVIDUAL
function generateAssigneIssues(list_issue, content, name) {
  var total_jh = [];

  content = generate_element.generateBlockOfText(content, true, 18, name, "START", true);
  content.push(generate_element.generateBreak("CONTINUOUS"));
  content.push(generate_element.generateBreak("CONTINUOUS"));
  content = generate_element.generateBlockOfText(content, false, 14, "Détails:", "START", true);
  content.push(generate_element.generateBreak("CONTINUOUS"));

  list_issue.forEach(function(title) {
    title._issue_subtitle.forEach(function(subtitle) {
      subtitle._list_issue.forEach(function(issue) {
        if (issue._assignee == name) {
          var to_print = "- ";
          content = generate_element.generateBlockOfText(content, false, 16, to_print.concat(issue._title, " - ", issue._nb_jh, "JH"), "START", false);
          total_jh.push(issue._nb_jh);
          content.push(generate_element.generateBreak("CONTINUOUS"));
        }
      });
    });
  });
  content.push(generate_element.generateBreak("CONTINUOUS"));
  content.push(generate_element.generateBreak("CONTINUOUS"));
  content = generate_element.generateBlockOfText(content, false, 14, "Total: ", "START", true);
  var total_jh_nb = 0;
  total_jh.forEach(function(jh, i) {
    content = generate_element.generateBlockOfText(content, false, 14, jh.toString(), "START", false);
    total_jh_nb += jh;
    if (i != total_jh.length - 1) {
      content = generate_element.generateBlockOfText(content, false, 14, " + ", "START", false);
    } else {
      content = generate_element.generateBlockOfText(content, false, 14, " = ", "START", false);
    }
  });
  content = generate_element.generateBlockOfText(content, true, 11, total_jh_nb.toString().concat(" JH"), "START", false);
  content.push(generate_element.generateBreak("CONTINUOUS"));
  content.push(generate_element.generateBreak("NEXT_PAGE"));

  return content;
}

GeneratePld.prototype.generateIndividual = async function(list_issue) {
  var part_5_footer = JSON.parse(fs.readFileSync("./textStyle/individual.json"));
  var part_5_content = [];

  part_5_content = generateAssigneIssues(list_issue, part_5_content, "Camille");
  part_5_content = generateAssigneIssues(list_issue, part_5_content, "Louis");
  part_5_content = generateAssigneIssues(list_issue, part_5_content, "Zoé");
  part_5_content = generateAssigneIssues(list_issue, part_5_content, "JC");
  part_5_content = generateAssigneIssues(list_issue, part_5_content, "Noémie");
  part_5_content = generateAssigneIssues(list_issue, part_5_content, "Rachid");
  part_5_content = generateAssigneIssues(list_issue, part_5_content, "Lal");

  var part_5 = part_5_content.reverse().concat(part_5_footer.requests);
  return part_5;
}


// PARTIE 6 CARTO LIVRABLE
function getMaxNbContent(list_subtitle) {
  var max_nb = 0;

  list_subtitle.forEach(function(content) {
    if (content._list_issue.length > max_nb) {
      max_nb = content._list_issue.length;
    }
  });

  return max_nb;
}

GeneratePld.prototype.generateCartoLivrable = async function(list_issue) {
  var part_6_footer = JSON.parse(fs.readFileSync("./textStyle/carto_livrable.json"));
  var part_6_content = [];

  part_6_content = generate_element.generateBlockOfText(part_6_content, true, 21, "1. Docker", "CENTER", true);
  part_6_content.push(generate_element.generateBreak("CONTINUOUS"));
  part_6_content.push(generate_element.generateBreak("CONTINUOUS"));
  part_6_content = generate_element.generateBlockOfText(part_6_content, true, 18, "PAS DE LIVRABLES", "START", false);
  part_6_content.push(generate_element.generateBreak("CONTINUOUS"));
  part_6_content = generate_element.generateBlockOfText(part_6_content, true, 21, "2. LoRa", "CENTER", true);
  part_6_content.push(generate_element.generateBreak("CONTINUOUS"));
  part_6_content.push(generate_element.generateBreak("CONTINUOUS"));
  part_6_content = generate_element.generateBlockOfText(part_6_content, true, 18, "PAS DE LIVRABLES", "START", false);
  part_6_content.push(generate_element.generateBreak("CONTINUOUS"));
  part_6_content = generate_element.generateBlockOfText(part_6_content, true, 21, "3. Capteurs", "CENTER", true);
  part_6_content.push(generate_element.generateBreak("CONTINUOUS"));
  part_6_content.push(generate_element.generateBreak("CONTINUOUS"));
  part_6_content = generate_element.generateBlockOfText(part_6_content, true, 18, "PAS DE LIVRABLES", "START", false);
  part_6_content.push(generate_element.generateBreak("CONTINUOUS"));
  part_6_content = generate_element.generateBlockOfText(part_6_content, true, 21, "4. Arbre décisionnel", "CENTER", true);
  part_6_content.push(generate_element.generateBreak("CONTINUOUS"));
  part_6_content.push(generate_element.generateBreak("CONTINUOUS"));
  part_6_content = generate_element.generateBlockOfText(part_6_content, true, 18, "PAS DE LIVRABLES", "START", false);
  part_6_content.push(generate_element.generateBreak("NEXT_PAGE"));

  await list_issue.forEach(async function(title) {
    var generate_carto = new generate_carto_source(title._issue_subtitle.length, getMaxNbContent(title._issue_subtitle));
    var title_text = title._id.toString().concat(".", title._title);

    part_6_content = generate_element.generateBlockOfText(part_6_content, true, 21, title_text, "CENTER", true);
    part_6_content.push(generate_element.generateBreak("CONTINUOUS"));

    var url = generate_carto.generate(title_text, title._issue_subtitle);
  //  part_6_content.push(generate_element.generateImage(url));
    part_6_content.push(generate_element.generateBreak("NEXT_PAGE"));
  });

  var part_6 = part_6_content.reverse().concat(part_6_footer.requests);
  return part_6;
}


// PARTIE 7 STORIES
GeneratePld.prototype.generateStories = async function(list_issue) {
  var part_7_table_header = JSON.parse(fs.readFileSync("./textStyle/stories_header.json"));
  var part_7_table_footer = JSON.parse(fs.readFileSync("./textStyle/stories_footer.json"));
  var part_7_content = [];

  list_issue.forEach(function(title) {
    var title_text = title._id.toString().concat(". ", title._title);
    part_7_content = generate_element.generateBlockOfText(part_7_content, true, 21, title_text, "CENTER", true);
    part_7_content.push(generate_element.generateBreak("CONTINUOUS"));
    part_7_content.push(generate_element.generateBreak("CONTINUOUS"));

    title._issue_subtitle.forEach(function(subtitle) {
      part_7_content = generate_element.generateBlockOfText(part_7_content, false, 14, subtitle._title, "CENTER", true);
      part_7_content.push(generate_element.generateBreak("CONTINUOUS"));
      part_7_content.push(generate_element.generateBreak("CONTINUOUS"));

      subtitle._list_issue.forEach(function(issue) {
        part_7_content = generate_element.generateBlockOfText(part_7_content, true, 12, issue._title, "CENTER", true);

        var description = issue._item.description.replace(/## /g, '').split('\n');
        part_7_content = part_7_content.concat(generate_element.generateIssueTable(description, issue._assignee, issue._item.labels[0]), part_7_table_header.requests);
      });

    });
  });

  var part_7 = part_7_content.reverse().concat(part_7_table_footer.requests);
  return part_7;
}

// PARTIE 8 RAPPORT
GeneratePld.prototype.generateRapport = async function(rapport, rapport_titre) {
  var part_8_footer = JSON.parse(fs.readFileSync("./textStyle/rapport.json"));
  var part_8_content = [];
  var rapport_log = fs.readFileSync("./logs/rapport_log.txt").toString().replace(/\r/g, '');
  var rapport_log_list = rapport_log.split("*");
  var isTitle = true;
  rapport_log_list.shift();

  rapport_log_list.forEach(function(item) {
    if (isTitle == true) {
      part_8_content = generate_element.generateBlockOfText(part_8_content, false, 12, item, "START", true);
      part_8_content.push(generate_element.generateBreak("CONTINUOUS"));
      isTitle = false;
    } else {
      part_8_content = generate_element.generateBlockOfText(part_8_content, false, 12, item, "START", false);
      part_8_content.push(generate_element.generateBreak("CONTINUOUS"));
      isTitle = true;
    }
  })

  var new_rapport_title = this.date.concat("-", rapport_titre.replace(/\r/g, ''));
  part_8_content = generate_element.generateBlockOfText(part_8_content, false, 12, new_rapport_title, "START", true);
  part_8_content.push(generate_element.generateBreak("CONTINUOUS"));
  part_8_content = generate_element.generateBlockOfText(part_8_content, false, 12, rapport.replace(/\r/g, ''), "START", false);
  part_8_content.push(generate_element.generateBreak("NEXT_PAGE"));

  var delimiter = "*";
  var to_print = delimiter.concat(new_rapport_title, "*", rapport);
  fs.writeFileSync("./logs/rapport_log.txt", rapport_log.concat(to_print));

  var part_8 = part_8_content.reverse().concat(part_8_footer.requests);
  return part_8;
}

module.exports = GeneratePld;
