import fs from 'fs';

const stepMap = JSON.parse(fs.readFileSync('scripts/extracted_step_map.json', 'utf8'));

function findMethodBodyStart(text, startIdx) {
  let searchIdx = startIdx;
  while (true) {
    const brace = text.indexOf('{', searchIdx);
    if (brace === -1) return -1;
    const after = text.substring(brace + 1, brace + 80).trim();
    if (!after.includes(':') || after.startsWith('//') || after.startsWith('/*') || after.startsWith('const ') || after.startsWith('let ') || after.startsWith('if ') || after.startsWith('return ') || after.startsWith('this.')) {
      return brace;
    }
    searchIdx = brace + 1;
  }
}

function extractMethodAccurate(text, methodName) {
  const startRegex = new RegExp(`(?:static|private)\\s+${methodName}\\b`);
  const match = text.match(startRegex);
  if (!match) return null;

  const startIndex = match.index;
  const openBrace = findMethodBodyStart(text, startIndex);
  if (openBrace === -1) return null;

  let depth = 0;
  let inString = false;
  let stringChar = '';
  let inComment = false;
  let inLineComment = false;

  for (let i = openBrace; i < text.length; i++) {
    const c = text[i];
    const prev = i > 0 ? text[i - 1] : '';
    const next = i < text.length - 1 ? text[i + 1] : '';

    if (inLineComment) {
      if (c === '\n') inLineComment = false;
      continue;
    }
    if (inComment) {
      if (c === '*' && next === '/') {
        inComment = false;
        i++;
      }
      continue;
    }
    if (inString) {
      if (c === stringChar && prev !== '\\') {
        inString = false;
      }
      continue;
    }

    if (c === '/' && next === '/') {
      inLineComment = true;
      i++;
      continue;
    }
    if (c === '/' && next === '*') {
      inComment = true;
      i++;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      inString = true;
      stringChar = c;
      continue;
    }

    if (c === '{') {
      depth++;
    } else if (c === '}') {
      depth--;
      if (depth === 0) {
        return text.substring(startIndex, i + 1).trim();
      }
    }
  }

  return null;
}

