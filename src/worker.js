export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/rsvp" && request.method === "POST") {
      try {
        const data = await request.json();
        const attending = data.attending;
        const guestCount = Number(data.guestCount);

        if (
          typeof attending !== "boolean" ||
          !Number.isInteger(guestCount) ||
          guestCount < 0 ||
          guestCount > 20
        ) {
          return Response.json(
            { success: false, error: "Invalid RSVP data" },
            { status: 400 }
          );
        }

        await env.DB.prepare(
          "INSERT INTO WeddingRSVPs (attending, guestCount) VALUES (?, ?)"
        ).bind(attending, guestCount).run();

        return Response.json({ success: true });
      } catch (error) {
        return Response.json(
          { success: false, error: "Could not save RSVP" },
          { status: 500 }
        );
      }
    }

    return env.ASSETS.fetch(request);
  }
};
