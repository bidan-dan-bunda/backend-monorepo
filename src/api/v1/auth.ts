import { ErrorMessages, NonErrorMessages } from './../constants';
import express from 'express';
import { UserFields } from '../../orm/models/user';
import { signin, signup } from '../../auth/auth';

const router = express.Router();

router.post('/signin', async (req, res) => {
  if (req.session?.user) {
    return res.status(205).json({
      message: ErrorMessages.ALREADY_LOGGED_IN,
    });
  }

  const { username, password } = req.body;

  try {
    const ret = await signin({ username, password });

    if (req.session) {
      req.session.user = { id: ret.id, user_type: ret.user_type };
    }

    return res.status(200).json({
      data: {
        user_id: ret.id,
      },
    });
  } catch ({ message, code }) {
    return res.status(401).json({
      code,
      message,
    });
  }
});

router.post('/signup', async (req, res) => {
  if (req.session?.user) {
    return res.status(205).json({
      message: ErrorMessages.LOGOUT_REQUIRED,
    });
  }

  try {
    const ret = await signup(req.body as UserFields);

    if (req.session) {
      req.session.user = { id: ret.id, user_type: ret.user_type };
    }

    return res.status(200).json({
      data: {
        user_id: ret.id,
      },
    });
  } catch ({ message, code }) {
    return res.status(400).json({
      message,
      code,
    });
  }
});

router.post('/signout', async (req, res) => {
  if (!req.session?.user) {
    return res.status(205).json({
      message: ErrorMessages.NOT_LOGGED_IN,
    });
  }

  req.session?.destroy((err) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
    return res.status(200).json({
      message: NonErrorMessages.LOGOUT_SUCCESSFUL,
    });
  });
});

export default router;
