import net from 'node:net';

function canReachLocalMongo() {
  return new Promise((resolve) => {
    const socket = net.connect({ host: '127.0.0.1', port: 27017 });
    const finish = (value) => {
      socket.destroy();
      resolve(value);
    };
    socket.setTimeout(1500);
    socket.on('connect', () => finish(true));
    socket.on('timeout', () => finish(false));
    socket.on('error', () => finish(false));
  });
}

export default async function handler(_req, res) {
  const reached = await canReachLocalMongo();
  res.setHeader('X-MongoDB', 'not-connected');
  res.status(200).json({
    apiLive: true,
    mongodbLive: false,
    cloudPortOpen: reached,
    database: 'daraz_shop',
    checked: '127.0.0.1:27017',
    site: 'daraz',
    message:
      'API Vercel par live hai. MongoDB live nahi hai. 127.0.0.1 Vercel ki machine hai, aapka laptop nahi. Products is link par project file se aa rahe hain, daraz_shop se nahi.',
  });
}
