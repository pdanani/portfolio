import React, { useEffect, useRef } from 'react';

const Layout = ({ children }) => {
  const vantaInstance = useRef(null);

  useEffect(() => {
    let mounted = true;

    const loadEffect = async () => {
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return; // Respect reduced motion preference
      }
      try {
        const [threeModule, vantaModule] = await Promise.all([
          import('three'),
          import('vanta/dist/vanta.waves.min'),
        ]);

        if (!mounted) return;

        const WAVES = vantaModule.default;
        vantaInstance.current = WAVES({
          el: '#vanta',
          THREE: threeModule,
          mouseControls: false,
          touchControls: false,
          color: '#272063',
          waveSpeed: 0.4,
          zoom: 1.5,
        });
      } catch (err) {
        // Silently fail if dynamic imports fail
      }
    };

    loadEffect();

    return () => {
      mounted = false;
      try {
        vantaInstance.current?.destroy?.();
      } catch {}
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100%', textAlign: 'center' }}>
      <div id="vanta" style={{ width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
