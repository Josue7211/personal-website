# memd memory [tab=none]

## Scope

- project: `personal-website`
- namespace: `main`
- agent: `codex@session-5b36b772`
- session: `session-5b36b772`
- tab: `none`
- effective agent: `codex@session-5b36b772`
- workspace: `none`
- visibility: `all`
- route: `auto`
- intent: `current_task`
- bundle: `.memd`


## Budget

- tok=1534 | ch=6135 | p=high | dup=0 | use=1540/1600 | refresh=true | action="resolve rehydration backlog before the next prompt"
- drivers=refresh,rehydration,tokens

## Durable Truth

- id=f1fd9500-2f95-4794-a5fd-3ac33f34c386 | stage=canonical | scope=local | kind=live_truth | status=active | project=personal-website | ns=main | vis=private ...
- id=e59c2616-8d5d-44d2-ba99-5ea9ef253943 | stage=canonical | scope=project | kind=fact | status=active | project=personal-website | ns=main | vis=private | ag...
- id=78c5e90f-f19f-4038-bbe7-decc325ca1ba | stage=canonical | scope=project | kind=decision | status=active | project=personal-website | ns=main | vis=private ...
- (+3 more)

## Read First

- doing=id=e59c2616-8d5d-44d2-ba99-5ea9ef253943 | stage=canonical | scope=project | kind=fact | status=active | project=personal-website | ns=main | vis=private | agent=codex@session-5b...
- left_off=id=b68adfea-49be-4ff9-a879-55b725a225ab | stage=canonical | scope=project | kind=fact | status=active | project=personal-website | ns=main | vis=private | agent=codex@session-5b...
- changed=file_edited: .memd/agents/HARNESS_BRIDGES.md
- next=id=b68adfea-49be-4ff9-a879-55b725a225ab | stage=canonical | scope=project | kind=fact | status=active | project=personal-website | ns=main | vis=private | agent=codex@session-5b...
- blocker=refresh recommended due to context pressure
- t=rolling_brief: focus id=e59c2616-8d5d-44d2-ba99-5ea9ef253943 | stage=canonical | scope=project | kind=fact | status=active | project=personal-website | ns=main | vis=private | agent=codex@session-5b36b772 | cf=0.70 | upd=1777087061 | c=Cl... | rolling_brief: next id=b68adfea-49be-4ff9-a879-55b725a225ab | stage=canonical | scope=project | kind=fact | status=active | project=personal-website | ns=main | vis=private | agent=codex@session-5b36b772 | cf=0.70 | upd=1777087325 | c=Ho... | rolling_brief: event file_edited: .memd/agents/HARNESS_BRIDGES.md | entity_sheet: personal-website / main / none | visibility private | trust 0.66 | claims 0
- focus=id=e59c2616-8d5d-44d2-ba99-5ea9ef253943 | stage=canonical | scope=project | kind=fact | status=active | project=perso...
- next=fact: id=b68adfea-49be-4ff9-a879-55b725a225ab | stage=canonical | scope=project | kind=fact | status=active | project=perso...

## Voice

- default: `caveman-lite`
- no filler/hedging, keep articles + full sentences
- professional but tight
- keep exact technical terms


## Memory Objects

- context id=f1fd9500 record="id=f1fd9500-2f95-4794-a5fd-3ac33f34c386 | stage=canonical | scope=local | kind=live_truth | status=active | project=p..."
- [open](items/context/context-01-d5cc635a)
- working id=e59c2616 record="id=e59c2616-8d5d-44d2-ba99-5ea9ef253943 | stage=canonical | scope=project | kind=fact | status=active | project=perso..."
- [open](items/working/working-01-366bffd8)
- inbox none
- recovery id=b68adfea kind=working_memory_record label="fact" source=codex@session-5b36b772 / memd reason="evicted_by_budget;kind=Fact;status=active;source=canonical;source_trust=0.60;freshness_days=2;verified_days=45;recent..."
- [open](items/recovery/recovery-01-bc8abd96)
- semantic none
- workspace project=personal-website namespace=main workspace=none visibility=private items=15 active=15 contested=0 trust=0.66 cf=0.75
- [open](items/workspace/workspace-01-5ef25cf5)

