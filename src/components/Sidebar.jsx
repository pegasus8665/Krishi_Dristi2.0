import { LayoutDashboard, Activity, Sprout, Droplets, Stethoscope, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Sidebar({ activeTab, setActiveTab }) {
    const navigate = useNavigate();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'sensors', label: 'Live Sensors', icon: Activity },
        { id: 'crops', label: 'Crop Advisor', icon: Sprout },
        { id: 'water', label: 'Water Monitor', icon: Droplets },
        { id: 'disease', label: 'Disease ID', icon: Stethoscope },
    ];

    return (
        <div className="glass-panel" style={{
            width: '260px',
            height: '95vh',
            margin: '2.5vh 0 2.5vh 2.5vh',
            display: 'flex',
            flexDirection: 'column',
            padding: '2rem',
            gap: '2rem'
        }}>
            <div className="flex-center" style={{ gap: '0.8rem', justifyContent: 'flex-start' }}>
                <div style={{
                    background: 'rgba(0, 255, 148, 0.1)',
                    padding: '0.5rem',
                    borderRadius: '50%'
                }}>
                    <Sprout size={24} color="var(--color-neon)" />
                </div>
                <h2 className="text-gradient" style={{ fontSize: '1.4rem' }}>KrishiDrishti</h2>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                borderRadius: '12px',
                                background: isActive ? 'linear-gradient(90deg, rgba(15, 61, 46, 0.8) 0%, rgba(26, 94, 71, 0.4) 100%)' : 'transparent',
                                border: isActive ? '1px solid rgba(0, 255, 148, 0.3)' : '1px solid transparent',
                                color: isActive ? 'var(--color-neon)' : 'var(--color-text-muted)',
                                transition: 'all 0.3s',
                                textAlign: 'left'
                            }}
                            onMouseOver={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.color = 'var(--color-text-main)';
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.color = 'var(--color-text-muted)';
                                    e.currentTarget.style.background = 'transparent';
                                }
                            }}
                        >
                            <Icon size={20} />
                            <span style={{ fontWeight: 500 }}>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                borderRadius: '12px',
                color: 'var(--color-danger)',
                background: 'rgba(255, 74, 74, 0.1)',
                marginTop: 'auto',
                transition: 'all 0.3s'
            }}
                onClick={() => navigate('/login')}>
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </div>
    );
}

export default Sidebar;
