import type { Express } from "express";
import type { Server } from "http";
import { api } from "@shared/routes";
import { z } from "zod";
import sgMail from "@sendgrid/mail";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  app.post(api.inquiries.create.path, async (req, res) => {
    try {
      // 1) Validazione input
      const input = api.inquiries.create.input.parse(req.body);

      // 2) API key
      const apiKey = process.env.SENDGRID_API_KEY_2;
      if (!apiKey) {
        return res.status(500).json({
          message: "SENDGRID_API_KEY_2 non configurata nei Secrets",
        });
      }
      sgMail.setApiKey(apiKey);

      // 3) Costruzione messaggio
      const msg: any = {
        to: "digiplanservice@gmail.com",
        from: "digiplanservice@gmail.com", // deve essere verificato su SendGrid (Single Sender)
        replyTo: input.email, // così rispondi al cliente
        subject: `Nuova richiesta dal sito - ${new Date().toLocaleString("it-IT")} - ${input.email}`,
        text: input.message || "Nuova richiesta dal sito",
        html: `
          <h3>Nuova richiesta di contatto</h3>
          <p><strong>Nome:</strong> ${input.name}</p>
          <p><strong>Email:</strong> ${input.email}</p>
          <p><strong>Pacchetto scelto:</strong> ${input.package}</p>
          <p><strong>Messaggio:</strong></p>
          <p>${input.message}</p>
        `,
      };

      // 4) Allegato (base64 dataURL)
      if (input.attachment) {
        const parts = input.attachment.split(",");
        if (parts.length === 2) {
          const meta = parts[0]; // data:<mime>;base64
          const base64Data = parts[1];

          const contentType =
            meta.split(";")[0].split(":")[1] || "application/octet-stream";
          const ext = contentType.includes("/")
            ? contentType.split("/")[1]
            : "bin";

          msg.attachments = [
            {
              content: base64Data,
              filename: `allegato_${Date.now()}.${ext}`,
              type: contentType,
              disposition: "attachment",
            },
          ];
        }
      }

      // 5) Invio email a DigiPlan
      try {
        const [resp] = await sgMail.send(msg);
        console.log("✅ SendGrid OK (notifica)", {
          statusCode: resp.statusCode,
          messageId: resp.headers?.["x-message-id"],
        });

        // 6) Email di conferma al cliente
        const confirmationMsg = {
          to: input.email,
          from: "digiplanservice@gmail.com",
          subject: "Abbiamo ricevuto la tua richiesta - DigiPlan service",
          text: `Ciao ${input.name},\ngrazie per averci scritto!\nQuesto messaggio serve solo a confermarti che abbiamo ricevuto la tua richiesta.\nTi risponderemo personalmente il prima possibile.\n\nIl Team DigiPlan service`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <p style="color: #2d3748; font-size: 16px; line-height: 1.6;">
                Ciao <strong>${input.name}</strong>,<br/>
                grazie per averci scritto!
              </p>
              <p style="color: #2d3748; font-size: 16px; line-height: 1.6;">
                Questo messaggio serve solo a confermarti che abbiamo ricevuto la tua richiesta.<br/>
                Ti risponderemo personalmente il prima possibile.
              </p>
              <p style="color: #718096; font-size: 14px; margin-top: 32px;">
                <strong>Il Team DigiPlan service</strong>
              </p>
            </div>
          `,
        };

        try {
          const [confirmResp] = await sgMail.send(confirmationMsg);
          console.log("✅ SendGrid OK (conferma cliente)", {
            statusCode: confirmResp.statusCode,
            messageId: confirmResp.headers?.["x-message-id"],
          });
        } catch (confirmErr: any) {
          console.error("⚠️ Conferma cliente non inviata", confirmErr?.message);
        }

        return res.status(201).json({ success: true });
      } catch (e: any) {
        console.error("❌ SendGrid ERROR", {
          status: e?.response?.statusCode,
          body: e?.response?.body,
          message: e?.message,
        });
        return res.status(500).json({
          message: "Errore durante l'invio dell'email",
          details: e?.response?.body || e?.message,
        });
      }
    } catch (err) {
      // Errori di validazione Zod
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0]?.message,
          field: err.errors[0]?.path?.join("."),
        });
      }

      console.error("❌ API ERROR:", err);
      return res.status(500).json({ message: "Errore interno del server" });
    }
  });

  return httpServer;
}
