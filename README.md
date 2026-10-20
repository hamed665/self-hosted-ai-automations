# Self-hosted Business Automations

**[Hamed Minaei](https://github.com/hamed665) · Project maintainer & integration engineer**

**My engineering scope:** Lead qualification, invoice follow-up and multilingual support triage workflows.

[My contributions & implementation evidence](MY_CONTRIBUTIONS.md) · [Implementation PR](https://github.com/hamed665/self-hosted-ai-automations/pull/1) · [Architecture](#architecture) · [Testing](#testing)

Three practical business workflow extensions by Hamed Minaei, built on n8n's self-hosted AI starter kit. The pack produces reviewable lead decisions, invoice follow-up drafts and support-ticket routes using synthetic datasets.

**Status: portfolio workflow pack.** Policy logic is tested independently; local Docker execution is unavailable. No email, WhatsApp, CRM mutation, payment or external customer action is configured. AI drafting is optional and requires a local Ollama model.

## Architecture

| Layer | Responsibility |
| --- | --- |
| `policy/*.js` | Testable, deterministic business decisions |
| `examples/*.json` | Fictional datasets with fixed dates and demo identifiers |
| `scripts/build-workflows.mjs` | Reproducibly embeds those policies and datasets into n8n JSON |
| `workflows/*.json` | Importable inactive n8n workflows |
| `compose.portfolio.yml` | Standalone localhost n8n/PostgreSQL/Ollama setup |

The original starter-kit Compose file and examples are retained unchanged for attribution. Use the standalone portfolio Compose file; do not merge it with the original port mappings.

## Features

1. **Lead qualification:** validates budget/timeline, computes an explicit score, routes to sales or nurture review, and optionally requests a local AI discovery draft.
2. **Invoice aging:** calculates overdue days against a fixed input date. Paid invoices close; disputed invoices go to a human without a reminder draft; unpaid overdue invoices produce an unsent review draft.
3. **Support triage:** English/Arabic routing with human-only rules for refund, complaint, payment and discount topics. Model output cannot override those rules or authorize delivery.

Every imported workflow starts with a manual trigger and is inactive. Lead/ticket HTTP nodes call only `http://ollama:11434/api/generate`; missing model responses produce an explicit unavailable draft. There are no delivery nodes. `requires_approval` is review metadata, not an implemented approval UI or permission system.

## Installation

For independent verification, only Node.js 24 is needed:

```bash
npm test
npm run build:workflows
```

For n8n, install Docker/Compose. Copy `.env.example` to `.env` and generate three distinct local secrets with `openssl rand -hex 32`. Then:

```bash
docker compose -f compose.portfolio.yml up -d
docker compose -f compose.portfolio.yml exec n8n n8n import:workflow --separate --input=/portfolio-workflows
```

Open `http://127.0.0.1:5678`, complete local owner setup, and inspect/import the inactive workflows. Use only included synthetic datasets during review. Model-free invoice logic needs no LLM.

## Configuration

The standalone stack pins n8n 2.43.8 and Ollama 0.40.6, using the PostgreSQL 16 patch-update image family. These are version tags, not immutable digests; image CVEs and image availability must be rechecked before release.

Optional drafting uses `llama3.2:3b`. Review its model terms and resource needs before downloading, then run `docker compose -f compose.portfolio.yml exec ollama ollama pull llama3.2:3b`. Allow sufficient local RAM; no latency or throughput claim is made.

PostgreSQL and Ollama have no published ports. n8n binds localhost only. Ollama has a separate egress network for model downloads. The HTTP-only demo sets `N8N_SECURE_COOKIE=false`; public deployment requires TLS, secure cookies, a separately reviewed network/auth configuration and credential management.

## Security

No real customer data, live credentials or Smart Visions infrastructure is used. Fixtures contain no deliverable customer contact endpoint. The policies use explicit validation and human-only routing; model text is untrusted, bounded draft text. No node executes that text or sends it to a customer.

A workflow export is not a security boundary. Before replacing fixtures or adding delivery nodes, implement authenticated intake, identity-based approval, deduplication, retention, audit controls and end-to-end delivery tests. Node VM use in tests is solely for trusted repository code, not untrusted-code sandboxing.

Container images and a live Ollama model have not been scanned or run locally because Docker is unavailable. Seven policy/export tests pass, but this is not a production deployment certification.

## Testing

`npm test` runs seven tests covering qualification branches, fixed-date aging, invalid dates, Arabic/English human-only routing, generated n8n Code-node equivalence, connection references, inactive defaults, local-only HTTP targets and model-output constraints. Regeneration is deterministic and CI checks for drift.

The GitHub workflow also validates Compose and attempts an import into a disposable n8n container. CI results must be checked separately; authored container tests are not evidence that an import or full execution passed. See [verification](docs/VERIFICATION.md).

## Demo

Use Manual demo in each workflow. Expected outcomes: lead scores 100 and 0; one invoice 30 days overdue, one disputed and one paid; refund/Arabic complaint tickets route to a human. Optional local drafts remain unsent and cannot bypass the policy. No hosted demo is claimed.

## Attribution and licensing

Based on [n8n-io/self-hosted-ai-starter-kit](https://github.com/n8n-io/self-hosted-ai-starter-kit), baseline `662bd8892476b41d9084417a569cc84013354674`. Original Apache-2.0 LICENSE, README (preserved in `docs/UPSTREAM_README.md`), source and full history are retained. Hamed Minaei added the policies, workflow generator, three workflow exports, datasets, standalone Compose setup, tests and CI.

The starter kit's Apache license does **not** relicense the n8n engine. n8n's [Sustainable Use License](https://github.com/n8n-io/n8n/blob/master/LICENSE.md) permits uses subject to its own restrictions; do not assume this pack authorizes a white-label or hosted n8n resale product. Enterprise features, model weights and other containers have separate terms. No paid service or commercial license was activated. See [NOTICE](NOTICE).
