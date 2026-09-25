# Imperium Compact v2

A trained opponent for four-player base Dune: Imperium, presented in the browser
as Ashen Concord: Founding. No expansions or Uprising support.

- Architecture: `dune_compact`, 112,826 parameters; browser export contains the actor only.
- Training: league PPO with prioritized historical opponents and targeted exploiters;
  one-hour CPU baseline plus a three-hour continuation on 2026-09-25, seed 470001.
  The continuation restored iteration 82, optimizer state, and opponent history.
- Selected policy: checkpoint 384, after 786,432 main-policy training games.
  Including three 20-iteration exploiter runs, the combined campaigns recorded
  847,872 training games. All three exploiters were rejected by the admission test.
- Selection: eight-checkpoint common-seed tournament, 256 games per directed matchup.
  Checkpoint 384 averaged 40.57% wins across seven opponents. This field differs
  from v1's selection tournament, so their field averages are not directly comparable.
- Held-out comparison against v1, using 128 fresh seeds and every seat:
  v2 won 285/512 games (55.66%) as one candidate against three v1 opponents.
  In the reverse lineup, v1 won 67/512 games (13.09%) against three v2 opponents.
  Equal-strength solo candidates would win approximately 25% in these four-player games.
  The 512 games per direction share 128 base seeds; seat rotations are not independent samples.
- Held-out versus initial bootstrap: 98.83% wins over 256 games / 64 base seeds.
- These results measure strength against earlier policies in this training lineage.
  Human-level strength and performance against independent strong agents are unmeasured.
  Three-player performance is unmeasured.
- Inference is greedy policy evaluation without tree search. Browser arithmetic may
  differ slightly from LibTorch near equal action scores.
- Training source: `fb89aaa1749862ec98dc12be85a5d9882f0928a3`.
  Observation ABI: `dune_observation_v1` (2174); action features:
  `dune_action_feature_v1` (507). Use the matching packaged browser engine.
- Checkpoint SHA-256: `ef12d0b836a9fcb09dd7419025a21d19aa7b9dd7e259276673acd132c98aedb7`.
- Weight license: MIT, as provided in the release LICENSE. Third-party names,
  trademarks, and artwork are not covered by the model weight license.

## Files

`champion/policy.pt` and its `.metadata.json` are the native LibTorch checkpoint.
`static/policy.json` is the browser actor export; `static/policy_pool.json` selects it.
`evaluation.json` contains the final tournament and held-out comparisons.
`checksums.json` records SHA-256 digests. Optimizer state is not needed for play
and is not distributed. Only load checkpoints from sources you trust.

The game and AI run on the player's device. No account, Python, GPU, or AI service
is required. This is an unofficial project, not affiliated with Dune or Dune: Imperium.
