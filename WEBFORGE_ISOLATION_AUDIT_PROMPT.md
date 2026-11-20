# WEBFORGE — SAFE AUTONOMOUS PROJECT ISOLATION UPGRADE

## MISSION
Upgrade WebForge into a safe, autonomous, isolated project factory.
Every new website or app must be treated as an entirely new project,
with its own directory, assets, GitHub repository, Vercel project,
and independent Supabase project whenever a database is actually needed.

## CRITICAL PRESERVATION RULE
Before changing anything, inspect all existing WebForge instructions,
configuration files, skills, routing, agents and project workflows.

Existing Part 1, Part 2 and Part 3 rules MUST BE PRESERVED.
Do not delete, rewrite, shorten, replace, reorder unnecessarily,
or weaken existing instructions.

Preserve all existing capabilities including:
- frontend-design
- emil-design-eng
- ui-ux-pro-max
- vercel-react-best-practices
- web-design-guidelines
- image and visual asset intelligence
- responsive design and browser QA
- production website factory
- existing agent workflow and routing
- existing MCP integrations and configuration
- current model settings

The primary model MUST remain:
nvidia/nemotron-3-ultra-550b-a55b

Never switch, remove, replace, downgrade, or alter the primary model.
Do not change model settings or providers.

## PHASE 1 — SAFETY AUDIT ONLY
1. Identify the actual WebForge rule files and configuration files.
2. Read the complete contents before editing.
3. Identify the existing Part 1, Part 2 and Part 3 sections.
4. Identify existing isolation, GitHub, Vercel, Supabase, asset,
   deployment and safety rules.
5. Identify conflicts, missing protections and duplicated rules.
6. Do not touch any website project or external cloud resource.
7. Do not expose API keys, secrets, tokens, environment variables,
   private keys or credentials in the report.

## PHASE 2 — BACKUP BEFORE EDITING
Create a timestamped backup directory outside all website projects.
Back up every configuration/rule file that you intend to modify.
Verify that backups exist and have nonzero size when expected.

If a backup fails, STOP. Do not edit.

Never create backups by overwriting older backups.
Do not delete backups.

## PHASE 3 — MINIMAL TARGETED IMPLEMENTATION
Only after the audit and successful backups, add missing rules to the
appropriate existing WebForge instruction file(s).

Prefer small, targeted additions over rewriting existing instructions.
Keep Part 1, Part 2 and Part 3 intact.

If a required change could damage existing functionality, do not apply it.
Explain the conflict instead.

# NEW PROJECT = NEW EVERYTHING

Whenever the user requests a new website or app, create a completely
independent project by default.

### A. LOCAL PROJECT
- Create a unique new project directory.
- Never overwrite, reuse, merge into, or delete another project.
- Inspect the destination before creation.
- If the destination already exists, choose a new unique name or ask.
- Use project-specific dependencies and configuration.
- Never modify unrelated directories.

### B. IMAGES AND ASSETS
- Understand whether each uploaded image is a reference, an asset to use,
  an image to replace, or an image to remove.
- Reference images should inform design; they are not automatically
  copied into the output project.
- Generate original imagery when image generation is available and needed.
- Search for appropriate licensed images when generation is not suitable.
- Use the user's supplied assets when explicitly intended for this project.
- Never automatically reuse assets from unrelated old projects.
- Never copy an old project's assets just because they are convenient.
- Preserve attribution/licensing information when required.
- Never pretend an image was generated or downloaded if it was not.

### C. SUPABASE — ONLY WHEN BACKEND IS NEEDED
First determine whether the application actually requires a backend.
Do not create Supabase for static websites that do not need it.

If Supabase is required:
1. Create a fresh Supabase project dedicated to this application.
2. Confirm the new project identity and organization before proceeding.
3. Never link to an existing unrelated Supabase project.
4. Never run SQL against a database until the target project identity
   has been verified.
5. Generate project-specific migrations/schema files in the new project.
6. Review SQL before executing it.
7. Create only necessary tables, indexes, triggers and functions.
8. Implement appropriate Row Level Security (RLS) policies.
9. Do not expose service-role keys or privileged secrets to the frontend.
10. Configure new project-specific environment variables.
11. Verify the connection points to the newly created database.
12. If project creation, permissions or identity verification fails,
    STOP. Never silently reuse another database.

Database provisioning or destructive SQL actions must require explicit
user approval before execution.
Never delete databases, tables or data as part of automatic setup.

### D. GITHUB — FRESH REPOSITORY PER PROJECT
- Create a new GitHub repository for each new project.
- Choose a unique repository name.
- Check whether the name already exists before creation.
- Never push a new website into an unrelated existing repository.
- Never replace, rename, delete or take over an existing repository.
- Never force-push.
- Never rewrite existing repository history.
- Never alter unrelated remotes.
- Verify the repository URL and ownership before pushing.
- Keep secrets out of commits.
- Inspect .gitignore and ensure .env, credentials, local secrets,
  build output and sensitive files are excluded appropriately.
- If repository creation or access fails, STOP and report the issue.
  Do not use another old repository as a fallback.

### E. VERCEL — FRESH PROJECT PER WEBSITE
- Create a new Vercel project for every independent new website.
- Verify project name and team/account before linking or deployment.
- Never deploy into an unrelated existing Vercel project.
- Never relink or overwrite another project's configuration.
- Never change another project's domains, environment variables,
  settings or deployment history.
