import sgMail from "@sendgrid/mail";

type Req = {
  method?: string;
  body?: any;
};

type Res = {
  status: (code: number) => Res;
  json: (data: any) => any;
  end: () => any;
  setHeader: (name: string, value: string) => any;
};

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
    const phone = body.phone ?? "-";

    if (!email || !message) {
      return res.status(400).json({ success: false, error: "Missing email/message" });
    }

    let attachments: any[] = [];

    // ✅ CASO 1: attachment singolo (come nel tuo payload)
    if (body.attachment && typeof body.attachment === "string") {
      const contentStr = body.attachment;
      const base64 = contentStr.includes("base64,")
        ? contentStr.split("base64,")[1]
        : contentStr;

      attachments.push({
        content: base64,
        filename: "allegato.jpg",
        type: "image/jpeg",
        disposition: "attachment",
      });
    }

    // ✅ CASO 2: array attachments
    if (Array.isArray(body.attachments)) {
      attachments = body.attachments.map((a: any) => {
        const contentStr = String(a.content);
        const base64 = contentStr.includes("base64,")
          ? contentStr.split("base64,")[1]
          : contentStr;

        return {
          content: base64,
          filename: a.filename || "file",
          type: a.type || "application/octet-stream",
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
        `Telefono: ${phone}\n` +
        `Pacchetto: ${service}\n\n` +
        `Messaggio:\n${message}\n`,
      attachments,
    });

    return res.status(200).json({ success: true });
  } catch (e: any) {
    return res.status(500).json({ success: false, error: e?.message || "Send failed" });
  }
}
