#!/bin/sh

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
echo "deb [ arch=amd64 ] http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
sudo apt-get update

sudo service mongod stop
sudo rm -r /var/log/mongodb
sudo rm -r /var/lib/mongodb

sudo apt-get install -y mongodb-org
sudo service mongod start

echo '
use admin
db.createUser({ user: "root",
  pwd: "root",
  roles: [
    "readWriteAnyDatabase",
    "clusterAdmin",
    "dbAdminAnyDatabase",
    "userAdminAnyDatabase"
  ],
   writeConcern: { w: "majority" , wtimeout: 5000 }
});

use borderline;
db.createUser({ user: "user",
  pwd: "user",
  roles: [
    "readWrite"
  ]
});
db.getUsers();
' | mongo localhost:27017/admin

echo "
security:
 authorization: enabled
" >> /etc/mongod.conf

sudo service mongod restart


