import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { config } from "@/lib/config"

const requestSchema = z.object({
  subject: z.string().min(3, "Subject must be at least 3 characters").max(255),
  requirements: z
    .string()
    .min(10, "Please describe your task with at least 10 characters")
    .max(10000),
  spreadsheetType: z.string().min(1, "Please select your spreadsheet type & version"),
  urgencyLevel: z.string().min(1, "Please select an urgency level"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please provide a valid email address"),
  country: z.string().optional().default(""),
  preferredContact: z.string().min(1, "Please select a preferred contact method"),
  contactHandle: z.string().optional().default(""),
  budgetRange: z.string().optional().default("Not specified"),
  serviceCategory: z.string().optional().default("Spreadsheet Solution"),
  cloudLink: z.string().optional().default(""),
})

export type ServiceRequestInput = z.infer<typeof requestSchema>

function generateTicketId(): string {
  const num = Math.floor(100000 + Math.random() * 900000)
  return `#EI-${num}`
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") ?? ""
    let rawData: Record<string, unknown> = {}
    let uploadedFile: File | null = null

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData()
      for (const [key, value] of formData.entries()) {
        if (key === "file" && value instanceof File && value.size > 0) {
          uploadedFile = value
        } else if (typeof value === "string") {
          rawData[key] = value
        }
      }
    } else {
      rawData = (await request.json().catch(() => ({}))) as Record<string, unknown>
    }

    const validation = requestSchema.safeParse(rawData)
    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors
      return NextResponse.json(
        { ok: false, error: "VALIDATION_FAILED", details: errors },
        { status: 400 }
      )
    }

    const data = validation.data
    const ticketId = generateTicketId()
    const now = new Date()

    // 1. Prepare Discord Rich Embed
    const discordEmbed = {
      title: `📋 New Service Request: ${data.subject}`,
      description:
        data.requirements.length > 1500
          ? `${data.requirements.slice(0, 1497)}...`
          : data.requirements,
      color: 0x059669, // Brand emerald green
      fields: [
        { name: "🎫 Ticket Reference", value: ticketId, inline: true },
        { name: "🏷️ Service Category", value: data.serviceCategory || "General Solution", inline: true },
        { name: "⚡ Urgency", value: data.urgencyLevel, inline: true },
        { name: "👤 Client Name", value: data.name, inline: true },
        { name: "✉️ Email Address", value: data.email, inline: true },
        { name: "🌍 Country", value: data.country || "Not specified", inline: true },
        {
          name: "📱 Preferred Contact",
          value: data.contactHandle
            ? `${data.preferredContact} (${data.contactHandle})`
            : data.preferredContact,
          inline: true,
        },
        { name: "💰 Budget Range", value: data.budgetRange || "Not specified", inline: true },
        { name: "📊 Spreadsheet Type", value: data.spreadsheetType, inline: true },
      ],
      footer: {
        text: `Excel Insider Orders • ${ticketId}`,
      },
      timestamp: now.toISOString(),
    }

    if (data.cloudLink) {
      discordEmbed.fields.push({
        name: "🔗 Cloud Spreadsheet Link",
        value: data.cloudLink,
        inline: false,
      })
    }

    if (uploadedFile) {
      discordEmbed.fields.push({
        name: "📎 Attached Spreadsheet",
        value: `${uploadedFile.name} (${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)`,
        inline: false,
      })
    }

    // 2. Dispatch to Discord Webhook
    const DEFAULT_DISCORD_WEBHOOK_URL =
      "https://discord.com/api/webhooks/1556008065977942076/9yqS9fTDdkiYAB6jLRqCk_zhlr5IGOueeGvqKFEVBuunAB0q7pfWKuTAEvdYiQsioAJ9"
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL || DEFAULT_DISCORD_WEBHOOK_URL

    if (webhookUrl && webhookUrl.trim().startsWith("http")) {
      try {
        if (uploadedFile && uploadedFile.size <= 25 * 1024 * 1024) {
          const discordFormData = new FormData()
          discordFormData.append(
            "payload_json",
            JSON.stringify({
              username: "Excel Insider Concierge",
              avatar_url: `${config.siteUrl}/icon-512.png`,
              embeds: [discordEmbed],
            })
          )
          discordFormData.append("files[0]", uploadedFile, uploadedFile.name)

          const res = await fetch(webhookUrl, {
            method: "POST",
            body: discordFormData,
          })

          if (!res.ok) {
            console.error(
              `[Discord Webhook] Failed with status ${res.status}:`,
              await res.text()
            )
          }
        } else {
          const res = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: "Excel Insider Concierge",
              avatar_url: `${config.siteUrl}/icon-512.png`,
              embeds: [discordEmbed],
            }),
          })

          if (!res.ok) {
            console.error(
              `[Discord Webhook] Failed with status ${res.status}:`,
              await res.text()
            )
          }
        }
      } catch (webhookErr) {
        console.error("[Discord Webhook] Exception during dispatch:", webhookErr)
      }
    } else {
      console.log(
        "[Discord Webhook] DISCORD_WEBHOOK_URL is not set. Payload preview:\n",
        JSON.stringify(discordEmbed, null, 2)
      )
    }

    // 3. Forward to backend database for audit/contact persistence if reachable
    try {
      await fetch(`${config.apiUrl}/api/v1/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          subject: `[${ticketId}] ${data.subject}`,
          service: data.serviceCategory,
          message: `Client: ${data.name} (${data.email})
Contact Method: ${data.preferredContact} ${data.contactHandle ? `(${data.contactHandle})` : ""}
Country: ${data.country || "N/A"}
Budget: ${data.budgetRange}
Urgency: ${data.urgencyLevel}
Platform: ${data.spreadsheetType}
${data.cloudLink ? `Cloud Link: ${data.cloudLink}\n` : ""}${uploadedFile ? `Attached File: ${uploadedFile.name}\n` : ""}
Requirements:
${data.requirements}`,
        }),
      }).catch(() => null)
    } catch {
      // Backend may be offline in dev, ignore failure
    }

    return NextResponse.json({
      ok: true,
      ticketId,
      message: "Your request has been received! Our team will reach out shortly.",
    })
  } catch (error) {
    console.error("[Service Request API] Internal error:", error)
    return NextResponse.json(
      { ok: false, error: "INTERNAL_SERVER_ERROR", message: "Failed to process request." },
      { status: 500 }
    )
  }
}
