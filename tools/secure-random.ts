import crypto from 'crypto';
import base64url from 'base64url';

crypto.randomBytes(48, (err, buff) => {
  console.log(base64url(buff));
});
