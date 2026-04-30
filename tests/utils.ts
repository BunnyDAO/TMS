import { fetchDiscoveryReport } from '../sources/discovery_report.ts';

async function loadTestDiscoveryReport(): Promise<DiscoveryReport> {
  return await fetchDiscoveryReport();
}

export async function assertDiscoveryReport(testCase: DiscoveryReport): Promise<void> {
  // Assert that the discovery report is correct
  expect(testCase.candidates).toEqual([
    { name: 'Euler V2', url: 'https://euler.v2.com' },
    { name: 'Pendle', url: 'https://pendle.finance' },
    // Add more expected candidates here
  ]);
  expect(testCase.categories).toEqual(['DeFi', 'RWA', 'Solana Ecosystem']);
  expect(testCase.noise).toEqual([
    'Meme Token 1',
    'Meme Token 2',
    'https://generic-github-repo.com',
  ]);
}