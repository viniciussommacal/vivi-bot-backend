import axios from 'axios';
import dotenv from 'dotenv';
import tools from '../tools';

dotenv.config();

const BASE_URL = 'https://api.openai.com/v1';
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID as string;
const API_KEY = process.env.OPENAI_API_KEY as string;

interface Message {
  role: string;
  content: { text?: { value?: string } }[];
}

const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'OpenAI-Beta': 'assistants=v2',
    Authorization: `Bearer ${API_KEY}`,
  },
});

async function pollRun(threadId: string, runId: string): Promise<string> {
  let status = 'in_progress';
  let result: string | null = null;
  const maxAttempts = 10;
  let attempt = 0;

  while (status === 'in_progress' && attempt < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    attempt++;

    const runResult = await http.get(`/threads/${threadId}/runs/${runId}`);
    status = runResult.data?.status ?? 'failed';

    if (
      status === 'requires_action' &&
      runResult.data?.required_action?.type === 'submit_tool_outputs'
    ) {
      await handleToolCalls(
        threadId,
        runId,
        runResult.data.required_action.submit_tool_outputs?.tool_calls ?? [],
      );
      status = 'in_progress';
    }

    if (status === 'completed') {
      result = await getAssistantMessage(threadId);
    }
  }

  if (!result) {
    throw new Error('Não foi possível obter a resposta do assistente.');
  }

  return result;
}

async function handleToolCalls(
  threadId: string,
  runId: string,
  toolCalls: any[],
) {
  if (toolCalls.length === 0) {
    return;
  }

  const toolCall = toolCalls[0];
  const func = toolCall.function;
  const tool = tools[func.name];

  if (!tool) {
    const result = `Função "${func.name}" não encontrada.`;
    console.error(result);

    await http.post(`/threads/${threadId}/runs/${runId}/submit_tool_outputs`, {
      tool_outputs: [
        {
          tool_call_id: toolCall.id,
          output: JSON.stringify({
            success: false,
            result,
          }),
        },
      ],
    });

    return;
  }

  const result = await tool(func.arguments);

  await http.post(`/threads/${threadId}/runs/${runId}/submit_tool_outputs`, {
    tool_outputs: [
      {
        tool_call_id: toolCall.id,
        output: JSON.stringify({
          success: true,
          result,
        }),
      },
    ],
  });
}

async function getAssistantMessage(threadId: string): Promise<string> {
  const messagesResponse = await http.get<{ data: Message[] }>(
    `/threads/${threadId}/messages`,
  );
  const messages = messagesResponse.data?.data ?? [];
  const assistantMessage = messages.find(
    message => message.role === 'assistant',
  );
  const contentMessage = assistantMessage?.content?.[0]?.text?.value ?? '';

  console.log(`\x1b[34mResposta do Assistente: ${contentMessage}\x1b[0m`);

  return contentMessage;
}

export async function createThread(): Promise<string> {
  const response = await http.post('/threads');
  const threadId: string | undefined = response.data?.id;

  if (!threadId) {
    throw new Error('Não foi possível obter o ID da thread.');
  }

  return threadId;
}

export async function sendMessage(
  threadId: string,
  userMessage: string,
): Promise<string> {
  console.log(`\x1b[35mMensagem do Usuário: ${userMessage}\x1b[0m`);

  await http.post(`/threads/${threadId}/messages`, {
    role: 'user',
    content: userMessage,
  });

  const runResponse = await http.post(`/threads/${threadId}/runs`, {
    assistant_id: ASSISTANT_ID,
  });

  const runId = runResponse.data?.id;
  if (!runId) {
    throw new Error('Não foi possível obter o ID da execução.');
  }

  return await pollRun(threadId, runId);
}
