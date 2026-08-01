import { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma, redis } from './_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { address } = req.query;

  if (!address || typeof address !== 'string') {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  if (req.method === 'GET') {
    try {
      // 1. Check Redis Cache
      try {
        const cachedStatus = await redis.get<any>(`verify_${address}`);
        if (cachedStatus) {
          return res.status(200).json({ data: cachedStatus, source: 'cache' });
        }
      } catch(e) {
        console.warn('Redis error', e);
      }

      // 2. Check Neon DB
      const record = await prisma.verificationCache.findUnique({
        where: { walletAddress: address },
      });

      if (record) {
        // Cache it for a day
        try {
          await redis.setex(`verify_${address}`, 86400, record);
        } catch(e) {}
        return res.status(200).json({ data: record, source: 'db' });
      }

      return res.status(404).json({ error: 'Not verified yet' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  if (req.method === 'POST') {
    const { status, txId } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    try {
      // Update DB
      const record = await prisma.verificationCache.upsert({
        where: { walletAddress: address },
        update: { status, txId, timestamp: new Date() },
        create: { walletAddress: address, status, txId },
      });

      // Update Cache
      try {
        await redis.setex(`verify_${address}`, 86400, record);
      } catch(e) {}

      return res.status(200).json({ success: true, record });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