- Configure only this project's environment variables.
- Never expose secrets in client-side code, logs, screenshots or commits.
- Deploy a preview first.
- Run build checks and preview QA.
- Production deployment requires explicit user approval.
- If project creation, permissions or identity verification fails,
  STOP. Never silently deploy to an existing project.

### F. ENVIRONMENT AND CREDENTIAL ISOLATION
- Each project gets its own environment configuration.
- Never copy .env files from previous projects.
- Never reuse database credentials, API keys or private tokens.
- Do not print secrets to terminal output or final reports.
- Use secure environment-variable handling.
- Keep privileged credentials server-side only.
- Never invent credentials or pretend integrations are connected.
- If required credentials are missing, explain what the user needs
  to configure. Do not search unrelated projects for credentials.

### G. PROJECT IDENTITY CHECK BEFORE EXTERNAL ACTIONS
Before any GitHub push, Supabase SQL operation, Vercel linking,
deployment, domain operation or external resource modification:

1. Identify the current project directory.
2. Identify the intended new resource.
3. Verify that the resource belongs to this new project.
4. Check that it is not an existing unrelated resource.
5. Confirm the action is non-destructive.
6. Obtain explicit approval for sensitive or destructive actions.
7. If identity is uncertain, STOP.

Do not guess project identity from similar names.
Do not use a previously selected resource merely because it is available.

## PHASE 4 — AUTONOMOUS WORKFLOW

For each new project, use this lifecycle:

1. Understand the user requirements.
2. Establish a unique project name and destination.
3. Inspect destination for conflicts.
4. Plan architecture and determine whether backend is necessary.
5. Create isolated project files.
6. Create original design, imagery and assets as appropriate.
7. Implement frontend and backend if required.
8. Run project-specific build, lint and type checks where available.
9. Test responsive layouts and important user flows.
10. Review images, links, forms, navigation and console/build errors.
11. Fix discovered issues.
12. Prepare a Git repository dedicated to the project.
13. Ask for approval before external cloud creation or sensitive actions.
14. Create a new Supabase project only if required and approved.
15. Create a new GitHub repository and push only after approval.
16. Create a new Vercel project and preview deployment only after approval.
17. Verify deployment URLs and report real results.
18. Ask before production deployment.

Do not stop after generating a homepage if the user requested a complete website.
Complete the requested pages and features, or clearly explain what remains.

## PHASE 5 — FAILURE RULES
If a tool, API, permission, authentication, network, provider or CLI
fails:

- Report the actual failure.
- Do not claim the operation succeeded.
- Do not silently substitute an old project, repository, database,
  deployment or asset collection.
- Do not bypass security or account permissions.
- Do not create duplicate resources repeatedly.
- Retry only safe operations when appropriate.
- Ask the user for the missing authorization or action.

## PHASE 6 — PROTECTION OF EXISTING PROJECTS
Existing projects must remain untouched unless the user explicitly
names one and authorizes work on it.

Never automatically:
- modify an existing website
- overwrite an existing repository
- push into another project's remote
- alter an existing Supabase project
- run SQL on an old database
- change existing Vercel settings
- replace existing deployments
- reuse existing secrets or environment files
- copy old project images/assets without permission
- delete or rename project directories
- modify global configuration beyond the explicitly approved scope

## PHASE 7 — FINAL VERIFICATION
After implementing rules:

1. Reread every modified instruction file.
2. Verify Part 1, Part 2 and Part 3 still exist.
3. Verify existing skill routing and integrations are preserved.
4. Verify the primary model is unchanged.
5. Review git diff or equivalent before/after comparison.
6. Check for accidental deletion or unrelated changes.
7. Verify backup files.
8. Report each check as PASS, FAIL or NOT VERIFIED.
9. Do not claim that safeguards are tested if only text rules were added.

Do not create real cloud resources as an audit test.

## TESTING — SIMULATION ONLY
After rule implementation, conduct a dry-run/simulated scenario for
a fictional project.

Simulate decisions for:
- new project directory
- fresh assets
- backend decision
- isolated Supabase
- new GitHub repository
- new Vercel project
- separate environment variables
- preview before production
- failure handling
- protection of existing projects

The simulation must not create any files outside the authorized backup,
rule-editing scope and must not create external resources.

## FINAL REPORT FORMAT
Provide:

1. Backup location
2. Files audited
3. Files changed
4. Exact sections added
5. Existing Part 1 preservation result
6. Existing Part 2 preservation result
7. Existing Part 3 preservation result
8. Skill routing/integration preservation result
9. Primary model preservation result
10. Isolation safeguards added
11. Simulation results
12. Verification PASS/FAIL/NOT VERIFIED table
13. Remaining risks or limitations

Do not say "perfect", "fully safe", "tested", "deployed" or "verified"
unless actual evidence supports the statement.

## ABSOLUTE STOP CONDITIONS
STOP immediately if:
- backup creation fails
- the target rule files are unclear
- Part 1/2/3 cannot be safely preserved
- a modification would affect another project
- a cloud resource identity is uncertain
- a destructive operation is requested without approval
- the primary model would need to change
- credentials or permissions are missing
- the action would overwrite or replace an existing resource

You are upgrading WebForge's safety and project isolation rules.
You are NOT building, deploying or modifying the LUMORA website
during this audit.

Minimal edits. Full preservation. No cross-project contamination.
