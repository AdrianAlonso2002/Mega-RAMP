// Exact Euclidean distance to transparency. No generated artwork or resampling.
export function distanceToBackground(rgba,width,height) {
  const field=new Float32Array(width*height),line=new Float64Array(Math.max(width,height)),out=new Float64Array(line.length);
  const sites=new Int32Array(line.length),limits=new Float64Array(line.length+1);
  function transform(length) {
    let k=0;sites[0]=0;limits[0]=-Infinity;limits[1]=Infinity;
    for(let q=1;q<length;q++) {
      let s=((line[q]+q*q)-(line[sites[k]]+sites[k]*sites[k]))/(2*(q-sites[k]));
      while(s<=limits[k]){k--;s=((line[q]+q*q)-(line[sites[k]]+sites[k]*sites[k]))/(2*(q-sites[k]));}
      sites[++k]=q;limits[k]=s;limits[k+1]=Infinity;
    }
    k=0;
    for(let q=0;q<length;q++){while(limits[k+1]<q)k++;out[q]=(q-sites[k])**2+line[sites[k]];}
  }
  for(let y=0;y<height;y++) {
    for(let x=0;x<width;x++)line[x]=rgba[(y*width+x)*4+3]>=128?1e9:0;
    transform(width);for(let x=0;x<width;x++)field[y*width+x]=out[x];
  }
  for(let x=0;x<width;x++) {
    for(let y=0;y<height;y++)line[y]=field[y*width+x];
    transform(height);for(let y=0;y<height;y++)field[y*width+x]=out[y];
  }
  return field;
}

/** Smooth only exterior coverage; retain the original ink thickness and RGB. */
export function normalizeCharacterOutline(input,width,height,lockThrough=0) {
 if(input.length!==width*height*4)throw Error('Expected RGBA pixels');
 const distances=distanceToBackground(input,width,height);
 const sigma=.65,weights=Array.from({length:5},(_,i)=>Math.exp(-((i-2)**2)/(2*sigma*sigma)));
 const sum=weights.reduce((a,b)=>a+b,0);for(let i=0;i<5;i++)weights[i]/=sum;
 const horizontal=new Float32Array(width*height),output=Buffer.from(input);let changed=0;
 for(let y=0;y<height;y++)for(let x=0;x<width;x++) {
  let alpha=0;for(let k=-2;k<=2;k++){const nx=x+k;if(nx>=0&&nx<width)alpha+=input[(y*width+nx)*4+3]*weights[k+2];}
  horizontal[y*width+x]=alpha;
 }
 for(let y=0;y<height;y++)for(let x=0;x<width;x++) {
  let alpha=0;for(let k=-2;k<=2;k++){const ny=y<lockThrough?Math.min(y+k,lockThrough-1):y+k;if(ny>=0&&ny<height)alpha+=horizontal[ny*width+x]*weights[k+2];}
  const j=(y*width+x)*4,a=Math.round(alpha);
  if(a===input[j+3]||distances[y*width+x]>8)continue;
  output[j+3]=a;
  // Newly covered pixels belong to exterior ink, never a white matte.
  if(input[j+3]===0&&a>0){output[j]=14;output[j+1]=14;output[j+2]=16;}
  changed++;
 }
 return {pixels:output,changed,recovered:0,stroke:null,band:3};
}
