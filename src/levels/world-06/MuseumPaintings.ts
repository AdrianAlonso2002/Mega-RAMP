import * as THREE from "three";
const textures=new Map<string,THREE.CanvasTexture>();
export const MUSEUM_PAINTING_TITLES=["Atardecer en el Támesis","El carro junto al río","Girasoles dorados","Veleros en la costa","El puente de piedra","Paisaje con cipreses","Jardín al anochecer","La galería de mármol"];
/** Original procedural paintings inspired by nineteenth-century gallery art.
 * Both copies use the same seed and brush strokes; only the named detail differs. */
export function museumPaintingTexture(row:number,different:boolean):THREE.CanvasTexture|null {
  const key=`${row}-${different}`;if(textures.has(key)) return textures.get(key)!;
  if(typeof document==="undefined") return null;
  const canvas=document.createElement("canvas");canvas.width=768;canvas.height=512;const c=canvas.getContext("2d");if(!c) return null;
  let state=49157+row*7919;const rnd=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
  const sky=c.createLinearGradient(0,0,0,512);
  const colours=row===6 ? ["#242d4f","#977e79"]:row===2 ? ["#c4ae65","#968a4c"]:row===7 ? ["#847466","#d8c6a3"]:["#7796aa","#e9c393"];
  sky.addColorStop(0,colours[0]);sky.addColorStop(1,colours[1]);c.fillStyle=sky;c.fillRect(0,0,768,512);
  c.globalAlpha=.12;
  for(let i=0;i<1800;i++) {const x=rnd()*768,y=rnd()*512;c.fillStyle=i%3 ? "#ffe5b0":"#405770";c.fillRect(x,y,3+rnd()*20,1+rnd()*5);}c.globalAlpha=1;
  const ellipse=(x:number,y:number,rx:number,ry:number,colour:string)=>{c.fillStyle=colour;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();};
  const poly=(pts:number[][],colour:string)=>{c.fillStyle=colour;c.beginPath();pts.forEach(([x,y],i)=>i ? c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();};
  const stroke=(pts:number[][],colour:string,width:number)=>{c.strokeStyle=colour;c.lineWidth=width;c.beginPath();pts.forEach(([x,y],i)=>i ? c.lineTo(x,y):c.moveTo(x,y));c.stroke();};
  if(row===0||row===3) {
    c.fillStyle="#c8b591";c.fillRect(0,300,768,212);ellipse(610,224,42,42,"#efc77f");
    c.globalAlpha=.4;for(let i=0;i<360;i++) {c.fillStyle=i%2 ? "#edcf92":"#6d8894";c.fillRect(rnd()*768,300+rnd()*212,15+rnd()*70,1+rnd()*4);}c.globalAlpha=1;
    poly([[140,350],[405,350],[367,390],[173,386]],"#4e5a58");
    for(const x of [210,285,355]) {stroke([[x,351],[x,137]],"#635e51",5);stroke([[x,150],[150,354],[365,354]],"#c8bda0",2);}
    for(const x of [210,285,355]) for(const y of [180,245]) {
      c.save();c.translate(x,y);if(different&&x===285&&y===180) c.rotate(.14);
      poly([[-30,0],[29,1],[34,53],[-34,49]],"#ece0b9");stroke([[-30,18],[29,19]],"#b5a98c",1);c.restore();
    }
    poly([[443,399],[531,399],[512,418],[458,416]],"#5e5646");c.fillStyle="#484b48";c.fillRect(480,353,11,46);
    for(let i=0;i<6;i++) ellipse(489+i*19,348-i*12,23,9,"rgba(110,108,91,.25)");
  } else if(row===1||row===4||row===5) {
    poly([[0,310],[160,273],[290,310],[427,262],[768,303],[768,512],[0,512]],"#65714e");
    poly([[313,306],[459,316],[604,512],[186,512]],"#92a6a2");
    for(let i=0;i<270;i++) {const x=rnd()*768,y=310+rnd()*200;c.fillStyle=i%2 ? "#71855c":"#a0a574";c.fillRect(x,y,4+rnd()*15,2+rnd()*5);}
    poly([[45,289],[80,225],[207,225],[247,290]],"#796753");c.fillStyle="#b5b09a";c.fillRect(80,290,133,78);c.fillStyle="#5c6657";c.fillRect(110,318,28,49);
    if(row===1) {
      c.fillStyle="#9b8264";c.fillRect(300,356,145,38);stroke([[317,395],[317,425]],"#5f5144",7);stroke([[424,395],[424,425]],"#5f5144",7);
      for(const [x,y] of [[317,422],[424+(different ? 9:0),422]]) {c.strokeStyle="#4e5149";c.lineWidth=7;c.beginPath();c.arc(x,y,22,0,Math.PI*2);c.stroke();}
    } else if(row===4) {
      c.fillStyle="#b9b09b";c.fillRect(200,330,390,35);for(const x of [245,345,445,545]) {c.fillStyle="#5d746d";c.beginPath();c.arc(x,377,36,Math.PI,0);c.lineTo(x+36,415);c.lineTo(x-36,415);c.fill();}
      stroke([[190,330],[600,330]],"#ded0ad",7);c.fillStyle="#b9644e";c.fillRect(484+(different ? 8:0),272,21,32);stroke([[484,305],[484,330]],"#766548",3);
    } else {
      for(const [x,y,h] of [[560,330,190],[617,340,220],[672,345,155]]) {poly([[x-29,y],[x-20,y-h*.55],[x,y-h-(different&&x===617 ? 13:0)],[x+18,y-h*.6],[x+30,y]],"#3e594a");stroke([[x,y],[x,y-h*.78]],"#62745c",3);}
    }
  } else if(row===2) {
    c.fillStyle="#9a8c57";c.fillRect(0,394,768,118);ellipse(385,445,157,23,"#83764c");
    poly([[285,318],[469,318],[448,436],[307,436]],"#b19454");ellipse(377,319,94,17,"#d1b56f");
    const flowers=[[280,134],[380,111],[480,153],[340,205],[445,237],[252,255],[520,285]];
    for(const [i,[x,y]] of flowers.entries()) {
      stroke([[380,324],[x,y]],"#596544",6);
      for(let j=0;j<13;j++) {const a=j*Math.PI*2/13+(different&&i===2&&j===3 ? .2:0);c.save();c.translate(x+Math.cos(a)*35,y+Math.sin(a)*35);c.rotate(a);ellipse(0,0,29,9,i%2 ? "#c99634":"#ddaf40");c.restore();}
      ellipse(x,y,29,29,"#695a35");for(let j=0;j<30;j++) ellipse(x+(rnd()-.5)*38,y+(rnd()-.5)*38,1.5,1.5,"#a78940");
    }
  } else if(row===6) {
    ellipse(575+(different ? 7:0),112,32,32,"#ded5b4");poly([[0,320],[150,270],[370,305],[600,265],[768,300],[768,512],[0,512]],"#3d554e");
    for(let i=0;i<10;i++) {const x=60+i*73;stroke([[x,470],[x,220]],"#4f5b4c",12);for(let j=0;j<6;j++) ellipse(x+(rnd()-.5)*80,210+j*17,40,20,"#4c6655");}
    poly([[320,512],[405,310],[447,310],[500,512]],"#9c9c85");for(const x of [310,478]) {stroke([[x,403],[x,297]],"#544d46",4);ellipse(x,290,8,14,"#dfba73");}
  } else {
    poly([[0,0],[170,80],[170,430],[0,512]],"#a4957d");poly([[768,0],[600,80],[600,430],[768,512]],"#a4957d");poly([[170,430],[600,430],[768,512],[0,512]],"#c8b89a");
    for(const side of [-1,1]) for(let i=0;i<5;i++) {const x=384+side*(100+i*38);c.fillStyle="#d4c8af";c.fillRect(x,120-i*13,15,300+i*10);ellipse(x+7,115-i*13,20,10,"#e8d9ba");}
    c.fillStyle="#776855";c.fillRect(324,343,120,87);ellipse(384,276,47,66,"#bcae93");poly([[346,332],[422,332],[447,355],[321,355]],"#b7aa91");stroke([[364,265],[376,262]],"#7e7666",3);stroke([[393,262],[407,265+(different ? 5:0)]],"#7e7666",3);
  }
  // Fine canvas grain is identical in both variants and never obscures the clue.
  c.globalAlpha=.065;c.strokeStyle="#4b4438";c.lineWidth=1;for(let x=0;x<768;x+=3) {c.beginPath();c.moveTo(x,0);c.lineTo(x,512);c.stroke();}c.globalAlpha=1;
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;texture.userData={row,different,title:MUSEUM_PAINTING_TITLES[row]};textures.set(key,texture);return texture;
}
