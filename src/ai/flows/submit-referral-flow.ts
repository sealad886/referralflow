
'use server';
/**
 * @fileOverview A flow for submitting a new clinical referral.
 *
 * - submitReferral - A function that handles the referral submission process.
 * - SubmitReferralInput - The input type for the submitReferral function.
 * - SubmitReferralOutput - The return type for the submitReferral function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const PatientSchema = z.object({
  id: z.string().describe('The patient\'s Medical Record Number (MRN).'),
  name: z.string().describe('The full name of the patient.'),
  dob: z.string().describe('The patient\'s date of birth.'),
  gender: z.string().describe('The patient\'s gender.'),
});

const SubmitReferralInputSchema = z.object({
  patient: PatientSchema,
  department: z.string().describe('The destination department for the referral.'),
  priority: z.string().describe('The priority level of the referral (e.g., Routine, Urgent).'),
  notes: z.string().optional().describe('Clinical notes or reason for the referral.'),
});
export type SubmitReferralInput = z.infer<typeof SubmitReferralInputSchema>;

const SubmitReferralOutputSchema = z.object({
  confirmationMessage: z.string().describe('A brief, friendly confirmation message for the user who submitted the referral.'),
  notificationSummary: z.string().describe('A concise, one-sentence summary of the referral suitable for a notification (e.g., email subject line).'),
});
export type SubmitReferralOutput = z.infer<typeof SubmitReferralOutputSchema>;

export async function submitReferral(input: SubmitReferralInput): Promise<SubmitReferralOutput> {
  return submitReferralFlow(input);
}

const prompt = ai.definePrompt({
  name: 'submitReferralPrompt',
  input: { schema: SubmitReferralInputSchema },
  output: { schema: SubmitReferralOutputSchema },
  prompt: `
    You are an AI assistant in a clinical referral management system.
    A new referral has been submitted with the following details:
    - Patient: {{patient.name}} (MRN: {{patient.id}})
    - Department: {{department}}
    - Priority: {{priority}}
    - Notes: {{notes}}

    Based on these details, please generate:
    1. A 'confirmationMessage' to be shown to the user who just submitted the form. It should be reassuring and confirm the action was successful.
    2. A 'notificationSummary' that can be used as a subject line for an email notification about this new referral. It should be very concise.
  `,
});

const submitReferralFlow = ai.defineFlow(
  {
    name: 'submitReferralFlow',
    inputSchema: SubmitReferralInputSchema,
    outputSchema: SubmitReferralOutputSchema,
  },
  async (input) => {
    // In a real application, this is where you would:
    // 1. Save the referral data to a database.
    // 2. Trigger notification hooks (e.g., sending an email) using the generated summary.
    console.log('Submitting referral to the backend:', input);

    const { output } = await prompt(input);
    if (!output) {
        throw new Error("The AI model failed to generate a response.");
    }
    
    // For now, we simulate success by returning the AI-generated content.
    return output;
  }
);
