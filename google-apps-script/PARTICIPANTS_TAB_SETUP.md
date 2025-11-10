# Participants Tab Setup Guide

This document explains how to set up the Participants tab in your Google Sheet, which processes Form Responses and calculates emotion scores for the email automation system.

## Overview

The Participants tab serves as the processing layer between your Google Form responses and the email automation system. It:
- Automatically pulls data from "Form Responses 1" tab
- Calculates emotion scores using formulas
- Identifies the 3 lowest-scoring emotions
- Tracks email sequence status

## Tab Structure

### Column Layout (28 columns total)

| Column | Name | Type | Description |
|--------|------|------|-------------|
| A | ID | Formula | Auto-incrementing ID number |
| B | Timestamp | Formula | From Form Responses |
| C | Email | Formula | From Form Responses |
| D | Name | Formula | From Form Responses |
| E | Status | Manual | "Pending" or "Active" |
| F | Total Score | Formula | Sum of all 40 items |
| G | Total % | Formula | Total Score / 200 * 100 |
| H | Joy Score | Formula | Average of 4 Joy items (1-5 scale) |
| I | Gratitude Score | Formula | Average of 4 Gratitude items |
| J | Serenity Score | Formula | Average of 4 Serenity items |
| K | Interest Score | Formula | Average of 4 Interest items |
| L | Hope Score | Formula | Average of 4 Hope items |
| M | Pride Score | Formula | Average of 4 Pride items |
| N | Amusement Score | Formula | Average of 4 Amusement items |
| O | Inspiration Score | Formula | Average of 4 Inspiration items |
| P | Awe Score | Formula | Average of 4 Awe items |
| Q | Love Score | Formula | Average of 4 Love items |
| R | Focus 1 | Formula | Name of lowest emotion |
| S | Focus 2 | Formula | Name of 2nd lowest emotion |
| T | Focus 3 | Formula | Name of 3rd lowest emotion |
| U | Current Day | Formula/Manual | Days since start (optional tracking) |
| V | Current Emotion | Formula/Manual | Which emotion they're on (optional) |
| W | Last Email | Formula/Manual | Last email type sent (optional) |
| X | Last Email Date | Formula/Manual | When last email was sent (optional) |
| Y | Engagement | Manual | Tracking field (optional) |
| Z | Raw Responses | Formula | All 40 answers concatenated |
| AA | Notes | Manual | Admin notes |
| AB | Email_Sequence_Started | Formula/Manual | TRUE/FALSE flag |

## Setup Instructions

### Step 1: Create the Participants Tab

1. In your Google Sheet, create a new tab named "Participants"
2. Add header row with the column names listed above

### Step 2: Add Formulas

**Important**: Assumes "Form Responses 1" is the name of your form response tab. Adjust if different.

#### Row 2 Formulas (copy down for all rows)

**Column A - ID**
```
=IF(ISBLANK('Form Responses 1'!A2),"",ROW()-1)
```

**Column B - Timestamp**
```
='Form Responses 1'!A2
```

**Column C - Email**
```
='Form Responses 1'!B2
```

**Column D - Name (if you have a name field)**
```
='Form Responses 1'!C2
```
*Note: If your form doesn't collect names, you can skip this or use email as name*

**Column E - Status**
```
=IF(ISBLANK(C2),"","Pending")
```

**Column F - Total Score**
```
=IF(ISBLANK(C2),"",SUM('Form Responses 1'!D2:AQ2))
```
*Assumes questions are in columns D-AQ of Form Responses 1*

**Column G - Total %**
```
=IF(ISBLANK(F2),"",F2/200*100)
```

### Emotion Score Formulas

**IMPORTANT**: These formulas account for reverse scoring (marked with * in the project brief).

#### Column H - Joy Score (Items 9, 12, 21*, 34)
```
=IF(ISBLANK(C2),"",AVERAGE(
  'Form Responses 1'!L2,
  'Form Responses 1'!O2,
  6-'Form Responses 1'!X2,
  'Form Responses 1'!AK2
))
```

#### Column I - Gratitude Score (Items 3, 10, 24, 29*)
```
=IF(ISBLANK(C2),"",AVERAGE(
  'Form Responses 1'!F2,
  'Form Responses 1'!M2,
  'Form Responses 1'!AA2,
  6-'Form Responses 1'!AF2
))
```

#### Column J - Serenity Score (Items 6, 14*, 26, 31)
```
=IF(ISBLANK(C2),"",AVERAGE(
  'Form Responses 1'!I2,
  6-'Form Responses 1'!Q2,
  'Form Responses 1'!AC2,
  'Form Responses 1'!AH2
))
```

#### Column K - Interest Score (Items 2*, 16, 22, 35)
```
=IF(ISBLANK(C2),"",AVERAGE(
  6-'Form Responses 1'!E2,
  'Form Responses 1'!S2,
  'Form Responses 1'!Y2,
  'Form Responses 1'!AL2
))
```

