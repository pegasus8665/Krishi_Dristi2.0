import { useState, useEffect } from 'react';
import { Thermometer, Droplets, Wind, Zap, Activity, Cylinder } from 'lucide-react';

function SensorPanel() {
    const [sensors, setSensors] = useState({
        nitrogen: 140,
        phosphorus: 45,
        potassium: 60,
        ph: 6.5,
        humidity: 60,
        temperature: 24
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setSensors(prev => ({
                nitrogen: Math.max(0, Math.min(200, prev.nitrogen + (Math.random() - 0.5) * 5)),
                phosphorus: Math.max(0, Math.min(100, prev.phosphorus + (Math.random() - 0.5) * 3)),
                potassium: Math.max(0, Math.min(100, prev.potassium + (Math.random() - 0.5) * 3)),
                ph: Math.max(4, Math.min(9, prev.ph + (Math.random() - 0.5) * 0.1)),
                humidity: Math.max(0, Math.min(100, prev.humidity + (Math.random() - 0.5) * 2)),
                temperature: Math.max(10, Math.min(40, prev.temperature + (Math.random() - 0.5) * 0.5))
            }));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const sensorConfig = [
        { label: 'Nitrogen (N)', value: sensors.nitrogen.toFixed(1), unit: 'mg/kg', icon: Zap, color: '#00FF94' },
        { label: 'Phosphorus (P)', value: sensors.phosphorus.toFixed(1), unit: 'mg/kg', icon: Activity, color: '#FFC107' },
        { label: 'Potassium (K)', value: sensors.potassium.toFixed(1), unit: 'mg/kg', icon: Cylinder, color: '#D4A056' }, // Changed Icon
        { label: 'Soil pH', value: sensors.ph.toFixed(2), unit: 'pH', icon: Activity, color: '#FF4A4A' },
        { label: 'Humidity', value: sensors.humidity.toFixed(1), unit: '%', icon: Droplets, color: '#00D1FF' },
        { label: 'Temperature', value: sensors.temperature.toFixed(1), unit: '°C', icon: Thermometer, color: '#FF9100' },
    ];

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Live Soil Telemetry</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {sensorConfig.map((sensor, index) => {
                    const Icon = sensor.icon;
                    return (
                        <div key={index} className="glass-panel" style={{
                            padding: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.5rem',
                            transition: 'transform 0.3s',
                            cursor: 'default'
                        }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{
                                background: `rgba(${parseInt(sensor.color.slice(1, 3), 16)}, ${parseInt(sensor.color.slice(3, 5), 16)}, ${parseInt(sensor.color.slice(5, 7), 16)}, 0.1)`,
                                padding: '1rem',
                                borderRadius: '50%',
                                boxShadow: `0 0 15px ${sensor.color}40`
                            }}>
                                <Icon size={32} color={sensor.color} />
                            </div>
                            <div>
                                <p style={{ color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>{sensor.label}</p>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                    <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: sensor.color }}>{sensor.value}</h3>
                                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>{sensor.unit}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default SensorPanel;
