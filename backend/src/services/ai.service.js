const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
 

const client = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100).describe("The match score between the candidate and the job description"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How the candidate would answer this question, what point to cover, what approach to take etc")
    })).describe("List of technical questions that can be asked in the interview with their intentions"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How the candidate would answer this question, what point to cover, what approach to take etc")
    })).describe("List of behavioral questions that can be asked in the interview with their intentions"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The missing skill"),
        severity: z.enum(["Low", "Medium", "High"]).describe("The severity of the skill gap")
    })).describe("List of skill gaps identified in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day of the preparation plan, starting from 1"),
        focus: z.string().describe("The focus area for that day to follow preparation plan, eg, Technical Skills, Behavioral Questions"),
        tasks: z.string().describe("The tasks to be completed that day to follow the preparation plan")
    })).describe("List of preparation steps for the interview that candidate should follow for effective preparation"),
    title: z.string().describe("The title of the job for which the interview is being conducted")
});

const interviewReportJsonSchema = z.toJSONSchema(interviewReportSchema);

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
 

    const prompt = `
You are an experienced technical interviewer with 15+ years of hiring experience.
Based on the resume, candidate's self-description, and job description below,
generate a match score, technical questions, behavioral questions, skill gaps,
and a day-by-day preparation plan.

Resume:
${resume}

Candidate's Self Description:
${selfDescription}

Job Description:
${jobDescription}

Return ONLY valid JSON. The JSON MUST exactly follow the provided schema.
`;

    const interaction = await client.interactions.create({
        model: "gemini-3.6-flash",
        input: prompt,
        response_format: {
            type: 'text',
            mime_type: 'application/json',
            schema: interviewReportJsonSchema
        },
    });

    const report = JSON.parse(interaction.output_text); 
    return report;
}

module.exports = { generateInterviewReport };