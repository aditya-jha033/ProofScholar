import { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma, redis } from './_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      // 1. Try Cache
      try {
        const cachedAddress = await redis.get<string>('contract_address_preview');
        if (cachedAddress) {
          return res.status(200).json({ address: cachedAddress, source: 'cache' });
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
          await redis.setex('contract_address_preview', 3600, config.address);
        } catch(e) {}
        return res.status(200).json({ address: config.address, source: 'db' });
      }

      return res.status(404).json({ error: 'Contract address not found' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  if (req.method === 'POST') {
    const { address } = req.body;
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    try {
      // Update DB
      const config = await prisma.contractConfig.upsert({
        where: { network: 'preview' },
        update: { address },
        create: { network: 'preview', address },
      });

      // Invalidate / Update Cache
      try {
        await redis.set('contract_address_preview', address);
      } catch(e) {}

      return res.status(200).json({ success: true, config });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
