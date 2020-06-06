import express from 'express';
import { UserFields } from '../../orm/models/user';
import { signin, signup } from '../../auth/auth';

const router = express.Router();

router.post('/signin', async (req, res) => {
  if (req.session?.user) {
    return res.status(200).json({
      message: 'success',
    });
  }

  const { username, password } = req.body;

  try {
    const ret = await signin({ username, password });

    if (req.session) {
      req.session.user = { id: ret.id, user_type: ret.user_type };
    }

    return res.status(200).json({
      user_id: ret.id,
    });
  } catch ({ message }) {
    return res.status(401).json({
      error: message,
    });
  }
});

router.post('/signup', async (req, res) => {
  if (req.session?.user) {
    return res.status(400).json({
      error: 'logout required',
    });
  }

  try {
    const ret = await signup(req.body as UserFields);

    if (req.session) {
      req.session.user = { id: ret.id, user_type: ret.user_type };
    }

    return res.status(200).json({
      user_id: ret.id,
    });
  } catch ({ message }) {
    return res.status(400).json({
      message,
    });
  }
});

router.post('/signout', async (req, res) => {
  req.session?.destroy((err) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
    return res.status(200).json({
      message: 'logout success',
    });
  });
});

export default router;
