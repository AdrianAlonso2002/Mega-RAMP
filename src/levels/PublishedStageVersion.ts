import type {LevelData} from './LevelTypes';

const revisions=new WeakMap<LevelData,string>();
/** A saved edit is only current for the particular published design it came from. */
export function publishedStageVersion(data:LevelData):string {
  const cached=revisions.get(data);if(cached)return cached;
  const properties={...data.properties};delete properties.publishedBase;
  const text=JSON.stringify({...data,properties});
  let hash=2166136261;
  for(let i=0;i<text.length;i++)hash=Math.imul(hash^text.charCodeAt(i),16777619);
  const version=`${data.id}:${text.length}:${(hash>>>0).toString(16)}`;
  revisions.set(data,version);return version;
}

export function preferPublishedStage(official:LevelData|null,saved:LevelData):boolean {
  if(!official?.properties?.editorPublished)return false;
  // Local authoring always uses the author's latest browser save.
  const hostname=typeof location==='undefined'?'localhost':location.hostname;
  if(['localhost','127.0.0.1','[::1]','::1'].includes(hostname))return false;
  return saved.properties?.publishedBase!==publishedStageVersion(official);
}
