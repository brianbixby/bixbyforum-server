## users
 id (primary key)
 user_name
 first_name
 last_name
 email
 interests
 profile_picture
 role
 created_on (date/time)
 last_login (date/time)
 comment_count
 
##comments
 id (primary key)
 content
 created_on (date/time)
 creator (foreign key)
 thread_parent (foreign key)
 subforum_parent (foreign key)

 ##threads
 id (primary key)
 title
 creator (foreign key)
 subforum_parent (foreign key)
 created_on (date/time)
 comment_count
 view_count
 last_comment (foreign key)
 background_picture

 ##subfora
 id (primary key)
 title
 subtitle
 category
 thread_count
 comment_count
 last_comment
 background_picture

 ##db commands
 CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  user_name VARCHAR(50) NOT NULL UNIQUE,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(50) UNIQUE,
  interests TEXT,
  profile_picture VARCHAR(500),
  role VARCHAR(50),
  created_on TIMESTAMP NOT NULL,
  last_login TIMESTAMP,
  comment_count INTEGER
);

CREATE TABLE subfora (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL UNIQUE,
  subtitle VARCHAR(255),
  category VARCHAR(255),
  thread_count INTEGER,
  comment_count INTEGER,
  last_comment INTEGER,
  background_picture VARCHAR(500)
);

CREATE TABLE threads (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  created_on TIMESTAMP NOT NULL,
  comment_count INTEGER,
  view_count INTEGER,
  background_picture VARCHAR(500),
  creator INTEGER REFERENCES users(id),
  subforum_parent INTEGER REFERENCES subfora(id),
  last_comment INTEGER REFERENCES comments(id)
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  created_on TIMESTAMP NOT NULL,
  creator INTEGER REFERENCES users(id),
  thread_parent INTEGER REFERENCES threads(id),
  subforum_parent INTEGER REFERENCES subfora(id) 
);

CREATE TABLE threads (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  created_on TIMESTAMP NOT NULL,
  comment_count INTEGER,
  view_count INTEGER,
  background_picture VARCHAR(500),
  creator INTEGER REFERENCES users(id),
  subforum_parent INTEGER REFERENCES subfora(id),
  last_comment INTEGER
);

ALTER TABLE threads
      ADD FOREIGN KEY (last_comment) 
      references comments (id);

ALTER TABLE subfora
      ADD FOREIGN KEY (last_comment) 
      references comments (id);

heroku pg:reset -a bixbyforum-server-staging
heroku pg:push bixbyforum DATABASE_URL --app bixbyforum-server-staging

heroku pg:reset -a bixbyforum-server 
heroku pg:push bixbyforum DATABASE_URL --app bixbyforum-server