#### Column L - Hope Score (Items 4, 8, 13, 27*)
```
=IF(ISBLANK(C2),"",AVERAGE(
  'Form Responses 1'!G2,
  'Form Responses 1'!K2,
  'Form Responses 1'!P2,
  6-'Form Responses 1'!AD2
))
```

#### Column M - Pride Score (Items 15, 18*, 23, 36)
```
=IF(ISBLANK(C2),"",AVERAGE(
  'Form Responses 1'!R2,
  6-'Form Responses 1'!U2,
  'Form Responses 1'!Z2,
  'Form Responses 1'!AM2
))
```

#### Column N - Amusement Score (Items 5*, 17, 30, 37)
```
=IF(ISBLANK(C2),"",AVERAGE(
  6-'Form Responses 1'!H2,
  'Form Responses 1'!T2,
  'Form Responses 1'!AG2,
  'Form Responses 1'!AN2
))
```

#### Column O - Inspiration Score (Items 7, 25*, 39, 40)
```
=IF(ISBLANK(C2),"",AVERAGE(
  'Form Responses 1'!J2,
  6-'Form Responses 1'!AB2,
  'Form Responses 1'!AP2,
  'Form Responses 1'!AQ2
))
```

#### Column P - Awe Score (Items 11, 20, 32*, 38)
```
=IF(ISBLANK(C2),"",AVERAGE(
  'Form Responses 1'!N2,
  'Form Responses 1'!W2,
  6-'Form Responses 1'!AI2,
  'Form Responses 1'!AO2
))
```

#### Column Q - Love Score (Items 1, 19, 28, 33)
```
=IF(ISBLANK(C2),"",AVERAGE(
  'Form Responses 1'!D2,
  'Form Responses 1'!V2,
  'Form Responses 1'!AF2,
  'Form Responses 1'!AJ2
))
```

### Identify 3 Lowest Emotions

**Column R - Focus 1 (Lowest Emotion)**
```
=IF(ISBLANK(C2),"",INDEX(
  {"Joy";"Gratitude";"Serenity";"Interest";"Hope";"Pride";"Amusement";"Inspiration";"Awe";"Love"},
  MATCH(SMALL(H2:Q2,1),H2:Q2,0)
))
```

**Column S - Focus 2 (2nd Lowest)**
```
=IF(ISBLANK(C2),"",INDEX(
  {"Joy";"Gratitude";"Serenity";"Interest";"Hope";"Pride";"Amusement";"Inspiration";"Awe";"Love"},
  MATCH(SMALL(H2:Q2,2),H2:Q2,0)
))
```

**Column T - Focus 3 (3rd Lowest)**
```
=IF(ISBLANK(C2),"",INDEX(
  {"Joy";"Gratitude";"Serenity";"Interest";"Hope";"Pride";"Amusement";"Inspiration";"Awe";"Love"},
  MATCH(SMALL(H2:Q2,3),H2:Q2,0)
))
```

### Optional Tracking Columns

**Column U - Current Day** (optional - for manual tracking)
```
=IF(ISBLANK(C2),"",IF(ISBLANK(AB2),"",DAYS(TODAY(),B2)))
```

**Columns V-Y** - Leave blank or add manual tracking as needed

**Column Z - Raw Responses** (for reference)
```
=IF(ISBLANK(C2),"",JOIN(",",D2:AQ2))
```

**Column AA - Notes** - Manual entry field

**Column AB - Email_Sequence_Started**
```
=IF(ISBLANK(C2),"",FALSE)
```
*The script will change this to TRUE after processing*

### Step 3: Format the Sheet

1. **Freeze header row**: View → Freeze → 1 row
2. **Format scores**: Select columns H-Q, Format → Number → Number (1 decimal place)
3. **Format percentage**: Select column G, Format → Number → Percent
4. **Color code emotions** (optional): Add conditional formatting to highlight low scores

### Step 4: Test the Formulas

1. Submit a test response through your Google Form
2. Verify that the Participants tab auto-populates
3. Check that emotion scores calculate correctly
4. Verify that Focus 1, 2, 3 identify the lowest emotions correctly

## Understanding the Item Mapping

### Form Responses Column Reference

Your form responses should be in columns D-AQ (40 questions):
- Column D = Question 1
- Column E = Question 2
- ...
- Column AQ = Question 40

### Emotion to Items Mapping

**Joy**: Items 9, 12, 21*, 34
- Item 9 (Column L): In the past month, I've found myself moving through activities with a sense of ease and flow
- Item 12 (Column O): When I'm happy, I feel it throughout my whole body as lightness and energy
- Item 21* (Column X): I feel light-hearted and carefree in my daily activities *REVERSED*
- Item 34 (Column AL): In the past month, I've felt open and playful when spending time with others

**Gratitude**: Items 3, 10, 24, 29*
- Item 3 (Column F): When someone does something thoughtful for me...
- Item 10 (Column M): I notice and feel thankful for the small things...
- Item 24 (Column AB): In the past month, I've taken time to acknowledge...
- Item 29* (Column AG): I pause to appreciate what others do... *REVERSED*

