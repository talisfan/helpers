# Nome projeto

### SUMÁRIO

1. [Introdução](###INTRODUÇÃO)
2. [Tipo da aplicação](###TIPO_DATA_APLICAÇÃO)
3. [Infraestrutura](###INFRAESTRUTURA)
4. [Arquitetura](###ARQUITETURA)
5. [Fluxo](###FLUXO)
6. [Tecnologias](###TECNOLOGIAS)
7. [Setup Local](###SETUP_LOCAL)
8. [Deploy](###DEPLOY)
9. [Considerações de desenvolvimento](###CONSIDERAÇÕES_DE_DESENVOLVIMENTO)

### INTRODUÇÃO

Objetivo geral da aplicação, briefing da demanda, contexto do desenvolvimento ...

[Voltar ao sumário](###SUMÁRIO)

### TIPO_DATA_APLICAÇÃO

Existem 2 tipos de aplicações até agora que são padronizadas pelo time:

1. Aplicações genéricas com execuções por cliente ou por contextos diferentes:
   Nesse tipo de aplicação, cada execução pertence a um cliente. É preciso
   explicar como essa distinção de cliente acontece e como fazer para executar.
   Exemplo 1: Essa aplicação é do tipo genérica com execução por cliente. Ela
   procura uma variável de ambiente CLIENT_CONFIG_PATH e com essa variável um
   arquivo de entrada é encontrado onde estão as informações necessárias para a
   execução.
   Exemplo 2: Essa aplicação é do tipo genérica com execução por contextos
   diferentes. Ela procura uma variável de ambiente CONFIG_PATH e com essa
   variável um arquivo de entrada é encontrado onde estão as informações
   necessárias para a execução. Para cada contexto ela importa os dados dele.

2. Aplicações específicas de um cliente:
   Nesse tipo de aplicação, há apenas uma execução ou um fluxo e apenas precisa
   deixar claro esse tipo de aplicação nessa etapa, pois a etapa de fluxo vai
   detalhar melhor.

[Voltar ao sumário](###SUMÁRIO)

### INFRAESTRUTURA

Exemplo: Aplicação hospedada na AWS Enext, roda em um Lambda (nome da função), iniciado pelo CloudWatch as 3 da manhã todos os dias...
Onde está rodando, na infra enext ou fora, como encontrar...

[Voltar ao sumário](###SUMÁRIO)

### ARQUITETURA

Recursos necessários para configurar a infraestrutura do zero. Todo repositório possui uma pasta chamada readme_assets, dentro uma pasta
images com as imagens do README. Uma delas é a imagem da arquitetura.

![Arquitetura](./readme_assets/images/arquitetura.png)

[Voltar ao sumário](###SUMÁRIO)

### FLUXO

Decrição do fluxo da aplicação. Todo repositório possui uma pasta chamada readme_assets, dentro uma pasta
images com as imagens do README. Uma delas é a imagem do fluxo.

![Fluxo](./readme_assets/images/fluxo.png)

[Voltar ao sumário](###SUMÁRIO)

### TECNOLOGIAS

-   Linguagem e versão 1.0
-   Framework

[Voltar ao sumário](###SUMÁRIO)

### SETUP_LOCAL

Configurações de ambiente necessárias para rodar a aplicação localmente.

[Voltar ao sumário](###SUMÁRIO)

### DEPLOY

Processo que deve ser feito para realizar o deploy.

[Voltar ao sumário](###SUMÁRIO)

### CONSIDERAÇÕES_DE_DESENVOLVIMENTO

Qualquer observação ou anotação sobre o desenvolvimento da aplicação, regra de negócio ou briefing da demanda.

[Voltar ao sumário](###SUMÁRIO)
