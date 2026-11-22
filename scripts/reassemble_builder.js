import fs from 'fs';
import readline from 'readline';

async function reassemble() {
  const methodNames = [
    'createMarketStallMesh',
    'createShopMesh',
    'createVerticalWheelMesh',
    'getEMTBusDestinationTexture',
    'getCPiquenasStreetMarkingTexture',
    'getAtletiJerseyTexture',
    'getGreenFloralDressTexture',
    'getRealMadridJerseyTexture',
    'getVintageTigerDressTexture',
    'getChalkboardTexture',
    'getDogTongueTexture',
    'getRonyFaceTexture',
    'getTramDestinationTexture',
    'createTramMesh',
    'createEMTBus35Mesh',
    'createCasinoRouletteMesh',
    'createTramRailsMesh',
    'createLimpKickerMesh',
    'createBeachKioskMesh',
    'createGiantUmbrellaMesh',
    'createBeachTowelMesh',
    'createWaveMesh',
    'createTramStraightRailsMesh',
    'createGiantBouncyPalmMesh',
    'createMercadonaShelvesMesh',
    'createSupermarketCheckoutMesh',
    'createShoppingCartBayMesh',
    'createBazarShelfMesh',
    'createClotheslineMesh',
    'createPopeyePizzaMesh',
    'createPopeyeBillboardMesh',
    'createStracciatellaConeMesh',
    'createGoalPortal',
    'createDogMesh',
    'createDoorMesh',
    'createLitosDuoMesh',
    'createSalamanderMesh',
    'createMisinaCatMesh',
    'createA4SheetMesh',
    'createGokuMesh',
    'createContinuousKamehamehaMesh',
    'createKamehamehaBeamMesh',
    'createKamehamehaBurstMesh',
    'createKamehamehaChargeMesh',
    'createChalkboardMesh',
    'createClappingGlovesMesh',
    'createMadridDuo132BMesh',
    'createElevator2FMesh',
    'createContinuousTongueMesh',
    'createYorkshireRonyMesh',
    'createFlooFlameGroup',
    'createFlooFireplaceMesh',
    'createHoodedManMesh',
    'createMembrilloBumperMesh',
    'createPokemonBoosterWallMesh',
    'createPirateShipMesh',
    'createWaterGeyserMesh',
    'createCarrefourArchMesh',
    'applyContinuousWorldUVs',
    'getSharedWaterTexture',
    'getSharedLavaTexture',
    'getSharedHoneyTexture',
    'buildWaterClusters',
    'createIslazulMallFacadeMesh',
    'createPrimarkClothesWallMesh',
    'createPrimarkPortalMesh',
    'createPrimarkPlushToyMesh',
    'createFunkoBoxMesh',
    'createRodillaSandwichMesh',
    'createQuesaritoMesh',
    'createTGBBurgerMesh',
    'createCinemaSeatRowMesh',
    'createCinemaScreenMesh',
    'createVivaGymTreadmillMesh'
  ];

  console.log('Searching for definitions of', methodNames.length, 'methods in transcript...');

  // Read all lines from transcript_full.jsonl into memory or stream
  const allReplacements = [];
  const fileStream = fs.createReadStream('C:/Users/Helio/.gemini/antigravity/brain/4cc64493-cbaf-4561-a71b-b67783a9ec43/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (line.includes('edit_file') && line.includes('LevelBuilder.ts')) {
      try {
        const parsed = JSON.parse(line);
        if (parsed.tool_calls) {
          for (const tc of parsed.tool_calls) {
            if (tc.name === 'edit_file' && tc.args.Path && tc.args.Path.includes('LevelBuilder.ts') && tc.args.Replacement) {
              allReplacements.push({ step: parsed.step_index, rep: tc.args.Replacement });
            }
          }
        }
      } catch (e) {}
    }
  }

  console.log('Found', allReplacements.length, 'LevelBuilder edits in transcript.');

  // For each method, find the latest replacement that contains its definition
  const foundMap = new Map();
  for (const name of methodNames) {
    for (let i = allReplacements.length - 1; i >= 0; i--) {
      const { step, rep } = allReplacements[i];
      // Definition regex: (static|private)\s+name\s*\( or name\s*\(
      const defRegex = new RegExp(`(?:static|private)\\s+${name}\\s*\\(|\\b${name}\\s*\\([^)]*\\)\\s*\\{`);
      if (defRegex.test(rep)) {
        foundMap.set(name, { step, rep });
        break;
      }
    }
  }

  console.log('Successfully found latest definition for:', foundMap.size, 'out of', methodNames.length);
  for (const name of methodNames) {
    if (!foundMap.has(name)) {
      console.log('MISSING:', name);
    } else {
      console.log('Found', name, 'at step', foundMap.get(name).step);
    }
  }
}
reassemble();
