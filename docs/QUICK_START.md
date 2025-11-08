# Quick Start Guide - New Sales Assessment Tool

## What Changed?

Your chain assessment tool is now a **deterministic, rule-based sales tool** instead of an AI guessing game.

**Before:** Everything was "MEDIUM complexity" with vague AI responses  
**After:** Clear LOW/MEDIUM/HIGH based on transparent rules + business metrics

## How to Use

### 1. Start the Application

```bash
npm run dev
# Open http://localhost:3000
```

### 2. Quick Sales Assessment (NEW - Primary Flow)

**Just type a chain name:**
- "Berachain"
- "Solana"  
- "Polygon"
- etc.

**Get instant results:**
```
✅ LOW Complexity
⏱️  4 weeks | $20K
🎯 P1 Priority
💰 Market: $2.5B TVL (Top 15)
🚀 Next Steps: Fast-track this integration
```

**Perfect for:**
- Sales calls
- Initial filtering
- Quick quotes
- Roadmap planning

### 3. Detailed Technical Assessment (Optional)

After sales assessment, if P0/P1 priority:
- Click "Upload Technical Questionnaire"
- Fill in comprehensive form
- Get AI-powered deep analysis
- Review engineering details

## Example Workflow

### Scenario: Foundation Contacts Sales

**Step 1: Quick Assessment (30 seconds)**
```
Sales: "What chain?"
Foundation: "We're building on Berachain"
Sales: *Types "Berachain" in tool*
```

**Result:**
```
LOW Complexity | 4 weeks | $20K | P1 Priority
Reasoning: EVM L1 - Standard implementation
Market: Top 19 chain, 92+ protocols
Recommendation: Fast-track, add to Q2 roadmap
```

**Step 2: Sales Conversation**
```
Sales: "Great! Berachain is LOW complexity for us - 
       standard EVM integration. We can deliver in 4 weeks 
       with 1 senior engineer. I see you have strong market 
       traction (Top 20 chain). This is a P1 priority for us.
       
       Next step: Can you send us your technical questionnaire?"
```

**Step 3: Technical Review (if committed)**
```
Foundation sends technical docs
→ Upload to "Detailed Technical Assessment"
→ Get full AI analysis for engineering team
→ Make final go/no-go decision
```

## Understanding Results

### Complexity Levels

**LOW (2-5 weeks)**
- ✅ EVM-based chains (Base, Arbitrum, Polygon, Berachain)
- ✅ Bitcoin forks
- ✅ Can leverage existing integrations
- ✅ Standard patterns, mature tooling

**MEDIUM (6-10 weeks)**
- ⚠️  Custom VMs (Solana, Move, Cairo)
- ⚠️  Cosmos SDK chains
- ⚠️  Alt-L1s (Near, Algorand, Cardano)
- ⚠️  Requires new integration patterns

**HIGH (10-16 weeks)**
- 🚨 Privacy chains (Monero, Aleo)
- 🚨 Experimental tech (Mina, Aztec)
- 🚨 Enterprise/permissioned
- 🚨 Significant R&D required

### Priority Levels

**P0 - IMMEDIATE**
- Low complexity + High market opportunity
- **Action:** Fast-track, allocate resources now

**P1 - HIGH**
- Good complexity-to-opportunity ratio
- **Action:** Add to next quarter roadmap

**P2 - MEDIUM**
- Moderate opportunity or complexity
- **Action:** Monitor quarterly, reassess

**P3 - LOW**
- Low opportunity or high complexity
- **Action:** Backlog only, wait for signals

## Key Improvements

### ✅ Deterministic
- Same input always gives same output
- No AI variance or guessing
- 100% predictable

### ✅ Fast
- < 1 second assessment
- Perfect for live calls
- Assess 100 chains in minutes

### ✅ Sales-Focused
- Business metrics (TVL, rank, protocols)
- Cost estimates ($20K vs $210K)
- Priority scoring (P0-P3)
- Clear next steps

### ✅ Transparent
- Shows exact reasoning
- Explains complexity factors
- Lists matched patterns

## Testing Examples

Try these to see the range:

```bash
# LOW complexity (should be ~3-4 weeks, P0-P1)
- Base
- Optimism
- Polygon
- Berachain
- Monad

# MEDIUM complexity (should be ~7-9 weeks, P1-P2)
- Solana
- Aptos
- Cosmos
- StarkNet
- Hyperliquid

# HIGH complexity (should be ~12-14 weeks, P2-P3)
- Monero
- Aleo
- Mina
- Zcash
```

## API Endpoint

If building integrations:

```bash
# Sales Assessment
curl -X POST http://localhost:3000/api/sales-assess \
  -H "Content-Type: application/json" \
  -d '{"chainName":"Berachain"}'

# Returns:
{
  "complexity": "LOW",
  "estimatedWeeks": 4,
  "estimatedCost": "$20K (1 eng × 4 weeks)",
  "recommendedPriority": "P1",
  "marketOpportunity": "MEDIUM",
  "whyThisComplexity": [...],
  "businessOpportunity": [...],
  "nextSteps": [...],
  "chainData": {...}
}
```

## Files Changed

### New Files (Core Logic)
- `app/lib/rule-based-assessment.ts` - 70+ chain patterns, deterministic rules
- `app/api/sales-assess/route.ts` - Sales assessment API
- `app/components/sales-results.tsx` - Business-focused results display

### Updated Files
- `app/page.tsx` - Two-stage flow (sales → optional tech deep dive)
- `app/components/minimal-hero.tsx` - Updated messaging

### Documentation
- `SALES_ASSESSMENT.md` - Full documentation
- `COMPARISON.md` - Before/after comparison
- `QUICK_START.md` - This file

## Common Questions

**Q: What if a chain isn't in the rules?**  
A: Defaults to MEDIUM with 60% confidence, suggests detailed assessment

**Q: Can I adjust the rules?**  
A: Yes! Edit `app/lib/rule-based-assessment.ts` → add patterns to COMPLEXITY_RULES array

**Q: Does this replace the old detailed assessment?**  
A: No, it's Stage 1 (sales). Old system is now Stage 2 (technical deep dive)

**Q: Is this using AI?**  
A: Stage 1 (sales) = No AI, pure rules. Stage 2 (technical) = Yes, AI-powered

**Q: How accurate are the timelines?**  
A: Based on historical integration data. LOW = 2-5 weeks proven, MEDIUM = 6-10 weeks typical, HIGH = 10-16 weeks realistic

## Support

Check these files for more details:
- `SALES_ASSESSMENT.md` - Full technical documentation
- `COMPARISON.md` - Before/after examples
- `README.md` - General project info

## Next Steps

1. ✅ Test with a few chains (Base, Solana, Monero)
2. ✅ Share with sales team
3. ✅ Adjust rules if needed (add your chains)
4. ✅ Use Stage 1 for all initial assessments
5. ✅ Use Stage 2 only for committed integrations

---

**Built for sales teams. Not too flashy. Just deterministic results.** 🎯

