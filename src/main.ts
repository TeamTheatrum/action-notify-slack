import fetch from 'node-fetch'

import * as core from '@actions/core'

interface SlackResponse {
  ok: boolean
  error: string
}

function isUnknownObject(
  value: unknown
): value is {[key in PropertyKey]: unknown} {
  return value !== null && typeof value === 'object'
}

function isSlackResponse(value: unknown): value is SlackResponse {
  if (
    isUnknownObject(value) &&
    typeof value === 'object' &&
    (('ok' in value && typeof value.ok === 'boolean') ||
      ('error' in value && typeof value.error === 'string'))
  ) {
    return true
  }
  return false
}

async function run(): Promise<void> {
  try {
    const SLACK_BOT_ACCESS_TOKEN = core.getInput('slack-bot-access-token')
    const channel = core.getInput('channel')
    const text = core.getInput('text')
    const thread_ts = core.getInput('thread_ts') || undefined
    const username = core.getInput('username') || undefined
    const icon_url = core.getInput('icon_url') || undefined

    // API Reference: https://api.slack.com/methods/chat.postMessage
    const result = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SLACK_BOT_ACCESS_TOKEN}`,
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        channel,
        text,
        thread_ts,
        username,
        icon_url
      })
    })

    if (!result.ok) {
      throw new Error(`Failed: ${result.status}, ${result.statusText}`)
    }

    const resp = await result.json()

    if (!isSlackResponse(resp)) {
      throw new Error(`Received invalid response: ${JSON.stringify(resp)}`)
    }

    if (resp.ok) {
      core.debug(`Message successfully sent to channel: ${channel}`)
    } else {
      throw new Error(resp.error)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
