import nodemailer from "nodemailer"

export default async (req, context) => {
  const mailer = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: Netlify.env.get("GMAIL_ADDRESS"),
      pass: Netlify.env.get("GMAIL_PASSWORD"),
    },
  })

  const body = JSON.parse(req.body)
  
  mailer.sendMail(
    {
      from: body.from,
      to: Netlify.env.get("TO_ADDRESSES")?.split(","),
      subject: body.subject || "[No subject]",
      html: body.message || "[No message]",
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