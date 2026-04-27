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

- tok=1663 | ch=6649 | p=high | dup=0 | use=1540/1600 | refresh=true | action="resolve rehydration backlog before the next prompt"
- drivers=refresh,rehydration,tokens

## Durable Truth

- id=f7478454-e39a-4d1e-b07c-49e9d789de89 | stage=canonical | scope=local | kind=live_truth | status=active | project=memd | ns=main | vis=private | agent=memd...
- id=e59c2616-8d5d-44d2-ba99-5ea9ef253943 | stage=canonical | scope=project | kind=fact | status=active | project=personal-website | ns=main | vis=private | ag...
- id=0bd4b700-5678-489a-a5e4-51495f31e6fd | stage=canonical | scope=project | kind=fact | status=active | project=personal-website | ns=main | vis=private | ag...
- (+4 more)

## Read First

- doing=id=e59c2616-8d5d-44d2-ba99-5ea9ef253943 | stage=canonical | scope=project | kind=fact | status=active | project=personal-website | ns=main | vis=private | agent=codex@session-5b...
- left_off=id=c602e59e-43ae-4561-baa5-0247e8ab1084 | stage=canonical | scope=project | kind=status | status=active | project=personal-website | ns=main | vis=private | agent=codex@session-...
- changed=file_edited: .memd/.last-wake
- next=id=c602e59e-43ae-4561-baa5-0247e8ab1084 | stage=canonical | scope=project | kind=status | status=active | project=personal-website | ns=main | vis=private | agent=codex@session-...
- blocker=refresh recommended due to context pressure
- t=rolling_brief: focus id=e59c2616-8d5d-44d2-ba99-5ea9ef253943 | stage=canonical | scope=project | kind=fact | status=active | project=personal-website | ns=main | vis=private | agent=codex@session-5b36b772 | cf=0.70 | upd=1777087061 | c=Cl... | rolling_brief: next id=c602e59e-43ae-4561-baa5-0247e8ab1084 | stage=canonical | scope=project | kind=status | status=active | project=personal-website | ns=main | vis=private | agent=codex@session-5b36b772 | tags=checkpoint,current-task,auto-short-term,bundle-refresh,remember | cf=0.72 | upd=1777210969 | c=status: wake project=personal-website namespace=main agent=codex@session-5b36b772 working=4 inbox=0 spine=7 tokens=885 core=647 focus="id=e59c2616-8d5d-44d2-ba99-5ea9ef253943 / stage=canonical / scope=project / kind=f... | rolling_brief: event file_edited: .memd/.last-wake | entity_sheet: personal-website / main / none | visibility private | trust 0.67 | claims 0
- focus=id=e59c2616-8d5d-44d2-ba99-5ea9ef253943 | stage=canonical | scope=project | kind=fact | status=active | project=perso...
- next=evicted working-set item: id=c602e59e-43ae-4561-baa5-0247e8ab1084 | stage=canonical | scope=project | kind=status | status=active | project=per...

## Voice

- default: `caveman-lite`
- no filler/hedging, keep articles + full sentences
- professional but tight
- keep exact technical terms


## Memory Objects

- context id=f7478454 record="id=f7478454-e39a-4d1e-b07c-49e9d789de89 | stage=canonical | scope=local | kind=live_truth | status=active | project=m..."
- [open](items/context/context-01-560bcc7f)
- working id=e59c2616 record="id=e59c2616-8d5d-44d2-ba99-5ea9ef253943 | stage=canonical | scope=project | kind=fact | status=active | project=perso..."
- [open](items/working/working-01-366bffd8)
- inbox none
- recovery id=c602e59e kind=working_memory_record label="evicted working-set item" source=none reason="evicted_by_status_cap;kind=Status;status=active;source=derived;source_trust=0.72;freshness_days=0;verified_days=45;re..."
- [open](items/recovery/recovery-01-d3f60f01)
- semantic none
- workspace project=personal-website namespace=main workspace=none visibility=private items=15 active=15 contested=0 trust=0.67 cf=0.73
- [open](items/workspace/workspace-01-72eebf16)

## E+LT

- - E=file_edited: .memd/.last-wake | file_edited: .memd/agents/CLAUDE_IMPORTS.md | - LT=status M .memd/.last-wake | status M .memd/agents/CLAUDE_IMPORTS.md

## W

- w=id=e59c2616-8d5d-44d2-ba99-5ea9ef253943 | stage=canonical | scope=project | kind=fact | status=active | project=personal-website | ns=main | vis=private | agent=codex@session-5b36b772 | cf=0.70 | upd=1777087061 | c=Cl... | id=0bd4b700-5678-489a-a5e4-51495f31e6fd | stage=canonical | scope=project | kind=fact | status=active | project=personal-website | ns=main | vis=private | agent=codex@session-5b36b772 | cf=0.70 | upd=1777087440 | c=Ho... (+5 more)

## RI

- r=evicted working-set item:id=c602e59e-43ae-4561-baa5-0247e8ab1084 | stage=canonical | scope=project | kind=status | status=active | project=personal-website | ns=main | vis=private | agent=codex@session-5b36b772 | tags=checkpoint,current-task,auto-short-term,bundle-refresh,remember | cf=0.72 | upd=1777210969 | c=status: wake project=personal-website namespace=main agent=codex@session-5b36b772 working=4 inbox=0 spine=7 tokens=885 core=647 focus="id=e59c2616-8d5d-44d2-ba99-5ea9ef253943 / stage=canonical / scope=project / kind=f... | r=livetruth:id=f7478454-e39a-4d1e-b07c-49e9d789de89 | stage=canonical | scope=local | kind=live_truth | status=active | project=memd | ns=main | vis=private | agent=memd | tags=live_truth,repo_changes | cf=0.98 | upd=1777212314 |... | r=livetruth:id=ae187238-9985-4bbf-a9cb-d527ad557f62 | stage=canonical | scope=local | kind=live_truth | status=active | project=global | ns=global | vis=private | agent=memd | tags=live_truth,repo_changes | cf=0.98 | upd=17772120... | r=status:id=6a19ade4-02ba-42af-a560-3456a59f1f55 | stage=canonical | scope=project | kind=status | status=active | project=personal-website | ns=main | vis=private | agent=codex@session-5b36b772 | tags=checkpoint,current-task,...

## L

- l=personal-website/main/none | v=private | it=15 | tr=0.67 

## Hive

- queen=none roster=1 active=1 review=0 overlap=0 stale=0
- active_bees=Personal Website Codex 5b36b772(session-5b36b772)/none
- focus=Personal Website Codex 5b36b772 work="c=Cl..." touches=project next="c=Cl..." action=coordinate_now

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

