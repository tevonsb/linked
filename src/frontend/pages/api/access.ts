// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
// eslint-disable-next-line import/extensions
import LitJsSdk from 'lit-js-sdk/build/index.node.js';
import { Blob } from 'node:buffer';
import { v4 as uuidv4 } from 'uuid';

import { PrismaClient, link } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ link: string }>,
) {
  console.log(`entering handler`);
  if (req.method === `POST`) {
    const link = await prisma.link.findUnique({
      where: {
        id: req.body.id,
      },
    });
    if (!link) {
      res.status(404).end();
      return;
    }
    const litNodeClient = new LitJsSdk.LitNodeClient();
    await litNodeClient.connect();

    const symmetricKey = await litNodeClient.getEncryptionKey({
      accessControlConditions: link.condition,
      // Note, below we convert the encryptedSymmetricKey from a UInt8Array to a hex string.  This is because we obtained the encryptedSymmetricKey from "saveEncryptionKey" which returns a UInt8Array.  But the getEncryptionKey method expects a hex string.
      toDecrypt: link.encryptedKey, // Already converted to hex
      chain: `ethereum`,
      authSig: req.body.authSig,
    });

    const hexEncryptedString = link.encryptedLink;
    const encryptedUint8Array = Buffer.from(hexEncryptedString, `hex`);
    const encryptedString = new Blob([encryptedUint8Array]);
    try {
      const decryptedString = await LitJsSdk.decryptString(
        encryptedString,
        symmetricKey,
      );
      await prisma.linkAccess.create({
        data: {
          id: uuidv4(),
          linkId: link.id,
          accessOutcome: `success`,
          accessAddress: req.body.authSig.address,
        };
      });
      res.json({ link: decryptedString });
    } catch (e) {
      await prisma.linkAccess.create({
        data: {
          id: uuidv4(),
          linkId: link.id,
          accessOutcome: `failed`,
          accessAddress: req.body.authSig.address
        }
      });
      res.status(401).end();
    }

  }
}