const methodConfig = [
  { name: 'createMarketStallMesh', step: 11054 },
  { name: 'createShopMesh', step: 10899 },
  { name: 'createVerticalWheelMesh', step: 11058 },
  { name: 'getEMTBusDestinationTexture', step: 16411 },
  { name: 'getCPiquenasStreetMarkingTexture', step: 15446 },
  { name: 'getAtletiJerseyTexture', step: 15664 },
  { name: 'getGreenFloralDressTexture', step: 15664 },
  { name: 'getRealMadridJerseyTexture', step: 16441 },
  { name: 'getVintageTigerDressTexture', step: 16441 },
  { name: 'getChalkboardTexture', step: 16441 },
  { name: 'getDogTongueTexture', step: 17284 },
  { name: 'getRonyFaceTexture', step: 17396 },
  { name: 'getTramDestinationTexture', step: 11712 },
  { name: 'createTramMesh', step: 11712 },
  { name: 'createEMTBus35Mesh', step: 15450 },
  // rouletteCode in test_reassembly.js
  { name: 'createBicyclePedalMesh', step: 10899 },
  { name: 'createTramRailsMesh', step: 10899 },
  { name: 'createLimpKickerMesh', step: 11074 },
  { name: 'createBeachKioskMesh', step: 11887 },
  { name: 'createGiantUmbrellaMesh', step: 11887 },
  { name: 'createBeachTowelMesh', step: 11887 },
  { name: 'createHippieStallMesh', step: 11887 },
  { name: 'createWaveMesh', step: 11887 },
  { name: 'createTramStraightRailsMesh', step: 11996 },
  { name: 'createGiantBouncyPalmMesh', step: 11996 },
  { name: 'createMercadonaShelvesMesh', step: 11996 },
  { name: 'createSupermarketCheckoutMesh', step: 11996 },
  { name: 'createShoppingCartBayMesh', step: 11996 },
  { name: 'createBazarShelfMesh', step: 11996 },
  { name: 'createClotheslineMesh', step: 11996 },
  { name: 'createPopeyePizzaMesh', step: 11996 },
  { name: 'createPopeyeBillboardMesh', step: 11996 },
  { name: 'createStracciatellaConeMesh', step: 11996 },
  // createGoalPortal in test_reassembly.js
  { name: 'createDogMesh', step: 12637 },
  { name: 'createGirlMesh', step: 12637 },
  { name: 'createBoyMesh', step: 12637 },
  { name: 'createDoorMesh', step: 12637 },
  { name: 'createLitosDuoMesh', step: 15668 },
  { name: 'createSalamanderMesh', step: 13303 },
  { name: 'createMisinaCatMesh', step: 12637 },
  { name: 'createA4SheetMesh', step: 13603 },
  { name: 'createGokuMesh', step: 15977 },
  { name: 'createContinuousKamehamehaMesh', step: 16110 },
  { name: 'createKamehamehaBeamMesh', step: 15977 },
  { name: 'createKamehamehaBurstMesh', step: 15977 },
  { name: 'createKamehamehaChargeMesh', step: 15977 },
  { name: 'createChalkboardMesh', step: 16445 },
  { name: 'createClappingGlovesMesh', step: 16445 },
  { name: 'createMadridDuo132BMesh', step: 16445 },
  { name: 'createElevator2FMesh', step: 16445 },
  { name: 'createContinuousTongueMesh', step: 17294 },
  { name: 'createYorkshireRonyMesh', step: 17632 },
  { name: 'createFlooFlameGroup', step: 17400 },
  { name: 'createFlooFireplaceMesh', step: 17294 },
  { name: 'createHoodedManMesh', step: 16445 },
  { name: 'createMembrilloBumperMesh', step: 17875 },
  { name: 'createPokemonBoosterWallMesh', step: 17875 },
  { name: 'createPirateShipMesh', step: 17875 },
  { name: 'createWaterGeyserMesh', step: 17875 },
  { name: 'createCarrefourArchMesh', step: 17875 },
  // applyContinuousWorldUVs in test_reassembly.js
  // sharedWaterLavaCode in test_reassembly.js
  { name: 'getSharedHoneyTexture', step: 12557 },
  // buildWaterClusters in test_reassembly.js
  // World 4 Level 4
  { name: 'createIslazulMallFacadeMesh', step: 19409 },
  { name: 'createPrimarkClothesWallMesh', step: 19409 },
  { name: 'createPrimarkPortalMesh', step: 19409 },
  { name: 'createPrimarkPlushToyMesh', step: 19409 },
  { name: 'createFunkoBoxMesh', step: 19409 },
  { name: 'createRodillaSandwichMesh', step: 19409 },
  { name: 'createQuesaritoMesh', step: 19409 },
  { name: 'createTGBBurgerMesh', step: 19409 },
  { name: 'createCinemaSeatRowMesh', step: 19409 },
  { name: 'createCinemaScreenMesh', step: 19409 },
  { name: 'createVivaGymTreadmillMesh', step: 19409 }
];

console.log('Testing extraction for', methodConfig.length, 'methods...');
let missing = 0;
const extracted = {};

for (const cfg of methodConfig) {
  const reps = stepMap[String(cfg.step)];
  if (!reps || reps.length === 0) {
    console.log('NO REPS FOR STEP', cfg.step, 'method:', cfg.name);
    missing++;
    continue;
  }
  let code = null;
  for (const rep of reps) {
    code = extractMethodAccurate(rep, cfg.name);
    if (code) break;
  }
  if (!code) {
    console.log('FAILED TO EXTRACT:', cfg.name, 'from step', cfg.step);
    missing++;
  } else {
    extracted[cfg.name] = code;
  }
}

console.log('Extraction complete. Missing:', missing, 'Found:', Object.keys(extracted).length);
fs.writeFileSync('scripts/extracted_methods.json', JSON.stringify(extracted, null, 2), 'utf8');
