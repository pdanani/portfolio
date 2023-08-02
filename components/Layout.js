import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import WAVES from 'vanta/dist/vanta.waves.min';

const Layout = ({ children }) => {
  const vantaRef = useRef(null);
  useEffect(() => {
    vantaRef.current = WAVES({
      el: '#vanta-bg',
      THREE,
      mouseControls: false,
      touchControls: false,
      color: '#272063',
      waveSpeed: 0.4,
      zoom: 1.5,
    });

    return () => {
      if (vantaRef.current) {
        vantaRef.current.destroy();
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <div
        id="vanta-bg"
        style={{
          width: '100vw',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0
        }}
      />
      <div id="vanta" style={{ position: 'relative', minHeight: '100vh', textAlign: 'center' }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
