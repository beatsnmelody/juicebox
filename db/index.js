const { Client } = require('pg');

const client = new Client('postgres://localhost:5432/juicebox-dev');

async function createPost({
  authorId,
  title,
  content
}) {
  try {
    const result = await client.query(`
    INSERT INTO posts(authorId, title, content)
    VALUES ($1, $2, $3)
    ON CONFLICT (authorId) DO NOTHING 
    RETURNING *;
    `, [authorId, title, content]);

    return result
  } catch (error) {
    throw error;
  }
}

async function updatePost({id, ...fields}){
  const setString = Object.keys(fields)
  .map((key, index) => `"${key}"=$${index + 1}`)
  .join(", ");
// return early if this is called without fields
if (setString.length === 0) {
  return;
}
try {
  const {
    rows: [posts],
  } = await client.query(
    `
  UPDATE posts
  SET ${setString}
  WHERE id=${id}
  RETURNING *;
`,
    Object.values(fields)
  );

  return posts;
} catch (error) {
  console.log(error);
}
}

async function getAllPosts() {
  try {
    const { rows } = await client.query(
      `SELECT author, title, content
      FROM posts;
    `);
  
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getPostsByUser(userId) {
  try {
    const { rows } = await client.query(`
      SELECT * FROM posts
      WHERE "authorId"=${ userId };
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  console.log("Got user! AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", user)
  try {
    const {
      rows: [user],
    } = await client.query(`SELECT * FROM users WHERE id = $1`, [userId]);
  user.password = null;
  return user;
  } catch (error) {
    throw error;
  }
}


  async function createUser({ username, password, name, location }) {
    try {
      const result = await client.query(`
      INSERT INTO users(username, password, name, location)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
      `, [username, password, name, location]);

      return result
    } catch (error) {
      throw error;
    }
  }

  

  async function updateUser(id, fields = {}) {
    // build the set string
    const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
  
    // return early if this is called without fields
    if (setString.length === 0) {
      return;
    }
  
    try {
      const result = await client.query(`
        UPDATE users
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(fields));
  
      return result;
    } catch (error) {
      throw error;
    }
  }

  async function getAllUsers() {
    const { rows } = await client.query(
      `SELECT id, username, name, location, active 
      FROM users;
    `);
  
    return rows;
  }

  // later
module.exports = {
    client,
    createPost,
    updatePost,
    getAllPosts,
    getPostsByUser,
    getAllUsers,
    getUserById,
    createUser,
    updateUser
  }