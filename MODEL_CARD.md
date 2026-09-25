# Imperium Compact v1

An experimental trained opponent for base Dune: Imperium, presented in the
browser as Ashen Concord: Founding. No expansions or Uprising support.

- Architecture: `dune_compact`, 112,826 parameters; browser export contains the actor only.
- Training: PPO league self-play from random initialization; four-player games;
  one-hour CPU campaign on 2026-09-25; seed 470001.
- Selected policy: checkpoint 81 (165,888 training games). The campaign completed
  82 iterations / 167,936 games before selecting its champion.
- Selection: six-checkpoint common-seed tournament, 256 games per directed matchup.
  Checkpoint 81 averaged 56.56% wins against the other five checkpoints.
- Held-out evaluation: 99.61% wins against the initial bootstrap policy, with one
  candidate against three bootstrap opponents across 256 games / 64 base seeds.
- These results measure improvement over this run's earlier policies. Human-level
  playing strength and performance against independent strong agents are unknown.
- Training and evaluation used four players; three-player performance is unmeasured.
- Inference is greedy policy evaluation without tree search. Browser arithmetic
  may differ slightly from LibTorch near equal action scores.
- Engine compatibility: training source `fb89aaa1749862ec98dc12be85a5d9882f0928a3`,
  observation ABI `dune_observation_v1` (2174), action features
  `dune_action_feature_v1` (507). Use the matching packaged browser engine.
- Weight license: MIT, as provided in the release LICENSE. Third-party names,
  trademarks, and artwork are not covered by the model weight license.

## Files

`champion/policy.pt` and its `.metadata.json` are the native LibTorch checkpoint.
`static/policy.json` is the browser actor export; `static/policy_pool.json` selects it.
`checksums.json` records SHA-256 digests. Optimizer state is not required for play
and is not included. Only load checkpoints from sources you trust.

The browser runs the rules and AI on the player's device. No account, Python,
GPU, or AI service is required. The UI uses original Ashen Concord presentation;
this is an unofficial project, not affiliated with Dune or Dune: Imperium.
