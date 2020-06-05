import express from 'express';
import { UserFields } from '../../orm/models/user';
import { signin, signup } from '../../auth/auth';
import passport from 'passport';

const router = express.Router();

router.post('/signin', passport.authenticate('local'), async (req, res) => {
  // const { username, password } = req.user as any;
  return res.json(req.user);
});

router.post('/signup', async (req, res) => {
  await signup(req.body as UserFields);
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
