const db = require('../../data/dbConfig.js')


function getAll() {
  return db('hobbits')
}

function getById(id) {
  return null
}

async function insert(hobbit) {
  return null
}

async function update(id, changes) {
  return null
}

function remove(id) {
  return null
}


module.exports = {
  insert,
  update,
  remove,
  getAll,
  getById,
}