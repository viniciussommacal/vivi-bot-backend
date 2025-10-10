import type { Request, Response } from 'express';
import { createThread, sendMessage } from '../services/chatService';

export async function startConversation(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { message } = req.body;

    if (!message) {
      return res
        .status(400)
        .json({ error: "O campo 'message' é obrigatório." });
    }

    const threadId = await createThread();
    const response = await sendMessage(threadId, message);

    return res.status(200).json({
      threadId,
      response,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function talk(req: Request, res: Response): Promise<Response> {
  try {
    const { message, threadId } = req.body;

    if (!message || !threadId) {
      return res.status(400).json({
        error: "Os campos 'message' e 'threadId' são obrigatórios.",
      });
    }

    const response = await sendMessage(threadId, message);

    return res.status(200).json({
      response,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
