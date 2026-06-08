import { Pool } from 'pg';
import { Nr1Repository } from './repositories';
import { Nr1Risco, Nr1Avaliacao, Nr1PlanoAcao, Nr1Evidencia } from './models';

export class Nr1Service {
  private nr1Repo: Nr1Repository;

  constructor(private db: Pool) {
    this.nr1Repo = new Nr1Repository(db);
  }

  // Riscos
  async listRiscos(tenantId: string) {
    return this.nr1Repo.getRiscos(tenantId);
  }

  async getRiscoDetails(tenantId: string, id: number) {
    const risco = await this.nr1Repo.getRiscoById(tenantId, id);
    if (!risco) throw new Error('Risco não encontrado.');

    const avaliacoes = await this.nr1Repo.getAvaliacoesByRisco(tenantId, id);
    const planos = await this.nr1Repo.getPlanosByRisco(tenantId, id);
    const evidencias = await this.nr1Repo.getEvidenciasByRisco(tenantId, id);

    return { ...risco, avaliacoes, planos, evidencias };
  }

  async createRisco(tenantId: string, data: Omit<Nr1Risco, 'id' | 'tenant_id' | 'codigo'>) {
    // Generate code
    const codigo = `RSK-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const risco: Nr1Risco = {
      tenant_id: tenantId,
      codigo,
      ...data
    };
    return this.nr1Repo.createRisco(risco);
  }

  // Avaliações
  async evaluateRisco(tenantId: string, riscoId: number, probabilidade: number, impacto: number, justificativa?: string, avaliadorId?: number) {
    const risco = await this.nr1Repo.getRiscoById(tenantId, riscoId);
    if (!risco) throw new Error('Risco não encontrado.');

    // Calcular nível de risco
    const nivel_risco = probabilidade * impacto;

    const avaliacao: Nr1Avaliacao = {
      tenant_id: tenantId,
      risco_id: riscoId,
      probabilidade,
      impacto,
      nivel_risco,
      justificativa,
      avaliador_id: avaliadorId
    };

    return this.nr1Repo.createAvaliacao(avaliacao);
  }

  // Planos de Ação (BPM Integration)
  async createPlanoAcao(tenantId: string, riscoId: number, titulo: string, responsavel_omoc_id: number, prazo?: Date, solicitanteNome?: string) {
    const risco = await this.nr1Repo.getRiscoById(tenantId, riscoId);
    if (!risco) throw new Error('Risco não encontrado.');

    // BPM Integration: Encontrar o fluxo padrão de Plano de Ação NR1 ou genérico
    let bpmExecucaoId = null;
    const resFluxo = await this.db.query(`
      SELECT id FROM bpm_fluxos WHERE tenant_id = $1 AND nome ILIKE '%Ação%' LIMIT 1
    `, [tenantId]);

    if (resFluxo.rows.length > 0) {
      const fluxoId = resFluxo.rows[0].id;
      // Iniciar execução BPM
      const resBpm = await this.db.query(`
        INSERT INTO bpm_execucoes (tenant_id, fluxo_id, solicitante, status, etapa_atual, log_execucao)
        VALUES ($1, $2, $3, 'Em Andamento', 'Início', '[]'::jsonb)
        RETURNING id
      `, [tenantId, fluxoId, solicitanteNome || 'Sistema NR1']);
      bpmExecucaoId = resBpm.rows[0].id;
    }

    const plano: Nr1PlanoAcao = {
      tenant_id: tenantId,
      risco_id: riscoId,
      bpm_execucao_id: bpmExecucaoId,
      titulo,
      responsavel_omoc_id,
      prazo,
      status: 'Pendente'
    };

    return this.nr1Repo.createPlanoAcao(plano);
  }

  // Evidências (ECM Integration)
  async addEvidencia(tenantId: string, riscoId: number, ecm_pop_id?: number, descricao?: string, url_anexo?: string) {
    const risco = await this.nr1Repo.getRiscoById(tenantId, riscoId);
    if (!risco) throw new Error('Risco não encontrado.');

    const evidencia: Nr1Evidencia = {
      tenant_id: tenantId,
      risco_id: riscoId,
      ecm_pop_id,
      descricao,
      url_anexo
    };

    return this.nr1Repo.createEvidencia(evidencia);
  }

  // Dashboard
  async getDashboard(tenantId: string) {
    return this.nr1Repo.getDashboardAggregations(tenantId);
  }
}
