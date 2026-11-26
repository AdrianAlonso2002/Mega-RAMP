import {applyPlazaFinale} from "./world-01/PlazaFinale";
import {registeredLevel} from './StageRegistry';
const WORLD_08_LEVEL_04_STAGES=registeredLevel(8,4);
const WORLD_08_LEVEL_03_STAGES=registeredLevel(8,3);
const WORLD_08_LEVEL_02_STAGES=registeredLevel(8,2);
const WORLD_08_LEVEL_01_STAGES=registeredLevel(8,1);
const WORLD_07_LEVEL_04_STAGES=registeredLevel(7,4);
import type { LevelData, LevelObjectData } from "./LevelTypes";
import {applyCollectibleBalance} from './CollectibleBalance';
import {applyCoastalStageUpdates} from './world-02/CoastalStages';
import {upgradeCoastalFinale} from './world-02/CoastalFinale';
const WORLD_05_LEVEL_02_STAGES=registeredLevel(5,2);
const WORLD_05_LEVEL_03_STAGES=registeredLevel(5,3);
const WORLD_05_LEVEL_04_STAGES=registeredLevel(5,4);
const WORLD_06_LEVEL_01_STAGES=registeredLevel(6,1);
import { LONDON_REVISION } from "./world-06/LondonRoutes";
const WORLD_06_LEVEL_02_STAGES=registeredLevel(6,2);
import { MUSEUM_REVISION } from "./world-06/MuseumRoutes";
const WORLD_06_LEVEL_03_STAGES=registeredLevel(6,3);
import { OXFORD_REVISION } from "./world-06/OxfordRoutes";
const WORLD_06_LEVEL_04_STAGES=registeredLevel(6,4);
import {BIG_BEN_REVISION,toyPlaneHeight,TOY_LANDING_Y} from './world-06/BigBenRoutes';
import {BIKE_REVISION,rebuildBikeCourse} from './BikeCourse';
const WORLD_07_LEVEL_01_STAGES=registeredLevel(7,1);
import { KYOTO_REVISION } from './world-07/KyotoRoutes';
const WORLD_07_LEVEL_02_STAGES=registeredLevel(7,2);
const WORLD_07_LEVEL_03_STAGES=registeredLevel(7,3);
import { NARA_STATION_REVISION, NARA_CHALLENGE_REVISION, naraPath, nv } from './world-07/NaraRoutes';
import {TOKYO_POLISH_REVISION,TOKYO_MACHINE_REVISION,TOKYO_ARCADE_REVISION,TOKYO_ACTION_REVISION,TOKYO_FUTURE_REVISION,tokyoGateSpeed} from './world-07/TokyoRoutes';

/** Apply requested adjustments to both the game and editor, including saved stages. */
export function applyRequestedStageUpdates(data: LevelData, world: number, level: number, stage: number): LevelData {
  upgradeCoastalFinale(data);
  if(data.properties?.editorPublished || data.customSaved || data.properties?.userSaved)return data;
  return applyPlazaFinale(applyCoastalStageUpdates(applyCollectibleBalance(applyStageMechanicUpdates(data,world,level,stage),world,level,stage)));
}

