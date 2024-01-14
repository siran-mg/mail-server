import express, { Router } from "express"
import bodyParser from "body-parser"
import nodemailer from "nodemailer"
import 'dotenv/config'
import serverless from "serverless-http";

const app = express()
app.use(bodyParser.urlencoded())

const router = Router();
app.use("/api/", router);

const contactAddresses = process.env.TO?.split(",")

const mailer = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_ADDRESS,
    pass: process.env.GMAIL_PASSWORD,
  },
})

router.post("/contact", function (req, res) {
  mailer.sendMail(
    {
      from: req.body.from,
      to: contactAddresses,
      subject: req.body.subject || "[No subject]",
      html: req.body.message || "[No message]",
    },
    function (err, info) {
      if (err) return res.status(500).send(err)
      res.json({ success: true })
    }
  )
})

export const handler = serverless(app);