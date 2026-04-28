# ROM Convention

## Objective
- Use one canonical ROM naming and reporting convention across frontend and backend.
- Keep ROM scoped to screening and follow-up, not clinical diagnosis.

## Canonical Joint Motions

### Cervical
- `flexion`
- `extension`
- `left-lateral-flexion`
- `right-lateral-flexion`
- `left-rotation`
- `right-rotation`

### Shoulder
- `flexion`
- `extension`
- `abduction`
- `adduction`
- `internal-rotation`
- `external-rotation`

### Elbow
- `flexion`
- `extension`

### Wrist
- `flexion`
- `extension`
- `radial-deviation`
- `ulnar-deviation`

### Hip
- `flexion`
- `extension`
- `abduction`
- `adduction`
- `internal-rotation`
- `external-rotation`

### Knee
- `flexion`
- `extension`

### Ankle
- `dorsiflexion`
- `plantarflexion`

## Side Semantics
- Bilateral joints use `left` or `right`.
- Midline joints use `midline`.

## Alias Compatibility
- Historical frontend names remain accepted and are normalized before calculation.
- Examples:
  - cervical `internal_rotation` -> `left-rotation`
  - cervical `external_rotation` -> `right-rotation`
  - cervical `abduction` -> `left-lateral-flexion`
  - cervical `adduction` -> `right-lateral-flexion`
  - wrist `abduction` -> `radial-deviation`
  - wrist `adduction` -> `ulnar-deviation`
  - ankle `flexion` -> `dorsiflexion`
  - ankle `extension` -> `plantarflexion`

## Reporting Thresholds
- Frontend reporting uses joint-specific `normalMin` and `normalMax`.
- `limited`: measured peak angle < `normalMin`
- `normal`: `normalMin` <= measured peak angle <= `normalMax`
- `excessive`: measured peak angle > `normalMax`

## Current Limitation
- This convention unifies terminology, supported motions, side semantics, and report thresholds.
- It does not by itself validate that each joint formula matches a clinical goniometer definition.
- Formula correction should be performed next on top of this unified convention.
