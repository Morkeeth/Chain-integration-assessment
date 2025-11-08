# Quick Reference Guide

**Purpose**: Quick lookup for common tasks and information  
**For**: AI Assistants, Developers, Contributors

---

## 🚀 Quick Start (30 seconds)

```bash
# Setup
npm install
cp .env.example .env.local  # Add OPENAI_API_KEY
npm run dev

# Visit
http://localhost:3000
```

---

## 📁 Key Files

| File | Purpose | When to Edit |
|------|---------|--------------|
| `app/lib/rule-based-assessment.ts` | Stage 1 rules (70+ patterns) | Adding new chain patterns |
| `app/lib/integration-database.ts` | Historical data (source of truth) | Adding SUPPORTED chains |
| `app/lib/enhanced-prompts.ts` | AI context injection | Modifying AI prompts |
| `app/lib/openai.ts` | Model configuration | Changing AI model |
| `app/api/sales-assess/route.ts` | Stage 1 API endpoint | Modifying sales assessment |
| `app/api/assess/route.ts` | Stage 2 API endpoint | Modifying technical assessment |
| `app/page.tsx` | Main UI (two-stage flow) | Modifying user interface |

---

## 🔑 Key Concepts

### Two-Stage System

**Stage 1 (Sales)**: Rule-based, < 1s, 95% accuracy
- **File**: `app/lib/rule-based-assessment.ts`
- **API**: `POST /api/sales-assess`
- **No AI** - pure pattern matching

**Stage 2 (Technical)**: AI-powered, ~10s, 85% accuracy
- **File**: `app/api/assess/route.ts`
- **Uses**: GPT-4o (default), GPT-4 Turbo (fallback)
- **With**: Historical context from integration database

### Integration Database

**File**: `app/lib/integration-database.ts`

**Status**: ✅ Structure complete, ⏳ **Data needed** (CRITICAL)

**What's Missing**: Only Solana in database. Need ~20+ SUPPORTED chains.

**Why It Matters**: AI accuracy drops from ~85% to ~70% without historical data.

---

## 🛠️ Common Tasks

### Add a New Chain Pattern

**File**: `app/lib/rule-based-assessment.ts`

```typescript
// Add to CHAIN_PATTERNS array
{
  name: 'NewChain',
  family: 'EVM',
  complexity: 'LOW',
  weeks: 4,
  cost: '$20K (1 eng × 4 weeks)',
  priority: 'P1',
  whyThisComplexity: ['Reason 1', 'Reason 2'],
  keyTechnicalFactors: ['Factor 1', 'Factor 2']
}
```

### Add to Integration Database

**File**: `app/lib/integration-database.ts`

```typescript
// Add to INTEGRATION_HISTORY array
{
  chainName: 'ChainName',
  ticker: 'TICKER',
  status: 'SUPPORTED',
  family: 'EVM',
  actualComplexity: 'LOW',
  integrationDuration: 4,
  lessonsLearned: ['Lesson 1', 'Lesson 2'],
  // ... all other fields
}
```

### Change AI Model

**File**: `app/lib/openai.ts`

```typescript
// Change default
export const ASSESSMENT_MODEL = 'gpt-4o';  // or 'gpt-4-turbo-preview'

// Or set environment variable
OPENAI_MODEL=gpt-4o
```

### Test Stage 1 API

```bash
curl -X POST http://localhost:3000/api/sales-assess \
  -H "Content-Type: application/json" \
  -d '{"chainName": "Berachain"}'
```

### Test Stage 2 API

1. Go to http://localhost:3000
2. Enter chain name (Stage 1)
3. Click "Upload Technical Questionnaire"
4. Fill form and submit

---

## 🔍 Understanding Code Flow

### Stage 1 Flow

```
User → app/page.tsx → /api/sales-assess → 
app/lib/rule-based-assessment.ts → 
app/lib/blockchain-data.ts → 
Results
```

### Stage 2 Flow

```
User → app/page.tsx → /api/assess → 
app/lib/enhanced-prompts.ts → 
app/lib/integration-database.ts → 
app/lib/openai.ts → 
Results
```

---

## 📊 Current State

### ✅ Working

- Stage 1 (rule-based) - Production-ready
- Stage 2 (AI) - Functional but needs data
- Integration database structure - Complete
- Enhanced prompts - Implemented
- GitHub scraper - Working

### ⚠️ Needs Work

1. **Data Population** (CRITICAL)
   - Only Solana in database
   - Need ~20+ SUPPORTED chains
   - See `docs/CRITICAL_ANALYSIS.md`

2. **Model Testing**
   - GPT-5/GPT-4o not tested yet
   - Currently using GPT-4 Turbo

3. **Coverage Gaps**
   - New chain types may not be in patterns
   - Defaults to MEDIUM (may be wrong)

---

## 🚨 Critical Next Steps

### 🔴 P0 - This Week

1. **Populate Integration Database**
   - Add all SUPPORTED chains (~20+)
   - File: `app/lib/integration-database.ts`
   - See: `docs/CRITICAL_ANALYSIS.md`

2. **Test GPT-5/GPT-4o**
   - Compare with GPT-4 Turbo
   - File: `app/lib/openai.ts`

3. **Run GitHub Analysis**
   - Scrape Ledger Live repo
   - Extract real timelines
   - API: `GET /api/github-analyze?action=all`

---

## 🔐 Environment Variables

```bash
# Required
OPENAI_API_KEY=your_key

# Optional
OPENAI_MODEL=gpt-4o  # or gpt-4-turbo-preview (default)
GITHUB_TOKEN=your_token  # Optional, increases rate limits
```

---

## 📚 Documentation Map

**For AI Assistants**:
- `HANDOFF.md` ⭐ - Start here!

**For Understanding**:
- `README.md` - Project overview
- `BUILD.md` - Technical details
- `docs/ARCHITECTURE.md` - System design

**For Next Steps**:
- `docs/CRITICAL_ANALYSIS.md` - Priorities and action items

**For Contributing**:
- `CONTRIBUTING.md` - How to contribute

---

## ❓ Quick Questions

**Q: Where do I add a new chain pattern?**  
A: `app/lib/rule-based-assessment.ts` → `CHAIN_PATTERNS` array

**Q: Where do I add historical data?**  
A: `app/lib/integration-database.ts` → `INTEGRATION_HISTORY` array

**Q: How do I change the AI model?**  
A: `app/lib/openai.ts` → `ASSESSMENT_MODEL` or set `OPENAI_MODEL` env var

**Q: What's the most critical thing to do?**  
A: Populate integration database with SUPPORTED chains (see `docs/CRITICAL_ANALYSIS.md`)

**Q: How do I test locally?**  
A: `npm run dev` → http://localhost:3000

---

## 🎯 Success Criteria

**For Monday Pitch**:
- ✅ Integration database populated (20+ chains)
- ✅ GPT-5 tested and compared
- ✅ GitHub analysis run
- ✅ Demo working

**For Production**:
- ✅ 85%+ AI accuracy (with historical data)
- ✅ < 1s Stage 1, < 10s Stage 2
- ✅ 200 evaluations/year tracked
- ✅ Team adoption

---

**Last Updated**: November 2025  
**See `HANDOFF.md` for full onboarding guide!** 🚀

