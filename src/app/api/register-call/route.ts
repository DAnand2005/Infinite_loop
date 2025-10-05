import { logger } from "@/lib/logger";
import { InterviewerService } from "@/services/interviewers.service";
import { NextResponse } from "next/server";
import Retell from "retell-sdk";

const retellClient = new Retell({
  apiKey: process.env.RETELL_API_KEY || "",
});

export async function POST(req: Request, res: Response) {
  try {
    logger.info("register-call request received");

    const body = await req.json();

    const interviewerId = body.interviewer_id;
    const interviewer = await InterviewerService.getInterviewer(interviewerId);

    if (!interviewer || !interviewer.agent_id) {
      logger.error("Interviewer or agent_id not found for interviewerId:", interviewerId);
      return NextResponse.json(
        { error: "Interviewer configuration is missing." },
        { status: 500 },
      );
    }

    if (!process.env.RETELL_API_KEY) {
      logger.error("RETELL_API_KEY is not set.");
      return NextResponse.json(
        { error: "Retell API key is not configured." },
        { status: 500 },
      );
    }

    const registerCallResponse = await retellClient.call.createWebCall({
      agent_id: interviewer.agent_id,
      retell_llm_dynamic_variables: body.dynamic_data,
    });

    logger.info("Call registered successfully");

    return NextResponse.json(
      {
        registerCallResponse,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Error in register-call:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      { error: "Failed to register call.", details: errorMessage },
      { status: 500 },
    );
  }
}
