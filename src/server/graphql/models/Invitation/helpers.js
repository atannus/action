import r from 'server/database/rethinkDriver';
import ms from 'ms';
import sendEmailPromise from 'server/email/sendEmail';
import makeAppLink from 'server/utils/makeAppLink';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import promisify from 'es6-promisify';

const INVITE_TOKEN_INVITE_ID_LEN = 6;
const INVITE_TOKEN_KEY_LEN = 8;
const INVITE_TOKEN_KEY_HASH_ROUNDS = parseInt(process.env.INVITE_TOKEN_KEY_HASH_ROUNDS, 10) || 10;

const hash = promisify(bcrypt.hash);
const compare = promisify(bcrypt.compare);

const asciiAlphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';
const randomSafeString = (length = 8, chars = asciiAlphabet) => {
  const randomBytes = crypto.randomBytes(length);
  const result = new Array(length);
  let cursor = 0;
  for (let i = 0; i < length; i++) {
    cursor += randomBytes[i];
    result[i] = chars[cursor % chars.length];
  }
  return result.join('');
};

export const makeInviteToken = () =>
  `${randomSafeString(INVITE_TOKEN_INVITE_ID_LEN)}${randomSafeString(INVITE_TOKEN_KEY_LEN)}`;

export const parseInviteToken = (uriTokenString) => ({
  id: uriTokenString.slice(0, INVITE_TOKEN_INVITE_ID_LEN),
  key: uriTokenString.slice(INVITE_TOKEN_INVITE_ID_LEN)
});

export const hashInviteTokenKey = async (uriTokenString) => {
  const {key} = parseInviteToken(uriTokenString);
  return await hash(key, INVITE_TOKEN_KEY_HASH_ROUNDS);
};

export const validateInviteTokenKey = async (key, hashStringToCompare) =>
  await compare(key, hashStringToCompare);

export const getInviterInfoAndTeamName = async(teamId, userId) => {
  /**
   * (1) Fetch user email and picture link from CachedUser.
   * (2) Rename fields to match TeamInvite email props
   * (3) Join 'UserProfile' to fetch preferredName as inviterName
   * (4) Join Team.name by using teamId as teamName
   */
  return await r.table('CachedUser').get(userId)
    .pluck('id', 'email', 'picture')
    .merge((doc) => ({
      inviterAvatar: doc('picture'),
      inviterEmail: doc('email'),
      inviterName: r.table('UserProfile').get(doc('id'))
        .pluck('preferredName')('preferredName'),
      teamName: r.table('Team').get(teamId)
        .pluck('name')('name'),
    }));
};

// can't use Promise.all because we want to try n+1, even if n was an error. we're not quitters!
export const resolveSentEmails = async (sendEmailPromises, inviteesWithTokens) => {
  const inviteeErrors = [];
  const inviteesToStore = [];
  for (let i = 0; i < sendEmailPromises.length; i++) {
    const promise = sendEmailPromises[i];
    const invitee = inviteesWithTokens[i];
    const resolvedPromise = await promise;
    const arrayToFill = resolvedPromise ? inviteesToStore : inviteeErrors;
    arrayToFill.push(invitee);
  }
  return {inviteeErrors, inviteesToStore};
};

export const makeInvitationsForDB = async(invitees, teamId) => {
  const now = new Date();
  const tokenExpiration = now.valueOf() + ms('30d');
  const hashPromises = invitees.map(invitee => hashInviteTokenKey(invitee.inviteToken));
  const hashedTokens = await Promise.all(hashPromises);
  return invitees.map((invitee, idx) => {
    const {email, inviteToken, task, fullName} = invitee;
    const {id} = parseInviteToken(inviteToken);
    return {
      id,
      teamId,
      createdAt: now,
      isAccepted: false,
      fullName,
      email,
      task,
      tokenExpiration,
      hashedToken: hashedTokens[idx]
    };
  });
};

export const createEmailPromises = (inviterInfoAndTeamName, inviteesWithTokens) => {
  return inviteesWithTokens.map(invitee => {
    const emailProps = {
      ...inviterInfoAndTeamName,
      inviteeEmail: invitee.email,
      firstProject: invitee.task,
      inviteLink: makeAppLink(`invitation/${invitee.inviteToken}`)
    };
    return sendEmailPromise(emailProps.inviteeEmail, 'teamInvite', emailProps);
  });
};
