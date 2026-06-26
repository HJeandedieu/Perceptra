# threat/rules.py

# ---------------------------------------------------------------------------
# Threat scoring rules
# ---------------------------------------------------------------------------

LABEL_BASE_SCORES: dict[str, float] = {
    # Weapons
    "knife":      0.80,
    "gun":        0.95,
    "scissors":   0.60,
    # People
    "person":     0.20,
    # Vehicles
    "car":        0.15,
    "truck":      0.20,
    "motorcycle": 0.25,
    # Default
    "__default__": 0.10,
}

LOITER_SCORE_PER_MINUTE: float = 0.10
LOITER_THRESHOLD_SECONDS: int  = 30

SEVERITY_THRESHOLDS: dict[str, float] = {
    "critical": 0.80,
    "high":     0.60,
    "medium":   0.35,
    "low":      0.0,
}


def get_severity(
    label: str,
    confidence: float,
    loiter_seconds: float = 0.0,
    identity: str | None  = None,
) -> tuple[str, float]:
    """
    Compute threat score and severity level.

    Returns:
        (severity, threat_score)
    """
    base = LABEL_BASE_SCORES.get(label, LABEL_BASE_SCORES["__default__"])

    # Identity adjustment
    if label == "person":
        if identity == "registered":
            base = 0.05
        elif identity == "unknown":
            base = 0.55

    # Confidence scaling
    score = base * confidence

    # Loiter penalty
    if loiter_seconds >= LOITER_THRESHOLD_SECONDS:
        minutes_over = (loiter_seconds - LOITER_THRESHOLD_SECONDS) / 60.0
        score += LOITER_SCORE_PER_MINUTE * minutes_over

    score = min(score, 1.0)

    severity = "low"
    for level, threshold in SEVERITY_THRESHOLDS.items():
        if score >= threshold:
            severity = level
            break

    return severity, round(score, 3)