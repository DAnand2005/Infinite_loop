export const SYSTEM_PROMPT =
  "You are an expert interviewer who crafts insightful questions to evaluate candidates.";

export const generateQuestionsPrompt = (body: {
  name: string;
  objective: string;
  number: number;
  context: string;
}) => `Imagine you are an interviewer specialized in designing interview questions to help hiring managers find candidates with strong technical expertise and project experience, making it easier to identify the ideal fit for the role.
              
Interview Title: ${body.name}
Interview Objective: ${body.objective}

Number of questions to be generated: ${body.number}

Follow these detailed guidelines when crafting the questions:
- Focus on evaluating the candidate's technical knowledge and their experience working on relevant projects. Questions should aim to gauge depth of expertise, problem-solving ability, and hands-on project experience. These aspects carry the most weight.
- Include questions designed to assess problem-solving skills through practical examples. For instance, how the candidate has tackled challenges in previous projects, and their approach to complex technical issues.
- Soft skills such as communication, teamwork, and adaptability should be addressed, but given less emphasis compared to technical and problem-solving abilities.
- Maintain a professional yet approachable tone, ensuring candidates feel comfortable while demonstrating their knowledge.
- Ask concise and precise open-ended questions that encourage detailed responses. Each question should be 30 words or less for clarity.

Use the following context to generate the questions:
${body.context}

Moreover generate a 50 word or less second-person description about the interview to be shown to the user. It should be in the field 'description'.
Do not use the exact objective in the description. Remember that some details are not be shown to the user. It should be a small description for the
user to understand what the content of the interview would be. Make sure it is clear to the respondent who's taking the interview.

The field 'questions' should take the format of an array of objects with the following key: question.

Here is an example of the desired JSON output format:

{
  "description": "An interview to assess your skills and experience in web development, focusing on your ability to solve problems and build robust applications.",
  "questions": [
    {
      "question": "Can you describe a complex web application you have worked on and your role in the project?"
    },
    {
      "question": "How do you approach debugging a difficult issue in a large codebase?"
    }
  ]
}

Strictly output only a JSON object with the keys 'questions' and 'description'. Do not include any other text or formatting.`;
