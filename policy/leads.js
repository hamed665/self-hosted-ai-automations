export default function processRecords(records) {
  if (records.length > 100) throw new Error('Maximum 100 leads');
  return records.map((lead) => {
    if (!lead.id || typeof lead.company !== 'string' || lead.company.length > 160 || !Number.isFinite(lead.budget) || lead.budget < 0 || !Number.isFinite(lead.timeline_days) || lead.timeline_days < 0) throw new Error('Invalid lead');
    const score = (lead.budget >= 1000 ? 40 : 0) + (lead.timeline_days <= 30 ? 25 : 0) + (['automation', 'website', 'ai'].includes(lead.need) ? 35 : 0);
    return { id: lead.id, score, route: score >= 60 ? 'sales-review' : 'nurture-review', requires_approval: true, send: false, draft_prompt: `Draft a short discovery reply for the fictional company ${lead.company}. Interest: ${lead.need}. Do not promise work, prices or a booking. Return plain text for a human reviewer.` };
  });
}
