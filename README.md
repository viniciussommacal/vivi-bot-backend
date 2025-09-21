# 🤖 Viv.ia BOT (Backend)

Um **assistente virtual** utilizando a **API da OpenAI** para **captura de leads em sites**, desenvolvido em **Node.js + TypeScript**, que utiliza **Express** para a API e **MongoDB** para armazenamento dos leads.  

O assistente realiza diálogos simulando uma conversa natural, solicitando informações relevantes do lead (**nome, e-mail e telefone**), validando os dados fornecidos, integrando com o backend e armazenando-os no banco de dados.

---

## 💡 Resumo das Funcionalidades

- Captura de leads de forma automatizada.

- Validação de dados (nome, e-mail, telefone).

- Armazenamento seguro no MongoDB.

- Diálogo natural com o usuário utilizando IA da OpenAI.

Possibilidade de integração com PDFs de FAQ para respostas automatizadas.

---

## ⚙️ Como Utilizar

1. Clone o repositório:

```bash
git clone https://github.com/viniciussommacal/vivi_bot_backend.git
cd vivi_bot_backend
```

2. Crie o arquivo .env com base no .env.example presente no projeto.

3. Acesse o painel de controle da OpenAI e crie uma nova chave: Painel API Keys - OpenAI

4. Cole a chave criada na variável OPENAI_API_KEY.

5. Acesse o Painel de Assistentes e crie um novo assistente seguindo o documento Exemplo de Prompt + PDF de FAQ

6. Copie o ID do assistente criado e cole na variável OPENAI_ASSISTANT_ID.

7. Instale as dependências:
```
npm install
```

8. Inicie o servidor em modo de desenvolvimento:
```
npm run dev
```

## 🧪 Testar a API com cURL

1. Inicie a conversa: 

```
curl --request POST \
  --url http://localhost:4502/startConversation \
  --header 'Content-Type: application/json' \
  --data '{
	"message": "Olá"
}'
```

2. Envie novas mensagens: 

```
curl --request POST \
  --url http://localhost:4502/talk \
  --header 'Content-Type: application/json' \
  --data '{
	"message": "Meu nome é fulano",
	"threadId": "thread_xpto123"
}'
```

---

## 🏗️ Tecnologias Utilizadas

- [Node.js](https://nodejs.org/) 
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Axios](https://axios-http.com/)
- [Dotenv](https://github.com/motdotla/dotenv)
- [Nodemon](https://nodemon.io/)
- [Prettier](https://prettier.io/)
- [API Open AI](https://platform.openai.com/docs/overview)
