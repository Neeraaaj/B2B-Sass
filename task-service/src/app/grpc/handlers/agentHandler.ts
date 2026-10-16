import * as grpc from '@grpc/grpc-js';
import { agentGraph } from '../../agent/graph';

type AskRequest = { user_id: string; question: string };

export const agentHandler = {
    // Unary RPC
    async Ask(
        call: grpc.ServerUnaryCall<AskRequest, { answer: string }>,
        callback: grpc.sendUnaryData<{ answer: string }>,
    ) {
        try {
            const result = await agentGraph.invoke({ question: call.request.question });
            callback(null, { answer: result.answer });
        } catch (err: any) {
            callback({ code: grpc.status.INTERNAL, message: err?.message ?? 'Agent failed' });
        }
    },

    // Server-streaming RPC
    async AskStream(call: grpc.ServerWritableStream<AskRequest, { content: string; done: boolean }>) {
        try {
            const result = await agentGraph.invoke({ question: call.request.question });
            for (const word of result.answer.split(' ')) {
                call.write({ content: word + ' ', done: false });
            }
            call.write({ content: '', done: true });
            call.end();
        } catch (err: any) {
            call.destroy(err);
        }
    },
};
