import { z } from 'zod';

const phone = z.string().min(5).max(20);
const countryCode = z.string().min(1).max(6).default('+91');
const url = z.string().url().or(z.literal(''));

const baseApplicant = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  contactCountryCode: countryCode,
  contactNumber: phone,
  whatsappCountryCode: countryCode,
  whatsappNumber: phone,
  googleVerified: z.boolean().optional(),
  phoneVerified: z.boolean().optional(),
  uid: z.string().optional(),
});

export const creatorApplicationSchema = baseApplicant.extend({
  applicationType: z.literal('creator'),
  facebookUrl: url.optional(),
  facebookFollowers: z.string().optional(),
  instagramUrl: url.optional(),
  instagramFollowers: z.string().optional(),
  youtubeUrl: url.optional(),
  youtubeFollowers: z.string().optional(),
  xUrl: url.optional(),
  xFollowers: z.string().optional(),
  linkedinUrl: url.optional(),
  linkedinFollowers: z.string().optional(),
});

export const merchantApplicationSchema = baseApplicant.extend({
  applicationType: z.literal('merchant'),
  brandName: z.string().min(2).max(120),
  city: z.string().min(2).max(80),
  state: z.string().min(2).max(80),
  country: z.string().min(2).max(80),
});

export const chapterApplicationSchema = baseApplicant.extend({
  applicationType: z.literal('chapter'),
  chapterName: z.string().min(2).max(120),
  customChapterName: z.string().optional(),
  chapterRole: z.string().min(2).max(80),
  chapterProfileUrl: url,
  statementOfPurpose: z.string().min(20).max(2000),
});

export const applicationSchema = z.discriminatedUnion('applicationType', [
  creatorApplicationSchema,
  merchantApplicationSchema,
  chapterApplicationSchema,
]);

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  reason: z.string().min(2).max(200),
  message: z.string().min(10).max(5000),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
