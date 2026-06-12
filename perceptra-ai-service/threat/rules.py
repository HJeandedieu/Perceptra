# threat/rules.py

# ---------------------------------------------------------------------------
# Threat scoring rules
# Each label has a base score (0.0 – 1.0) representing inherent danger level.
# Final severity is determined by combining base score + confidence + loiter.
# ---------------------------------------------------------------------------

LABEL_BASE_SCORES = {
    # Weapons — always high priority
    "knife":        0.80,
    "gun":          0.95,
    "scissors":     0.60,

    # People in suspicious context
    "person":       0.20,

    # Vehicles in restricted zones
    "car":          0.15,
    "truck":        0.20,
    "motorcycle":   0.25,

    # Default for anything not listed
    "__default__":  0.10,
}

# Loitering penalty — added to threat score per minute of dwell time
LOITER_SCORE_PER_MINUTE = 0.10
LOITER_THRESHOLD_SECONDS = 30  # dwell time before loiter penalty kicks in

# Severity thresholds (based on final threat score 0.0 – 1.0)
SEVERITY_THRESHOLDS = {
    "critical": 0.80,
    "high":     0.60,
    "medium":   0.35,
    "low":      0.0,
}


def get_severity(label: str, confidence: float, loiter_seconds: float = 0.0, identity=None):
    """
    Compute a threat score and map it to a severity level.

    Args:
        label:           YOLO class label string
        confidence:      model confidence 0.0 – 1.0
        loiter_seconds:  how long this object has been in the zone

    Returns:
        Tuple: (severity: str, threat_score: float)
    """
    base = LABEL_BASE_SCORES.get(label, LABEL_BASE_SCORES["__default__"])
    
    # Identity adjustment for persons
    if label == "person":
        if identity == "registered":
            base = 0.05   # known person — almost no threat
        elif identity == "unknown":
            base = 0.55   # unrecognised person — elevated threat

    # Confidence boosts the score proportionally
    score = base * confidence

    # Add loiter penalty once threshold is crossed
    if loiter_seconds >= LOITER_THRESHOLD_SECONDS:
        minutes_over = (loiter_seconds - LOITER_THRESHOLD_SECONDS) / 60.0
        score += LOITER_SCORE_PER_MINUTE * minutes_over

    # Cap at 1.0
    score = min(score, 1.0)

    # Map to severity label
    severity = "low"
    for level, threshold in SEVERITY_THRESHOLDS.items():
        if score >= threshold:
            severity = level
            break

    return severity, score