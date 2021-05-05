import fetch from 'node-fetch'

import * as core from '@actions/core'

async function run(): Promise<void> {
  try {
    const SLACK_BOT_ACCESS_TOKEN = core.getInput('slack-bot-access-token')
    const channel = core.getInput('channel')
    const text = core.getInput('text')
    const thread_ts = core.getInput('thread_ts') || undefined

    await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SLACK_BOT_ACCESS_TOKEN}`,
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        channel,
        text,
        thread_ts
      })
    })

    core.debug('Message sent.')
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
