# ADR-012: NR-01 Intelligence Platform (Arquitetura do Módulo)

**Status:** PROPOSED  
**Data:** 08/06/2026  
**Autores:** Equipe de Arquitetura QualitiOS  

## Contexto

O QualitiOS já gerencia a qualidade hospitalar através do módulo ONA (focado em certificação e governança). Com a atualização da Norma Regulamentadora 01 (NR-01) em 2024, que tornou obrigatório o Gerenciamento de Riscos Ocupacionais (GRO) e a digitalização do Programa de Gerenciamento de Riscos (PGR), os hospitais parceiros demandam uma solução integrada de SST (Saúde e Segurança do Trabalho).

O desafio arquitetural é como introduzir o domínio extremamente complexo de SST (que engloba ergonomia, riscos psicossociais, integração eSocial e matriz de riscos) dentro do ecossistema QualitiOS sem poluir o Core Domain existente, garantindo a coesão.

## Decisão

Foi decidido **criar o módulo NR-01 Intelligence Platform como um Bounded Context separado**, integrado via arquitetura dirigida a eventos (Event-Driven Architecture) e APIs REST síncronas (quando necessário o consumo em tempo real), utilizando os padrões táticos do Domain-Driven Design (DDD).

## Justificativa (Critérios de Avaliação)

Avaliamos quatro abordagens para o design arquitetural:

### 1. Extensão do módulo ONA existente
*   **Prós:** Rápido de implementar inicialmente; banco de dados já existente.
*   **Contras:** Criação de um "Big Ball of Mud". O domínio ONA (certificação/processos) possui regras de negócio completamente diferentes de SST (higiene ocupacional, insalubridade, eSocial). Misturá-los violaria o Princípio da Responsabilidade Única (SRP) em nível arquitetural.

### 2. Módulo independente fortemente acoplado (Monolito Tradicional)
*   **Prós:** Facilidade em joins de banco de dados (ex: `SELECT * FROM nr1_risco JOIN ona_setor`).
*   **Contras:** Um erro no módulo NR-01 poderia derrubar o módulo ONA; manutenção de código torna-se difícil com times crescendo; impossibilidade de escalar serviços de forma independente.

### 3. Bounded Context DDD com Integração por Eventos (Escolha Decidida)
*   **Prós:**
    *   **Isolamento:** O modelo de Risco da NR-01 evolui independente do modelo de Risco da ONA (apesar do nome parecido, têm propriedades e ciclos de vida diferentes).
    *   **Desacoplamento:** A comunicação principal entre domínios (NR-01, OMOC, BPM) será via eventos de domínio (ex: `WorkerTransferredEvent` no OMOC aciona recálculo no NR-01).
    *   **Evolução Modular:** Prepara o terreno para no futuro, se necessário, extrair o NR-01 para um microsserviço físico.
*   **Contras:** Complexidade inicial maior de setup; eventual consistência na replicação de dados entre módulos; overhead para desenhar as APIs e mensageria internas.

### 4. Microsserviço Separado Fisicamente
*   **Prós:** Isolamento extremo de deploy e banco de dados.
*   **Contras:** Over-engineering para o momento atual; aumento drástico nos custos operacionais de infraestrutura no beta; latência de rede; transações distribuídas (Sagas) seriam prematuras para a atual volumetria.

## Consequências

**Positivas:**
- O código do NR-01 ficará confinado no diretório `app/backend/src/modules/nr1`, mantendo a base de código do Fastify limpa.
- O modelo de banco de dados do NR-01 usará seu próprio schema/namespace dentro do PostgreSQL, isolado do schema ONA.
- Os modelos de IA e Assessment poderão ser iterados sem impactar o resto do QualitiOS.

**Negativas:**
- Exige que o time de engenharia seja treinado nos padrões DDD (Anti-Corruption Layer, Domain Events).
- Integração de relatórios consolidados exigirá um CQRS/Read Model onde dados de diferentes módulos são projetados para leitura.

## Riscos e Mitigações

*   **Risco:** Inconsistência de dados entre o Bounded Context OMOC (estrutura hierárquica) e o Bounded Context NR-01.
*   **Mitigação:** Implementar *Outbox Pattern* para garantir que a publicação de eventos de domínio seja atômica com a persistência de banco de dados.

## Critérios de Revisão

Esta ADR deve ser revista se:
1. O volume de dados de IoT / monitoramento ambiental da NR-01 superar 1000 eventos por segundo, justificando a divisão para um microsserviço separado.
2. A integração eSocial exigir tempos de resposta incompatíveis com a arquitetura assíncrona proposta.

## Referências

- Vernon, Vaughn. *Implementing Domain-Driven Design*.
- Norma Regulamentadora nº 01 (MTE - Portaria nº 1.419/2024).
- Padrões de Integração Empresarial (EIP).
