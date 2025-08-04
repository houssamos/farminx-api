const ileDeFranceCoordinates = require('../data/geo/11.js');
const centreValDeLoireCoordinates = require('../data/geo/24.js');
const bourgogneFrancheComteCoordinates = require('../data/geo/27.js');
const normandieCoordinates = require('../data/geo/28.js');
const hautDeFranceCoordinates = require('../data/geo/32.js');
const grandEstCoordinates = require('../data/geo/44.js');
const paysDeLaLoireCoordinates = require('../data/geo/52.js');
const bretagneCoordinates = require('../data/geo/53.js');
const nouvelleAquitaineCoordinates = require('../data/geo/75.js');
const occiatanieCoordinates = require('../data/geo/76.js');
const auvergneRhoneAlpesCoordinates = require('../data/geo/84.js');
const provenceAlpesCoteDAzurCoordinates = require('../data/geo/93.js');
const corseCoordinates = require('../data/geo/94.js');
const guadeloupeCoordinates = require('../data/geo/971.js');
const martiniqueCoordinates = require('../data/geo/972.js');
const guyaneCoordinates = require('../data/geo/973.js');
const reunionCoordinates = require('../data/geo/974.js');
const mayotteCoordinates = require('../data/geo/976.js');

class Region {
  constructor(code, name, coordinates, type) {
    this.code = code;
    this.name = name;
    this.coordinates = coordinates;
    this.type = type;
  }
}

const REGIONS_CONFIG = {
  "11": new Region("11", "Île-de-France", ileDeFranceCoordinates, "Polygon"),
  "24": new Region("24", "Centre-Val de Loire", centreValDeLoireCoordinates, "Polygon"),
  "27": new Region("27", "Bourgogne-Franche-Comté", bourgogneFrancheComteCoordinates, "Polygon"),
  "28": new Region("28", "Normandie", normandieCoordinates, "Polygon"),
  "32": new Region("32", "Hauts-de-France", hautDeFranceCoordinates, "Polygon"),
  "44": new Region("44", "Grand Est", grandEstCoordinates, "Polygon"),
  "52": new Region("52", "Pays de la Loire", paysDeLaLoireCoordinates, "MultiPolygon"),
  "53": new Region("53", "Bretagne", bretagneCoordinates, "MultiPolygon"),
  "75": new Region("75", "Nouvelle-Aquitaine", nouvelleAquitaineCoordinates, "MultiPolygon"),
  "76": new Region("76", "Occitanie", occiatanieCoordinates, "MultiPolygon"),
  "84": new Region("84", "Auvergne-Rhône-Alpes", auvergneRhoneAlpesCoordinates, "Polygon"),
  "93": new Region("93", "Provence-Alpes-Côte d'Azur", provenceAlpesCoteDAzurCoordinates, "MultiPolygon"),
  "94": new Region("94", "Corse", corseCoordinates, "MultiPolygon"),
  "971": new Region("971", "Guadeloupe", guadeloupeCoordinates, "MultiPolygon"),
  "972": new Region("972", "Martinique", martiniqueCoordinates, "Polygon"),
  "973": new Region("973", "Guyane", guyaneCoordinates, "MultiPolygon"),
  "974": new Region("974", "La Réunion", reunionCoordinates, "Polygon"),
  "976": new Region("976", "Mayotte", mayotteCoordinates, "MultiPolygon")
};

module.exports = { REGIONS_CONFIG, Region };