function applyStageMechanicUpdates(data: LevelData, world: number, level: number, stage: number): LevelData {
  if(world===8&&level===4&&!data.properties?.auroraRevision&&!data.customSaved&&!data.properties?.userSaved&&!data.objects.some(o=>o.id.startsWith('obj-custom'))){const official=WORLD_08_LEVEL_04_STAGES[stage];if(official)return structuredClone(official);}
  if(world===8&&level===3&&!data.properties?.osloRevision&&!data.customSaved&&!data.properties?.userSaved&&!data.objects.some(o=>o.id.startsWith('obj-custom'))){const official=WORLD_08_LEVEL_03_STAGES[stage];if(official)return structuredClone(official);}
  if(world===8&&level===2&&!data.properties?.fjordRevision&&!data.customSaved&&!data.properties?.userSaved&&!data.objects.some(o=>o.id.startsWith('obj-custom'))){const official=WORLD_08_LEVEL_02_STAGES[stage];if(official)return structuredClone(official);}
  if(world===8&&level===1&&!data.properties?.norwayRevision&&!data.customSaved&&!data.properties?.userSaved&&!data.objects.some(o=>o.id.startsWith('obj-custom'))){const official=WORLD_08_LEVEL_01_STAGES[stage];if(official)return structuredClone(official);}
  if(world===7&&level===4&&!data.properties?.tokyoRevision&&!data.customSaved&&!data.properties?.userSaved&&!data.objects.some(o=>o.id.startsWith('obj-custom'))) {const official=WORLD_07_LEVEL_04_STAGES[stage];if(official)return structuredClone(official);}
  if(world===7&&level===4&&data.properties?.tokyoPolishRevision!==TOKYO_POLISH_REVISION){
    if(stage===1)for(const object of data.objects){const match=/^w7n4e1-prize-(\d+)$/.exec(object.id);if(match)object.position.x=[-3.8,0,3.8,0][Number(match[1])%4];}
    if(stage===3){
      const oldWalls=new Set(['w7n4e3-table-wall--12.3','w7n4e3-table-wall-12.3']);
      if(data.objects.some(o=>oldWalls.has(o.id))){data.objects=data.objects.filter(o=>!oldWalls.has(o.id));for(const object of WORLD_07_LEVEL_04_STAGES[3].objects.filter(o=>o.id.includes('table-wall-')||o.id==='w7n4e3-table-back'))if(!data.objects.some(o=>o.id===object.id))data.objects.push(structuredClone(object));}
      for(const object of data.objects)if(object.properties?.subType==='tokyo_flipper'){const side=Number(object.properties.side??1);object.position.x=side*11.8;object.position.y-=.27;object.rotation.x=Math.atan(.2);object.properties={...object.properties,length:10.8};}
      for(const object of data.objects)if(object.type==='goal')object.properties={...object.properties,tokyoAction:'pinballGoal'};
    }
    data.properties={...data.properties,tokyoPolishRevision:TOKYO_POLISH_REVISION};
  }
  if(world===7&&level===4&&data.properties?.tokyoMachineRevision!==TOKYO_MACHINE_REVISION){
    if(stage===3){
      const official=WORLD_07_LEVEL_04_STAGES[3],replacements=new Map(official.objects.filter(o=>!o.id.includes('skyline-')).map(o=>[o.id,o]));
      data.objects=data.objects.map(o=>replacements.has(o.id)?structuredClone(replacements.get(o.id)!):o);
      for(const object of replacements.values())if(!data.objects.some(o=>o.id===object.id))data.objects.push(structuredClone(object));
      data.spawn={...official.spawn};
    }
    data.properties={...data.properties,tokyoMachineRevision:TOKYO_MACHINE_REVISION};
  }
  if(world===7&&level===4&&data.properties?.tokyoArcadeRevision!==TOKYO_ARCADE_REVISION){
    const official=WORLD_07_LEVEL_04_STAGES[stage];
    if(stage===4)for(const object of data.objects)if(object.properties?.tokyoAction==='gate')object.properties={...object.properties,speed:tokyoGateSpeed(Number(object.properties.index??0))};
    if(stage===5)for(const object of data.objects){const prize=official.objects.find(o=>o.type==='collectible'&&o.id===object.id);if(prize)object.position={...prize.position};}
    if(stage===6){data.objects=[...data.objects.filter(o=>!o.id.startsWith('w7n4e6-')),...structuredClone(official.objects)];data.spawn={...official.spawn};}
    if(stage===7)for(const object of data.objects){const tile=official.objects.find(o=>o.id===object.id&&o.properties?.subType==='tokyo_tile');if(tile){object.properties={...object.properties,...tile.properties};if(object.properties.restDock)delete object.properties.tokyoAction;}}
    data.properties={...data.properties,tokyoArcadeRevision:TOKYO_ARCADE_REVISION};
  }
  if(world===7&&level===4&&data.properties?.tokyoActionRevision!==TOKYO_ACTION_REVISION){
    if(stage===6||stage===7||stage===8){const official=WORLD_07_LEVEL_04_STAGES[stage];data.objects=[...data.objects.filter(o=>!o.id.startsWith(`w7n4e${stage}-`)),...structuredClone(official.objects)];data.spawn={...official.spawn};}
    if(stage===9)for(const object of data.objects)if(object.properties?.subType==='tokyo_godzilla')object.rotation.y=Math.PI;
    data.properties={...data.properties,tokyoActionRevision:TOKYO_ACTION_REVISION};
  }
  if(world===7&&level===4&&data.properties?.tokyoFutureRevision!==TOKYO_FUTURE_REVISION){
    const official=WORLD_07_LEVEL_04_STAGES[stage];if(official&&(stage===9||stage===10))for(const object of official.objects){if(object.properties?.subType==='tokyo_pulse_emitter'||stage===10&&object.id.includes('-final-rotor-')){if(!data.objects.some(o=>o.id===object.id))data.objects.push(structuredClone(object));}if(stage===10&&object.id.includes('-bridge-')){const existing=data.objects.find(o=>o.id===object.id);if(existing)existing.properties={...existing.properties,...object.properties};}}
    data.properties={...data.properties,tokyoFutureRevision:TOKYO_FUTURE_REVISION};
  }
  if(world===7&&(level===3||level===4))for(const object of data.objects)if(object.properties?.subType==='nara_rotor')Object.assign(object.properties,{neonRotor:true,neonAccent:level===3?0xff79d5:0x73e5f2});
  if(world===7&&level===3&&!data.properties?.osakaRevision&&!data.customSaved&&!data.properties?.userSaved&&!data.objects.some(o=>o.id.startsWith('obj-custom'))) {
    const official=WORLD_07_LEVEL_03_STAGES[stage];if(official)return structuredClone(official);
  }
  // Replace only an unsaved generated placeholder; real editor saves retain their geometry.
  if(world===7&&level===2&&!data.properties?.naraRevision&&!data.customSaved&&!data.properties?.userSaved&&!data.objects.some(o=>o.id.startsWith('obj-custom'))) {
    const official=WORLD_07_LEVEL_02_STAGES[stage];if(official)return structuredClone(official);
  }
  if(world===7&&level===2&&stage===1&&data.properties?.naraStationRevision!==NARA_STATION_REVISION) {
    // Old editor saves may still have purely visual stations. Apply just the requested collision/rail changes.
    for(const obj of data.objects) {
      const kind=String(obj.properties?.subType??'');
      if(['nara_station','nara_tracks','kyoto_island','kyoto_pine','kyoto_sakura','kyoto_shrine'].includes(kind))obj.properties={...obj.properties,hasCollision:true};
    }
    if(!data.objects.some(obj=>obj.properties?.subType==='nara_tracks')) {
      const rail=WORLD_07_LEVEL_02_STAGES[1].objects.find(obj=>obj.properties?.subType==='nara_tracks');
      if(rail) {
        const copy=structuredClone(rail),train=data.objects.find(obj=>obj.properties?.naraAction==='train');
        if(train)copy.position={x:train.position.x,y:train.position.y-1,z:train.position.z-120};
        if(data.objects.some(obj=>obj.id===copy.id))copy.id+='-rails-update';
        data.objects.push(copy);
      }
    }
    const train=data.objects.find(obj=>obj.properties?.naraAction==='train');
    if(train&&Math.abs(data.spawn.x-train.position.x)<3&&Math.abs(data.spawn.z-train.position.z)<13&&Math.abs(data.spawn.y-train.position.y)<4) {
      const station=data.objects.filter(obj=>obj.properties?.subType==='nara_station').sort((a,b)=>Math.abs(a.position.z-train.position.z)-Math.abs(b.position.z-train.position.z))[0];
      if(station)data.spawn={x:station.position.x+6.3,y:station.position.y+1.05,z:station.position.z+1.5};
    }
    data.properties={...data.properties,naraStationRevision:NARA_STATION_REVISION};
  }
  if(world===7&&level===2&&[7,8,9,10].includes(stage)&&data.properties?.naraChallengeRevision!==NARA_CHALLENGE_REVISION) {
    const official=WORLD_07_LEVEL_02_STAGES[stage];
    if(stage===7&&data.properties?.naraChallengeRevision==='nara-challenges-v3') {
      const exit=data.objects.find(o=>o.id==='w7n2e7-mochi-west');
      const points=exit?.properties?.points as {x:number;y:number;z:number}[]|undefined;
      const previous=naraPath([nv(-14,10,0),nv(-14,10,9),nv(-24,12,18),nv(-37,14,17),nv(-43,14,6),nv(-36,14,-9),nv(-44,14,-19)],4.6,true).points;
      // Undo the previous automatic lowering, preserving custom offsets and the horizontal layout.
      if(points)points.forEach((p,i)=>{p.y+=14-previous[Math.round(i*(previous.length-1)/Math.max(1,points.length-1))].y;});
    }
    for(const object of official.objects.filter(o=>o.properties?.naraAction==='rotor'))if(!data.objects.some(o=>o.id===object.id))data.objects.push(structuredClone(object));
    for(const object of data.objects)if(object.properties?.subType==='nara_bowl') {
      const authored=official.objects.find(o=>o.id===object.id);
      object.properties={...object.properties,naraAction:'bowl',hasCollision:true,sticky:true,spinSpeed:authored?.properties?.spinSpeed??1.5};
    }
    data.properties={...data.properties,naraChallengeRevision:NARA_CHALLENGE_REVISION};
  }
  if(world===7&&level===1) {
    if([1,2,5,6].includes(stage)&&data.properties?.kyotoRevision==='kyoto-v2')data.properties={...data.properties,kyotoRevision:KYOTO_REVISION};
    const official=WORLD_07_LEVEL_01_STAGES[stage];
    if(official&&data.properties?.kyotoRevision!==KYOTO_REVISION) {
      const fresh=structuredClone(official),extras=data.objects.filter(object=>object.id.startsWith('obj-custom'));
      return {...data,...fresh,customSaved:data.customSaved,objects:[...fresh.objects,...extras],properties:{...data.properties,...fresh.properties}};
    }
    if(stage===8&&official&&data.properties?.spiralWidthRevision!==official.properties?.spiralWidthRevision) {
      const widths=official.objects.find(object=>object.properties?.subType==='kyoto_path')?.properties?.widths as number[];
      for(const object of data.objects)if(object.properties?.subType==='kyoto_path') {
        const count=(object.properties.points as unknown[]).length;
        object.properties.widths=Array.from({length:count},(_,i)=>{
          const at=i*(widths.length-1)/Math.max(1,count-1),a=Math.floor(at),b=Math.min(a+1,widths.length-1);
          return widths[a]+(widths[b]-widths[a])*(at-a);
        });
      }
      data.properties={...data.properties,spiralWidthRevision:official.properties?.spiralWidthRevision};
    }
    return data;
  }
  if(world===6&&level===4) {
    // This revision changes stages 6–10; retain existing edits in the first five stages.
    if(stage<=5&&data.properties?.bigBenRevision==='big-ben-christmas-v1')data.properties={...data.properties,bigBenRevision:BIG_BEN_REVISION};
    const official=WORLD_06_LEVEL_04_STAGES[stage];
    if(official&&data.properties?.bigBenRevision!==BIG_BEN_REVISION) {
      const fresh=structuredClone(official),extras=data.objects.filter(object=>object.id.startsWith('obj-custom'));
      return {...data,...fresh,customSaved:data.customSaved,objects:[...fresh.objects,...extras],properties:{...data.properties,...fresh.properties}};
    }
    if(stage===1)for(const object of data.objects)if(object.properties?.benAction==='portal')object.properties.hasCollision=true;
    if(stage===2&&data.properties?.hamleysRevision!==2) {
      const freshById=new Map(official?.objects.map(object=>[object.id,object]));
      for(const object of data.objects) {
        if(object.properties?.benAction==='plane')object.position.y=toyPlaneHeight(Number(object.properties.index??0));
        else if(object.id==='w6s42-llegada')object.position.y=TOY_LANDING_Y-.4;
        else if(object.type==='goal')object.position.y=TOY_LANDING_Y+.1;
        else if(object.type==='collectible'&&freshById.has(object.id))object.position.y=freshById.get(object.id)!.position.y;
      }
      data.properties={...data.properties,hamleysRevision:2};
    }
    return data;
  }
  if((world===2&&level===2&&stage===6||world===4&&level===3&&stage===1)&&data.properties?.bikeRevision!==BIKE_REVISION) return rebuildBikeCourse(data);
  if(world===6&&level===3) {
    const official=WORLD_06_LEVEL_03_STAGES[stage];
    if(official&&data.properties?.oxfordRevision!==OXFORD_REVISION) {
      const fresh=structuredClone(official),extras=data.objects.filter(o=>o.id.startsWith('obj-custom'));
      return {...data,...fresh,customSaved:data.customSaved,objects:[...fresh.objects,...extras],properties:{...data.properties,...fresh.properties}};
    }
    return data;
  }
  if(world===6&&level===2) {
    const official=WORLD_06_LEVEL_02_STAGES[stage];
    if(official&&data.properties?.museumRevision!==MUSEUM_REVISION) {
      const fresh=structuredClone(official),extras=data.objects.filter(o=>o.id.startsWith("obj-custom"));
      return {...data,...fresh,customSaved:data.customSaved,objects:[...fresh.objects,...extras],properties:{...data.properties,...fresh.properties}};
    }
    return data;
  }
  if(world===6&&level===1) {
    const official=WORLD_06_LEVEL_01_STAGES[stage];
    if(official&&data.properties?.londonRevision!==LONDON_REVISION) {
      const fresh=structuredClone(official),extras=data.objects.filter(o=>o.id.startsWith("obj-custom"));
      return {...data,...fresh,customSaved:data.customSaved,objects:[...fresh.objects,...extras],properties:{...data.properties,...fresh.properties}};
    }
    return data;
  }
  if(world===5 && level===4) {
    const official=WORLD_05_LEVEL_04_STAGES[stage];
    if(official && data.properties?.covadongaRevision!=="picos-covadonga-v1") {
      const fresh=structuredClone(official),extras=data.objects.filter(o=>o.id.startsWith("obj-custom"));
      return {...data,...fresh,customSaved:data.customSaved,objects:[...fresh.objects,...extras],properties:{...data.properties,...fresh.properties}};
    }
    if(official && data.properties?.covadongaSceneryRevision!=="grounded-picos-v2") {
      const oldLandscape=data.objects.find(o=>o.properties?.subType==="asturias_cov_landscape"),freshLandscape=official.objects.find(o=>o.properties?.subType==="asturias_cov_landscape");
      if(oldLandscape && freshLandscape) {
        const route=data.objects.find(o=>o.properties?.subType==="asturias_cov_road");
        oldLandscape.properties={...oldLandscape.properties,...structuredClone(freshLandscape.properties),
          points:route?.properties?.points??freshLandscape.properties?.points,routeWidth:route?.properties?.width??12};
      }
      data.objects.filter(o=>o.properties?.covadongaAction==="cow").forEach((cow,i)=>{
        cow.properties!.cowBreed??=["brown","dairy","black","white"][i%4];
        if(stage===7) cow.properties!.amplitude=Math.min(Number(cow.properties!.amplitude??2.95),2.95);
      });
      for(const object of official.objects.filter(o=>o.properties?.subType==="asturias_cov_outcrop")) if(!data.objects.some(o=>o.id===object.id)) data.objects.push(structuredClone(object));
      data.properties={...data.properties,covadongaSceneryRevision:"grounded-picos-v2"};
    }
    if(official && stage===10 && data.properties?.backRoundRouteRevision!=="ds-reference-v3") {
      for(const fresh of official.objects) {
        const saved=data.objects.find(o=>o.id===fresh.id);
        if(!saved) {data.objects.push(structuredClone(fresh));continue;}
        if(fresh.properties?.subType==="asturias_cov_landscape") {
          saved.properties={...saved.properties,points:structuredClone(fresh.properties.points),routeWidth:fresh.properties.routeWidth};
        } else {
          saved.position={...fresh.position};saved.rotation={...fresh.rotation};saved.scale={...fresh.scale};
          if(fresh.properties?.subType==="asturias_cov_road") saved.properties={...saved.properties,...structuredClone(fresh.properties)};
        }
      }
      data.spawn={...official.spawn};
      data.properties={...data.properties,backRoundRouteRevision:"ds-reference-v3"};
    }
    if(official && stage===6 && data.properties?.covadongaMineRevision!=="paced-mine-v2") {
      const extras=data.objects.filter(o=>!o.id.startsWith("w5s46-"));
      data.objects=[...structuredClone(official.objects),...extras];data.spawn={...official.spawn};
      data.properties={...data.properties,...official.properties};
    }
    return data;
  }
  if(world===5 && level===3) {
    const official=WORLD_05_LEVEL_03_STAGES[stage];
    if(official && !data.properties?.sellaRevision) {
      const extras=data.objects.filter(object=>object.id.startsWith("obj-custom"));
      const updated=structuredClone(official);
      return {...data,...updated,customSaved:data.customSaved,objects:[...updated.objects,...extras],
        properties:{...data.properties,...updated.properties,sellaRevision:"sella-canoe-v1"}};
    }
    if(official && stage===2 && data.properties?.sellaE2Revision!=="sella-land-short-v2") {
      const extras=data.objects.filter(object=>!object.id.startsWith("w5s32-"));
      data.objects=[...structuredClone(official.objects),...extras];data.spawn={...official.spawn};data.timeLimit=official.timeLimit;
      data.properties={...data.properties,...official.properties};
    }
    if(official && stage===10 && data.properties?.sellaRouteRevision!=="mega-aligned-river-v7") {
      const extras=data.objects.filter(object=>!object.id.startsWith("w5s310-"));
      data.objects=[...structuredClone(official.objects),...extras];data.spawn={...official.spawn};
      data.properties={...data.properties,...official.properties};
    }
    data.objects=data.objects.filter(object=>!(stage!==3 && object.id===`w5s3${stage}-cartel-salida`) &&
      !(typeof object.properties?.caption==="string" && /W:\s*REMAR|REMO IZQ\.|HUNDIR REMO/.test(object.properties.caption)));
    for(const object of data.objects) if(object.properties?.subType==="asturias_sella_river") {
      object.properties.bankCollision??=object.properties.hasCollision!==false;
      object.properties.hasCollision=false;
      object.type="water";object.properties.passable=true;object.properties.fluidType="water";
    }
    if(stage===10 && !data.properties?.sellaDescentRevision) {
      data.timeLimit=Math.max(data.timeLimit,480);data.properties={...data.properties,sellaDescentRevision:"manageable-descents-v1"};
    }
    if(stage===10 && official && data.properties?.sellaMegaRevision!=="mega-current-60-v5") {
      for(const object of data.objects) if(object.properties?.subType==="asturias_sella_river") object.properties.current=60/3.6;
      data.properties={...data.properties,canoePace:1.35,sellaMegaRevision:"mega-current-60-v5"};
    }
    if(official?.properties?.sellaRocksRevision && data.properties?.sellaRocksRevision!==official.properties.sellaRocksRevision) {
      const prefix=`w5s3${stage}-roca-`;
      data.objects=data.objects.filter(object=>!object.id.startsWith(prefix));
      data.objects.push(...structuredClone(official.objects.filter(object=>object.id.startsWith(prefix))));
      data.properties={...data.properties,sellaRocksRevision:official.properties.sellaRocksRevision};
    }
    return data;
  }
  if (world === 5 && level === 2 && Array.isArray(data.objects)) {
    updateSavedCangasStage(data,stage);
    return updateCangasPolish(data,stage);
  }
  if (world !== 4 || level !== 4 || !Array.isArray(data.objects)) return data;

  if (stage === 3) {
    const boxes = data.objects.filter(object => object.properties?.variant === "funko_pop_box");
    const series = ["dragon_ball", "harry_potter", "disney", "dragon_ball", "harry_potter"];
    boxes.forEach((box, index) => {
      box.properties = { ...box.properties, series: series[index % series.length] };
    });
  }

  if (stage === 6 || stage === 9) {
    const fillings = ["turkey_cheese", "ensaladilla", "tuna_tomato"];
    data.objects.forEach(object => {
      const sandwich = /^w4s46-sandwich-([1-3])$/.exec(object.id);
      if (stage === 6 && sandwich) {
        object.properties = { ...object.properties, filling: fillings[Number(sandwich[1]) - 1] };
      }
      if (stage === 9 && object.properties?.variant === "cinema_seat_row") {
        const count = Math.max(1, Math.floor(Number(object.properties.seatCount) || 8));
        // Stable gaps across gameplay, editor and reloads.
        let hash = 2166136261;
        for (const char of object.id) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
        object.properties = { ...object.properties, seatCount: count, missingSeat: (hash >>> 0) % count };
      }
    });
  }

  if (stage === 7) {
    const roll = data.objects.find(object => object.id === "w4s47-quesarito-cylinder");
    if (roll) {
      const radius = 5.8;
      const rise = radius - Number(roll.properties?.radius ?? roll.scale.x / 2);
      roll.position = { x: 0, y: 0, z: 0 };
      roll.rotation = { x: 0, y: 0, z: 0 };
      roll.scale = { x: radius * 2, y: radius * 2, z: 68 };
      roll.properties = { ...roll.properties, radius, speed: 3.3, rollSpeed: 3.3 };
      data.spawn = { ...data.spawn, y: data.spawn.y + rise };
      for (const object of data.objects) {
        if (/^w4s47-(start-dock|corner-goal-dock|goal|col-\d+)$/.test(object.id)) {
          object.position = { ...object.position, y: object.position.y + rise };
        }
      }
    }
  }

  if (stage === 10) updateVivaGym(data);

  return data;
}

