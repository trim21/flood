import fs from 'fs-extra';
import path from 'path';

import config from '../../../shared/config';
import Users from '../../models/Users';

const migration = () => {
  return Users.listUsers().then((users) => {
    return Promise.all(
      users.map((user) => fs.rm(path.join(config.dbPath, user._id, 'history'), {recursive: true})),
    ).catch(() => {
      // do nothing.
    });
  });
};

export default migration;
