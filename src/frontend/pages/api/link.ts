// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

import { PrismaClient, link } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<link[] | link>,
) {
  console.log(`entering handler`);
  if (req.method === `GET`) {
    console.log(`GET request`);
    // get all todos
    const link = await prisma.link.findMany();
    res.json(link);
  } else if (req.method === `POST`) {
    console.log(req.body);
    const requestorAddress = req.body.authSig.address;

    let address = await prisma.address.findUnique({
      where: {
        address: requestorAddress,
      },
    });
    console.log(address);
    if (!address) {
      const user = await prisma.user.create({ data: { id: uuidv4() } });
      address = await prisma.address.create({
        data: {
          id: uuidv4(),
          userId: user.id,
          address: requestorAddress,
          chain: `ethereum`,
        },
      });
    }

    const newLink = {
      id: uuidv4(),
      encryptedLink: req.body.encryptedLink,
      encryptedKey: req.body.encryptedKey,
      condition: req.body.condition,
      creatorAddress: address.address,
      creatorId: address.userId,
    };
    console.log(`New link incloming!`, newLink);
    const link = await prisma.link.create({
      data: newLink,
    });
    console.log(link);
    res.json(link);
  }
}
