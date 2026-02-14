import { useState } from 'react';
import { UploadCloud, CheckCircle, AlertTriangle, X } from 'lucide-react';

function DiseaseDetector() {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                setResult(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!image) return;
        setLoading(true);
        setResult(null);

        try {
            // Convert base64/blob to file for upload
            const response = await fetch(image);
            const blob = await response.blob();
            const file = new File([blob], "leaf.jpg", { type: "image/jpeg" });

            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("http://localhost:8000/predict", {
                method: "POST",
                body: formData
            });

            if (!res.ok) throw new Error("Prediction failed");

            const data = await res.json();

            setResult({
                status: data.disease.includes("healthy") ? "Healthy" : "Diseased",
                disease: data.disease.replace(/_/g, " "),
                confidence: data.confidence,
                cure: data.cure
            });

        } catch (error) {
            console.error("Error analyzing image:", error);
            alert("Failed to analyze image. Ensure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', height: '100%' }}>

            {/* Upload Section */}
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', borderWidth: '2px' }}>

                {!image ? (
                    <>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                            <UploadCloud size={64} color="var(--color-neon)" />
                        </div>
                        <h3 style={{ marginBottom: '1rem' }}>Upload Plant Photo</h3>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', textAlign: 'center' }}>
                            Drag and drop or click to upload an image of the affected leaf.
                        </p>
                        <input
                            type="file"
                            id="fileInput"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageUpload}
                        />
                        <button
                            onClick={() => document.getElementById('fileInput').click()}
                            style={{
                                padding: '1rem 2rem',
                                background: 'var(--color-neon)',
                                color: 'var(--color-bg-dark)',
                                borderRadius: '12px',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                boxShadow: '0 0 20px rgba(0,255,148,0.4)',
                                transition: 'all 0.3s'
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            Select Image
                        </button>
                    </>
                ) : (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ position: 'relative', width: '100%', maxHeight: '400px', overflow: 'hidden', borderRadius: '16px', marginBottom: '1.5rem' }}>
                            <img src={image} alt="Upload" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            <button
                                onClick={() => { setImage(null); setResult(null); }}
                                style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    background: 'rgba(0,0,0,0.6)',
                                    color: 'white',
                                    borderRadius: '50%',
                                    padding: '0.5rem'
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        {!result && (
                            <button
                                onClick={handleAnalyze}
                                disabled={loading}
                                style={{
                                    padding: '1rem 3rem',
                                    background: loading ? 'rgba(255,255,255,0.1)' : 'var(--color-primary)',
                                    border: '1px solid var(--color-neon)',
                                    color: 'var(--color-neon)',
                                    borderRadius: '12px',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s',
                                    width: '100%'
                                }}
                            >
                                {loading ? 'ANALYZING...' : 'IDENTIFY DISEASE'}
                            </button>
                        )}
                    </div>
                )}

            </div>

            {/* Results Section */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {loading && (
                    <div className="flex-center" style={{ flexDirection: 'column', gap: '1rem' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            border: '4px solid rgba(0,255,148,0.2)',
                            borderTop: '4px solid var(--color-neon)',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }} />
                        <style>{`
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                 `}</style>
                        <p className="text-gradient"> analyzing leaf patterns...</p>
                    </div>
                )}

                {result && (
                    <div className="glass-panel" style={{ padding: '2.5rem', border: `1px solid ${result.status === 'Diseased' ? '#FF4A4A' : '#00FF94'}`, animation: 'fadeInUp 0.5s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            {result.status === 'Diseased' ? <AlertTriangle size={48} color="#FF4A4A" /> : <CheckCircle size={48} color="#00FF94" />}
                            <div>
                                <h2 style={{ fontSize: '2rem', color: result.status === 'Diseased' ? '#FF4A4A' : '#00FF94' }}>{result.status}</h2>
                                <p style={{ color: 'var(--color-text-muted)' }}>Confidence: {result.confidence}</p>
                            </div>
                        </div>

                        {result.status === 'Diseased' && (
                            <div style={{ marginBottom: '2rem' }}>
                                <h4 style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Detected Disease</h4>
                                <h3 style={{ fontSize: '1.5rem' }}>{result.disease}</h3>
                            </div>
                        )}

                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px' }}>
                            <h4 style={{ color: 'var(--color-neon)', marginBottom: '0.5rem' }}>Recommended Action</h4>
                            <p style={{ lineHeight: '1.6' }}>{result.cure}</p>
                        </div>
                    </div>
                )}

                {!loading && !result && (
                    <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
                        <h2>AI Diagnosis System</h2>
                        <p>Upload a clear image of the plant leaf for instant disease identification.</p>
                    </div>
                )}
            </div>

        </div>
    );
}

export default DiseaseDetector;
