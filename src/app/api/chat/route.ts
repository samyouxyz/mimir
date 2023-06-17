import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { createParser } from "eventsource-parser";

export async function POST(request: NextRequest) {
  const messages = await request.json();

  try {
    const res = await fetch(`https://api.openai.com/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.5,
        max_tokens: 500,
        stream: true,
      }),
    });

    if (res.status !== 200) {
      throw new Error("OpenAI API error");
    }

    const textEncoder = new TextEncoder();
    const textDecoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const onParse = (event: any) => {
          if (event.type === "event") {
            const data = event.data;
            try {
              const json = JSON.parse(data);
              if (json.choices[0].finish_reason != null) {
                controller.close();
                return;
              }
              const text = json.choices[0].delta.content;
              controller.enqueue(textEncoder.encode(text));
            } catch (e) {
              console.error(e);
            }
          }
        };

        const parser = createParser(onParse);

        for await (const chunk of res.body as any) {
          parser.feed(textDecoder.decode(chunk));
        }
      },
    });

    return new NextResponse(stream);
  } catch (e) {
    console.error(e);
    if (e instanceof Error) {
      return new NextResponse("Error", { status: 500 });
    }
  }
}
