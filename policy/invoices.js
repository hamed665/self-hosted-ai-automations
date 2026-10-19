export default function processRecords(records) {
  function day(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('Invalid ISO date');
    const time = Date.parse(`${value}T00:00:00Z`);
    if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== value) throw new Error('Invalid calendar date');
    return time;
  }
  return records.map(invoice => {
    if (!invoice.id || !['paid', 'unpaid', 'disputed'].includes(invoice.status)) throw new Error('Invalid invoice');
    const overdue_days = Math.max(0, Math.floor((day(invoice.as_of) - day(invoice.due_date)) / 86400000));
    const route = invoice.status === 'paid' ? 'closed' : invoice.status === 'disputed' ? 'human-review' : overdue_days > 0 ? 'reminder-review' : 'not-due';
    return { id: invoice.id, overdue_days, route, requires_approval: route !== 'closed', send: false, draft: route === 'reminder-review' ? `Draft only: invoice ${invoice.id} is ${overdue_days} days overdue as of ${invoice.as_of}. Please verify the balance before contacting anyone.` : null };
  });
}
