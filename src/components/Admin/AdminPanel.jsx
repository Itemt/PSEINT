import React, { useState, useEffect } from 'react';

export function AdminPanel({ isOpen, onClose }) {
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('Todos');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const GRADES = ['Todos', '6°', '7°', '8°', '9°', '10°', '11°'];

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchSubmissions();
    }
  }, [isOpen, isAuthenticated, selectedGrade]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput.trim() === 'admin123' || pinInput.trim() === 'admin' || pinInput.trim() === '1234') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('PIN incorrecto. Intenta con: admin123');
    }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      // 1. Fetch from Turso API if available
      const url = selectedGrade === 'Todos' ? '/api/submissions' : `/api/submissions?grade=${encodeURIComponent(selectedGrade)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        let apiResults = data.submissions || [];

        // 2. Combine with local storage submissions if any
        const localDataStr = localStorage.getItem('pseint_exam_submissions');
        let localResults = localDataStr ? JSON.parse(localDataStr) : [];
        if (selectedGrade !== 'Todos') {
          localResults = localResults.filter(s => s.grade === selectedGrade);
        }

        // Merge without duplicates (by timestamp or id)
        const combined = [...apiResults];
        for (const loc of localResults) {
          if (!combined.some(c => c.studentName === loc.studentName && c.exerciseId === loc.exerciseId && c.createdAt === loc.createdAt)) {
            combined.push(loc);
          }
        }

        // Sort by timestamp desc
        combined.sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()));
        setSubmissions(combined);
      } else {
        // Fallback to local storage
        loadLocalSubmissions();
      }
    } catch (err) {
      console.warn('Servidor API no disponible. Cargando respuestas locales:', err);
      loadLocalSubmissions();
    } finally {
      setLoading(false);
    }
  };

  const loadLocalSubmissions = () => {
    const localDataStr = localStorage.getItem('pseint_exam_submissions');
    let localResults = localDataStr ? JSON.parse(localDataStr) : [];
    if (selectedGrade !== 'Todos') {
      localResults = localResults.filter(s => s.grade === selectedGrade);
    }
    localResults.sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()));
    setSubmissions(localResults);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(6px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '1000px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
        color: '#f8fafc'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #334155',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#0f172a'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🛡️</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#f8fafc' }}>
                Panel de Administración de Exámenes
              </h2>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                Respuestas registradas en tiempo real por grado
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '6px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Auth Screen */}
        {!isAuthenticated ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🔐</span>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>Ingresar PIN de Administrador</h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#94a3b8' }}>
              Ingrese la clave de acceso para revisar los exámenes entregados.
            </p>

            <form onSubmit={handleLogin}>
              <input
                type="password"
                placeholder="PIN (admin123)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #475569',
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  fontSize: '16px',
                  textAlign: 'center',
                  marginBottom: '14px'
                }}
              />
              {authError && (
                <div style={{ color: '#ef4444', fontSize: '13px', marginBottom: '14px' }}>
                  {authError}
                </div>
              )}
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#2563eb',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Acceder al Panel
              </button>
            </form>
          </div>
        ) : (
          /* Main Admin Content */
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            {/* Grade Filter Bar */}
            <div style={{
              padding: '12px 24px',
              backgroundColor: '#1e293b',
              borderBottom: '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>Filtrar por Grado:</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {GRADES.map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGrade(g)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid',
                        borderColor: selectedGrade === g ? '#3b82f6' : '#475569',
                        backgroundColor: selectedGrade === g ? '#2563eb' : '#0f172a',
                        color: '#fff',
                        fontSize: '13px',
                        fontWeight: selectedGrade === g ? '600' : '400',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      {g === 'Todos' ? '🏫 Todos los Grados' : `Grado ${g}`}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={fetchSubmissions}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid #475569',
                  backgroundColor: '#0f172a',
                  color: '#94a3b8',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                🔄 Actualizar
              </button>
            </div>

            {/* Content Area */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              {/* Submissions List */}
              <div style={{
                width: selectedSubmission ? '40%' : '100%',
                borderRight: selectedSubmission ? '1px solid #334155' : 'none',
                overflowY: 'auto',
                padding: '16px'
              }}>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    Cargando respuestas...
                  </div>
                ) : submissions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>📭</span>
                    No hay respuestas registradas {selectedGrade !== 'Todos' ? `para el Grado ${selectedGrade}` : ''}.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {submissions.map((sub, idx) => {
                      const isSelected = selectedSubmission && selectedSubmission.id === sub.id;
                      const statusColor = sub.allPassed ? '#10b981' : sub.passedCount > 0 ? '#f59e0b' : '#ef4444';
                      const statusBg = sub.allPassed ? 'rgba(16, 185, 129, 0.1)' : sub.passedCount > 0 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)';

                      return (
                        <div
                          key={sub.id || idx}
                          onClick={() => setSelectedSubmission(sub)}
                          style={{
                            padding: '14px 16px',
                            borderRadius: '10px',
                            backgroundColor: isSelected ? '#0f172a' : '#1e293b',
                            border: '1px solid',
                            borderColor: isSelected ? '#3b82f6' : '#334155',
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                            <div>
                              <strong style={{ fontSize: '15px', color: '#f8fafc' }}>{sub.studentName}</strong>
                              <span style={{
                                marginLeft: '8px',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                backgroundColor: '#334155',
                                color: '#cbd5e1',
                                fontSize: '11px',
                                fontWeight: '600'
                              }}>
                                Grado {sub.grade}
                              </span>
                            </div>

                            <span style={{
                              padding: '3px 10px',
                              borderRadius: '12px',
                              backgroundColor: statusBg,
                              color: statusColor,
                              fontSize: '12px',
                              fontWeight: '600',
                              border: `1px solid ${statusColor}`
                            }}>
                              {sub.allPassed ? `✅ ${sub.passedCount}/${sub.totalTests} Aprobado` : `⚠️ ${sub.passedCount}/${sub.totalTests}`}
                            </span>
                          </div>

                          <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>
                            📝 {sub.exerciseTitle}
                          </div>

                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            🕒 {sub.createdAt ? new Date(sub.createdAt).toLocaleString('es-CO') : 'Reciente'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Submission Detail Inspection View */}
              {selectedSubmission && (
                <div style={{
                  width: '60%',
                  overflowY: 'auto',
                  padding: '20px',
                  backgroundColor: '#0f172a'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '18px', color: '#f8fafc' }}>
                        {selectedSubmission.studentName} — <span style={{ color: '#3b82f6' }}>Grado {selectedSubmission.grade}</span>
                      </h3>
                      <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>
                        {selectedSubmission.exerciseTitle}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedSubmission(null)}
                      style={{
                        background: '#1e293b',
                        border: '1px solid #475569',
                        color: '#cbd5e1',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Cerrar Vista
                    </button>
                  </div>

                  {/* Code Written Box */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center',
                      marginBottom: '6px'
                    }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#cbd5e1' }}>
                        📜 Código PSeInt Escrito por el Estudiante:
                      </span>
                      <button
                        onClick={() => copyToClipboard(selectedSubmission.code)}
                        style={{
                          background: '#1e293b',
                          border: '1px solid #475569',
                          color: '#3b82f6',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                      >
                        {copiedCode ? '✓ Copiado' : '📋 Copiar Código'}
                      </button>
                    </div>

                    <pre style={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      padding: '14px',
                      color: '#38bdf8',
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      overflowX: 'auto',
                      whiteSpace: 'pre-wrap',
                      margin: 0
                    }}>
                      {selectedSubmission.code}
                    </pre>
                  </div>

                  {/* Test Cases Verification */}
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '8px' }}>
                      🧪 Comprobaciones de Prueba ({selectedSubmission.passedCount}/{selectedSubmission.totalTests} Pasadas):
                    </span>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(selectedSubmission.results || []).map((res, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '10px 14px',
                            borderRadius: '8px',
                            backgroundColor: res.passed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                            border: '1px solid',
                            borderColor: res.passed ? '#059669' : '#dc2626',
                            fontSize: '12px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', marginBottom: '4px' }}>
                            <span style={{ color: res.passed ? '#34d399' : '#f87171' }}>
                              {res.passed ? '✅' : '❌'} Caso #{res.testIndex || idx + 1}: {res.description}
                            </span>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', color: '#94a3b8' }}>
                            <div><strong>Entradas:</strong> [{Array.isArray(res.inputs) ? res.inputs.join(', ') : res.inputs}]</div>
                            <div><strong>Salida Esperada:</strong> {res.expected}</div>
                          </div>

                          <div style={{ marginTop: '4px', color: res.passed ? '#a7f3d0' : '#fca5a5' }}>
                            <strong>Salida del Estudiante:</strong> {res.actual}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
