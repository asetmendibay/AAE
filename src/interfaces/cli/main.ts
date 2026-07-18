/* eslint-disable no-console */
import { createDemoRuntime } from '../../composition/create-demo-runtime.js';
import { createLocalSmokeRuntime } from '../../composition/create-local-smoke-runtime.js';

export async function main(arguments_: readonly string[] = process.argv.slice(2)): Promise<void> {
  if (!arguments_.includes('--demo') && !arguments_.includes('--local-smoke')) {
    console.log('Usage: npm run start -- --demo | --local-smoke');
    return;
  }

  const result = arguments_.includes('--local-smoke')
    ? await createLocalSmokeRuntime().run({
        id: 'local-smoke-job',
        input: { expectedTitle: 'AAE Local Smoke' },
        timeoutMs: 15_000,
      })
    : await createDemoRuntime().run({
        id: 'demo-job',
        input: { message: 'AAE execution engine is running' },
        timeoutMs: 1_000,
      });

  console.log(
    JSON.stringify({ jobId: result.jobId, status: result.status, attempts: result.attempts }),
  );
}

if (process.argv[1]?.endsWith('/main.ts') === true) {
  main().catch((error: unknown): void => {
    console.error(error);
    process.exitCode = 1;
  });
}
