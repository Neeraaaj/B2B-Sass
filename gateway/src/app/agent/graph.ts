import { Annotation, END, START, StateGraph } from '@langchain/langgraph';

// Shared state that flows through every node of the graph
const AgentState = Annotation.Root({
    question: Annotation<string>(),
    answer: Annotation<string>(),
});

// Placeholder node — later this is where you call an LLM
async function answerNode(state: typeof AgentState.State) {
    return { answer: `You asked: "${state.question}"` };
}

export const agentGraph = new StateGraph(AgentState)
    .addNode('respond', answerNode)
    .addEdge(START, 'respond')
    .addEdge('respond', END)
    .compile();
