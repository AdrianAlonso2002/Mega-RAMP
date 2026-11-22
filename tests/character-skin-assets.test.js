import {describe,expect,it} from 'vitest';
import {readFileSync,existsSync} from 'node:fs';
import {inflateSync} from 'node:zlib';
import {CHARACTERS} from '../src/player/Characters';
import {getCharacterSkins,characterSpritePath} from '../src/player/CharacterSkins';
describe('Production character skin assets',()=>{
  it('keeps every scared face and torso pixel identical while alternating both legs/paws',()=>{
    const manifest=JSON.parse(readFileSync('art/character-skins/generation-v4.json','utf8'));
    function pixels(file) {
      const bytes=readFileSync(file),chunks=[];
      for(let p=8;p<bytes.length;){const n=bytes.readUInt32BE(p);if(bytes.toString('ascii',p+4,p+8)==='IDAT')chunks.push(bytes.subarray(p+8,p+8+n));p+=12+n;}
      const scan=inflateSync(Buffer.concat(chunks)),out=Buffer.alloc(512*512*4);
      for(let y=0;y<512;y++){expect(scan[y*2049]).toBe(0);scan.copy(out,y*2048,y*2049+1,y*2049+2049);}
      return out;
    }
    for(const {key,lockThrough} of manifest.assets) {
      const a=pixels(`public/assets/characters/${key}_scary1.png`),b=pixels(`public/assets/characters/${key}_scary2.png`);
      expect(a.subarray(0,lockThrough*2048).equals(b.subarray(0,lockThrough*2048)),`${key} fixed face and torso`).toBe(true);
      const changes=[0,0];
      for(let y=lockThrough;y<512;y++)for(let x=0;x<512;x++) {
        const p=(y*512+x)*4;
        if(Math.abs(a[p+3]-b[p+3])>24)changes[x<256?0:1]++;
      }
      expect(changes[0],`${key} left step`).toBeGreaterThan(80);
      expect(changes[1],`${key} right step`).toBeGreaterThan(80);
    }
  });
  it('ships all 48 nonempty, distinct, padded RGBA animations and valid portrait crops',()=>{
    const states=['normal','move1','move2','scary1','scary2','happy'];
    for(const c of CHARACTERS)for(const skin of getCharacterSkins(c.id)) {
      expect(skin.avatar[2]).toBeLessThan(.38);
      const files=states.map(state=>`public${characterSpritePath(c.id,skin.id,state)}`);
      files.forEach(file=>expect(existsSync(file),file).toBe(true));
      if(skin.id==='normal')continue;
      expect(new Set(files.map(file=>readFileSync(file).toString('base64'))).size).toBe(6);
      for(const rect of [skin.avatar,skin.eyes]) {
        expect(rect.every(n=>n>=0&&n<=1)).toBe(true);expect(rect[0]+rect[2]).toBeLessThanOrEqual(1);expect(rect[1]+rect[rect.length===3?2:3]).toBeLessThanOrEqual(1);
      }
      const heads=[];
      for(const file of files) {
        const bytes=readFileSync(file);expect(bytes.readUInt32BE(16)).toBe(512);expect(bytes.readUInt32BE(20)).toBe(512);expect(bytes[25]).toBe(6);
        const chunks=[];for(let p=8;p<bytes.length;) {const len=bytes.readUInt32BE(p);if(bytes.toString('ascii',p+4,p+8)==='IDAT')chunks.push(bytes.subarray(p+8,p+8+len));p+=12+len;}
        const raw=inflateSync(Buffer.concat(chunks)),stride=2049;let filled=0,minY=512,maxY=0,edgeAlpha=0;
        for(let y=0;y<512;y++)for(let x=0;x<512;x++) {const alpha=raw[y*stride+1+x*4+3];
          if(x<12||x>=500||y<12||y>=500)edgeAlpha+=alpha;
          if(alpha>=24){filled++;minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
        }
        expect(edgeAlpha).toBe(0);expect(filled).toBeGreaterThan(12000);expect(maxY).toBeGreaterThanOrEqual(465);expect(maxY).toBeLessThanOrEqual(482);
        if(skin.id==='bebe')expect(maxY-minY).toBeLessThan(360);
        let left=512,right=0;
        for(let y=minY;y<minY+(maxY-minY)*.48;y++)for(let x=0;x<512;x++)if(raw[y*stride+1+x*4+3]>=24){left=Math.min(left,x);right=Math.max(right,x);}
        heads.push({x:(left+right)/2,y:minY});
      }
      expect(Math.max(...heads.map(h=>h.x))-Math.min(...heads.map(h=>h.x)),skin.spriteBase+' horizontal registration').toBeLessThanOrEqual(3);
      expect(Math.max(...heads.map(h=>h.y))-Math.min(...heads.map(h=>h.y)),skin.spriteBase+' vertical registration').toBeLessThanOrEqual(2);
    }
  });
});
