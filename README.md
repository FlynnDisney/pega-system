# Positive Emotion Growth Assessment (PEGA)

A professional web application for administering the Positive Emotion Growth Assessment (PEGA), a 40-item psychological questionnaire that measures ten positive emotions based on Barbara Fredrickson's broaden-and-build research.

## 🌟 Features

- **40-item assessment** measuring 10 positive emotions
- **Professional, mobile-responsive UI** with progress tracking
- **Real-time scoring** and emotion profile analysis
- **Google Sheets integration** for data storage
- **Automated email courses** triggered by lowest-scoring emotions
- **Beautiful results visualization** with detailed interpretation

## 🎯 Measured Emotions

The PEGA measures these ten positive emotions (4 items each):

1. **Joy** - Happiness, contentment, and well-being
2. **Gratitude** - Appreciation for life and relationships
3. **Serenity** - Peace, calm, and tranquility
4. **Interest** - Curiosity and fascination
5. **Hope** - Optimism about the future
6. **Pride** - Confidence in abilities and accomplishments
7. **Amusement** - Humor and playfulness
8. **Inspiration** - Motivation from witnessing excellence
9. **Awe** - Wonder at beauty and vastness
10. **Love** - Close connections and warm feelings

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Hosting:** Vercel
- **Database:** Google Sheets (via Google Sheets API v4)
- **Email:** Google Apps Script with GmailApp

## 📋 Prerequisites

- Node.js 18+ and npm
- Google Cloud Platform account
- Google Sheets with service account access
- Vercel account (for deployment)

## 🔧 Setup Instructions

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd pega-system
npm install
\`\`\`

### 2. Set Up Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google Sheets API**
4. Create a **Service Account**:
   - Go to IAM & Admin → Service Accounts
   - Click "Create Service Account"
   - Give it a name (e.g., "pega-assessment")
   - Grant role: "Editor"
5. Create a key for the service account:
   - Click on the service account
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose JSON format
   - Download the JSON file
6. Create a new Google Sheet
7. Share the sheet with the service account email (found in the JSON file)

### 3. Configure Environment Variables

Copy the example environment file:

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Edit \`.env.local\` with your values:

\`\`\`env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your_spreadsheet_id_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

**Important:**
- Get the `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY` from the JSON file you downloaded
- The `GOOGLE_SHEET_ID` is found in your Google Sheet URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
- Keep the private key wrapped in quotes and preserve the \n characters

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Google Sheets Schema

The application writes data to Google Sheets with the following schema:

| Column | Field | Description |
|--------|-------|-------------|
| A | Timestamp | ISO timestamp of submission |
| B | Email | User's email address |
| C-AQ | Q1-Q40 | Individual item responses (1-5) |
| AR | Joy_Score | Joy subscale score (4-20) |
| AS | Gratitude_Score | Gratitude subscale score (4-20) |
| AT | Serenity_Score | Serenity subscale score (4-20) |
| AU | Interest_Score | Interest subscale score (4-20) |
| AV | Hope_Score | Hope subscale score (4-20) |
| AW | Pride_Score | Pride subscale score (4-20) |
| AX | Amusement_Score | Amusement subscale score (4-20) |
| AY | Inspiration_Score | Inspiration subscale score (4-20) |
| AZ | Awe_Score | Awe subscale score (4-20) |
| BA | Love_Score | Love subscale score (4-20) |
| BB | Total_Score | Total PEGA score (40-200) |
| BC | Lowest_Emotion_1 | Primary deficit emotion |
| BD | Lowest_Emotion_2 | Secondary deficit emotion |
| BE | Lowest_Emotion_3 | Tertiary deficit emotion |
| BF | Email_Sequence_Started | Email automation flag |

## 🚀 Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables:
   - Add `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - Add `GOOGLE_PRIVATE_KEY`
   - Add `GOOGLE_SHEET_ID`
   - Add `NEXT_PUBLIC_SITE_URL`
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

