// Quick test client: npm run grpc:client
import 'dotenv/config';
import * as grpc from '@grpc/grpc-js';
import { loadProto } from '../src/app/bootstrap/grpc/protoLoader';

const proto = loadProto('/proto/agent.proto');
const client = new proto.agent.AgentService(
    `localhost:${process.env.GRPC_PORT ?? 50051}`,
    grpc.credentials.createInsecure(),
);

client.Ask({ user_id: 'u1', question: 'Hello gRPC' }, (err: any, res: any) => {
    if (err) return console.error('Ask error:', err.message);
    console.log('Ask ->', res.answer);

    const stream = client.AskStream({ user_id: 'u1', question: 'Stream this please' });
    stream.on('data', (chunk: any) => process.stdout.write(chunk.content));
    stream.on('end', () => { console.log('\nStream done'); process.exit(0); });
    stream.on('error', (e: any) => console.error('Stream error:', e.message));
});
