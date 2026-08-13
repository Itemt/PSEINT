import React, { useState } from 'react';
import { STUDENTS_6A, STUDENTS_6B } from '../../models/Student.js';

export function LoginScreen({ onStartExam, onOpenAdmin }) {
  const [selectedGrade, setSelectedGrade] = useState('6A');
  const currentList = selectedGrade === '6A' ? STUDENTS_6A : STUDENTS_6B;
  const [selectedStudent, setSelectedStudent] = useState(currentList[0] || '');

  const handleGradeChange = (grade) => {
    setSelectedGrade(grade);
    const newList = grade === '6A' ? STUDENTS_6A : STUDENTS_6B;
    setSelectedStudent(newList[0] || '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedStudent) {
      onStartExam(selectedGrade, selectedStudent);
    }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1b365d 0%, #1e40af 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        padding: '36px 40px',
        width: '100%',
        maxWidth: 480,
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Admin Secret/Top Button */}
        <button
          type="button"
          onClick={onOpenAdmin}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#f1f5f9',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '0.78rem',
            color: '#475569',
            cursor: 'pointer',
            fontWeight: '600'
          }}
          title="Panel de Administración"
        >
          🛡️ Admin
        </button>

        {/* Brand Icon & Title */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: '#3b82f6',
          color: 'white',
          fontWeight: 900,
          fontSize: '1rem',
          padding: '4px 12px',
          borderRadius: 6,
          marginBottom: 16,
          letterSpacing: 0.5
        }}>
          PSeInt Web
        </div>

        <h1 style={{ color: '#1e293b', fontSize: '1.5rem', marginBottom: 6, fontWeight: 800 }}>
          Plataforma de Examen PSeInt
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 28 }}>
          Evaluación Escolar de Programación — Grado 6°
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
              1. Selecciona tu Curso:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button
                type="button"
                onClick={() => handleGradeChange('6A')}
                style={{
                  padding: '12px',
                  borderRadius: 8,
                  border: '2px solid',
                  borderColor: selectedGrade === '6A' ? '#2563eb' : '#cbd5e1',
                  background: selectedGrade === '6A' ? '#eff6ff' : '#ffffff',
                  color: selectedGrade === '6A' ? '#1d4ed8' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
              >
                Grado 6°A
              </button>
              <button
                type="button"
                onClick={() => handleGradeChange('6B')}
                style={{
                  padding: '12px',
                  borderRadius: 8,
                  border: '2px solid',
                  borderColor: selectedGrade === '6B' ? '#2563eb' : '#cbd5e1',
                  background: selectedGrade === '6B' ? '#eff6ff' : '#ffffff',
                  color: selectedGrade === '6B' ? '#1d4ed8' : '#475569',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
              >
                Grado 6°B
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: 6 }}>
              2. Selecciona tu Nombre de Estudiante:
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 8,
                border: '1px solid #94a3b8',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#0f172a',
                outline: 'none',
                backgroundColor: '#f8fafc',
                cursor: 'pointer'
              }}
            >
              {currentList.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: '0.82rem',
            color: '#166534',
            textAlign: 'left'
          }}>
            📋 Al iniciar se te asignarán <strong>2 ejercicios de pseudocódigo PSeInt</strong> para resolver durante el examen.
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 8,
              border: 'none',
              backgroundColor: '#16a34a',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
              transition: 'background 0.15s'
            }}
          >
            🚀 Iniciar Examen PSeInt
          </button>
        </form>
      </div>
    </div>
  );
}
