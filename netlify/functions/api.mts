import nodemailer from "nodemailer"

import type { Context } from "@netlify/functions"

export default async (req: Request, context: Context) => {
  const mailer = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: Netlify.env.get("GMAIL_ADDRESS"),
      pass: Netlify.env.get("GMAIL_PASSWORD"),
    },
  })

  if (req.method !== "POST") {
    return new Response("Only POST requests are allowed", { status: 405 })
  }
  const body = await req.formData()

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST'
  };

  try {
    await mailer.sendMail({
      from: body.get("from")?.toString() || Netlify.env.get("GMAIL_ADDRESS"),
      to: Netlify.env.get("TO_ADDRESSES")?.split(","),
      subject: body.get("subject")?.toString() || "[No subject]",
      html: body.get("message")?.toString() || "[No message]",
    })
    return new Response("Ok", { status: 200, ...headers })
  } catch (error) {
    return new Response("Error: " + error, { status: 500, ...headers })
  }
}