**Serenity**: Items 6, 14*, 26, 31
- Item 6 (Column I): In the past month, I've experienced peaceful moments...
- Item 14* (Column Q): I experience stretches of time where I feel truly peaceful... *REVERSED*
- Item 26 (Column AD): In the past month, I've been able to maintain my focus...
- Item 31 (Column AI): I experience moments of deep calm...

**Interest**: Items 2*, 16, 22, 35
- Item 2* (Column E): I feel drawn to explore and learn... *REVERSED*
- Item 16 (Column S): When I encounter something unfamiliar...
- Item 22 (Column Z): In the past month, I've asked questions...
- Item 35 (Column AM): I actively seek out new information...

**Hope**: Items 4, 8, 13, 27*
- Item 4 (Column G): In the past month, I've been able to imagine...
- Item 8 (Column K): I feel energized by possibilities...
- Item 13 (Column P): In the past month, I've talked with others...
- Item 27* (Column AE): Even when facing challenges... *REVERSED*

**Pride**: Items 15, 18*, 23, 36
- Item 15 (Column R): In the past month, I've taken on challenges...
- Item 18* (Column U): I feel proud of what I've accomplished... *REVERSED*
- Item 23 (Column AA): When I accomplish something difficult...
- Item 36 (Column AN): In the past month, I've shared my achievements...

**Amusement**: Items 5*, 17, 30, 37
- Item 5* (Column H): I find myself genuinely laughing... *REVERSED*
- Item 17 (Column T): In the past month, I've enjoyed making others laugh...
- Item 30 (Column AH): In the past month, I've looked for opportunities...
- Item 37 (Column AO): I often laugh in a way that feels spontaneous...

**Inspiration**: Items 7, 25*, 39, 40
- Item 7 (Column J): I feel moved and energized...
- Item 25* (Column AC): I encounter things that make me want to improve... *REVERSED*
- Item 39 (Column AP): In the past month, I've felt drawn to activities...
- Item 40 (Column AQ): In the past month, I've shared ideas...

**Awe**: Items 11, 20, 32*, 38
- Item 11 (Column N): In the past month, I've had moments...
- Item 20 (Column W): In the past month, I've sought out experiences...
- Item 32* (Column AJ): In the past month, I've felt moved... *REVERSED*
- Item 38 (Column AO): I experience moments where something takes my breath away...

**Love**: Items 1, 19, 28, 33
- Item 1 (Column D): In the past month, I've engaged in activities...
- Item 19 (Column V): I experience moments of deep connection...
- Item 28 (Column AF): In the past month, I've felt warmth and closeness...
- Item 33 (Column AK): I feel secure and cherished...

## Reverse Scoring Explanation

Items marked with * use reverse scoring: 1→5, 2→4, 3→3, 4→2, 5→1

This is accomplished in formulas by using `6-value` instead of `value`.

For example:
- If someone rates item 21 as "5" (very true), but it's reverse scored
- The formula uses `6-5 = 1` (low score, indicating less joy)
- This correctly identifies it as a deficit area

## Troubleshooting

### Problem: Formulas showing #REF! error
**Solution**: Check that 'Form Responses 1' tab name matches exactly. Adjust formula references if needed.

### Problem: Focus 1/2/3 showing same emotion multiple times
**Solution**: This can happen when multiple emotions have the same score. The MATCH function finds the first occurrence. This is acceptable behavior - the person has multiple deficit areas.

### Problem: Scores not calculating
**Solution**:
1. Verify form responses are appearing in columns D-AQ
2. Check that there are no blank responses (all 40 questions answered)
3. Ensure responses are numbers 1-5, not text

### Problem: Email_Sequence_Started not changing to TRUE
**Solution**: This is controlled by the Google Apps Script, not formulas. Check:
1. Script has been set up with setupAllTriggers()
2. CONFIG.COLUMNS.EMAIL_SEQUENCE_STARTED matches column AB (index 27)
3. Script execution log for any errors

## Script Configuration

Update the EmailAutomation.gs CONFIG section to match your column layout:

```javascript
COLUMNS: {
  ID: 0,                      // Column A
  TIMESTAMP: 1,               // Column B
  EMAIL: 2,                   // Column C
  NAME: 3,                    // Column D
  FOCUS_1: 17,                // Column R (0-indexed, so R = 17)
  FOCUS_2: 18,                // Column S
  FOCUS_3: 19,                // Column T
  EMAIL_SEQUENCE_STARTED: 27  // Column AB
}
```

## Next Steps

Once the Participants tab is set up:

1. Test with a form submission
2. Verify all formulas calculate correctly
3. Configure the Google Apps Script
4. Test the email automation system

---

**Need Help?**

Common issues and solutions:
- Always verify column references match your actual sheet structure
- Test with a single submission before processing multiple users
- Use the testReadSheet() function in Apps Script to verify data access
- Check the Error Log tab (created automatically) for script errors

**Estimated Setup Time**: 30-45 minutes for initial setup and testing
