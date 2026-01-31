import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { UserCircle } from 'lucide-react';
import SensorPanel from '../components/SensorPanel';
import CropAdvisor from '../components/CropAdvisor';
import WaterMonitor from '../components/WaterMonitor';
import DiseaseDetector from '../components/DiseaseDetector';

function Dashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardHome />;
            case 'sensors':
                return <SensorPanel />;
            case 'crops':
                return <CropAdvisor />;
            case 'water':
                return <WaterMonitor />;
            case 'disease':
                return <DiseaseDetector />;
            default:
                return <DashboardHome />;
        }
    };

    return (
        <div style={{ display: 'flex', width: '100vw', height: '100vh', gap: '2rem' }}>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <main style={{ flex: 1, padding: '2.5vh 2.5vh 2.5vh 0', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Header */}
                <header className="glass-panel" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                            {activeTab === 'dashboard' ? 'Overview' :
                                activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </h1>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Welcome back, Farmer John</p>
                    </div>
                    <div className="flex-center" style={{ gap: '1rem' }}>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>John Doe</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-neon)' }}>Premium Plan</p>
                        </div>
                        <UserCircle size={40} color="var(--color-text-muted)" />
                    </div>
                </header>

                {/* Dynamic Content */}
                <div className="glass-panel" style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}

// Placeholder for the main dashboard view (could serve as a summary)
function DashboardHome() {
    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Farm Status Summary</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {/* Quick Stats Placeholders */}
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px' }}>
                    <p style={{ color: 'var(--color-text-muted)' }}>Avg. Soil Moisture</p>
                    <h3 style={{ fontSize: '2rem', color: 'var(--color-neon)' }}>64%</h3>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px' }}>
                    <p style={{ color: 'var(--color-text-muted)' }}>Temperature</p>
                    <h3 style={{ fontSize: '2rem', color: 'var(--color-warning)' }}>28°C</h3>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px' }}>
                    <p style={{ color: 'var(--color-text-muted)' }}>Crop Health</p>
                    <h3 style={{ fontSize: '2rem', color: 'var(--color-success)' }}>Excellent</h3>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
