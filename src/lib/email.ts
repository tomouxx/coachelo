import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: process.env.SMTP_SECURE !== "false",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

export async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}) {
  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text ?? opts.html.replace(/<[^>]+>/g, ""),
    replyTo: opts.replyTo
  });
}

// ============ Templates ============
const shell = (title: string, body: string) => `
<!doctype html>
<html lang="fr"><head><meta charset="utf-8" />
<title>${title}</title></head>
<body style="margin:0;padding:0;background:#FBF7F4;font-family:Inter,system-ui,sans-serif;color:#2E2A27">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;padding:40px;border-radius:12px;box-shadow:0 8px 30px rgba(46,42,39,.06)">
    <div style="text-align:center;margin-bottom:32px">
      <div style="font-family:Georgia,serif;font-size:24px;color:#C8825B;font-weight:700">Élodie Duhayon</div>
      <div style="font-size:12px;color:#7A6B63;letter-spacing:.1em;text-transform:uppercase">Personal Trainer</div>
    </div>
    ${body}
    <hr style="border:none;border-top:1px solid #E5DDD7;margin:32px 0" />
    <div style="text-align:center;color:#7A6B63;font-size:12px">
      Élodie Duhayon · Poliez-Pittet, Suisse<br/>
      <a href="https://www.coachelo.ch" style="color:#C8825B;text-decoration:none">www.coachelo.ch</a>
    </div>
  </div>
</body></html>`;

export function bookingConfirmClient(booking: {
  firstName: string;
  serviceName: string;
  startsAt: Date;
}) {
  const when = new Intl.DateTimeFormat("fr-CH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(booking.startsAt));
  return shell(
    "Ta demande de réservation est bien reçue",
    `
    <h1 style="font-family:Georgia,serif;font-size:28px;color:#B56A45;margin:0 0 16px">Merci ${booking.firstName} !</h1>
    <p>Ta demande de réservation pour <strong>${booking.serviceName}</strong> le <strong>${when}</strong> a bien été reçue.</p>
    <p>Je te confirme ton créneau par retour d'email dans les plus brefs délais. À très vite !</p>
    <p style="margin-top:24px">Élodie</p>`
  );
}

export function bookingNotifyAdmin(booking: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceName: string;
  startsAt: Date;
  goal?: string | null;
  message?: string | null;
}) {
  const when = new Intl.DateTimeFormat("fr-CH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(booking.startsAt));
  return shell(
    "Nouvelle demande de réservation",
    `
    <h1 style="font-family:Georgia,serif;font-size:24px;color:#B56A45;margin:0 0 16px">Nouvelle demande</h1>
    <p><strong>${booking.firstName} ${booking.lastName}</strong> souhaite réserver une séance.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      <tr><td style="padding:6px 0;color:#7A6B63">Prestation</td><td>${booking.serviceName}</td></tr>
      <tr><td style="padding:6px 0;color:#7A6B63">Date</td><td>${when}</td></tr>
      <tr><td style="padding:6px 0;color:#7A6B63">Email</td><td>${booking.email}</td></tr>
      <tr><td style="padding:6px 0;color:#7A6B63">Téléphone</td><td>${booking.phone}</td></tr>
      ${booking.goal ? `<tr><td style="padding:6px 0;color:#7A6B63">Objectif</td><td>${booking.goal}</td></tr>` : ""}
      ${booking.message ? `<tr><td style="padding:6px 0;color:#7A6B63">Message</td><td>${booking.message}</td></tr>` : ""}
    </table>
    <a href="https://www.coachelo.ch/admin/reservations" style="display:inline-block;padding:12px 24px;background:#C8825B;color:#ffffff;text-decoration:none;border-radius:6px">Voir dans l'admin</a>`
  );
}

export function bookingReminderClient(booking: {
  firstName: string;
  serviceName: string;
  startsAt: Date;
}) {
  const when = new Intl.DateTimeFormat("fr-CH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(booking.startsAt));
  return shell(
    "Rappel : séance demain",
    `
    <h1 style="font-family:Georgia,serif;font-size:28px;color:#B56A45;margin:0 0 16px">À demain ${booking.firstName} !</h1>
    <p>Petit rappel : ta séance de <strong>${booking.serviceName}</strong> a lieu <strong>${when}</strong>.</p>
    <p>Pense à prévoir une tenue adaptée, une bouteille d'eau et un peu d'avance pour te préparer.</p>
    <p style="margin-top:24px">Hâte de te retrouver,<br/>Élodie</p>`
  );
}

export function contactNotifyAdmin(msg: {
  firstName: string;
  lastName?: string | null;
  email: string;
  message: string;
}) {
  return shell(
    "Nouveau message de contact",
    `
    <h1 style="font-family:Georgia,serif;font-size:24px;color:#B56A45;margin:0 0 16px">Nouveau message</h1>
    <p>De : <strong>${msg.firstName} ${msg.lastName ?? ""}</strong> (${msg.email})</p>
    <p style="background:#F9E7E1;padding:16px;border-radius:8px">${msg.message.replace(/\n/g, "<br/>")}</p>`
  );
}
