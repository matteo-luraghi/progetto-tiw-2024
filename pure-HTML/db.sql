CREATE TABLE user(
  email varchar(320),
  password varchar(30) NOT NULL,
  name varchar(50) NOT NULL,
  surname varchar(50) NOT NULL,
  PRIMARY KEY (email)
);

CREATE TABLE group (
  id int AUTO_INCREMENT,
  title varchar(100) NOT NULL,
  creation_date DATE NOT NULL,
  duration int NOT NULL,
  min_participants int NOT NULL,
  max_participants int NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE contains (
  user_email varchar(320) REFERENCES user(email) ON UPDATE CASCADE ON DELETE NO ACTION,
  group_id int, REFERENCES group(id) ON UPDATE CASCADE ON DELETE NO ACTION,
  PRIMARY KEY(user_email, group_id)
);

CREATE TABLE created (
  user_email varchar(320) REFERENCES user(email) ON UPDATE CASCADE ON DELETE NO ACTION,
  group_id int, REFERENCES group(id) ON UPDATE CASCADE ON DELETE NO ACTION,
  PRIMARY KEY(user_email, group_id)
);
