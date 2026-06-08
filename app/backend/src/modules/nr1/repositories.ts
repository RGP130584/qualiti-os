import { Pool } from 'pg';
import { Nr1Risco, Nr1Avaliacao, Nr1PlanoAcao, Nr1Evidencia } from './models';

export class Nr1Repository {
  constructor(private db: Pool) {}

  // ============================
  // RISCOS
  // ============================
  async getRiscos(tenantId: string): Promise<Nr1Risco[]> {
    const res = await this.db.query('SELECT * FROM nr1_riscos WHERE tenant_id = $1 ORDER BY data_criacao DESC', [tenantId]);
    return res.rows;
  }

  async getRiscoById(tenantId: string, id: number): Promise<Nr1Risco | null> {
    const res = await this.db.query('SELECT * FROM nr1_riscos WHERE tenant_id = $1 AND id = $2', [tenantId, id]);
    return res.rows[0] || null;
  }

  async createRisco(risco: Nr1Risco): Promise<Nr1Risco> {
    const res = await this.db.query(`
      INSERT INTO nr1_riscos (tenant_id, codigo, titulo, descricao, categoria, setor, omoc_cargo_id, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [risco.tenant_id, risco.codigo, risco.titulo, risco.descricao, risco.categoria, risco.setor, risco.omoc_cargo_id, risco.status || 'Ativo']);
    return res.rows[0];
  }

  async updateRiscoStatus(tenantId: string, id: number, status: string): Promise<Nr1Risco | null> {
    const res = await this.db.query(`
      UPDATE nr1_riscos SET status = $3 WHERE tenant_id = $1 AND id = $2 RETURNING *
    `, [tenantId, id, status]);
    return res.rows[0] || null;
  }

  // ============================
  // AVALIAÇÕES (MATRIZ)
  // ============================
  async getAvaliacoesByRisco(tenantId: string, riscoId: number): Promise<Nr1Avaliacao[]> {
    const res = await this.db.query('SELECT * FROM nr1_avaliacoes WHERE tenant_id = $1 AND risco_id = $2 ORDER BY data_avaliacao DESC', [tenantId, riscoId]);
    return res.rows;
  }

  async createAvaliacao(avaliacao: Nr1Avaliacao): Promise<Nr1Avaliacao> {
    const res = await this.db.query(`
      INSERT INTO nr1_avaliacoes (tenant_id, risco_id, probabilidade, impacto, nivel_risco, justificativa, avaliador_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [avaliacao.tenant_id, avaliacao.risco_id, avaliacao.probabilidade, avaliacao.impacto, avaliacao.nivel_risco, avaliacao.justificativa, avaliacao.avaliador_id]);
    return res.rows[0];
  }

  // ============================
  // PLANOS DE AÇÃO
  // ============================
  async getPlanosByRisco(tenantId: string, riscoId: number): Promise<Nr1PlanoAcao[]> {
    const res = await this.db.query('SELECT * FROM nr1_planos_acao WHERE tenant_id = $1 AND risco_id = $2 ORDER BY data_criacao DESC', [tenantId, riscoId]);
    return res.rows;
  }

  async createPlanoAcao(plano: Nr1PlanoAcao): Promise<Nr1PlanoAcao> {
    const res = await this.db.query(`
      INSERT INTO nr1_planos_acao (tenant_id, risco_id, bpm_execucao_id, titulo, responsavel_omoc_id, prazo, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [plano.tenant_id, plano.risco_id, plano.bpm_execucao_id, plano.titulo, plano.responsavel_omoc_id, plano.prazo, plano.status || 'Pendente']);
    return res.rows[0];
  }

  // ============================
  // EVIDÊNCIAS
  // ============================
  async getEvidenciasByRisco(tenantId: string, riscoId: number): Promise<Nr1Evidencia[]> {
    const res = await this.db.query('SELECT * FROM nr1_evidencias WHERE tenant_id = $1 AND risco_id = $2 ORDER BY data_anexo DESC', [tenantId, riscoId]);
    return res.rows;
  }

  async createEvidencia(evidencia: Nr1Evidencia): Promise<Nr1Evidencia> {
    const res = await this.db.query(`
      INSERT INTO nr1_evidencias (tenant_id, risco_id, ecm_pop_id, descricao, url_anexo)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [evidencia.tenant_id, evidencia.risco_id, evidencia.ecm_pop_id, evidencia.descricao, evidencia.url_anexo]);
    return res.rows[0];
  }

  // ============================
  // AGREGADOS (DASHBOARD)
  // ============================
  async getDashboardAggregations(tenantId: string) {
    const resCount = await this.db.query('SELECT status, COUNT(*) as total FROM nr1_riscos WHERE tenant_id = $1 GROUP BY status', [tenantId]);
    
    // Obter última avaliação de cada risco ativo
    const resMatrix = await this.db.query(`
      WITH UltimasAvaliacoes AS (
        SELECT risco_id, probabilidade, impacto, nivel_risco,
               ROW_NUMBER() OVER(PARTITION BY risco_id ORDER BY data_avaliacao DESC) as rn
        FROM nr1_avaliacoes
        WHERE tenant_id = $1
      )
      SELECT a.probabilidade, a.impacto, COUNT(*) as total
      FROM UltimasAvaliacoes a
      JOIN nr1_riscos r ON r.id = a.risco_id
      WHERE a.rn = 1 AND r.tenant_id = $1 AND r.status != 'Encerrado'
      GROUP BY a.probabilidade, a.impacto
    `, [tenantId]);

    const resPlanos = await this.db.query('SELECT status, COUNT(*) as total FROM nr1_planos_acao WHERE tenant_id = $1 GROUP BY status', [tenantId]);

    return {
      riscosPorStatus: resCount.rows,
      matriz: resMatrix.rows,
      planosPorStatus: resPlanos.rows
    };
  }
}
