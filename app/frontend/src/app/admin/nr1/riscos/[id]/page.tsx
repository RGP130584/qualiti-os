'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowLeft, Plus, FileText, CheckCircle } from 'lucide-react';

export default function RiscoDetalhes({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dados');

  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await fetch(`/api/nr1/riscos/${id}`);
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
    fetchDetails();
  }, [id]);

  if (loading) return <div>Carregando detalhes do Risco...</div>;
  if (!data) return <div>Risco não encontrado.</div>;

  return (
    <div style={{ padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
      <button 
        onClick={() => router.back()}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: 600, marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={18} /> Voltar
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'inline-block', background: '#1e293b', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            {data.codigo}
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{data.titulo}</h1>
          <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: '1.1rem' }}>{data.descricao}</p>
        </div>
        <span style={{ background: data.status === 'Ativo' ? '#fee2e2' : '#dcfce7', color: data.status === 'Ativo' ? '#b91c1c' : '#15803d', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 800 }}>
          {data.status}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #e2e8f0', marginBottom: '2rem' }}>
        {['dados', 'matriz', 'planos', 'evidencias'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ 
              padding: '0.8rem 1.5rem', 
              background: 'transparent', 
              border: 'none', 
              borderBottom: activeTab === tab ? '3px solid #2563eb' : '3px solid transparent',
              color: activeTab === tab ? '#2563eb' : '#64748b',
              fontWeight: activeTab === tab ? 800 : 600,
              cursor: 'pointer',
              textTransform: 'capitalize',
              marginBottom: '-2px'
            }}
          >
            {tab === 'dados' ? 'Dados Gerais' : tab === 'matriz' ? 'Avaliação (Matriz)' : tab === 'planos' ? 'Planos de Ação' : 'Evidências (ECM)'}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'dados' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <p style={{ color: '#64748b', fontWeight: 600, margin: '0 0 0.5rem 0' }}>Categoria</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{data.categoria}</p>
            </div>
            <div>
              <p style={{ color: '#64748b', fontWeight: 600, margin: '0 0 0.5rem 0' }}>Setor</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{data.setor}</p>
            </div>
          </div>
        )}

        {activeTab === 'matriz' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#1e293b' }}>Histórico de Avaliações</h3>
              <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#10b981', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                <Plus size={16} /> Nova Avaliação
              </button>
            </div>
            {data.avaliacoes?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {data.avaliacoes.map((av: any) => (
                  <div key={av.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#334155', marginBottom: '0.2rem' }}>Avaliação em {new Date(av.data_avaliacao).toLocaleDateString()}</div>
                      <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{av.justificativa}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Probabilidade x Impacto</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: av.nivel_risco > 12 ? '#ef4444' : av.nivel_risco > 6 ? '#f59e0b' : '#10b981' }}>
                        {av.probabilidade} x {av.impacto} = Nível {av.nivel_risco}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#94a3b8' }}>Nenhuma avaliação registrada.</p>
            )}
          </div>
        )}

        {activeTab === 'planos' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#1e293b' }}>Planos de Ação Vinculados</h3>
              <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#2563eb', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                <Plus size={16} /> Novo Plano (BPM)
              </button>
            </div>
            {data.planos?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {data.planos.map((plano: any) => (
                  <div key={plano.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <CheckCircle size={24} color={plano.status === 'Concluído' ? '#10b981' : '#cbd5e1'} />
                      <div>
                        <div style={{ fontWeight: 700, color: '#334155' }}>{plano.titulo}</div>
                        <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Prazo: {plano.prazo ? new Date(plano.prazo).toLocaleDateString() : 'N/A'}</div>
                      </div>
                    </div>
                    <span style={{ background: '#f1f5f9', color: '#475569', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
                      {plano.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#94a3b8' }}>Nenhum plano de ação vinculado.</p>
            )}
          </div>
        )}

        {activeTab === 'evidencias' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#1e293b' }}>Evidências e Controles</h3>
              <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#8b5cf6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                <Plus size={16} /> Anexar POP (ECM)
              </button>
            </div>
            {data.evidencias?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {data.evidencias.map((ev: any) => (
                  <div key={ev.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <FileText size={24} color="#8b5cf6" />
                    <div>
                      <div style={{ fontWeight: 700, color: '#334155' }}>{ev.descricao}</div>
                      {ev.ecm_pop_id && <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Vinculado ao Documento ECM ID: {ev.ecm_pop_id}</div>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#94a3b8' }}>Nenhuma evidência anexada.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
