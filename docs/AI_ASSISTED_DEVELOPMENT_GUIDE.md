# AI-Assisted Development Guide

## Overview

This guide documents the sophisticated AI-assisted development workflow established in OmenDB, designed to maximize collaboration between human developers and AI assistants like Claude Code. The system emphasizes structured task management, comprehensive documentation, and tooling that enables autonomous AI work while maintaining human oversight.

## Core Philosophy

### 🎯 Three Pillars of AI-Assisted Development

1. **Structured Task Management**: Multi-layered task tracking with clear progression paths
2. **Comprehensive Context**: Rich documentation that gives AI assistants full project understanding
3. **Autonomous Capability**: Tools and workflows that enable AI to work independently while staying aligned

### 🚨 Critical Success Factors

- **Database/Core Safety**: Never compromise on testing critical components
- **Dual-Mode Architecture**: Every feature must work in both embedded and server modes
- **Task Flow Discipline**: Completed tasks must be moved to maintain clean state
- **Documentation-First**: AI assistants need rich context to be effective

## Directory Structure

### 🎯 Minimal Setup (Start Here)

```
your-project/
├── docs/
│   ├── tasks.json             # Single task file with status tracking
│   └── architecture.md        # Core design and patterns
├── .ai/
│   └── context.md             # Additional AI context and troubleshooting
├── CLAUDE.md                  # Primary AI instruction file
└── [your project files]
```

### 🔧 Extended Setup (Complex Projects)

```
your-project/
├── docs/
│   ├── tasks.json             # Single source of truth for tasks
│   ├── architecture.md        # System design and patterns
│   └── development.md         # Development workflow and conventions
├── .ai/
│   ├── context.md             # Project context and troubleshooting
│   └── patterns.md            # Code patterns and examples
├── CLAUDE.md                  # Primary AI instruction file
└── [your project files]
```

## Task Management System

### 🎯 Single File Approach (Recommended)

**`docs/tasks.json`** - Single source of truth:
```json
{
  "tasks": [
    {
      "id": "001",
      "title": "Setup authentication system",
      "status": "pending",
      "priority": "high",
      "dependencies": [],
      "description": "Implement JWT-based auth with user registration",
      "acceptance_criteria": ["Tests pass", "Security review complete"]
    }
  ],
  "current_focus": "001",
  "next_available": ["002", "003"]
}
```

**Status Flow**: `pending` → `in_progress` → `completed`

### 📊 Task Analysis (Optional)

For complex projects, add simple task analysis:
```bash
# Find next available tasks
grep -A5 '"status": "pending"' docs/tasks.json

# Check current focus
grep '"current_focus"' docs/tasks.json
```

## CLAUDE.md Best Practices

### 🚨 Critical Rules Section
Always start with a "CRITICAL RULES" section that covers:
- **Safety requirements** (testing, validation)
- **Architecture constraints** (dual-mode, patterns)
- **Workflow requirements** (task flow, cleanup)
- **Import/coding standards**

### 📋 Essential Sections

1. **Project Context** - What, why, and current status
2. **Quick Commands** - Immediate actions AI can take
3. **Task Management** - Current focus and workflow
4. **Essential Sources** - Key files and documentation
5. **Development Essentials** - Patterns and conventions
6. **Error Recovery** - Troubleshooting workflow

### 🎯 Context Efficiency

**Optimization Strategy**:
- **Primary AI Files**: 2-3 files max for 80% of work
- **Task-Specific Docs**: Detailed guides for complex areas
- **Quick Reference**: Essential patterns and commands
- **Progressive Disclosure**: Basic → Detailed → Expert levels

## AI Context Files

### 📚 Essential Files

**`.ai/context.md`** - Core AI context:
- Common issues and solutions
- Project-specific patterns
- Troubleshooting steps
- Important constraints

**Example structure**:
```markdown
# AI Context

## Common Issues
- Import errors: Use relative imports
- Test failures: Run `npm test` before commit

## Project Patterns
- Components in `src/components/`
- Tests in `__tests__/` directories
- Use TypeScript strict mode

## Architecture Notes
- Database: PostgreSQL
- Auth: JWT tokens
- API: REST with Express
```

## Workflow Recommendations

### 🚀 AI Agent Workflow

1. **Start**: Read `CLAUDE.md` for project context
2. **Check Tasks**: Review `docs/tasks.json` for current focus
3. **Load Context**: Check `docs/architecture.md` and `.ai/context.md`
4. **Implement**: Follow project patterns and test requirements
5. **Update**: Mark task as completed in `tasks.json`

### 📋 Task Lifecycle

**Simple Flow**:
- Tasks stay in single `tasks.json` file
- Status: `pending` → `in_progress` → `completed`
- Completed tasks remain for context and learning
- Archive old completed tasks periodically

### 🔄 Documentation Updates

**Keep Current**:
- Update `.ai/context.md` with new patterns
- Add troubleshooting solutions as discovered
- Refine `CLAUDE.md` based on what works

## Directory Naming

### 🗂️ `.ai/` vs `.agents/`

**Recommendation**: Use `.ai/` (shorter, clearer purpose)

**Why Hidden Directory Works**:
- Separates AI context from main project
- Reduces clutter in project root
- Follows convention for tooling directories
- AI assistants access when documented in CLAUDE.md

**Alternative**: If team prefers visible, use `ai/` or `docs/ai/`

**Key**: Document the chosen path clearly in CLAUDE.md

## Implementation Checklist

### 🎯 Quick Setup (15 minutes)
- [ ] Create `CLAUDE.md` with project context and rules
- [ ] Create `docs/tasks.json` with initial tasks
- [ ] Create `docs/architecture.md` with core design
- [ ] Create `.ai/context.md` with patterns and troubleshooting

### 🎯 Extended Setup (Optional)
- [ ] Add `docs/development.md` for workflow details
- [ ] Expand `.ai/patterns.md` with code examples
- [ ] Set up project-specific automation scripts
- [ ] Add testing and deployment documentation

## Success Metrics

### 📊 AI Effectiveness Indicators

**Autonomous Work Capability**:
- AI can start work immediately with "continue" prompts
- Less than 3 files needed for 80% of tasks
- Consistent adherence to project patterns

**Task Management Efficiency**:
- Clear progression through task dependencies
- Completed tasks properly archived
- Minimal context switching between sessions

**Documentation Quality**:
- New contributors can understand project quickly
- Troubleshooting guides solve common issues
- Pattern documentation enables consistent code

## Conclusion

This AI-assisted development approach transforms how projects are built by:

1. **Enabling Autonomous AI Work** through structured task management
2. **Maintaining Human Oversight** through clear documentation and workflows
3. **Optimizing for Efficiency** through context-aware tooling
4. **Ensuring Quality** through systematic testing and validation

The key insight is that **documentation is infrastructure** - investing in AI-readable project documentation pays dividends in development velocity and code quality.

**Next Steps**: Adapt this guide to your specific project needs, starting with the Critical Rules section in CLAUDE.md and building the task management foundation.