import { openai } from '@ai-sdk/openai';
import { CoreMessage, streamText, tool } from 'ai';
import dotenv from 'dotenv';
import { z } from 'zod';
import * as readline from 'node:readline/promises';
import { logger, task, wait } from "@trigger.dev/sdk/v3";

export const chatbotTask = task({
  id: "chatBot",
  // Set an optional maxDuration to prevent tasks from running indefinitely
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  run: async (payload: { userInput: string; sessionId: string }, { ctx }) => {
    logger.log("Chatbot started", payload);

  const messages: CoreMessage[] = [
    { role: 'user', content: payload.userInput },
  ];

  const result = streamText({
      model: openai('gpt-4o'),
      messages,
      tools: {
        weather: tool({
          description: 'Get the weather in a location (in Celsius)',
          parameters: z.object({
            location: z
              .string()
              .describe('The location to get the weather for'),
          }),
          execute: async ({ location }) => ({
            location,
            temperature: Math.round((Math.random() * 30 + 5) * 10) / 10, // Random temp between 5°C and 35°C
          }),
        }),
      },
      maxSteps: 5,
      onStepFinish: step => {
        console.log(JSON.stringify(step, null, 2));
      },
    });

    let fullResponse = '';
    //process.stdout.write('\nAssistant: ');
    for await (const delta of result.textStream) {
      fullResponse += delta;
     // process.stdout.write(delta);
    }
    //process.stdout.write('\n\n');
    logger.log('Chatbot response complete', { fullResponse });
    messages.push({ role: 'assistant', content: fullResponse });
    //await wait.for({ seconds: 5 });
    console.log(fullResponse)
    console.log(typeof fullResponse)
    return {
      response: fullResponse,
    };
  },
});
