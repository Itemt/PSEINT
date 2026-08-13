import React from 'react';

export function ExamCompleted({ studentName, grade, onResetExam }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
      backgroundColor: '#f8fafc',
      textAlign: 'center'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        border: '2px solid #bbf7d0',
        borderRadius: 12,
        padding: '40px 48px',
        maxWidth: 560,
        boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
      }}>
        <div style={{ fontSize: '3.5rem', marginBottom: 10 }}>🎉</div>
        <h1 style={{ color: '#166534', fontSize: '1.8rem', marginBottom: 12 }}>
          ¡Examen Finalizado con Éxito!
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#334155', marginBottom: 20, lineHeight: 1.5 }}>
          Felicitaciones, <strong>{studentName}</strong> ({grade === '6A' ? 'Grado 6°A' : 'Grado 6°B'}). Has completado los 2 ejercicios de pseudocódigo PSeInt asignados.
        </p>

        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: 8,
          padding: '16px 20px',
          marginBottom: 24,
          textAlign: 'left',
          fontSize: '0.9rem',
          color: '#14532d'
        }}>
          <div>✔ Ejercicio 1 completado</div>
          <div style={{ marginTop: 6 }}>✔ Ejercicio 2 completado</div>
          <div style={{ marginTop: 10, fontWeight: 700, borderTop: '1px solid #bbf7d0', paddingTop: 8 }}>
            Tus algoritmos han sido guardados para revisión del docente.
          </div>
        </div>

        <button
          onClick={onResetExam}
          style={{
            backgroundColor: '#16a34a',
            color: 'white',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.95rem',
            padding: '10px 24px',
            borderRadius: 8,
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          🔄 Iniciar Nuevo Examen
        </button>
      </div>
    </div>
  );
}
