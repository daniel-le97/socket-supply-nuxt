import extension from 'socket:extension'
import process from 'socket:process'
import path from 'socket:path'
import test from 'socket:test'
import fs from 'socket:fs/promises'
export default defineNuxtPlugin(async(nuxtApp) => {
  //   const sqlite = await extension.load("sqlite3")
  //   const databasePath = process.cwd() + path.sep + 'data.db'
  //   const { err:loadError, data: db } = await sqlite.binding.open({ path: databasePath })

  //   if (loadError) {
  //     console.error(loadError)
  //     return
  //   }

  //  const query = `
  //   CREATE TABLE IF NOT EXISTS users (
  //     id INTEGER PRIMARY KEY AUTOINCREMENT,
  //     name NVARCHAR NOT NULL
  //   );
  // `

  // const { err } = await sqlite.binding.exec({ query, id: db.id })

  //   if (err) {
  //       console.error(err)
  //       return
  //   }
})
