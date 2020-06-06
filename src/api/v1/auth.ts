import express from 'express';
import { UserFields } from '../../orm/models/user';
import { signin, signup } from '../../auth/auth';

const router = express.Router();

router.post('/signin', async (req, res) => {
  if (req.session?.isLoggedIn) {
    return res.status(200).json({
      message: 'success',
    });
  }

  const { username, password } = req.body;

  try {
    const ret = await signin({ username, password });

    if (req.session) {
      req.session.isLoggedIn = true;
      req.session.user = { id: ret.id, user_type: ret.user_type };
    }

    return res.status(200).json({
      message: 'success',
    });
  } catch ({ code, message }) {
    return res.status(400).json({
      code,
      message,
    });
  }
});

router.post('/signup', async (req, res) => {
  if (req.session?.isLoggedIn) {
    return res.status(400).json({
      message: 'logout required',
    });
  }

  try {
    const ret = await signup(req.body as UserFields);

    if (req.session) {
      req.session.user = { id: ret.id, user_type: ret.user_type };
    }

    return res.status(200).json({
      status: 200,
      message: 'success',
      data: {
        user_id: ret.id,
      },
    });
  } catch ({ code, message }) {
    return res.status(400).json({
      code,
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