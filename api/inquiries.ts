import type { VercelRequest, VercelResponse } from "@vercel/node";
import sgMail from "@sendgrid/mail";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS (utile se in futuro chiami da domini diversi)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  const apiKey = process.env.SENDGRID_API_KEY_2;
  if (!apiKey) return res.status(500).json({ ok: false, error: "SENDGRID_API_KEY_2 missing" });

  try {
    // il tuo form potrebbe inviare campi diversi: gestiamo in modo “tollerante”
    const body = (req.body || {}) as any;

    const name = body.name ?? body.fullName ?? body.nome ?? "-";
    const email = body.email ?? body.mail ?? body.from ?? "";
    const phone = body.phone ?? body.telefono ?? body.tel ?? "-";
    const service = body.service ?? body.tipo ?? body.category ?? "Richiesta";
    const message = body.message ?? body.messaggio ?? body.notes ?? "";

    if (!email || !message) {
      return res.status(400).json({ ok: false, error: "Missing email/message" });
    }

    sgMail.setApiKey(apiKey);

    await sgMail.send({
      to: "digiplanservice@gmail.com",         // <-- dove ricevi le richieste
      from: "digiplanservice@gmail.com",       // <-- meglio poi un mittente verificato su SendGrid
      replyTo: email,
      subject: `Nuova richiesta: ${service}`,
      text:
        `Nome: ${name}\n` +
        `Email: ${email}\n` +
        `Telefono: ${phone}\n` +
        `Servizio: ${service}\n\n` +
        `Messaggio:\n${message}\n`,
    });

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || "Send failed" });
  }
}
