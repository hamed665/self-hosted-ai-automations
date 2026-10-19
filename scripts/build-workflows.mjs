import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
function id(value) { const hash = createHash('sha256').update(value).digest('hex'); return `${hash.slice(0,8)}-${hash.slice(8,12)}-4${hash.slice(13,16)}-8${hash.slice(17,20)}-${hash.slice(20,32)}`; }
for (const name of ['leads', 'invoices', 'tickets']) {
  const data = JSON.parse(await readFile(`examples/${name}.json`, 'utf8'));
  const policy = (await readFile(`policy/${name}.js`, 'utf8')).replace('export default ', '');
  const nodes = [
    { id: id(name+'trigger'), name: 'Manual demo', type: 'n8n-nodes-base.manualTrigger', typeVersion: 1, position: [0, 0], parameters: {} },
    { id: id(name+'fixture'), name: 'Synthetic inputs', type: 'n8n-nodes-base.code', typeVersion: 2, position: [240, 0], parameters: { mode: 'runOnceForAllItems', jsCode: `return ${JSON.stringify(data)}.map(json => ({ json }));` } },
    { id: id(name+'policy'), name: 'Business policy', type: 'n8n-nodes-base.code', typeVersion: 2, position: [480, 0], parameters: { mode: 'runOnceForAllItems', jsCode: `${policy}\nreturn processRecords($input.all().map(item => item.json)).map(json => ({ json }));` } },
  ];
  const connections = { 'Manual demo': { main: [[{ node: 'Synthetic inputs', type: 'main', index: 0 }]] }, 'Synthetic inputs': { main: [[{ node: 'Business policy', type: 'main', index: 0 }]] } };
  if (name !== 'invoices') {
    nodes.push({ id: id(name+'draft'), name: 'Optional local AI draft', type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, position: [720, 0], continueOnFail: true, parameters: { method: 'POST', url: 'http://ollama:11434/api/generate', sendBody: true, specifyBody: 'json', jsonBody: "={{ JSON.stringify({model: 'llama3.2:3b', prompt: $json.draft_prompt, stream: false}) }}", options: { timeout: 30000 } } });
    nodes.push({ id: id(name+'review'), name: 'Human review output', type: 'n8n-nodes-base.code', typeVersion: 2, position: [960, 0], parameters: { mode: 'runOnceForAllItems', jsCode: "const decisions = $('Business policy').all(); return $input.all().map((item, i) => { const decision = decisions[i].json; const humanOnly = decision.route === 'human-required'; const valid = !humanOnly && typeof item.json.response === 'string'; return { json: { ...decision, draft: valid ? item.json.response.slice(0,2000) : null, draft_state: humanOnly ? 'human-required' : valid ? 'ready-for-review' : 'unavailable', requires_approval: true, send: false } }; });" } });
    connections['Business policy'] = { main: [[{ node: 'Optional local AI draft', type: 'main', index: 0 }]] };
    connections['Optional local AI draft'] = { main: [[{ node: 'Human review output', type: 'main', index: 0 }]] };
  }
  await writeFile(`workflows/${name}.json`, JSON.stringify({ id: `portfolio-${name}`, name: `Portfolio / ${name}`, active: false, nodes, connections, settings: { executionOrder: 'v1', saveDataSuccessExecution: 'none', saveDataErrorExecution: 'none' }, versionId: id(name+'version') }, null, 2)+'\n');
}
