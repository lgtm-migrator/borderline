
module.exports.adminPrivileges = function(req, res, next) {
    if (req.user && req.user.admin === true) {
        next();
        return;
    }
    res.status(403);
    res.json({ error: 'Permission denied' });
};

module.exports.userPrivileges = function(req, res, next) {
    if (req.user && req.user.id === req.params.user_id) {
        next();
        return;
    }
    res.status(403);
    res.json({ error: 'Permission denied' });
};

module.exports.userOrAdminPrivileges = function(req, res, next) {
  if (req.user && req.user.id === req.params.user_id) {
      next();
      return;
  }
  if (req.user && req.user.admin === true) {
      next();
      return;
  }
  res.status(403);
  res.json({ error: 'Permission denied' });
};
