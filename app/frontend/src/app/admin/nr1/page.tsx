'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function Nr1Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/nr1/dashboard');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) return <div>Carregando Dashboard NR1...</div>;

  const totalRiscos = data?.riscosPorStatus?.reduce((acc: any, curr: any) => acc + parseInt(curr.total), 0) || 0;
  const riscosAtivos = data?.riscosPorStatus?.find((r: any) => r.status === 'Ativo')?.total || 0;
  
  return (
    <div style={{ padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '12px', color: '#2563eb' }}>
          <ShieldCheck size={32} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>NR1 Intelligence Platform</h1>
          <p style={{ color: '#64748b', margin: 0, marginTop: '0.2rem' }}>Dashboard e Matriz de Riscos Operacionais</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Card 1 */}
        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontWeight: 600 }}>
            <Activity size={20} />
            <span>Total de Riscos Mapeados</span>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>{totalRiscos}</div>
        </div>
        
        {/* Card 2 */}
        <div style={{ background: '#fffbeb', padding: '1.5rem', borderRadius: '10px', border: '1px solid #fef3c7', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#d97706', fontWeight: 600 }}>
            <AlertTriangle size={20} />
            <span>Riscos Ativos</span>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#b45309' }}>{riscosAtivos}</div>
        </div>

        {/* Card 3 */}
        <div style={{ background: '#f0fdf4', padding: '1.5rem', borderRadius: '10px', border: '1px solid #dcfce7', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a', fontWeight: 600 }}>
            <CheckCircle size={20} />
            <span>Planos de Ação (Concluídos)</span>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#15803d' }}>
            {data?.planosPorStatus?.find((p: any) => p.status === 'Concluído')?.total || 0}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>Matriz de Risco (Probabilidade x Impacto)</h3>
          <div style={{ background: '#f8fafc', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
            {data?.matriz?.length > 0 ? (
              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                {data.matriz.map((item: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'white', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    <span>P: {item.probabilidade} | I: {item.impacto}</span>
                    <span style={{ fontWeight: 700 }}>{item.total} risco(s)</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#94a3b8' }}>Sem dados suficientes para a matriz.</p>
            )}
          </div>
        </div>

        <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#1e293b' }}>Ações Rápidas</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <a href="/admin/nr1/riscos" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f1f5f9', borderRadius: '8px', textDecoration: 'none', color: '#334155', fontWeight: 600 }}>
              <AlertTriangle size={20} color="#2563eb" />
              Ver Inventário de Riscos
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
