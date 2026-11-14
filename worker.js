export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (url.pathname !== "/api/rsvp") return new Response("Not found", { status: 404 });
    if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: cors });
    try {
      const body = await request.json();
      if (typeof body.attending !== "boolean") return Response.json({ error: "invalid_attending" }, { status: 400, headers: cors });
      const count = Number(body.guestCount);
      if (!Number.isInteger(count) || count < 0 || count > 20 || (body.attending && count < 1) || (!body.attending && count !== 0)) {
        return Response.json({ error: "invalid_guest_count" }, { status: 400, headers: cors });
      }
      await env.DB.prepare(
        "INSERT INTO WeddingRSVPs (attending, guestCount, createdAt) VALUES (?, ?, ?)"
      ).bind(body.attending ? 1 : 0, count, new Date().toISOString()).run();
      return Response.json({ ok: true }, { headers: cors });
    } catch (err) {
      return Response.json({ error: "save_failed" }, { status: 500, headers: cors });
    }
  }
};