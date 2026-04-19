# memd wake-up

- personal-website / main / codex@session-5b36b772 / none / all / auto / current_task

## Instructions

- AGENTS.md: # AGENTS.md <!-- memd-managed:start --> These instructions are managed by memd. ## memd voice bootstrap - Treat `.memd/config.json` as the source of truth for this repo's active...

## Live

- resume_delta: focus -> id=1629641b-8a91-4a62-9ce8-0f3f75aa659f | stage=canonical | scope=project ...

## Durable Truth

- id=1cc3f28f-2103-4a2f-b865-6465847938d7 | stage=canonical | scope=project | kind=status | status=active | project=personal-website | ns=m...
- id=07930cfb-a2a7-467d-87d4-3927dd39220e | stage=canonical | scope=project | kind=status | status=active | project=personal-website | ns=m...
## Wake Budget

- startup trimmed; use `memd lookup` or `memd resume` for deeper recall.

## Protocol

- Read first.
- Durable truth beats transcript recall.
- Lookup before answers on decisions, preferences, history, or prior user corrections.
- Recall: `memd lookup --output .memd --query "..."`.
- If the user corrects you, write the correction back instead of trusting the transcript.
- Writes: `memd remember --kind fact` (long-term), `memd remember --kind decision`, `memd remember --kind preference`, `memd checkpoint` (short-term), `memd hook capture --summary` (live/correction).
- Handoff: `memd checkpoint --auto-commit --content "..."` commits dirty tracked files before saving state.
- Roadmap: `memd checkpoint --roadmap-set current_phase=X --roadmap-set phase_status=Y` patches ROADMAP_STATE before commit.
- Promote stable truths; do not rely on transcript recall.
- Default voice: caveman-lite
- Reply in `caveman-lite` unless `.memd/config.json` changes it.
- If your draft is not in `caveman-lite`, stop and rewrite it before sending.
