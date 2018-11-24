import React from 'react'

const Note = ({ note, deleteNote }) => {
  const label = 'poista'
  return (
    <li className> <h2>{note.title}</h2>author: {note.author}<p>url: {note.url}</p><p>likes: {note.likes}</p><button onClick={deleteNote}>{label}</button> </li>
  )

}

export default Note