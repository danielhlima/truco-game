# AdMob e UMP: configuração e teste

## Variantes Android

Os identificadores de anúncio não ficam no código Java. O Manifest aponta para
`@string/admob_app_id`, que é fornecida por variante:

- `android/app/src/debug/res/values/admob.xml`: App ID e unidade intersticial oficiais de teste do Google;
- `android/app/src/release/res/values/admob.xml`: App ID e unidade intersticial de produção do Truco Raiz.

Assim, `assembleDebug` nunca usa IDs de produção e `assembleRelease` nunca usa
os IDs de exemplo.

## Fluxo de consentimento

Na inicialização Android, `TrucoAdsPlugin` atualiza `ConsentInformation`, mostra
o formulário UMP quando exigido e só inicializa o Google Mobile Ads SDK quando
`canRequestAds()` permite. A escolha do usuário não é substituída por uma
suposição local. A opção **Opções de privacidade** aparece nas configurações
somente quando o UMP retorna `PrivacyOptionsRequirementStatus.REQUIRED`.

## Teste manual do UMP em debug

1. Gere e instale uma build debug. Emuladores já são dispositivos de teste.
2. Abra o app uma vez e consulte o Logcat. O UMP informa um hash e uma instrução
   semelhante a `addTestDeviceHashedId("...")`.
3. Para testar em aparelho físico, adicione temporariamente esse hash na criação
   de `ConsentDebugSettings` em `TrucoAdsPlugin`, protegida por
   `if (BuildConfig.DEBUG)`. Passe o objeto ao `ConsentRequestParameters` e,
   se necessário, use `DEBUG_GEOGRAPHY_EEA` nesse mesmo bloco.
4. Nunca acrescente hash de teste ou geografia forçada fora desse bloco; código
   de debug não deve chegar à release.
5. Para simular primeira execução novamente, use `consentInformation.reset()`
   somente dentro do mesmo bloco `BuildConfig.DEBUG`, reinstale a build ou limpe
   os dados do app. Não use `reset()` em produção.

### Cenários a validar

- **Consentir:** o formulário fecha; anúncios podem ser solicitados quando o
  UMP permitir; a cadência continua sendo uma exibição a cada duas partidas
  elegíveis.
- **Não consentir:** o jogo continua funcionando. O app não presume consentimento;
  anúncios só são solicitados se `canRequestAds()` autorizar o modo aplicável,
  como anúncios limitados.
- **Gerenciar opções:** quando o item aparecer em Configurações, toque em
  **Opções de privacidade**, altere a escolha no formulário e confirme que o
  item segue o status retornado pelo UMP.
- **Links externos:** em Configurações, valide **Política de Privacidade** e
  **Suporte**. No Android, ambos usam `ACTION_VIEW` e devem abrir no navegador
  padrão; na web, abrem em nova aba.

## Antes de publicar

Crie e publique as mensagens necessárias em **Privacy & messaging** na conta
AdMob para o App ID de produção. Teste o artefato release e atualize a seção de
Segurança dos dados e a declaração de anúncios na Play Console para refletir o
Google Mobile Ads SDK e a configuração efetiva de anúncios.
