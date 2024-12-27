import React from "react";

const HeadIco = () => {
  return <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>🤖</text></svg>" />
}

HeadIco.displayName = "HeadIco";

export default React.memo(HeadIco);