function updateSavedCangasStage(data:LevelData,stage:number):LevelData {
  const revision="cangas-physics-layout-2026-11-11-v1";
  if(![2,3,4,6,7,9,10].includes(stage) || data.properties?.cangasRequestedRevision===revision) return data;
  const official=WORLD_05_LEVEL_02_STAGES[stage];
  if(!official) return data;
  const prefix=`w5s2${stage}-`;
  // Replace the requested stage's original layout, retaining editor additions and metadata.
  // A revision marker allows subsequent editor edits to survive saving and reloading.
  const previous=new Map(data.objects.map(object=>[object.id,object]));
  const updated=official.objects.map(object=>{
    const saved=previous.get(object.id);
    const fresh=structuredClone(object);
    return {...saved,...fresh,properties:{...saved?.properties,...fresh.properties}};
  });
  data.objects=[...updated,...data.objects.filter(object=>!object.id.startsWith(prefix))];
  data.spawn={...official.spawn};
  data.timeLimit=official.timeLimit;
  data.properties={...data.properties,cangasRequestedRevision:revision};
  return data;
}

function updateCangasPolish(data:LevelData,stage:number):LevelData {
  const revision="cangas-magnets-icecream-honey-v2";
  if(![4,6,9,10].includes(stage) || data.properties?.cangasPolishRevision===revision) return data;
  for(const official of WORLD_05_LEVEL_02_STAGES[stage].objects) {
    if(official.properties?.cangasAction!=="magnet" && official.properties?.cangasAction!=="icecream" &&
        !(stage===10 && official.properties?.cangasAction==="launch") && !official.id.endsWith("-miel-superior")) continue;
    const saved=data.objects.find(object=>object.id===official.id);
    if(saved) saved.properties={...saved.properties,...official.properties};
    else data.objects.push(structuredClone(official));
  }
  data.properties={...data.properties,cangasPolishRevision:revision};
  return data;
}

