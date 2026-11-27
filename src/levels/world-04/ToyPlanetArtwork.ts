import type {LevelData} from '../LevelTypes';
const art=['goku-948','elliot-et-1252','scarlet-witch-1034','kamehameha-2223','hermione-113'];
/** Assign exact packaging to the five existing platforms without altering their movement or dimensions. */
export function upgradeToyPlanetArt(data:LevelData):LevelData {
 if(data.world!==4||data.level!==4||data.stage!==3||data.properties?.toyPlanetArtRevision===1)return data;
 for(const object of data.objects){const match=/^w4s43-funko-([1-5])$/.exec(object.id);if(match)object.properties={...object.properties,funkoArtwork:art[Number(match[1])-1]};}
 data.properties={...data.properties,toyPlanetArtRevision:1};return data;
}
