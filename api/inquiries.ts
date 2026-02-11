import type { VercelRequest, VercelResponse } from "@vercel/node";
import sgMail from "@sendgrid/mail";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS (non indispensabile se chiami dallo stesso dominio, ma non dà fastidio)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const apiKey = process.env.SENDGRID_API_KEY_2;
  if (!apiKey) {
    return res.status(500).json({ success: false, error: "SENDGRID_API_KEY_2 missing" });
  }

  try {
    const body = (req.body || {}) as any;

    // Campi "tolleranti" (così non si rompe se i nomi cambiano leggermente)
    const name = body.name ?? body.fullName ?? body.nome ?? "-";
    const email = body.email ?? body.mail ?? body.from ?? "";
    const phone = body.phone ?? body.telefono ?? body.tel ?? "-";
    const service = body.service ?? body.tipo ?? body.category ?? "Richiesta";
    const message = body.message ?? body.messaggio ?? body.notes ?? "";

    if (!email || !message) {
      return res.status(400).json({ success: false, error: "Missing email/message" });
    }

    // Allegati: il client spesso manda [{ filename, type, content: "data:...;base64,XXXX" }]
    const rawAttachments = body.attachments ?? body.files ?? [];
    const attachments = Array.isArray(rawAttachments)
      ? rawAttachments
          .filter((a: any) => a?.content && a?.filename)
          .slice(0, 5) // limite prudente
          .map((a: any) => {
            const contentStr = String(a.content);
            const base64 = contentStr.includes("base64,")
              ? contentStr.split("base64,")[1]
              : contentStr; // se già base64 puro

            return {
              content: base64,
              filename: String(a.filename),
              type: a.type ? String(a.type) : "application/octet-stream",
              disposition: "attachment" as const,
            };
          })
      : [];

    sgMail.setApiKey(apiKey);

    await sgMail.send({
      to: "digiplanservice@gmail.com", // dove ricevi
      from: "digiplanservice@gmail.com", // meglio poi un mittente verificato SendGrid
      replyTo: email,
      subject: `Nuova richiesta: ${service}`,
      text:
        `Nome: ${name}\n` +
        `Email: ${email}\n` +
        `Telefono: ${phone}\n` +
        `Servizio: ${service}\n\n` +
        `Messaggio:\n${message}\n`,
      attachments, // ✅ allegati
    });

    return res.status(200).json({ success: true });
  } catch (e: any) {
    return res.status(500).json({ success: false, error: e?.message || "Send failed" });
  }
}