## E+LT

- - E=file_edited: .memd/agents/HARNESS_BRIDGES.md | file_edited: .memd/compiled/memory/context.md | - LT=status M .memd/agents/HARNESS_BRIDGES.md | status M .memd/compiled/memory/context.md

## W

- w=id=e59c2616-8d5d-44d2-ba99-5ea9ef253943 | stage=canonical | scope=project | kind=fact | status=active | project=personal-website | ns=main | vis=private | agent=codex@session-5b36b772 | cf=0.70 | upd=1777087061 | c=Cl... | id=78c5e90f-f19f-4038-bbe7-decc325ca1ba | stage=canonical | scope=project | kind=decision | status=active | project=personal-website | ns=main | vis=private | agent=codex@session-5b36b772 | cf=0.70 | upd=1777210962 | ... (+5 more)

## RI

- r=fact:id=b68adfea-49be-4ff9-a879-55b725a225ab | stage=canonical | scope=project | kind=fact | status=active | project=personal-website | ns=main | vis=private | agent=codex@session-5b36b772 | cf=0.70 | upd=1777087325 | c=Ho... | r=constraint:id=4e8f1272-655e-403f-9a9a-c255d86dae31 | stage=canonical | scope=project | kind=constraint | status=active | project=personal-website | ns=main | vis=private | agent=codex@session-5b36b772 | cf=0.70 | upd=1777292792 ... | r=livetruth:id=6cda4eeb-391a-4978-8c94-1408c2e25b2b | stage=canonical | scope=project | kind=live_truth | status=active | project=personal-website | ns=main | vis=private | agent=codex@session-5b36b772 | tags=docs | cf=0.95 | upd... | r=livetruth:id=f1fd9500-2f95-4794-a5fd-3ac33f34c386 | stage=canonical | scope=local | kind=live_truth | status=active | project=personal-website | ns=main | vis=private | agent=memd | tags=live_truth,repo_changes | cf=0.98 | upd=...

## L

- l=personal-website/main/none | v=private | it=15 | tr=0.66 

## Hive

- queen=none roster=0 active=0 review=0 overlap=0 stale=0

## Event Compiler

- live event log: [events.md](events.md)
- compiled event pages: [compiled/events/latest.md](compiled/events/latest.md)
- memory updates now flow through the event compiler before the visible pages refresh

## Memory Pages

- [Context](compiled/memory/context.md)
- [Working](compiled/memory/working.md)
- [Inbox](compiled/memory/inbox.md)
- [Recovery](compiled/memory/recovery.md)
- [Semantic](compiled/memory/semantic.md)
- [Workspace](compiled/memory/workspace.md)

## Capability Registry

- discovered_capabilities: 697
- universal: 39
- bridgeable: 0
- harness_native: 658

## Capability Bridges

- bridged: 0
- already_bridged: 483
- available: 0
- blocked: 62

### Recent bridge actions

- opencode / codex:system--imagegen -> /home/josue/.config/opencode/command/system--imagegen.md (already-bridged)
- opencode / codex:system--openai-docs -> /home/josue/.config/opencode/command/system--openai-docs.md (already-bridged)
- opencode / codex:system--plugin-creator -> /home/josue/.config/opencode/command/system--plugin-creator.md (already-bridged)
- opencode / codex:system--skill-creator -> /home/josue/.config/opencode/command/system--skill-creator.md (already-bridged)
- opencode / codex:system--skill-installer -> /home/josue/.config/opencode/command/system--skill-installer.md (already-bridged)
- opencode / codex:autodream -> /home/josue/.config/opencode/command/autodream.md (already-bridged)
- opencode / codex:autoplan -> /home/josue/.config/opencode/command/autoplan.md (already-bridged)
- opencode / codex:autoresearch -> /home/josue/.config/opencode/command/autoresearch.md (already-bridged)


## Project source refresh

The following project sources changed since the last import:

- CLAUDE.md

