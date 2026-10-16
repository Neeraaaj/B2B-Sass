# B2BSass — Express + gRPC + LangGraph (TypeScript)

## Setup
1. npm install
2. copy .env.example .env      (Windows)   |   cp .env.example .env   (mac/linux)
3. npm run dev                 -> starts Express (4000) + gRPC (50051)
4. In a second terminal: npm run grpc:client   -> tests Ask + AskStream

## Structure
proto/agent.proto                         gRPC contract (the "menu")
src/index.ts                              entry: loads .env, calls bootstrap()
src/app/bootstrap/index.ts                starts both servers
src/app/bootstrap/express/                Express server
src/app/bootstrap/exceptions/             Express error handler
src/app/bootstrap/grpc/protoLoader.ts     loads .proto at runtime
src/app/bootstrap/grpc/grpcServer.ts      creates gRPC server, binds handlers
src/app/grpc/handlers/agentHandler.ts     implementation of each RPC
src/app/agent/graph.ts                    LangGraph StateGraph (placeholder node)
scripts/grpcClient.ts                     test client

## Adding a new RPC
1. Add the rpc + messages in proto/agent.proto
2. Add a method with the SAME name in agentHandler.ts
3. nodemon restarts automatically (it watches .proto too)
