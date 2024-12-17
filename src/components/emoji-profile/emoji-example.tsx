"use client";

import { Trans } from "@lingui/macro"
import EmojiSectionTitle from "./emoji-section-title"
import React from "react"

interface EmojiExampleProps {
  examples: string
}

const EmojiExample: React.FC<EmojiExampleProps> = React.memo(({ examples }) => {
  const exampleList = React.useMemo(() => examples.split(/[\n\t]+/), [examples])

  return (
    <section className="relative mb-16 text-center">
      <EmojiSectionTitle>
        <Trans>使用示例</Trans>
      </EmojiSectionTitle>

      <div className="mt-4 max-w-2xl mx-auto">
        {exampleList.map((example: string, index: number) => (
          <div key={index} className="mb-4 p-4 border-l-4 border-blue-400 bg-gray-50 rounded-lg shadow-md hover:shadow-lg">
            <p className="text-md font-medium text-gray-800">{example}</p>
          </div>
        ))}
      </div>
    </section>
  )
})

EmojiExample.displayName = 'EmojiExample';

export default EmojiExample