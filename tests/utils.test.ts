import { assertDiscoveryReport } from './utils.ts';

describe('Discovery Report', () => {
  it('should return the correct discovery report', async () => {
    const testCase = await loadTestDiscoveryReport();
    await assertDiscoveryReport(testCase);
  });
});