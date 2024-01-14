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
  
  mailer.sendMail(
    {
      from: body.get("from")?.toString() || Netlify.env.get("GMAIL_ADDRESS"),
      to: Netlify.env.get("TO_ADDRESSES")?.split(","),
      subject: body.get("subject")?.toString() || "[No subject]",
      html: body.get("message")?.toString() || "[No message]",
    },
    function (err, info) {
      if (err) {
        return new Response("Error: " + err, { status: 500 })
      }
      return new Response()
    }
  )
  return new Response("Hello, world!", { status: 500 })
}