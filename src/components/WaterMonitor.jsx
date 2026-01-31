import { useState, useEffect } from 'react';
import { Droplets, Info } from 'lucide-react';

function WaterMonitor() {
    const [level, setLevel] = useState(65); // Initial %

    // Simulate water level fluctuation
    useEffect(() => {
        const interval = setInterval(() => {
            setLevel(prev => {
                const change = (Math.random() - 0.5) * 5;
                return Math.max(0, Math.min(100, prev + change));
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const getStatus = (lvl) => {
        if (lvl < 30) return { label: 'LOW', color: '#FF4A4A', desc: 'Critical: Irrigation needed immediately.' };
        if (lvl < 70) return { label: 'MEDIUM', color: '#FFC107', desc: 'Optimal: Monitor levels.' };
        return { label: 'HIGH', color: '#00FF94', desc: 'Alert: Possible waterlogging risk.' };
    };

    const status = getStatus(level);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '3rem', alignItems: 'center' }}>

            {/* Visual Tank */}
            <div className="glass-panel" style={{
                height: '400px',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '24px',
                border: '2px solid rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end'
            }}>
                {/* Readings Overlay */}
                <div style={{
                    position: 'absolute',
                    top: '2rem',
                    left: '0',
                    width: '100%',
                    textAlign: 'center',
                    zIndex: 10,
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: 'bold' }}>{level.toFixed(0)}%</h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)' }}>Field Water Level</p>
                </div>

                {/* Water Wave */}
                <div style={{
                    height: `${level}%`,
                    background: 'linear-gradient(180deg, #00D1FF 0%, #005694 100%)',
                    transition: 'height 1s ease-in-out',
                    position: 'relative',
                    boxShadow: '0 0 50px rgba(0, 209, 255, 0.4)'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '-10px',
                        left: 0,
                        width: '100%',
                        height: '20px',
                        background: 'rgba(255,255,255,0.2)',
                        filter: 'blur(5px)',
                        borderRadius: '50%'
                    }} />
                </div>

                {/* Graduation Markers */}
                <div style={{ position: 'absolute', right: '1rem', top: '10%', bottom: '10%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', opacity: 0.5 }}>
                    <span>100% -</span>
                    <span>75% -</span>
                    <span>50% -</span>
                    <span>25% -</span>
                    <span>0% -</span>
                </div>
            </div>

            {/* Info Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                    <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Droplets color="#00D1FF" /> Field Sensor #01
                    </h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        Real-time data from capacitive soil moisture sensors located in Sector A.
                    </p>
                </div>

                <div className="glass-panel" style={{ padding: '2rem', borderLeft: `4px solid ${status.color}` }}>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Status</p>
                    <h3 style={{ fontSize: '2rem', color: status.color, marginBottom: '0.5rem' }}>{status.label}</h3>
                    <p style={{ fontSize: '1.1rem' }}>{status.desc}</p>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Info size={20} /> Recommendations
                    </h4>
                    <ul style={{ paddingLeft: '1.5rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>
                        {level < 30 && <li>Turn on irrigation system immediately.</li>}
                        {level > 70 && <li>Ensure drainage channels are clear. Stop irrigation.</li>}
                        {level >= 30 && level <= 70 && <li>Maintain current schedule. Check again in 4 hours.</li>}
                        <li>Inspect sensor calibration if values fluctuate rapidly.</li>
                    </ul>
                </div>
            </div>

        </div>
    );
}

export default WaterMonitor;
