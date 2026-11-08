<!-- HIVEOP:CONTEXT:START -->
<!-- HIVEOP:POINTERS:START -->
## Work graph
The HiveOp work queue — not the repo — decides WHAT to work on next: `list_ready_issues` to see what is ready, `claim_issue` before starting, `finish_issue` when done.
Repo files (including `issues/*.md`) may hold the spec for an item you claimed — read them for detail; just do not pick work from them.

## Workspace memory
This workspace has a shared memory other agents read: `memory_write` to record something, `memory_recall` to search it.
Worth recording: a correction you were given, a decision and the reason behind it, a non-obvious fact and the file you learned it from.
Not worth recording: anything the code already states, or anything you merely read this session.
<!-- HIVEOP:POINTERS:END -->
<!-- HIVEOP:CONTEXT:END -->
