import { useEffect, useRef, useState } from 'react';
import { Providers } from "@/components/Providers";

export default function ColorPage() {
  // State for the color palette
  const [palette, setPalette] = useState([]);
  
  // Refs for all DOM elements accessed by ID
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);
  const mainCanvasRef = useRef(null);
  const pickerTargetRef = useRef(null);
  const gridOverlayRef = useRef(null);
  const placeholderRef = useRef(null);
  const loadingOverlayRef = useRef(null);
  const gridToggleRef = useRef(null);
  const zebraToggleRef = useRef(null);
  const zebraLevelRef = useRef(null);
  const viewModeRef = useRef(null);
  const aiTextRef = useRef(null);
  const dExpRef = useRef(null);
  const dExpQRef = useRef(null);
  const dDrRef = useRef(null);
  const dDrQRef = useRef(null);
  const dSatRef = useRef(null);
  const dSatQRef = useRef(null);
  const dClrRef = useRef(null);
  const dTempRef = useRef(null);
  const dTintRef = useRef(null);
  const dMidBalanceRef = useRef(null);
  const dContrastRatioRef = useRef(null);
  const dCrQRef = useRef(null);
  const dBlackPctRef = useRef(null);
  const dBlackQRef = useRef(null);
  const dWhitePctRef = useRef(null);
  const dWhiteQRef = useRef(null);
  const dDarkestRef = useRef(null);
  const dBrightestRef = useRef(null);
  const diagSumRef = useRef(null);
  const mSatValRef = useRef(null);
  const mSatBarRef = useRef(null);
  const mTempMkRef = useRef(null);
  const mTintMkRef = useRef(null);
  const pickSwatchRef = useRef(null);
  const pHexRef = useRef(null);
  const pRgbRef = useRef(null);
  const pLumRef = useRef(null);
  const hueCanvasRef = useRef(null);
  const hueSumRef = useRef(null);
  const rgbCanvasRef = useRef(null);
  const rgbSumRef = useRef(null);
  const waveCanvasRef = useRef(null);
  const waveSumRef = useRef(null);
  const vecCanvasRef = useRef(null);
  const vecSumRef = useRef(null);
  const slCanvasRef = useRef(null);
  const slSumRef = useRef(null);
  const infoWRef = useRef(null);
  const infoHRef = useRef(null);
  const infoSizeRef = useRef(null);
  const infoTypeRef = useRef(null);
  const helpModalRef = useRef(null);
  const helpTextRef = useRef(null);

  const state = useRef({
    img: null,
    w: 0,
    h: 0,
    pixels: null,
    locked: false,
  }).current;

  const helpData = {
    diag: "9つの指標で画像を数値化します。Exposure(露出)、WB(ホワイトバランス)、Tint(色かぶり)などの基本項目に加え、Clarity(明瞭度)なども判定します。",
    meter: "視覚的なバー表示です。Tempは左が寒色(青)、右が暖色(オレンジ)。Tintは左が緑、右がマゼンタ寄りを示します。",
    hue: "画像に含まれる色相(色味)の分布です。山が高いほどその色が支配的です。",
    wave: "Waveform (Luminance) は画像の左から右への輝度分布です。上が明るく(白)、下が暗い(黒)。露出の偏りがわかります。",
    vec: "Vectorscopeは色彩情報を円形にプロットします。中心が無彩色、外側ほど高彩度。肌色は左上(10-11時方向)のラインに乗るのが理想です。",
  };

  const showHelp = (key) => {
    if (helpTextRef.current) {
      helpTextRef.current.textContent = helpData[key] || "No info";
    }
    if (helpModalRef.current) {
      helpModalRef.current.style.display = "flex";
    }
  };


  useEffect(() => {
    const ID = (ref) => ref.current;
    const CTX = (ref) => ID(ref)?.getContext('2d');

    const colorize = (val, typeRef) => {
        const el = ID(typeRef);
        if (!el) return;
        el.textContent = val;
        if (val.includes("WARM")) el.style.color = "#ffaa55";
        else if (val.includes("COOL")) el.style.color = "#55aaff";
        else if (val.includes("MAG")) el.style.color = "#ff55ff";
        else if (val.includes("GRN")) el.style.color = "#55ff55";
        else el.style.color = "#fff";
    };

    const toHex = (c) => "#" + ((1 << 24) + (c.r << 16) + (c.g << 8) + c.b).toString(16).slice(1).toUpperCase();

    const setQualLabel = (idRef, val, thresholds) => {
        const el = ID(idRef);
        if (!el) return;
        if (val < thresholds[0]) el.textContent = thresholds[2];
        else if (val > thresholds[1]) el.textContent = thresholds[3];
        else el.textContent = "";
    };

    const dropArea = ID(dropAreaRef);
    const handleDragOver = (e) => {
        e.preventDefault();
        dropArea.classList.add("drag-active");
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        dropArea.classList.remove("drag-active");
    };
    const handleDrop = (e) => {
        e.preventDefault();
        dropArea.classList.remove("drag-active");
        loadFile(e.dataTransfer.files[0]);
    };

    if (dropArea) {
        dropArea.addEventListener("dragenter", handleDragOver);
        dropArea.addEventListener("dragover", handleDragOver);
        dropArea.addEventListener("dragleave", handleDragLeave);
        dropArea.addEventListener("drop", handleDrop);
    }

    const fileInput = ID(fileInputRef);
    const handleFileChange = (e) => loadFile(e.target.files[0]);
    if (fileInput) {
        fileInput.addEventListener("change", handleFileChange);
    }

    const gridToggle = ID(gridToggleRef);
    const handleGridToggle = (e) => ID(gridOverlayRef).style.display = e.target.checked ? "block" : "none";
    if(gridToggle) gridToggle.addEventListener("change", handleGridToggle);

    const zebraToggle = ID(zebraToggleRef);
    if(zebraToggle) zebraToggle.addEventListener("change", render);
    
    const zebraLevel = ID(zebraLevelRef);
    if(zebraLevel) zebraLevel.addEventListener("input", render);

    const viewMode = ID(viewModeRef);
    if(viewMode) viewMode.addEventListener("change", render);

    const mainCv = ID(mainCanvasRef);
    const target = ID(pickerTargetRef);

    const handleMouseMove = (e) => {
        if (state.locked || !state.pixels) return;
        updatePicker(e.offsetX, e.offsetY);
    };

    const handleClick = (e) => {
        if (!state.pixels) return;
        state.locked = !state.locked;
        if (!state.locked) updatePicker(e.offsetX, e.offsetY);
    };

    if (mainCv) {
        mainCv.addEventListener("mousemove", handleMouseMove);
        mainCv.addEventListener("click", handleClick);
    }

    function updatePicker(x, y) {
        if (!mainCv || !target) return;
        target.style.left = x + "px";
        target.style.top = y + "px";
        target.style.borderColor = state.locked ? "#f00" : "rgba(255,255,255,0.8)";

        const scaleX = state.w / mainCv.offsetWidth;
        const scaleY = state.h / mainCv.offsetHeight;
        const rx = Math.floor(x * scaleX);
        const ry = Math.floor(y * scaleY);
        const i = (ry * state.w + rx) * 4;

        if (i < 0 || i >= state.pixels.length) return;

        const r = state.pixels[i], g = state.pixels[i + 1], b = state.pixels[i + 2];
        const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        const lum = (0.299 * r + 0.587 * g + 0.114 * b).toFixed(0);

        ID(pickSwatchRef).style.backgroundColor = hex;
        ID(pHexRef).textContent = hex.toUpperCase();
        ID(pRgbRef).textContent = `${r}, ${g}, ${b}`;
        ID(pLumRef).textContent = lum;
    }

    function loadFile(file) {
        if (!file || !file.type.startsWith("image/")) return;
        ID(loadingOverlayRef).style.display = "flex";

        ID(infoSizeRef).textContent = (file.size / 1024).toFixed(1) + " KB";
        ID(infoTypeRef).textContent = file.type.split("/")[1].toUpperCase();

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                state.img = img;
                const maxW = 1200;
                const scale = Math.min(1, maxW / img.width);
                state.w = ID(mainCanvasRef).width = Math.floor(img.width * scale);
                state.h = ID(mainCanvasRef).height = Math.floor(img.height * scale);
                ID(infoWRef).textContent = img.width;
                ID(infoHRef).textContent = img.height;
                ID(placeholderRef).style.display = "none";

                const ctx = CTX(mainCanvasRef);
                ctx.drawImage(img, 0, 0, state.w, state.h);
                state.pixels = ctx.getImageData(0, 0, state.w, state.h).data;

                setTimeout(() => {
                    analyze();
                    render();
                    ID(loadingOverlayRef).style.display = "none";
                }, 50);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function render() {
        if (!state.img) return;
        const ctx = CTX(mainCanvasRef);
        if(!ctx) return;
        const w = state.w, h = state.h;
        const mode = ID(viewModeRef).value;

        ctx.drawImage(state.img, 0, 0, w, h);
        const iData = ctx.getImageData(0, 0, w, h);
        const d = iData.data;
        const zebra = ID(zebraToggleRef).checked;
        const zLv = ID(zebraLevelRef).value * 2.55;

        for (let i = 0; i < d.length; i += 4) {
            const r = d[i], g = d[i + 1], b = d[i + 2];
            const l = 0.299 * r + 0.587 * g + 0.114 * b;

            if (mode === "grayscale") {
                d[i] = d[i + 1] = d[i + 2] = l;
            } else if (mode === "saturation") {
                const max = Math.max(r, g, b), min = Math.min(r, g, b);
                const s = max === 0 ? 0 : ((max - min) / max) * 255;
                d[i] = s > 128 ? (s - 128) * 2 : 0;
                d[i + 1] = s > 128 ? 255 - (s - 128) * 2 : s * 2;
                d[i + 2] = s < 128 ? 255 - s * 2 : 0;
            }

            if (zebra && l > zLv && mode !== "saturation") {
                if ((i / 4) % 8 < 4 && Math.floor(i / 4 / w) % 8 < 4) {
                    d[i] = 255; d[i + 1] = 0; d[i + 2] = 0;
                }
            }
        }
        ctx.putImageData(iData, 0, 0);
    }

    function analyze() {
      const px = state.pixels;
      if(!px) return;
      const len = px.length;
      const step = 4;

      let sumL = 0, sumR = 0, sumG = 0, sumB = 0, sumSat = 0;
      let sumMidR = 0, sumMidG = 0, sumMidB = 0, midCnt = 0;
      let minL = 255, maxL = 0;
      let brightestColor = { r: 0, g: 0, b: 0 };
      let darkestColor = { r: 255, g: 255, b: 255 };
      let hHist = new Int32Array(360);
      let rHist = new Int32Array(256), gHist = new Int32Array(256), bHist = new Int32Array(256);
      let highCnt = 0, shdCnt = 0;

      const wCtx = CTX(waveCanvasRef), wW = 300, wH = 100;
      if(wCtx) wCtx.clearRect(0, 0, wW, wH);
      const vCtx = CTX(vecCanvasRef), vW = 160, vH = 160;
      if(vCtx) vCtx.clearRect(0, 0, vW, vH);
      const sCtx = CTX(slCanvasRef), sW = 300, sH = 100;
      if(sCtx) sCtx.clearRect(0, 0, sW, sH);

      const wArr = new Uint32Array(wW * wH);
      const vR = new Float32Array(vW * vH);
      const vG = new Float32Array(vW * vH);
      const vB = new Float32Array(vW * vH);
      const vCnt = new Uint32Array(vW * vH);
      const sArr = new Uint32Array(sW * sH);

      for (let i = 0; i < len; i += 4 * step) {
        const r = px[i], g = px[i + 1], b = px[i + 2];
        const l = 0.299 * r + 0.587 * g + 0.114 * b;
        sumL += l; sumR += r; sumG += g; sumB += b;
        if (l < minL) { minL = l; darkestColor = { r, g, b }; }
        if (l > maxL) { maxL = l; brightestColor = { r, g, b }; }
        if (l > 220) highCnt++;
        if (l < 30) shdCnt++;
        if (l >= 75 && l <= 175) { sumMidR += r; sumMidG += g; sumMidB += b; midCnt++; }
        rHist[r]++; gHist[g]++; bHist[b]++;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const delta = max - min;
        let h = 0, s = 0;
        if (delta !== 0) {
            s = delta / max;
            h = (max === r ? (g - b) / delta : max === g ? 2 + (b - r) / delta : 4 + (r - g) / delta) * 60;
            if (h < 0) h += 360;
        }
        hHist[Math.floor(h)]++;
        sumSat += s;
        const wx = Math.floor((((i / 4) % state.w) / state.w) * wW);
        const wy = Math.floor((1 - l / 255) * (wH - 1));
        wArr[wy * wW + wx]++;
        const cb_val = -0.1687 * r - 0.3313 * g + 0.5 * b;
        const cr_val = 0.5 * r - 0.4187 * g - 0.0813 * b;
        const vx = Math.floor(vW / 2 + cr_val * 0.6);
        const vy = Math.floor(vH / 2 - cb_val * 0.6);
        if (vx >= 0 && vx < vW && vy >= 0 && vy < vH) {
            const idx = vy * vW + vx;
            vR[idx] += r; vG[idx] += g; vB[idx] += b; vCnt[idx]++;
        }
        const sx = Math.floor((l / 255) * (sW - 1));
        const sy = Math.floor((1 - s) * (sH - 1));
        sArr[sy * sW + sx]++;
      }

      const count = len / (4 * step);
      const avgL = sumL / count;
      const avgS = sumSat / count;
      const avgR = sumR / count, avgG = sumG / count, avgB = sumB / count;
      const variance = Math.abs(avgL - 128);
      ID(dClrRef).textContent = variance < 25 ? "FLAT" : "CRISP";
      ID(dExpRef).textContent = avgL.toFixed(0);
      setQualLabel(dExpQRef, avgL, [80, 175, "暗い", "明るい"]);
      const dynamicRange = maxL - minL;
      ID(dDrRef).textContent = dynamicRange.toFixed(0);
      setQualLabel(dDrQRef, dynamicRange, [100, 220, "狭い", "広い"]);
      ID(dSatRef).textContent = (avgS * 100).toFixed(0) + "%";
      setQualLabel(dSatQRef, avgS * 100, [10, 45, "低い", "高い"]);
      if (midCnt > 0) {
          const midR = (sumMidR / midCnt).toFixed(0);
          const midG = (sumMidG / midCnt).toFixed(0);
          const midB = (sumMidB / midCnt).toFixed(0);
          ID(dMidBalanceRef).textContent = `${midR},${midG},${midB}`;
      } else { ID(dMidBalanceRef).textContent = "N/A"; }
      const diffRB = avgR - avgB;
      colorize(diffRB > 8 ? "WARM" : diffRB < -8 ? "COOL" : "OK", dTempRef);
      colorize(avgG > (avgR + avgB) / 2 ? "GRN" : "MAG", dTintRef);
      ID(dWhitePctRef).textContent = ((highCnt / count) * 100).toFixed(1) + "%";
      const blackPct = (shdCnt / count) * 100;
      ID(dBlackPctRef).textContent = blackPct.toFixed(1) + "%";
      setQualLabel(dBlackQRef, blackPct, [0, 10, "", "多め"]);
      ID(dBrightestRef).textContent = toHex(brightestColor);
      ID(dDarkestRef).textContent = toHex(darkestColor);
      const l1 = (0.299 * brightestColor.r + 0.587 * brightestColor.g + 0.114 * brightestColor.b) / 255;
      const l2 = (0.299 * darkestColor.r + 0.587 * darkestColor.g + 0.114 * darkestColor.b) / 255;
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      ID(dContrastRatioRef).textContent = ratio.toFixed(1) + ":1";
      ID(diagSumRef).textContent = `露出: ${avgL < 80 ? "暗部寄り" : avgL > 175 ? "明部寄り" : "適正範囲"} / ${(highCnt / count) * 100 > 2 ? "⚠️ ハイライト飽和あり" : "ハイライト保持良好"}`;
      ID(mSatBarRef).style.width = avgS * 100 + "%";
      ID(mSatValRef).textContent = (avgS * 100).toFixed(0) + "%";
      let tempPos = 50 + diffRB * 1.5;
      ID(mTempMkRef).style.left = Math.max(0, Math.min(100, tempPos)) + "%";
      let tintPos = 50 + (avgG - (avgR + avgB) / 2) * 2;
      ID(mTintMkRef).style.left = Math.max(0, Math.min(100, tintPos)) + "%";
      if(wCtx) drawScope(wCtx, wArr, wW, wH, "green");
      if(vCtx) drawVectorScope(vCtx, vR, vG, vB, vCnt, vW, vH);
      if(sCtx) drawScope(sCtx, sArr, sW, sH, "white");
      drawHue(CTX(hueCanvasRef), hHist);
      drawRGB(CTX(rgbCanvasRef), rHist, gHist, bHist);
      generatePalette(px);
      let maxH = 0, maxHv = 0;
      hHist.forEach((v, i) => { if (v > maxHv) { maxHv = v; maxH = i; } });
      const hueMap = ["赤", "黄", "緑", "シアン", "青", "マゼンタ", "赤"];
      const hueName = hueMap[Math.floor(((maxH + 30) % 360) / 60)];
      ID(hueSumRef).textContent = `ピーク: ${maxH}° (${hueName}) 付近`;
      ID(rgbSumRef).textContent = `R:${avgR.toFixed(0)} G:${avgG.toFixed(0)} B:${avgB.toFixed(0)}`;
      ID(waveSumRef).textContent = `Luminance Peak: ${maxL}`;
      ID(vecSumRef).textContent = `彩度平均: ${(avgS * 100).toFixed(0)}%`;
      ID(slSumRef).textContent = `Sat/Lum相関分布`;
      ID(aiTextRef).textContent = `【AI分析】\n` + `ベースは${diffRB > 10 ? "暖色系" : "寒色系"}で、${hueName}が支配的です。` + `露出は${avgL.toFixed(0)}/255で、${avgS > 0.3 ? "鮮やかな" : "落ち着いた"}トーンでまとめられています。` + `${highCnt / count > 0.02 ? "ハイライトの白飛びに注意してください。" : "階調は綺麗に保たれています。"}`;
    }

    function drawScope(ctx, arr, w, h, mode) {
      if(!ctx) return;
      const iData = ctx.createImageData(w, h);
      let max = 0;
      for (let i = 0; i < arr.length; i++) if (arr[i] > max) max = arr[i];
      const densityScale = max > 0 ? 255 / Math.log(max + 1) : 0;
      for (let i = 0; i < arr.length; i++) {
          if (arr[i] > 0) {
              const val = Math.min(255, Math.log(arr[i] + 1) * densityScale * 1.5);
              const p = i * 4;
              if (mode === "green") { iData.data[p] = 0; iData.data[p + 1] = 255; iData.data[p + 2] = 100; }
              else { iData.data[p] = 255; iData.data[p + 1] = 255; iData.data[p + 2] = 255; }
              iData.data[p + 3] = val;
          }
      }
      ctx.putImageData(iData, 0, 0);
    }

    function drawVectorScope(ctx, vR, vG, vB, vCnt, w, h) {
      if(!ctx) return;
      const iData = ctx.createImageData(w, h);
      let maxCnt = 0;
      for (let i = 0; i < vCnt.length; i++) if (vCnt[i] > maxCnt) maxCnt = vCnt[i];
      for (let i = 0; i < vCnt.length; i++) {
          const cnt = vCnt[i];
          if (cnt === 0) continue;
          const ar = vR[i] / cnt, ag = vG[i] / cnt, ab = vB[i] / cnt;
          const intensity = Math.min(1, Math.log(cnt + 1) / Math.log(maxCnt + 1));
          const alpha = Math.floor(intensity * 255);
          const p = i * 4;
          iData.data[p] = Math.round(ar); iData.data[p + 1] = Math.round(ag); iData.data[p + 2] = Math.round(ab); iData.data[p + 3] = alpha;
      }
      ctx.putImageData(iData, 0, 0);
      ctx.strokeStyle = "rgba(255,255,255,0.14)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(w / 2, h / 2, w / 2 - 2, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = "rgba(255,200,150,0.35)"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(w / 2, h / 2); ctx.lineTo(w / 2 - Math.floor(w * 0.22), h / 2 - Math.floor(h * 0.28)); ctx.stroke();
    }

    function drawHue(ctx, hist) {
        if(!ctx) return;
        ctx.fillStyle = "#000"; ctx.fillRect(0, 0, 300, 50);
        const max = Math.max(...hist);
        for (let i = 0; i < 360; i++) {
            ctx.fillStyle = `hsl(${i}, 90%, 60%)`;
            const h = (hist[i] / max) * 50;
            ctx.fillRect((i / 360) * 300, 50 - h, 1, h);
        }
    }

    function drawRGB(ctx, r, g, b) {
      if(!ctx) return;
      ctx.fillStyle = "#000"; ctx.fillRect(0, 0, 300, 80);
      const max = Math.max(Math.max(...r), Math.max(...g), Math.max(...b));
      ctx.globalCompositeOperation = "screen";
      const drawC = (arr, c) => {
          ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(0, 80);
          for (let i = 0; i < 256; i++) ctx.lineTo((i / 255) * 300, 80 - (arr[i] / max) * 80);
          ctx.lineTo(300, 80); ctx.fill(); ctx.strokeStyle = c; ctx.stroke();
      };
      drawC(r, "rgba(255,0,0,0.6)");
      drawC(g, "rgba(0,255,0,0.6)");
      drawC(b, "rgba(0,100,255,0.6)");
      ctx.globalCompositeOperation = "source-over";
    }

    function generatePalette(pixels) {
      const colorCounts = {};
      const step = 20;
      for (let i = 0; i < pixels.length; i += 4 * step) {
          const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
          if (pixels[i + 3] < 128) continue;
          const roundR = Math.floor(r / 10) * 10;
          const roundG = Math.floor(g / 10) * 10;
          const roundB = Math.floor(b / 10) * 10;
          const key = `${roundR},${roundG},${roundB}`;
          colorCounts[key] = (colorCounts[key] || 0) + 1;
      }
      const sortedColors = Object.keys(colorCounts).sort((a, b) => colorCounts[b] - colorCounts[a]);
      const newPalette = [];
      const threshold = 45;
      for (let colorStr of sortedColors) {
          if (newPalette.length >= 5) break;
          const [r, g, b] = colorStr.split(",").map(Number);
          const isTooClose = newPalette.some((p) => {
              const diff = Math.abs(p.r - r) + Math.abs(p.g - g) + Math.abs(p.b - b);
              return diff < threshold;
          });
          if (!isTooClose) newPalette.push({ r, g, b });
      }
      setPalette(newPalette);
    }
    
    // Cleanup function
    return () => {
        if (dropArea) {
            dropArea.removeEventListener("dragenter", handleDragOver);
            dropArea.removeEventListener("dragover", handleDragOver);
            dropArea.removeEventListener("dragleave", handleDragLeave);
            dropArea.removeEventListener("drop", handleDrop);
        }
        if (fileInput) {
            fileInput.removeEventListener("change", handleFileChange);
        }
        if(gridToggle) gridToggle.removeEventListener("change", handleGridToggle);
        if(zebraToggle) zebraToggle.removeEventListener("change", render);
        if(zebraLevel) zebraLevel.removeEventListener("input", render);
        if(viewMode) viewMode.removeEventListener("change", render);
        if (mainCv) {
            mainCv.removeEventListener("mousemove", handleMouseMove);
            mainCv.removeEventListener("click", handleClick);
        }
    };
  }, []);

  const toHex = (c) => "#" + ((1 << 24) + (c.r << 16) + (c.g << 8) + c.b).toString(16).slice(1).toUpperCase();

  return (
    <Providers>
      <style jsx global>{`
        :root {
            --bg-app: #121212;
            --bg-panel: #181818;
            --bg-box: #222;
            --accent: #c9b658;
            --accent-dim: rgba(0, 136, 255, 0.1);
            --text-main: #eee;
            --text-sub: #888;
            --border: #333;
            --scrollbar-bg: #1a1a1a;
            --scrollbar-thumb: #444;
        }
        /* Overriding app body to match tool's design */
        body {
            background-color: var(--bg-app) !important;
            color: var(--text-main) !important;
            font-family: "Noto Sans JP", "Inter", sans-serif;
            margin: 0;
            height: 100vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        * {
            box-sizing: border-box;
        }
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: var(--scrollbar-bg);
        }
        ::-webkit-scrollbar-thumb {
            background: var(--scrollbar-thumb);
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #555;
        }

        .color-tool-header {
            height: 48px;
            background: var(--bg-panel);
            border-bottom: 1px solid var(--border);
            display: flex;
            align-items: center;
            padding: 0 20px;
            justify-content: space-between;
            flex-shrink: 0;
        }
        .color-tool-header h1 {
            font-size: 15px;
            font-weight: 700;
            margin: 0;
            color: #fff;
            letter-spacing: 0.5px;
        }
        .color-tool-header h1 span {
            color: var(--accent);
            font-weight: 400;
        }
        .btn {
            background: var(--accent);
            color: #fff;
            border: none;
            padding: 6px 14px;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            font-weight: 600;
            transition: filter 0.2s;
        }
        .btn:hover {
            filter: brightness(1.1);
        }
        .main-container {
            display: grid;
            grid-template-columns: 1fr 420px;
            flex: 1;
            overflow: hidden;
        }
        .viewport {
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
            background-image: radial-gradient(#333 1px, transparent 1px);
            background-size: 24px 24px;
            position: relative;
        }
        .stage-wrapper {
            flex: 1;
            display: flex;
            flex-direction: column;
            min-height: 0;
            position: relative;
        }
        .stage {
            flex: 1;
            border: 1px solid var(--border);
            background: #000;
            border-radius: 6px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
            transition: border-color 0.2s, background-color 0.2s;
        }
        .stage.drag-active {
            border-color: var(--accent);
            background-color: rgba(0, 136, 255, 0.05);
        }
        canvas#mainCanvas {
            max-width: 100%;
            max-height: 100%;
            display: block;
            cursor: crosshair;
        }
        #pickerTarget {
            position: absolute;
            width: 20px;
            height: 20px;
            border: 1px solid rgba(255, 255, 255, 0.8);
            border-radius: 2px;
            box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5);
            pointer-events: none;
            display: block; /* Always visible for React version */
            z-index: 10;
            transform: translate(-50%, -50%);
        }
        #pickerTarget::after {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            width: 4px;
            height: 4px;
            background: red;
            border-radius: 50%;
            transform: translate(-50%, -50%);
        }
        .overlay-grid {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none; display: none;
            background: linear-gradient(to right, transparent 33.3%, rgba(255,255,255,0.15) 33.3%, rgba(255,255,255,0.15) 33.6%, transparent 33.6%, transparent 66.6%, rgba(255,255,255,0.15) 66.6%, rgba(255,255,255,0.15) 66.9%, transparent 66.9%), linear-gradient(to bottom, transparent 33.3%, rgba(255,255,255,0.15) 33.3%, rgba(255,255,255,0.15) 33.6%, transparent 33.6%, transparent 66.6%, rgba(255,255,255,0.15) 66.6%, rgba(255,255,255,0.15) 66.9%, transparent 66.9%);
        }
        .toolbar {
            display: flex; gap: 15px; background: var(--bg-panel); padding: 8px 20px;
            border-radius: 50px; border: 1px solid var(--border); align-self: center;
            font-size: 11px; color: #ccc; align-items: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 20;
        }
        select {
            background: #2a2a2a; color: #eee; border: 1px solid #444; padding: 4px 8px;
            border-radius: 4px; font-size: 11px; outline: none;
        }
        #loadingOverlay {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.7); display: none; justify-content: center;
            align-items: center; z-index: 50; color: var(--accent);
            font-weight: 700; letter-spacing: 1px; backdrop-filter: blur(2px);
        }
        .instruments {
            background: var(--bg-panel); border-left: 1px solid var(--border);
            padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px;
        }
        .box {
            background: var(--bg-box); border: 1px solid #333; border-radius: 6px;
            padding: 12px; position: relative;
        }
        .box-head {
            font-size: 11px; font-weight: 700; color: #fff; margin-bottom: 10px;
            display: flex; justify-content: space-between; align-items: center;
            border-left: 3px solid var(--accent); padding-left: 8px;
        }
        .help-icon {
            color: #666; cursor: pointer; font-size: 10px; width: 16px; height: 16px;
            display: flex; justify-content: center; align-items: center; border-radius: 50%;
            background: #333; transition: color 0.2s;
        }
        .help-icon:hover { color: #fff; background: #444; }
        .summary-text { font-size: 10px; color: #999; margin-top: 10px; padding-top: 8px; border-top: 1px solid #333; line-height: 1.5; }
        .ai-box { background: linear-gradient(145deg, #1a2530, #222); border: 1px solid #2a4055; }
        .ai-badge { color: #4da6ff; font-size: 11px; font-weight: 700; display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
        .diag-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; }
        .diag-item { background: rgba(255,255,255,0.03); padding: 6px; border-radius: 4px; text-align: center; border: 1px solid transparent; }
        .val-wrap { display: flex; justify-content: center; align-items: baseline; gap: 5px; }
        .diag-qual { font-size: 9px; color: #666; font-weight: bold; background: #1a1a1a; padding: 1px 3px; border-radius: 3px; }
        .diag-label { font-size: 9px; color: #777; display: block; margin-bottom: 2px; text-transform: uppercase; }
        .diag-val { font-size: 11px; font-weight: 700; color: #eee; }
        .meter-wrap { margin-bottom: 8px; }
        .meter-label { display: flex; justify-content: space-between; font-size: 10px; color: #aaa; margin-bottom: 4px; }
        .meter-bar { height: 6px; background: #111; border-radius: 3px; position: relative; overflow: hidden; }
        .meter-fill { height: 100%; position: absolute; top: 0; left: 0; transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
        .marker { width: 2px; height: 100%; background: #fff; position: absolute; top: 0; z-index: 2; box-shadow: 0 0 4px rgba(255,255,255,0.8); transform: translateX(-50%); transition: left 0.4s ease-out; }
        .bg-grad-temp { background: linear-gradient(90deg, #3498db, #eee, #f39c12); }
        .bg-grad-tint { background: linear-gradient(90deg, #2ecc71, #eee, #9b59b6); }
        canvas.scope { width: 100%; display: block; background: #000; border-radius: 3px; }
        .rgb-labels { display: flex; justify-content: space-between; padding: 2px 4px; font-size: 9px; color: #666; font-family: monospace; }
        .picker-row { display: flex; gap: 12px; align-items: center; font-size: 11px; }
        .picker-swatch { width: 40px; height: 40px; border: 1px solid #555; border-radius: 4px; background: #000; box-shadow: 0 2px 5px rgba(0,0,0,0.5); }
        .picker-data { display: flex; flex-direction: column; gap: 2px; }
        .picker-data div { display: flex; gap: 10px; color: #888; }
        .picker-data span { color: #fff; font-family: monospace; font-weight: 700; min-width: 60px; }
        .palette-item { text-align: center; }
        .swatch { width: 100%; height: 35px; border-radius: 4px; border: 1px solid #555; margin-bottom: 5px; cursor: pointer; transition: transform 0.1s ease-in-out; box-shadow: 0 2px 5px rgba(0,0,0,0.5); }
        .swatch:hover { transform: scale(1.08); }
        .hex-code { font-family: monospace; font-size: 10px; color: #888; }
        .vectorscope-wrapper { position: relative; width: 160px; height: 160px; }
        .vec-label { position: absolute; font-size: 10px; font-weight: bold; pointer-events: none; text-shadow: 0 0 3px #000; }
        #helpModal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 2000; justify-content: center; align-items: center; backdrop-filter: blur(4px); }
        .modal-content { background: #252525; padding: 25px; width: 320px; border-radius: 8px; border: 1px solid #444; box-shadow: 0 20px 50px rgba(0,0,0,0.8); }
        @media (max-width: 900px) {
            .main-container { grid-template-columns: 1fr; }
            .viewport { min-height: 400px; }
            body { height: auto; overflow: auto; }
        }
      `}</style>

      <header className="color-tool-header">
        <h1>
          Pro Color <span>Analyzer</span>
          <small style={{ fontSize: '10px', color: '#666', fontWeight: 400, marginLeft: '5px' }}>
            POLISHED
          </small>
        </h1>
        <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }} />
        <button className="btn" onClick={() => fileInputRef.current.click()}>
          ＋ 画像を開く
        </button>
      </header>

      <div className="main-container">
        <div className="viewport">
          <div className="stage-wrapper">
            <div className="stage" ref={dropAreaRef}>
              <canvas ref={mainCanvasRef} id="mainCanvas"></canvas>
              <div ref={pickerTargetRef} id="pickerTarget"></div>
              <div className="overlay-grid" ref={gridOverlayRef} id="gridOverlay"></div>
              <div
                ref={placeholderRef}
                id="placeholder"
                style={{ position: 'absolute', color: '#666', fontSize: '13px', pointerEvents: 'none', textAlign: 'center', lineHeight: 1.6 }}
              >
                <span style={{ fontSize: '24px', color: '#444' }}>📥</span><br />
                画像をここにドロップ<br />または右上のボタン
              </div>
              <div ref={loadingOverlayRef} id="loadingOverlay">Analyzing...</div>
            </div>
          </div>
          <div className="toolbar">
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <input type="checkbox" ref={gridToggleRef} /> 三分割
            </label>
            <div style={{ width: '1px', height: '14px', background: '#444' }}></div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <input type="checkbox" ref={zebraToggleRef} /> ゼブラ
            </label>
            <input type="range" ref={zebraLevelRef} min="50" max="100" defaultValue="95" style={{ width: '60px', cursor: 'pointer' }} title="Zebra Level" />
            <div style={{ width: '1px', height: '14px', background: '#444' }}></div>
            <select ref={viewModeRef}>
              <option value="normal">通常表示</option>
              <option value="grayscale">輝度 (白黒)</option>
              <option value="saturation">彩度 (ヒートマップ)</option>
            </select>
          </div>
        </div>

        <div className="instruments">
            <div className="box ai-box">
                <div className="ai-badge">
                    <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16" style={{marginTop: "-1px"}}><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM2.5 8a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A.5.5 0 0 0 8.5 8h-3a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3zm3.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"></path></svg>
                    AI Insight
                </div>
                <div style={{fontSize: "11px", lineHeight: "1.6", color: "#ddd"}} ref={aiTextRef}>画像を読み込むと、AIによる美的分析と改善提案が表示されます。</div>
            </div>
            <div className="box">
                <div className="box-head">Diagnosis (総合診断)<span className="help-icon" onClick={() => showHelp('diag')}>?</span></div>
                <div className="diag-grid">
                    <div className="diag-item"><span className="diag-label">露出</span><div className="val-wrap"><span className="diag-val" ref={dExpRef}>-</span><span className="diag-qual" ref={dExpQRef}></span></div></div>
                    <div className="diag-item"><span className="diag-label">Dレンジ</span><div className="val-wrap"><span className="diag-val" ref={dDrRef}>-</span><span className="diag-qual" ref={dDrQRef}></span></div></div>
                    <div className="diag-item"><span className="diag-label">彩度</span><div className="val-wrap"><span className="diag-val" ref={dSatRef}>-</span><span className="diag-qual" ref={dSatQRef}></span></div></div>
                    <div className="diag-item"><span className="diag-label">明瞭度</span><span className="diag-val" ref={dClrRef}>-</span></div>
                    <div className="diag-item"><span className="diag-label">色温度</span><span className="diag-val" ref={dTempRef}>-</span></div>
                    <div className="diag-item"><span className="diag-label">色かぶり</span><span className="diag-val" ref={dTintRef}>-</span></div>
                    <div className="diag-item"><span className="diag-label">中間調バランス</span><span className="diag-val" ref={dMidBalanceRef}>-</span></div>
                    <div className="diag-item"><span className="diag-label">コントラスト比</span><div className="val-wrap"><span className="diag-val" ref={dContrastRatioRef}>-</span><span className="diag-qual" ref={dCrQRef}></span></div></div>
                    <div className="diag-item"><span className="diag-label">黒の割合</span><div className="val-wrap"><span className="diag-val" ref={dBlackPctRef}>-</span><span className="diag-qual" ref={dBlackQRef}></span></div></div>
                    <div className="diag-item"><span className="diag-label">白の割合</span><div className="val-wrap"><span className="diag-val" ref={dWhitePctRef}>-</span><span className="diag-qual" ref={dWhiteQRef}></span></div></div>
                    <div className="diag-item"><span className="diag-label">最も暗い色</span><span className="diag-val" ref={dDarkestRef}>-</span></div>
                    <div className="diag-item"><span className="diag-label">最も明るい色</span><span className="diag-val" ref={dBrightestRef}>-</span></div>
                </div>
                <div className="summary-text" ref={diagSumRef}>画像データ待ち...</div>
            </div>
            <div className="box">
                <div className="box-head">Meters <span className="help-icon" onClick={() => showHelp('meter')}>?</span></div>
                <div className="meter-wrap">
                    <div className="meter-label"><span>Sat (彩度)</span><span ref={mSatValRef}>--</span></div>
                    <div className="meter-bar"><div className="meter-fill" ref={mSatBarRef} style={{background: "linear-gradient(90deg, #777, #f0f)", width: "0%"}}></div></div>
                </div>
                <div className="meter-wrap">
                    <div className="meter-label"><span>Temp (色温度)</span><span>Cool | Warm</span></div>
                    <div className="meter-bar bg-grad-temp"><div className="marker" ref={mTempMkRef} style={{left: "50%"}}></div></div>
                </div>
                <div className="meter-wrap">
                    <div className="meter-label"><span>Tint (色かぶり)</span><span>Grn | Mag</span></div>
                    <div className="meter-bar bg-grad-tint"><div className="marker" ref={mTintMkRef} style={{left: "50%"}}></div></div>
                </div>
            </div>
            <div className="box">
                <div className="box-head">Picker (Click to Lock)</div>
                <div className="picker-row">
                    <div className="picker-swatch" ref={pickSwatchRef}></div>
                    <div className="picker-data">
                        <div>HEX: <span ref={pHexRef}>--</span></div>
                        <div>RGB: <span ref={pRgbRef}>--</span></div>
                        <div>Lum: <span ref={pLumRef}>--</span></div>
                    </div>
                </div>
            </div>
            <div className="box">
                <div className="box-head">Color Palette (Top 5)</div>
                <div style={{display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px"}}>
                    {palette.length === 0 ? (
                        <div style={{gridColumn:"1/-1", textAlign:"center", color:"#555"}}>No Data</div>
                    ) : (
                        palette.map((c, index) => {
                            const hex = toHex(c);
                            return (
                                <div key={index} className="palette-item">
                                    <div
                                        className="swatch"
                                        style={{ backgroundColor: hex }}
                                        title={`Click to copy: ${hex}`}
                                        onClick={() => {
                                            navigator.clipboard.writeText(hex);
                                            alert('Copied: ' + hex);
                                        }}
                                    ></div>
                                    <div className="hex-code">{hex}</div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
            <div className="box">
                <div className="box-head">Hue (色相)<span className="help-icon" onClick={() => showHelp('hue')}>?</span></div>
                <canvas ref={hueCanvasRef} className="scope" height="50" width="300"></canvas>
                <div className="summary-text" ref={hueSumRef}>--</div>
            </div>
            <div className="box">
                <div className="box-head">RGB (バランス)</div>
                <canvas ref={rgbCanvasRef} className="scope" height="80" width="300"></canvas>
                <div className="rgb-labels"><span>Bk</span><span>Shd</span><span>Mid</span><span>Hgh</span><span>Wt</span></div>
                <div className="summary-text" ref={rgbSumRef}>--</div>
            </div>
            <div className="box">
                <div className="box-head">Waveform (輝度)<span className="help-icon" onClick={() => showHelp('wave')}>?</span></div>
                <canvas ref={waveCanvasRef} className="scope" height="100" width="300"></canvas>
                <div className="summary-text" ref={waveSumRef}>--</div>
            </div>
            <div className="box">
                <div className="box-head">Vectorscope (Pro)<span className="help-icon" onClick={() => showHelp('vec')}>?</span></div>
                <div style={{display: "flex", justifyContent: "center", marginBottom: "5px"}}>
                    <div className="vectorscope-wrapper">
                        <canvas ref={vecCanvasRef} width="160" height="160" style={{background: "#000", borderRadius: "50%", border: "1px solid #333"}}></canvas>
                        <span className="vec-label" style={{top: "38px", left: "148px", color: "#f55"}}>R</span>
                        <span className="vec-label" style={{top: 0, left: "75px", color: "#f5f"}}>Mg</span>
                        <span className="vec-label" style={{top: "38px", left: "2px", color: "#55f"}}>B</span>
                        <span className="vec-label" style={{bottom: "38px", left: "2px", color: "#5ff"}}>Cy</span>
                        <span className="vec-label" style={{bottom: 0, left: "75px", color: "#5f5"}}>G</span>
                        <span className="vec-label" style={{bottom: "38px", left: "148px", color: "#ff5"}}>Y</span>
                    </div>
                </div>
                <div className="summary-text" ref={vecSumRef}>--</div>
            </div>
            <div className="box">
                <div className="box-head">Sat vs Lum</div>
                <canvas ref={slCanvasRef} className="scope" height="100" width="300"></canvas>
                <div className="summary-text" ref={slSumRef}>--</div>
            </div>
            <div className="box">
                <div className="box-head">Image Data</div>
                <div className="diag-grid" style={{gridTemplateColumns: "1fr 1fr"}}>
                    <div className="diag-item"><span className="diag-label">Width</span><span className="diag-val" ref={infoWRef}>--</span></div>
                    <div className="diag-item"><span className="diag-label">Height</span><span className="diag-val" ref={infoHRef}>--</span></div>
                    <div className="diag-item"><span className="diag-label">File Size</span><span className="diag-val" ref={infoSizeRef}>--</span></div>
                    <div className="diag-item"><span className="diag-label">Type</span><span className="diag-val" ref={infoTypeRef}>--</span></div>
                </div>
            </div>
        </div>
      </div>

      <div ref={helpModalRef} id="helpModal" onClick={(e) => { e.currentTarget.style.display = 'none'; }}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h3 style={{ color: 'var(--accent)', marginTop: 0 }}>Help</h3>
          <p ref={helpTextRef} style={{ fontSize: '13px', lineHeight: 1.6, color: '#ccc' }}></p>
          <button className="btn" onClick={() => { if(helpModalRef.current) helpModalRef.current.style.display = 'none'; }} style={{ width: '100%', marginTop: '15px', background: '#444', border: '1px solid #555' }}>
            閉じる
          </button>
        </div>
      </div>
    </Providers>
  );
}
