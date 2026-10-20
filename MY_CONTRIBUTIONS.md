# Engineering contributions — Hamed Minaei

**Project:** Self-hosted Business Automations  
**Role:** Business-policy design, workflow implementation, deterministic export, synthetic dataset preparation and container verification  
**Portfolio:** https://github.com/hamed665

I developed this portfolio edition as an extension of n8n's self-hosted AI starter kit. The original foundation, copyright, license notices and Git ancestry are preserved. The work described below is my added integration and application development.

## My implementation

Lead qualification, invoice follow-up and multilingual support triage workflows.

**Primary code:** `policy/`, `examples/`, `scripts/build-workflows.mjs`, `workflows/`, standalone Compose and CI.

## Review the work

- [Implementation pull request](https://github.com/hamed665/self-hosted-ai-automations/pull/1): inspect the actual added code and reviewable history.
- [Testing instructions](README.md#testing): reproduce the relevant checks.
- **Verification evidence:** 7 policy/export tests, Compose validation and real container import/execution of all 3 workflows.
- **Demonstration:** Synthetic workflow/container scenarios; optional local Ollama drafting.

## Engineering boundary

No customer messaging or payment action is configured. Actual local-model inference is unverified. n8n's engine has Sustainable Use License terms separate from the starter kit's Apache license.

This is a portfolio preview. The test evidence describes the checks performed and does not establish production readiness.

## Foundation and attribution

n8n's self-hosted AI starter kit supplies the original project foundation. My contribution is the extension and integration scope above; I do not claim original authorship of the upstream platform, SDKs or conversion libraries. See [Attribution](README.md#attribution), the retained root license and the project's dependency-license notes for exact provenance and applicable terms.
