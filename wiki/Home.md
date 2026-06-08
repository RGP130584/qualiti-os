# QualitiOS Wiki

Bem-vindo à Wiki Oficial do QualitiOS! Esta plataforma centraliza a governança, estratégia e compliance para instituições de saúde (SST, ONA, ISO, etc.).

## 📚 Índice da Documentação

### 1. Estratégia e Descoberta
Documentação voltada para negócio, objetivos e capacidades da plataforma.
- [Domain Discovery](../docs/strategy/nr1/domain-discovery.md)
- [Capability Map](../docs/strategy/nr1/capability-map.md)
- [Maturity Model](../docs/strategy/nr1/maturity-model.md)

### 2. Arquitetura de Software
Decisões arquiteturais, fluxos de dados e infraestrutura.
- [Arquitetura TO-BE](../docs/architecture/to-be-architecture-v2.md)
- [Context Map (DDD)](../docs/architecture/nr1/context-map.md)
- [Arquitetura GRO/PGR](../docs/architecture/nr1/gro-pgr-architecture.md)
- [Modelo de Riscos Psicossociais](../docs/architecture/nr1/psychosocial-risk-model.md)
- [Root Cause Analysis (RCA)](../docs/architecture/nr1/root-cause-analysis-model.md)
- [Risk Canvas](../docs/architecture/nr1/risk-canvas-model.md)

### 3. Integrações de Módulos
Como os módulos do QualitiOS se conversam via APIs e mensageria.
- [Integração BPM (Workflows)](../docs/integrations/nr1/bpm-integration.md)
- [Integração LMS (Treinamentos)](../docs/integrations/nr1/lms-integration.md)
- [Integração ECM (Documentos/Evidências)](../docs/integrations/nr1/ecm-integration.md)
- [Integração OMOC (Hierarquia Org.)](../docs/integrations/nr1/omoc-integration.md)
- [Dashboard de Indicadores](../docs/integrations/nr1/indicators-dashboard.md)

### 4. Inteligência Operacional
Modelos analíticos de IA para apoio à decisão (Human-in-the-loop).
- [Modelo de Assessment de IA](../docs/ai/nr1/ai-assessment-model.md)

### 5. Roadmap e Implementação
Planejamento de versões, épicos e entregáveis técnicos.
- [Roadmap NR-01](../docs/roadmap/nr1/nr1-roadmap.md)
- [Pacote de Implementação](../docs/roadmap/nr1/nr1-implementation-package.md)

### 6. Architecture Decision Records (ADR)
Registro histórico de todas as decisões técnicas tomadas pela equipe de arquitetura.
- [ADRs Anteriores](../docs/adr/)
- [ADR-012: NR-01 Intelligence Platform](../docs/adr/ADR-012-NR1-Intelligence-Platform.md)

---

> **Nota para Desenvolvedores:**
> Para rodar a aplicação localmente, utilize `docker compose up -d`. Assegure-se de que a rede `shared_net` esteja criada. Para detalhes adicionais sobre desenvolvimento, consulte o `README.md` na raiz do projeto.
