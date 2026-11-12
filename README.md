# DevPulse

A lightweight, open-source HTTP endpoint health checker and JSON reporter.

> Early development: this is a small, dependency-light starter. It is not yet a hosted monitoring service.

## Requirements

- Node.js 20+
- npm

## Install and run

```bash
npm install
npm run build
node dist/cli.js https://example.com https://httpbin.org/status/204
```

Or run directly during development:

```bash
npm run dev -- https://example.com
```

## Example output

```json
{
  "checkedAt": "2026-11-12T12:00:00.000Z",
  "summary": { "total": 1, "up": 1, "down": 0 },
  "results": [
    {
      "url": "https://example.com",
      "ok": true,
      "status": 200,
      "durationMs": 123
    }
  ]
}
```

## Library usage

```ts
import { checkEndpoint } from './dist/index.js';

const result = await checkEndpoint('https://example.com', {
  timeoutMs: 5000
});
console.log(result);
```

## Development

```bash
npm test
npm run check
npm run build
```

## Roadmap

- [x] Single endpoint HTTP check
- [x] Multiple URL CLI
- [x] Timeout and JSON report
- [ ] Config file (`devpulse.json`)
- [ ] Expected status-code assertions
- [ ] Retry policy
- [ ] HTML report
- [ ] Scheduled monitoring and history storage
- [ ] GitHub Actions integration

## Contributing

Issues and pull requests are welcome. Keep changes focused, add tests for behavior changes, and explain how you validated them.

## License

MIT.
