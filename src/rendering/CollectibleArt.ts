export type CollectibleKind =
  "pan" | "dragon_ball" | "lonchas_pavo" | "varitas_estrella";
export function collectibleKind(id: string): CollectibleKind {
  if (["adri", "bolas", "dragon_ball"].includes(id)) return "dragon_ball";
  if (["misi", "pavo", "lonchas_pavo"].includes(id)) return "lonchas_pavo";
  if (["pao", "varitas", "varitas_estrella"].includes(id))
    return "varitas_estrella";
  return "pan";
}
function star(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5 - Math.PI / 2,
      rr = i % 2 ? r * 0.44 : r;
    if (i === 0) ctx.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    else ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath();
}
/** One antialiased drawing shared by every menu, map badge, HUD and low-quality billboard. */
export function drawCollectibleArt(
  ctx: CanvasRenderingContext2D,
  id: string,
  size: number,
): void {
  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.scale(size / 64, size / 64);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  switch (collectibleKind(id)) {
    case "pan": {
      ctx.translate(32, 32);
      ctx.rotate(-0.38);
      const crust = ctx.createLinearGradient(0, -15, 0, 18);
      crust.addColorStop(0, "#f6c477");
      crust.addColorStop(0.35, "#d88d38");
      crust.addColorStop(1, "#8c451b");
      ctx.fillStyle = crust;
      ctx.strokeStyle = "#94501f";
      ctx.lineWidth = 1.2;
      // A short cut heel, with a round cut face and a tapered bread tip.
      ctx.beginPath();
      ctx.moveTo(-15, -13);
      ctx.bezierCurveTo(0, -20, 22, -12, 25, 0);
      ctx.bezierCurveTo(27, 10, 6, 18, -15, 13);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      for (let i = 0; i < 20; i++) {
        const x = -8 + ((i * 7) % 29),
          y = -7 + ((i * 11) % 17);
        ctx.fillStyle = i % 2 ? "#b66b2a" : "#edb263";
        ctx.beginPath();
        ctx.ellipse(x, y, 0.7, 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = "#f9d99c";
      ctx.lineWidth = 2.3;
      ctx.beginPath();
      ctx.moveTo(-3, -9);
      ctx.quadraticCurveTo(0, -3, -2, 2);
      ctx.moveTo(8, -7);
      ctx.quadraticCurveTo(12, -2, 10, 3);
      ctx.stroke();
      const crumb = ctx.createRadialGradient(-19, -4, 1, -16, 1, 15);
      crumb.addColorStop(0, "#fff6d5");
      crumb.addColorStop(0.75, "#f3dca4");
      crumb.addColorStop(1, "#c78b43");
      ctx.fillStyle = crumb;
      ctx.strokeStyle = "#bc7835";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(-15, 0, 9, 13.3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      for (let i = 0; i < 14; i++) {
        const a = i * 2.4,
          r = 3 + (i % 3) * 2;
        ctx.fillStyle = i % 2 ? "#d6b879" : "#b9955d";
        ctx.beginPath();
        ctx.ellipse(
          -15 + Math.cos(a) * r * 0.7,
          Math.sin(a) * r * 1.3,
          0.55 + (i % 2) * 0.35,
          0.7 + (i % 3) * 0.25,
          i,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
      break;
    }
    case "lonchas_pavo": {
      // Exactly two thin slices, curled at the open ends, with restrained deli-meat tones.
      for (let i = 0; i < 2; i++) {
        ctx.save();
        ctx.translate(i ? 35 : 28, i ? 26 : 38);
        ctx.rotate(i ? 0.18 : -0.18);
        const meat = ctx.createLinearGradient(0, -11, 0, 13);
        meat.addColorStop(0, "#fff0df");
        meat.addColorStop(0.45, "#e7b1a5");
        meat.addColorStop(0.76, "#f6d2be");
        meat.addColorStop(1, "#bd7e73");
        ctx.fillStyle = meat;
        ctx.strokeStyle = "#bd8678";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-22, 1);
        ctx.bezierCurveTo(-24, -13, 13, -16, 22, -5);
        ctx.bezierCurveTo(27, 2, 18, 13, 6, 12);
        ctx.bezierCurveTo(-5, 11, -23, 14, -22, 1);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#a86f68";
        ctx.beginPath();
        ctx.ellipse(13, 0, 9, 8, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ffdfc9";
        ctx.lineWidth = 3.4;
        ctx.beginPath();
        ctx.ellipse(12, -0.3, 8, 7, -0.2, -2.2, 2.4);
        ctx.stroke();
        ctx.strokeStyle = "#ce9c8b";
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(-16, -2);
        ctx.bezierCurveTo(-9, -8, 2, -7, 10, -6);
        ctx.stroke();
        for (let j = 0; j < 13; j++) {
          ctx.fillStyle = j % 2 ? "#efc4b1" : "#d6a295";
          ctx.beginPath();
          ctx.ellipse(
            -15 + j * 1.7,
            -3 + Math.sin(j * 2.7) * 3,
            0.55,
            0.32,
            j,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
        ctx.restore();
      }
      break;
    }
    case "dragon_ball": {
      const amber = ctx.createRadialGradient(22, 18, 1, 33, 34, 26);
      amber.addColorStop(0, "#fff0a8");
      amber.addColorStop(0.35, "#ffbd3e");
      amber.addColorStop(0.72, "#f88a13");
      amber.addColorStop(1, "#b94004");
      ctx.fillStyle = amber;
      ctx.strokeStyle = "#f9c168";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(32, 32, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      for (const [x, y] of [
        [32, 23],
        [23, 32],
        [41, 32],
        [32, 41],
      ]) {
        star(ctx, x, y, 4.6);
        ctx.fillStyle = "#ce2521";
        ctx.fill();
        ctx.strokeStyle = "#a92a1a";
        ctx.lineWidth = 0.45;
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(255,255,255,.9)";
      ctx.beginPath();
      ctx.ellipse(23, 18, 7, 3.1, -0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,227,160,.75)";
      ctx.beginPath();
      ctx.ellipse(43, 46, 6, 1.3, -0.7, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "varitas_estrella": {
      ctx.save();
      ctx.translate(31, 32);
      ctx.rotate(0.44);
      const shaft = ctx.createLinearGradient(-3, 0, 4, 0);
      shaft.addColorStop(0, "#6946a2");
      shaft.addColorStop(0.4, "#c4a4e8");
      shaft.addColorStop(1, "#7352aa");
      ctx.fillStyle = shaft;
      ctx.beginPath();
      ctx.moveTo(-2, 23);
      ctx.lineTo(-2.5, -11);
      ctx.quadraticCurveTo(0, -14, 2.5, -11);
      ctx.lineTo(2, 23);
      ctx.quadraticCurveTo(0, 26, -2, 23);
      ctx.fill();
      ctx.strokeStyle = "#f9ce78";
      ctx.lineWidth = 1.5;
      for (const y of [14, 18, -4]) {
        ctx.beginPath();
        ctx.moveTo(-2.3, y);
        ctx.lineTo(2.3, y);
        ctx.stroke();
      }
      star(ctx, 0, -14, 14);
      ctx.fillStyle = "#bc782b";
      ctx.fill();
      ctx.save();
      ctx.translate(0, -1.4);
      star(ctx, 0, -14, 12.5);
      const gold = ctx.createLinearGradient(-9, -26, 8, -3);
      gold.addColorStop(0, "#fff7c1");
      gold.addColorStop(0.45, "#ffdb67");
      gold.addColorStop(1, "#e6a12f");
      ctx.fillStyle = gold;
      ctx.fill();
      ctx.restore();
      ctx.strokeStyle = "#fff8d8";
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(-7, -18);
      ctx.lineTo(-3, -18);
      ctx.lineTo(0, -25);
      ctx.stroke();
      ctx.restore();
      for (const [x, y, r] of [
        [49, 15, 3.5],
        [46, 38, 2.4],
        [15, 21, 2],
      ]) {
        star(ctx, x, y, r);
        ctx.fillStyle = "#fbd477";
        ctx.fill();
      }
      break;
    }
  }
  ctx.restore();
}
