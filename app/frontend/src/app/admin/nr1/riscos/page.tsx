'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Plus, Search, Filter } from 'lucide-react';

export default function InventarioRiscos() {
  const router = useRouter();
  const [riscos, setRiscos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRiscos() {
      try {
        const res = await fetch('/api/nr1/riscos');
        if (res.ok) {
          const data = await res.json();
          setRiscos(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchRiscos();
  }, []);

  return (
    <div style={{ padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#fef2f2', padding: '1rem', borderRadius: '12px', color: '#ef4444' }}>
            <AlertTriangle size={32} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Inventário de Riscos</h1>
            <p style={{ color: '#64748b', margin: 0, marginTop: '0.2rem' }}>Gestão centralizada de riscos operacionais e assistenciais.</p>
          </div>
        </div>
        <button 
          onClick={() => alert('Implementar modal de novo risco')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#2563eb', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
        >
          <Plus size={18} /> Novo Risco
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem 1rem', flexGrow: 1 }}>
          <Search size={18} color="#94a3b8" />
          <input type="text" placeholder="Buscar por código ou título..." style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', marginLeft: '0.5rem', fontSize: '0.9rem' }} />
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', color: '#475569', fontWeight: 600 }}>
          <Filter size={18} /> Filtros
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Carregando riscos...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: 700 }}>Código</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: 700 }}>Título</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: 700 }}>Setor</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: 700 }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {riscos.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Nenhum risco cadastrado.</td>
                </tr>
              ) : (
                riscos.map(risco => (
                  <tr key={risco.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#0f172a' }}>{risco.codigo}</td>
                    <td style={{ padding: '1rem', color: '#334155' }}>{risco.titulo}</td>
                    <td style={{ padding: '1rem', color: '#64748b' }}>{risco.setor}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        background: risco.status === 'Ativo' ? '#fee2e2' : '#dcfce7', 
                        color: risco.status === 'Ativo' ? '#b91c1c' : '#15803d', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem', 
                        fontWeight: 700 
                      }}>
                        {risco.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button 
                        onClick={() => router.push(`/admin/nr1/riscos/${risco.id}`)}
                        style={{ background: 'transparent', border: '1px solid #cbd5e1', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, color: '#2563eb' }}
                      >
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
