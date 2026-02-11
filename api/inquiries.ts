import sgMail from "@sendgrid/mail";

type Req = { method?: string; body?: any };
type Res = {
  status: (code: number) => Res;
  json: (data: any) => any;
  end: () => any;
  setHeader: (name: string, value: string) => any;
};

function parseDataUrl(dataUrl: string): { mime: string; base64: string } {
  // data:<mime>;base64,<payload>
  const match = /^data:(.*?);base64,(.*)$/.exec(dataUrl);
  if (!match) return { mime: "application/octet-stream", base64: dataUrl };
  return { mime: match[1] || "application/octet-stream", base64: match[2] || "" };
}

export default async function handler(req: Req, res: Res) {
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
    const body = req.body || {};

    const name = body.name ?? "-";
    const email = body.email ?? "";
    const service = body.package ?? body.service ?? "Richiesta";
    const message = body.message ?? "";

    if (!email || !message) {
      return res.status(400).json({ success: false, error: "Missing email/message" });
    }

    let attachments: any[] = [];

    // ✅ Caso principale: attachment singolo + nome/tipo inviati dal form
    if (body.attachment && typeof body.attachment === "string") {
      const { mime, base64 } = parseDataUrl(body.attachment);

      const filename =
        (typeof body.attachmentName === "string" && body.attachmentName.trim()) ||
        "allegato";

      const type =
        (typeof body.attachmentType === "string" && body.attachmentType.trim()) ||
        mime ||
        "application/octet-stream";

      attachments.push({
        content: base64,
        filename,
        type,
        disposition: "attachment",
      });
    }

    // ✅ Compatibilità: array attachments (se un domani lo rimetti)
    if (Array.isArray(body.attachments)) {
      attachments = body.attachments
        .filter((a: any) => a?.content)
        .map((a: any) => {
          const { mime, base64 } = parseDataUrl(String(a.content || ""));
          return {
            content: base64,
            filename: String(a.filename || "file"),
            type: String(a.type || mime || "application/octet-stream"),
            disposition: "attachment",
          };
        });
    }

    sgMail.setApiKey(apiKey);

    await sgMail.send({
      to: "digiplanservice@gmail.com",
      from: "digiplanservice@gmail.com",
      replyTo: email,
      subject: `Nuova richiesta: ${service}`,
      text:
        `Nome: ${name}\n` +
        `Email: ${email}\n` +
        `Pacchetto: ${service}\n\n` +
        `Messaggio:\n${message}\n`,
      attachments,
    });

    return res.status(200).json({ success: true });
  } catch (e: any) {
    return res.status(500).json({ success: false, error: e?.message || "Send failed" });
  }
}