function updateVivaGym(data: LevelData): void {
  const treadmill = data.objects.find(object => object.properties?.movementType === "vivagym_treadmill");
  if (!treadmill) return;
  treadmill.properties = { ...treadmill.properties, speed: 1.3, pushSpeed: 1.3 };
  const goalDock = data.objects.find(object => object.id === "w4s410-goal-dock");
  if (goalDock) goalDock.properties = { ...goalDock.properties, customColor: "#f47b20" };

  const profiles = [
    { form: "bar", x: 5.2, y: 0.65, z: 1.35 },
    { form: "drum", x: 2.4, y: 1.35, z: 2.4 },
    { form: "block", x: 3.1, y: 1.7, z: 1.9 },
    { form: "bar", x: 4.4, y: 0.95, z: 2.2 },
    { form: "drum", x: 1.75, y: 1.9, z: 1.75 },
    { form: "block", x: 3.7, y: 1.2, z: 1.5 }
  ];
  const count = 24;
  const distance = Math.max(4, treadmill.scale.z - 12);
  const byId = new Map(data.objects.map(object => [object.id, object]));
  for (let index = 0; index < count; index++) {
    const id = `w4s410-obstacle-loop-${index + 1}`;
    const { form, x, y, z } = profiles[(index + Math.floor(index / 6)) % profiles.length];
    const scale = { x, y, z };
    const phase = (index + 0.5) / count;
    const centerY = treadmill.position.y + 0.9 + y / 2;
    const centerZ = treadmill.position.z;
    const speed = 8.5;
    const lane = index % 3 - 1;
    const position = {
      x: treadmill.position.x + lane * treadmill.scale.x * 0.29 + Math.sin(index * 2.4) * 0.6,
      ...sampleVivaGymObstacle(0, speed, distance, phase, centerY, centerZ)
    };
    const obstacle: LevelObjectData = byId.get(id) ?? {
      id, type: "moving-platform", position, rotation: { x: 0, y: 0, z: 0 }, scale
    };
    obstacle.position = position;
    obstacle.scale = scale;
    obstacle.properties = {
      ...obstacle.properties, movementType: "vivagym_obstacle", obstacleForm: form,
      axis: "z", speed, distance, phase, centerY, centerZ, startDelay: 0
    };
    if (!byId.has(id)) data.objects.push(obstacle);
  }
}

/** Closed track with a straight upper pass and a return underneath the deck. */
export function sampleVivaGymObstacle(time: number, speed: number, length: number, phase: number, top: number, center: number) {
  const radius = 2.6;
  const bend = Math.PI * radius;
  const lap = 2 * (length + bend);
  const travel = (time * speed + phase * lap) % lap;
  const start = center - length / 2;
  const end = center + length / 2;
  if (travel < length) return { y: top, z: start + travel };
  if (travel < length + bend) {
    const angle = (travel - length) / radius;
    return { y: top - radius * (1 - Math.cos(angle)), z: end + radius * Math.sin(angle) };
  }
  if (travel < 2 * length + bend) return { y: top - 2 * radius, z: end - (travel - length - bend) };
  const angle = (travel - 2 * length - bend) / radius;
  return { y: top - radius * (1 + Math.cos(angle)), z: start - radius * Math.sin(angle) };
}




