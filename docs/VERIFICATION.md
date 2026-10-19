# Verification — 2026-10-19

Upstream SHA 662bd8892476b41d9084417a569cc84013354674 (2026-07-23); public, not archived. Apache-2.0 license and original source retained. Source baseline uses rolling n8n/Ollama/Qdrant tags and exposed service ports. Docker/daemon is unavailable locally, so original stack startup and model inference could not be measured.

Seven Node tests pass against policy modules and the exact generated n8n Code-node strings. Exports are deterministic, inactive, credential-free and contain only manual/code/local-Ollama HTTP nodes. Human-only output remains enforced despite a fabricated model response. No customer delivery occurs.

The standalone Compose file uses n8n 2.43.8 and Ollama 0.40.6, verified against their official GitHub latest-release records. PostgreSQL remains on the 16-alpine patch family. These tags are not image digests, and container CVE scanning is outstanding.

GitHub CI is configured to run code tests, validate Compose, check generated-file drift and attempt a disposable container import. A complete n8n workflow execution and live local-model draft remain unverified until actual runtime results are obtained. Import success alone does not verify AI behavior.

The n8n engine license was read separately from the starter-kit Apache license. No license or paid account was accepted through a website, and no cloud/customer credential was used. Model licensing must be reviewed before model download.
