import { Router } from 'express';
import users from '../../users.json';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const bcrypt = await import('bcrypt-ts');

    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: users.length + 1,
      email,
      name,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    users.push(newUser);

    const { sign } = await import('jsonwebtoken');

    const token = sign({ id: newUser.id }, process.env.JWT_SECRET!, {
      expiresIn: '1h'
    });
    res.status(201).setHeader('X-Auth-Token', token).json({ data: newUser });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    req.log.error(error.message);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(user => user.email === email);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { compare } = await import('bcrypt-ts');
  const isMatch = await compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  //create a token
  const jwt = await import('jsonwebtoken');
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '1h'
  });

  res.json({ token });
});

export default router;