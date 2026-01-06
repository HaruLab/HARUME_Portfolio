import React, { useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

/**
 * MagneticWrapper
 * 子供要素を「吸い寄せられる」ようなインタラクションで包みます。
 */
const MagneticWrapper = ({ children, distance = 0.5 }) => {
  const ref = useRef(null);
  
  // スプリング設定：大人可愛い、フワッとした動きを目指す
  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    // 中心点からの距離を計算
    const center = { x: left + width / 2, y: top + height / 2 };
    const dX = clientX - center.x;
    const dY = clientY - center.y;
    
    // distance倍の力で吸い寄せる
    mouseX.set(dX * distance);
    mouseY.set(dY * distance);
  };

  const handleMouseLeave = () => {
    // マウスが離れたら中央に戻す
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: mouseX,
        y: mouseY,
      }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
};

export default MagneticWrapper;
