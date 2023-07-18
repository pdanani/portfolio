import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import WAVES from 'vanta/dist/vanta.waves.min';

const Layout = ({ children }) => {
  const vantaRef = useRef(null);
  useEffect(() => {
    vantaRef.current = WAVES({
      el: '#vanta',
      THREE,
      mouseControls: false,
      touchControls: false,
      color: '#150C38', // Adjusted color to a slightly more vibrant purple
      waveSpeed: 0.6, // Slowed down the layout movement
    });

    return () => {
      if (vantaRef.current) {
        vantaRef.current.destroy();
      }
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', textAlign:'center' }}>
      <div id="vanta" style={{ width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
