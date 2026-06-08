import { FastifyPluginAsync } from 'fastify';
import { authenticate } from '../utils/auth';
import pool from '../db';
import { Nr1Service } from '../modules/nr1/services';

const nr1Routes: FastifyPluginAsync = async (fastify, opts) => {
  const nr1Service = new Nr1Service(pool);

  fastify.addHook('onRequest', authenticate);

  // Inventário de Riscos
  fastify.get('/riscos', async (request, reply) => {
    try {
      const tenant_id = request.user.unidade || 'Unidade Central';
      const riscos = await nr1Service.listRiscos(tenant_id);
      return reply.send(riscos);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.post('/riscos', async (request, reply) => {
    try {
      const tenant_id = request.user.unidade || 'Unidade Central';
      const data = request.body as any;
      const risco = await nr1Service.createRisco(tenant_id, data);
      return reply.send(risco);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.get('/riscos/:id', async (request, reply) => {
    try {
      const tenant_id = request.user.unidade || 'Unidade Central';
      const { id } = request.params as { id: string };
      const details = await nr1Service.getRiscoDetails(tenant_id, Number(id));
      return reply.send(details);
    } catch (error: any) {
      return reply.status(404).send({ error: error.message });
    }
  });

  // Avaliações
  fastify.post('/riscos/:id/avaliacoes', async (request, reply) => {
    try {
      const tenant_id = request.user.unidade || 'Unidade Central';
      const userId = request.user.id;
      const { id } = request.params as { id: string };
      const { probabilidade, impacto, justificativa } = request.body as any;
      
      const avaliacao = await nr1Service.evaluateRisco(tenant_id, Number(id), probabilidade, impacto, justificativa, userId);
      return reply.send(avaliacao);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Planos de Ação
  fastify.post('/riscos/:id/planos-acao', async (request, reply) => {
    try {
      const tenant_id = request.user.unidade || 'Unidade Central';
      const nome = request.user.nome;
      const { id } = request.params as { id: string };
      const { titulo, responsavel_omoc_id, prazo } = request.body as any;
      
      const plano = await nr1Service.createPlanoAcao(tenant_id, Number(id), titulo, responsavel_omoc_id, prazo, nome);
      return reply.send(plano);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Evidências
  fastify.post('/riscos/:id/evidencias', async (request, reply) => {
    try {
      const tenant_id = request.user.unidade || 'Unidade Central';
      const { id } = request.params as { id: string };
      const { ecm_pop_id, descricao, url_anexo } = request.body as any;
      
      const evidencia = await nr1Service.addEvidencia(tenant_id, Number(id), ecm_pop_id, descricao, url_anexo);
      return reply.send(evidencia);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Dashboard
  fastify.get('/dashboard', async (request, reply) => {
    try {
      const tenant_id = request.user.unidade || 'Unidade Central';
      const data = await nr1Service.getDashboard(tenant_id);
      return reply.send(data);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });
};

export default nr1Routes;
