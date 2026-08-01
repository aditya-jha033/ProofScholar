import { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma, redis } from './_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      // 1. Try Cache
      try {
        const cachedData = await redis.get<any>('contract_address_preview');
        if (cachedData && cachedData.address) {
          return res.status(200).json({ address: cachedData.address, minGpa: cachedData.minGpa, maxIncome: cachedData.maxIncome, source: 'cache' });
        }
      } catch(e) {
        console.warn('Redis Cache Miss/Error:', e);
      }

      // 2. Fetch from Neon DB
      const config = await prisma.contractConfig.findUnique({
        where: { network: 'preview' },
      });

      if (config) {
        // Cache it for 1 hour
        try {
          await redis.setex('contract_address_preview', 3600, { address: config.address, minGpa: config.minGpa, maxIncome: config.maxIncome });
        } catch(e) {}
        return res.status(200).json({ address: config.address, minGpa: config.minGpa, maxIncome: config.maxIncome, source: 'db' });
      }

      return res.status(404).json({ error: 'Contract address not found' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  if (req.method === 'POST') {
    const { address, minGpa, maxIncome } = req.body;
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    try {
      // Update DB
      const config = await prisma.contractConfig.upsert({
        where: { network: 'preview' },
        update: { address, minGpa, maxIncome },
        create: { network: 'preview', address, minGpa, maxIncome },
      });

      // Invalidate / Update Cache
      try {
        await redis.set('contract_address_preview', { address, minGpa, maxIncome });
      } catch(e) {}

      return res.status(200).json({ success: true, config });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
