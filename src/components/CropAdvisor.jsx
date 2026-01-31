import { useState } from 'react';
import { Sprout, ChevronRight, Droplets, FlaskConical } from 'lucide-react';

function CropAdvisor() {
    const [soilType, setSoilType] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [activeRecommendation, setActiveRecommendation] = useState(null);

    const crops = [
        { name: 'Wheat', yield: '4.2 ton/ha', image: '🌾', tips: { water: 'Moderate watering required', fertilizer: 'Add Nitrogen rich fertilizer' } },
        { name: 'Rice', yield: '5.1 ton/ha', image: '🍚', tips: { water: 'High water requirement, flood fields', fertilizer: 'Use NPK 15:15:15' } },
        { name: 'Maize', yield: '6.5 ton/ha', image: '🌽', tips: { water: 'Regular irrigation needed', fertilizer: 'Phosphate rich fertilizer recommended' } },
        { name: 'Cotton', yield: '2.3 ton/ha', image: '☁️', tips: { water: 'Low to moderate water', fertilizer: 'Potash application essential' } },
        { name: 'Sugarcane', yield: '80.0 ton/ha', image: '🎋', tips: { water: 'Very high water requirement', fertilizer: 'High nitrogen and phosphorus needed' } }
    ];

    const handlePredict = () => {
        if (!soilType) return alert('Please select a soil type');
        setLoading(true);
        setResults(null);
        setActiveRecommendation(null);

        // Simulate API Call/ML Model
        setTimeout(() => {
            // Shuffle and pick 3
            const shuffled = [...crops].sort(() => 0.5 - Math.random());
            setResults(shuffled.slice(0, 3));
            setLoading(false);
        }, 2000);
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

            {/* Input Section */}
            <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
                <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Sprout color="var(--color-neon)" /> Crop Predictor
                </h2>

                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Soil Type</label>
                <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        color: 'white',
                        marginBottom: '1.5rem',
                        appearance: 'none',
                        fontSize: '1rem'
                    }}
                >
                    <option value="">Select Soil Type...</option>
                    <option value="Clay">Clay</option>
                    <option value="Sandy">Sandy</option>
                    <option value="Loamy">Loamy</option>
                    <option value="Silt">Silt</option>
                    <option value="Peat">Peat</option>
                </select>

                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Live Sensor Data Included:</p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <span style={{ color: 'var(--color-neon)', background: 'rgba(0,255,148,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>N: 140</span>
                        <span style={{ color: 'var(--color-warning)', background: 'rgba(255,193,7,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>P: 45</span>
                        <span style={{ color: 'var(--color-accent)', background: 'rgba(212,160,86,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>K: 60</span>
                        <span style={{ color: '#00D1FF', background: 'rgba(0,209,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>pH: 6.5</span>
                    </div>
                </div>

                <button
                    onClick={handlePredict}
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                        border: '1px solid var(--color-neon)',
                        borderRadius: '12px',
                        color: 'var(--color-neon)',
                        fontWeight: 'bold',
                        opacity: loading ? 0.7 : 1,
                        cursor: loading ? 'wait' : 'pointer',
                        transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => !loading && (e.target.style.background = 'var(--color-primary)')}
                >
                    {loading ? 'ANALYZING SOIL DATA...' : 'GENERATE RECOMMENDATIONS'}
                </button>
            </div>

            {/* Results Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {results && !loading && (
                    <>
                        <h3 className="text-gradient">Top Recommended Crops</h3>
                        {results.map((crop, index) => (
                            <div key={index}
                                className="glass-panel"
                                style={{
                                    padding: '1.5rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    border: activeRecommendation === crop ? '1px solid var(--color-neon)' : 'var(--glass-border)'
                                }}
                                onClick={() => setActiveRecommendation(crop)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{ fontSize: '2rem' }}>{crop.image}</span>
                                    <div>
                                        <h4 style={{ fontSize: '1.2rem' }}>{crop.name}</h4>
                                        <p style={{ color: 'var(--color-success)', fontSize: '0.9rem' }}>Exp. Yield: {crop.yield}</p>
                                    </div>
                                </div>
                                <ChevronRight color={activeRecommendation === crop ? 'var(--color-neon)' : 'white'} />
                            </div>
                        ))}
                    </>
                )}

                {/* Recommendation Details */}
                {activeRecommendation && (
                    <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1rem', borderTop: '2px solid var(--color-neon)', animation: 'fadeInUp 0.5s' }}>
                        <h4 style={{ marginBottom: '1rem' }}>Optimization Guide for {activeRecommendation.name}</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ background: 'rgba(0, 209, 255, 0.1)', padding: '1rem', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#00D1FF' }}>
                                    <Droplets size={16} /> <strong>Watering</strong>
                                </div>
                                <p style={{ fontSize: '0.9rem' }}>{activeRecommendation.tips.water}</p>
                            </div>
                            <div style={{ background: 'rgba(255, 193, 7, 0.1)', padding: '1rem', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#FFC107' }}>
                                    <FlaskConical size={16} /> <strong>Fertilizer</strong>
                                </div>
                                <p style={{ fontSize: '0.9rem' }}>{activeRecommendation.tips.fertilizer}</p>
                            </div>
                        </div>
                        <button style={{ marginTop: '1rem', width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}>Download Detailed Report</button>
                    </div>
                )}
            </div>

        </div>
    );
}

export default CropAdvisor;
