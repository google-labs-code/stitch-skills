---
name: science-skills-common
description: >-
  Shared Python package for Science Skills, currently containing http_client --
  a unified HTTP client with rate limiting, retries, and exponential backoff.
  Not a standalone agent skill. Do not invoke directly.
---

# Science Skills Common

This is a shared Python package, not an agent skill. Skills import it as:

```python
from science_skills.science_skills_common import http_client
```

Each skill declares this as a dependency in its inline `uv` script header, so it
is installed automatically on first use.

This SKILL.md file is included so that standard skill installers automatically
discover and install this package alongside the skills that depend on it.
