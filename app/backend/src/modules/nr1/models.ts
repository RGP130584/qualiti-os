export interface Nr1Risco {
  id?: number;
  tenant_id: string;
  codigo: string;
  titulo: string;
  descricao?: string;
  categoria: string;
  setor: string;
  omoc_cargo_id?: number | null;
  status: string;
  data_criacao?: Date;
}

export interface Nr1Avaliacao {
  id?: number;
  tenant_id: string;
  risco_id: number;
  data_avaliacao?: Date;
  probabilidade: number;
  impacto: number;
  nivel_risco: number;
  justificativa?: string;
  avaliador_id?: number | null;
}

export interface Nr1PlanoAcao {
  id?: number;
  tenant_id: string;
  risco_id: number;
  bpm_execucao_id?: number | null;
  titulo: string;
  responsavel_omoc_id?: number | null;
  prazo?: Date;
  status: string;
  data_criacao?: Date;
}

export interface Nr1Evidencia {
  id?: number;
  tenant_id: string;
  risco_id: number;
  ecm_pop_id?: number | null;
  descricao?: string;
  url_anexo?: string;
  data_anexo?: Date;
}