\`\`\`bash
npm install -g vercel
vercel login
vercel
\`\`\`

Follow the prompts and add environment variables when asked.

### Custom Domain Setup

1. In Vercel Dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain (e.g., `flynndisney.com/joy-assessment`)
4. Follow DNS configuration instructions
5. Update `NEXT_PUBLIC_SITE_URL` environment variable

## 📧 Email Automation Setup

The email automation is handled via Google Apps Script. See the project documentation for detailed setup instructions for:

- Configuring Google Apps Script triggers
- Email template management
- Email scheduling logic
- Tracking email delivery

## 📁 Project Structure

\`\`\`
pega-system/
├── app/
│   ├── api/
│   │   └── submit-assessment/
│   │       └── route.ts          # API endpoint for submissions
│   ├── results/
│   │   └── page.tsx              # Results page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page (assessment form)
│   └── globals.css               # Global styles
├── components/
│   ├── AssessmentForm.tsx        # Main assessment form
│   ├── QuestionItem.tsx          # Individual question component
│   ├── ProgressBar.tsx           # Progress indicator
│   └── ResultsChart.tsx          # Score visualization
├── lib/
│   ├── constants.ts              # Questions and configuration
│   ├── types.ts                  # TypeScript type definitions
│   ├── scoring.ts                # Scoring algorithm
│   └── googleSheets.ts           # Google Sheets integration
├── public/                       # Static assets
├── .env.local.example            # Environment variables template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
\`\`\`

## 🧪 Testing

### Manual Testing Checklist

- [ ] All 40 questions display correctly
- [ ] Email validation works
- [ ] Form validation prevents submission with missing answers
- [ ] Progress bar updates correctly
- [ ] Scoring calculation is accurate
- [ ] Data saves to Google Sheets
- [ ] Results page displays correctly
- [ ] Mobile responsiveness works
- [ ] All links work correctly

### Test Submission

To test the application:

1. Fill out all 40 questions
2. Enter a valid email address
3. Submit the form
4. Check Google Sheets for the new row
5. Verify the results page displays correctly

## 🎨 Customization

### Branding

Update colors in `tailwind.config.ts` and `app/globals.css` to match your brand:

\`\`\`css
:root {
  --primary: #3b82f6;
  --secondary: #10b981;
  /* ... */
}
\`\`\`

### Questions

To modify questions, edit `lib/constants.ts`:

\`\`\`typescript
export const QUESTIONS: Question[] = [
  // Update question text here
];
\`\`\`

**Warning:** Changing questions will affect scoring validation. Ensure 40 questions total with 4 items per emotion.

## 📊 Score Interpretation

- **Low (4-8):** Significant deficit - triggers email course
- **Moderate (9-14):** Some access with room for growth
- **High (15-20):** Good access to emotion

## 🔒 Security & Privacy

- Service account credentials stored securely in environment variables
- No sensitive data exposed to frontend
- HTTPS encryption via Vercel
- GDPR-compliant data handling
- Users can request data deletion

## 🐛 Troubleshooting

### "Failed to save assessment data"

- Check that `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY` are set correctly
- Verify the service account has edit access to the Google Sheet
- Check that Google Sheets API is enabled in Google Cloud Console

### Environment Variables Not Loading

- Make sure `.env.local` exists in the project root
- Restart the development server after changing environment variables
- For Vercel deployments, verify environment variables are set in the dashboard

### TypeScript Errors

\`\`\`bash
npm run build
\`\`\`

This will show any TypeScript compilation errors.

## 📝 License

[Add your license information here]

## 🤝 Contributing

[Add contribution guidelines here]

## 📞 Support

For questions or issues, please contact:
- Email: [your-email@example.com]
- Website: [flynndisney.com](https://flynndisney.com)

## 🙏 Acknowledgments

Built on Barbara Fredrickson's broaden-and-build theory of positive emotions.

---

**Note:** This application is designed for research and educational purposes. It should not be used as a diagnostic tool without proper validation and IRB approval.
