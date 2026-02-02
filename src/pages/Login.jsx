import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Sprout } from 'lucide-react';

function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        // Mimic API delay
        setTimeout(() => {
            navigate('/dashboard');
        }, 1500);
    };

    return (
        <div className="full-screen flex-center" style={{
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decor */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                left: '-10%',
                width: '50%',
                height: '50%',
                background: 'radial-gradient(circle, rgba(15, 61, 46, 0.4) 0%, transparent 60%)',
                filter: 'blur(50px)',
                zIndex: -1
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-10%',
                right: '-10%',
                width: '50%',
                height: '50%',
                background: 'radial-gradient(circle, rgba(212, 160, 86, 0.2) 0%, transparent 60%)',
                filter: 'blur(50px)',
                zIndex: -1
            }} />

            <div className="glass-panel" style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '0',
                padding: '0',
                overflow: 'hidden',
                maxWidth: '900px',
                width: '90%',
                animation: 'fadeInUp 0.8s ease-out'
            }}>
                {/* Login Section */}
                <form onSubmit={handleLogin} style={{
                    flex: 1,
                    padding: '3rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                    minWidth: '350px'
                }}>
                    {/* Header */}
                    <div className="flex-center" style={{ flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{
                            background: 'rgba(0, 255, 148, 0.1)',
                            padding: '1rem',
                            borderRadius: '50%',
                            marginBottom: '1rem'
                        }}>
                            <Sprout size={40} color="var(--color-neon)" />
                        </div>
                        <h1 className="text-gradient" style={{ fontSize: '2rem' }}>KrishiDrishti</h1>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Smart Farming Assistant</p>
                    </div>

                    {/* Inputs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="input-group" style={{ position: 'relative' }}>
                            <User size={20} color="var(--color-text-muted)" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
                            <input
                                type="text"
                                placeholder="Username"
                                style={{
                                    width: '100%',
                                    padding: '1rem 1rem 1rem 3rem',
                                    background: 'rgba(0,0,0,0.2)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'border 0.3s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--color-neon)'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                        </div>

                        <div className="input-group" style={{ position: 'relative' }}>
                            <Lock size={20} color="var(--color-text-muted)" style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)' }} />
                            <input
                                type="password"
                                placeholder="Password"
                                style={{
                                    width: '100%',
                                    padding: '1rem 1rem 1rem 3rem',
                                    background: 'rgba(0,0,0,0.2)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'border 0.3s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--color-neon)'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                        </div>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                            border: '1px solid var(--color-neon)',
                            padding: '1rem',
                            borderRadius: '12px',
                            color: 'var(--color-neon)',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            letterSpacing: '1px',
                            transition: 'all 0.3s',
                            boxShadow: '0 0 15px rgba(0, 255, 148, 0.2)',
                            opacity: loading ? 0.7 : 1
                        }}
                        onMouseOver={(e) => {
                            if (!loading) {
                                e.target.style.background = 'var(--color-neon)';
                                e.target.style.color = 'var(--color-bg-dark)';
                                e.target.style.boxShadow = '0 0 25px rgba(0, 255, 148, 0.6)';
                            }
                        }}
                        onMouseOut={(e) => {
                            if (!loading) {
                                e.target.style.background = 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%)';
                                e.target.style.color = 'var(--color-neon)';
                                e.target.style.boxShadow = '0 0 15px rgba(0, 255, 148, 0.2)';
                            }
                        }}
                    >
                        {loading ? 'AUTHENTICATING...' : 'ACCESS PORTAL'}
                    </button>
                </form>

                {/* Divider Line */}
                <div style={{
                    width: '1px',
                    background: 'linear-gradient(to bottom, transparent, rgba(0, 255, 148, 0.3), transparent)'
                }} />

                {/* Registration Section */}
                <div style={{
                    flex: 1,
                    padding: '3rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                    background: 'rgba(0,0,0,0.2)',
                    minWidth: '350px'
                }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-neon)' }}>Create an Account</h2>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Join the smart farming revolution</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input
                            type="text"
                            placeholder="First Name"
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <input
                        type="email"
                        placeholder="Email Address"
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            color: 'white',
                            outline: 'none'
                        }}
                    />

                    <input
                        type="text"
                        placeholder="Product Code (Hardware Label)"
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            color: 'white',
                            outline: 'none'
                        }}
                    />

                    <input
                        type="text"
                        placeholder="State / Region"
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            color: 'white',
                            outline: 'none'
                        }}
                    />

                    <input
                        type="password"
                        placeholder="Create Password"
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            color: 'white',
                            outline: 'none'
                        }}
                    />

                    <button
                        style={{
                            marginTop: '1rem',
                            background: 'rgba(0, 255, 148, 0.1)',
                            border: '1px solid var(--color-neon)',
                            padding: '0.8rem',
                            borderRadius: '12px',
                            color: 'var(--color-neon)',
                            fontWeight: '600',
                            transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.background = 'var(--color-neon)';
                            e.target.style.color = 'var(--color-bg-dark)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.background = 'rgba(0, 255, 148, 0.1)';
                            e.target.style.color = 'var(--color-neon)';
                        }}
                    >
                        REGISTER DEVICE & ACCOUNT
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
