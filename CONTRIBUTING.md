# Contributing Guide

**Welcome!** This guide will help you contribute to the Chain Integration Assessment Tool.

---

## 🚀 Quick Start

1. **Read the handoff guide**: `HANDOFF.md` (especially for AI assistants)
2. **Read the README**: `README.md` for project overview
3. **Check critical analysis**: `docs/CRITICAL_ANALYSIS.md` for priorities
4. **Set up locally**: See [Getting Started](#getting-started)

---

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Code Style](#code-style)
4. [Making Changes](#making-changes)
5. [Testing](#testing)
6. [Submitting Changes](#submitting-changes)
7. [Priority Areas](#priority-areas)

---

## Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API key (for Stage 2)
- GitHub token (optional, for scraper)

### Installation

```bash
# Clone the repository
git clone https://github.com/Morkeeth/Chain-integration-assessment.git
cd chain-assessment

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local  # Create if doesn't exist
# Add your OPENAI_API_KEY

# Start development server
npm run dev
```

Visit http://localhost:3000

---

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Development branch (if needed)
- Feature branches: `feature/description`
- Bug fixes: `fix/description`

### Making Changes

1. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Follow code style (see below)
   - Add tests if applicable
   - Update documentation

3. **Test locally**:
   ```bash
   npm run dev
   # Test your changes
   ```

4. **Commit**:
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

5. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   # Create PR on GitHub
   ```

---

## Code Style

### TypeScript

- Use TypeScript for all new code
- Follow existing patterns
- Use meaningful variable names
- Add comments for complex logic

### File Organization

- **API routes**: `app/api/`
- **Components**: `app/components/`
- **Business logic**: `app/lib/`
- **Types**: `app/types/`

### Naming Conventions

- **Files**: `kebab-case.ts` or `kebab-case.tsx`
- **Functions**: `camelCase`
- **Components**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`

### Example

```typescript
// ✅ Good
export function assessChain(chainName: string): AssessmentResult {
  // Implementation
}

// ❌ Bad
export function assess_chain(chainName: string) {
  // Implementation
}
```

---

## Making Changes

### Adding a New Chain Pattern

**File**: `app/lib/rule-based-assessment.ts`

1. Add to `CHAIN_PATTERNS` array:
```typescript
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

2. Test with chain name
3. Update documentation if needed

### Adding to Integration Database

**File**: `app/lib/integration-database.ts`

1. Add to `INTEGRATION_HISTORY` array
2. Include all required fields (see `IntegrationRecord` interface)
3. Most important fields:
   - `status` (SUPPORTED, IN_PROGRESS, etc.)
   - `family` (EVM, Bitcoin, Cosmos, etc.)
   - `actualComplexity` (LOW, MEDIUM, HIGH)
   - `integrationDuration` (weeks)
   - `lessonsLearned` (array of strings)

### Modifying AI Behavior

**Files**:
- `app/lib/enhanced-prompts.ts` - How context is injected
- `app/lib/openai.ts` - Model selection

**To change prompts**:
1. Edit `buildEnhancedPrompt()` in `enhanced-prompts.ts`
2. Test with real assessment
3. Document changes

**To change model**:
1. Edit `ASSESSMENT_MODEL` in `openai.ts` or set `OPENAI_MODEL` env var
2. Test accuracy and cost
3. Document results

### Adding a New API Endpoint

1. Create file: `app/api/your-endpoint/route.ts`
2. Export `GET`, `POST`, etc. handlers
3. Add to documentation
4. Test locally

---

## Testing

### Manual Testing

**Stage 1 (Sales Assessment)**:
```bash
# Start dev server
npm run dev

# Test API
curl -X POST http://localhost:3000/api/sales-assess \
  -H "Content-Type: application/json" \
  -d '{"chainName": "Berachain"}'
```

**Stage 2 (Technical Assessment)**:
1. Go to http://localhost:3000
2. Enter chain name
3. Fill assessment form
4. Submit and verify results

### Testing Integration Database

```typescript
import { getIntegrationRecord, isChainSupported } from './app/lib/integration-database';

// Test functions
console.log(isChainSupported('Solana'));
console.log(getIntegrationRecord('Solana'));
```

---

## Submitting Changes

### Pull Request Process

1. **Create PR** with clear description
2. **Link to issue** if applicable
3. **Describe changes**:
   - What changed
   - Why it changed
   - How to test
4. **Wait for review**
5. **Address feedback**
6. **Merge when approved**

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Refactoring

## Testing
How was this tested?

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

---

## Priority Areas

### 🔴 P0 - Critical (This Week)

1. **Populate Integration Database**
   - Add all SUPPORTED chains (~20+)
   - See `docs/CRITICAL_ANALYSIS.md` for details
   - **File**: `app/lib/integration-database.ts`

2. **Test GPT-5/GPT-4o**
   - Compare with GPT-4 Turbo
   - Document results
   - **File**: `app/lib/openai.ts`

3. **Run GitHub Analysis**
   - Scrape Ledger Live repo
   - Extract real timelines
   - **File**: `app/lib/github-analyzer.ts`

### 🟡 P1 - High (Next 2 Weeks)

4. Validate enhanced prompts
5. Add more chain patterns
6. Create admin UI for database

### 🟢 P2 - Medium (Next Month)

7. JIRA integration (when access available)
8. Pipeline dashboard

---

## 📚 Documentation

**When to update documentation**:
- Adding new features
- Changing API endpoints
- Modifying data structures
- Fixing bugs (if behavior changes)

**Files to update**:
- `README.md` - Project overview
- `BUILD.md` - Technical details
- `docs/` - Specific documentation
- Code comments - Inline documentation

---

## ❓ Questions?

- **Technical**: See `BUILD.md` or `docs/ARCHITECTURE.md`
- **Usage**: See `docs/QUICK_START.md`
- **Next Steps**: See `docs/CRITICAL_ANALYSIS.md`
- **Handoff**: See `HANDOFF.md` (for AI assistants)

---

## 🎯 Code of Conduct

- Be respectful
- Help others learn
- Document your changes
- Test before submitting
- Ask questions if unsure

---

**Thank you for contributing!** 🚀

