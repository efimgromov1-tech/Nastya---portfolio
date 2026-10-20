// One complete image per flower, positioned on the page rather than in frames.
const blooms = [
 [39,90,241,240,5,.7],[974,-100,206,205,5,.8],
 [796,546,206,205,5,.7],[-82,792,286,286,3.5,.8],
 [688,1751,286,286,3.5,.8],[813,2015,286,286,3.5,.8],
 [-89,2789,286,286,3.5,.8],[1236,2829,286,286,3.5,.8],
 [554,3475,286,286,3.5,.8],[1173,3828,286,286,3.5,.8],
 [-106,4776,212,211,3.5,.8],[-129,5092,258,257,3.5,.8],
 [1319,5786,207,206,3.5,.8]
];
const photoSlots = [[833,990,607,990],[941,2029,371,644],
 [197,2483,417,350],[61,3319,315,551],[408,3317,312,551],
 [152,4239,430,625]];

function cleanFlowerPixels(ctx, heroCtx) {
 const width=ctx.canvas.width,height=ctx.canvas.height;
 const sx=width/1440,sy=height/5940;
 const foreground=[];
 const heroPixels=heroCtx.getImageData(0,0,heroCtx.canvas.width,heroCtx.canvas.height).data;
 for(const [bx,by,bw,bh] of blooms){
  const left=Math.max(0,Math.floor((bx-22)*sx));
  const top=Math.max(0,Math.floor((by-22)*sy));
  const right=Math.min(width,Math.ceil((bx+bw+22)*sx));
  const bottom=Math.min(height,Math.ceil((by+bh+22)*sy));
  const w=right-left,h=bottom-top;
  if(w<=0||h<=0)continue;
  const region=ctx.getImageData(left,top,w,h);
  const front=ctx.createImageData(w,h);
  for(let py=0;py<h;py++)for(let px=0;px<w;px++){
   const i=(py*w+px)*4,x=(left+px)/sx,y=(top+py)/sy;
   const r=region.data[i],g=region.data[i+1],b=region.data[i+2];
   let protectedPixel=photoSlots.some(([a,c,d,e])=>x>=a&&x<a+d&&y>=c&&y<c+e);
   if(y<990&&x>=280&&x<1161){
    const hx=Math.min(heroCtx.canvas.width-1,Math.max(0,Math.floor((x-280)/881*heroCtx.canvas.width)));
    const hy=Math.min(heroCtx.canvas.height-1,Math.max(0,Math.floor((y+184)/1174*heroCtx.canvas.height)));
    protectedPixel ||= heroPixels[(hy*heroCtx.canvas.width+hx)*4+3]>20;
   }
   // White lettering and cream headings stay in front of the flowers.
   const textPixel=r>200&&g>155&&b>158;
   if(protectedPixel||textPixel){
    front.data.set(region.data.subarray(i,i+4),i);
   }else if(g>114&&b<154&&r>135){
    region.data[i]=235;region.data[i+1]=112;region.data[i+2]=154;
   }
  }
  ctx.putImageData(region,left,top);
  foreground.push({left,top,w,h,data:front});
 }
 return foreground;
}

async function initPortfolio(){
 const artwork=document.querySelector('.artwork');
 const load=src=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=src;});
 const [source,hero,aboutPortrait]=await Promise.all([load(artwork.src),load('assets/hero.webp'),load('assets/about.webp')]);
 const base=document.createElement('canvas');base.width=source.naturalWidth;base.height=source.naturalHeight;
 base.className='clean-artwork';base.setAttribute('aria-hidden','true');
 const ctx=base.getContext('2d',{willReadFrequently:true});ctx.drawImage(source,0,0);
 const heroCanvas=document.createElement('canvas');heroCanvas.width=hero.naturalWidth;heroCanvas.height=hero.naturalHeight;
 const heroCtx=heroCanvas.getContext('2d',{willReadFrequently:true});heroCtx.drawImage(hero,0,0);
 const foreground=cleanFlowerPixels(ctx,heroCtx);
 const layer=document.getElementById('flowers');layer.replaceChildren();
 blooms.forEach(([x,y,w,h,blur,opacity],index)=>{
  const wrap=document.createElement('div');wrap.className='whole-flower';
  wrap.style.cssText=`left:${x/1440*100}%;top:${y/5940*100}%;width:${w/1440*100}%;aspect-ratio:${w}/${h};--blur:${blur/1440*100}vw;--opacity:${opacity};--delay:${-index*1.73}s;--duration:${9+index%5}s`;
  const img=new Image();img.src='assets/dandelion.png';img.alt='';wrap.append(img);layer.append(wrap);
 });
 for(const patch of foreground){
  const canvas=document.createElement('canvas');canvas.width=patch.w;canvas.height=patch.h;canvas.className='foreground';canvas.setAttribute('aria-hidden','true');
  canvas.style.cssText=`left:${patch.left/base.width*100}%;top:${patch.top/base.height*100}%;width:${patch.w/base.width*100}%;height:${patch.h/base.height*100}%`;
  canvas.getContext('2d').putImageData(patch.data,0,0);layer.append(canvas);
 }
 // Keep the entire about portrait above the animated decoration, including
 // every position reached during the flower's animation.
 const photo=document.createElement('canvas');
 const photoRect={x:1248,y:1483,width:912,height:1482};
 photo.width=photoRect.width;photo.height=photoRect.height;
 photo.className='about-photo-shield';photo.setAttribute('aria-hidden','true');
 photo.style.cssText=`left:${photoRect.x/base.width*100}%;top:${photoRect.y/base.height*100}%;width:${photoRect.width/base.width*100}%;height:${photoRect.height/base.height*100}%;`;
 const photoScale=Math.max(photo.width/aboutPortrait.naturalWidth,photo.height/aboutPortrait.naturalHeight);
 const portraitWidth=aboutPortrait.naturalWidth*photoScale;
 const portraitHeight=aboutPortrait.naturalHeight*photoScale;
 photo.getContext('2d').drawImage(aboutPortrait,(photo.width-portraitWidth)/2,(photo.height-portraitHeight)/2,portraitWidth,portraitHeight);
 layer.append(photo);
 artwork.after(base);artwork.classList.add('accessible-artwork');
 document.documentElement.classList.add('flowers-ready');
}
if(typeof document!=='undefined')initPortfolio().catch(error=>console.error('Portfolio decorations could not load',error));
