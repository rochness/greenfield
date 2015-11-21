
exports.getMidPoint = function (users) {
  var longSum = 0;
  var latSum = 0;
  var totalUsers = 0;

  if(users === {}){
    return [];
  }

  for(var user in users) {
    longSum += users[user].longitude;
    latSum += users[user].latitude;
    totalUsers++;
  }

  return [latSum / totalUsers, longSum / totalUsers];
};