# Fluxo e aprovações

`Discovery → Refinamento → Aprovação do escopo → Planejamento → Implementação → QA → Pull Request → Aprovação humana → Integração → Preparação de release → Aprovação humana → Publicação`

## Controles efetivos

| Marco | Ação permitida | Controle |
| --- | --- | --- |
| Discovery e refinamento | Leitura, análise e proposta | Não muda funcionalidade. |
| Aprovação do escopo | Início da implementação | Confirmação explícita do usuário. |
| QA | Correções dentro do escopo aprovado | Evidência de teste; escalonar mudança significativa ao PO. |
| Pull Request | Preparar descrição e evidências | Criar/alterar PR depende de autorização explícita. |
| Integração | Merge | Aprovação humana explícita; nunca automática. |
| Release/publicação | Checklist e avaliação de risco | Aprovação humana específica; nunca inferida da aprovação do escopo. |

Falha grave, requisito novo ou impacto fora do escopo retorna ao PO para novo
refinamento e aprovação. O Harness nunca executa deploy ou publicação de forma
automática.

## Integração por branch

O trabalho regular de produto é revisado e integrado em `develop`. `main`
representa somente a versão publicada e recebe promoção de `develop` apenas no
processo de release autorizado. A aprovação do escopo ou de uma PR não autoriza
merge em nenhuma das branches; o merge continua dependendo de aprovação humana
explícita.

## Retorno de QA

QA informa ao Desenvolvedor o critério falho, severidade, reprodução e evidência.
O Desenvolvedor corrige apenas dentro do escopo aprovado e devolve evidências;
QA retesta. Alterações de escopo voltam ao PO. O PO consolida o resultado e
mantém os gates de PR, merge e publicação.
