const users = [];

function userJoin(socketId, name, email) {
  const data = { socketId, name, email };
  const _user = users.find((user) => user.socketId == socketId);
  if (_user) {
    return _user;
  }
  users.push(data);
  return data;
}

function userLeave(socketId) {
  const idx = users.findIndex((user) => user.socketId == socketId);
  if (idx != -1) return users.splice(idx, 1)[0];
}

function getEmailUsers(email) {
    return users.filter(user => user.email == email)
}

function getCurrentUser(socketId) {
  return users.find((user) => user.socketId == socketId);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getEmailUsers
};
