## TECNOLOGIAS ##

1. API GOOGLE DRIVE: V3
2. Node.js

## Fluxo de aplicação ##

1. Aplicação é iniciada pelo index.js
2. index.js é resposável por:
    > Contar e listar quantos arquivos foram gerados dentro da pasta XML
    > Upload de arquivos para o Drive

## OBSERVAÇÕES ##

> Caso seja a primeira execução ou necessário atualizar o token, ou mudança no SCOPES, seguir os seguintes passos:
1. Apagar arquivo token.json (se existir)
2. Executar o arquivo gdrive-auth.js. Ele retornará um link e solicitará um código
3. Abrir link no navegador e permitir o acesso, então receberá um código
4. Colar código no terminal e teclar enter

# Fim