import React from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import noteService from './services/notes'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      notes:[],
      newHeader: 'new title...',
      newText: 'new author..',
      newUrl: 'new url..',
      like:'',
      showOne:'true',
      showAll:'true',
      error: null,
      notification: null
    }
    }

  componentDidMount() {
    noteService
      .getAll()
      .then(response => {
        this.setState({ notes: response })
      })
  }

  addNote = (event) => {
    event.preventDefault()
    const noteObject = {
    title: this.state.newHeader,
    author: this.state.newText,
    url: this.state.newUrl, //new Date().toISOString(),
    likes:this.state.like
  //  important: Math.random() > 0.5,
    }
    if (this.includesNote()){
      const note = this.findNote();
   
       if(window.confirm(note.title +" blogikirjoitus on jo luotu, haluatko muokata tykkäyksiä")) {
         noteService
                        .update(note.id, noteObject)
                        .then(response => {
                            this.setState({
                                notes: this.state.notes.map(p => p.id !== note.id ? p : noteObject),
                                newHeader: '',
                                newText:'',
                                newUrl: '',
                                like:'',
                                notification: `Blogikirjoituksen '${noteObject.title}'päivitys onnistui!`
             })
   
             setTimeout(() => {
               this.setState({notification: null})
             }, 5000)
           })
           .catch(error => {
             this.setState({
                         error: `henkilö '${noteObject.title}' on jo valitettavasti poistettu palvelimelta`,
                         notes: this.state.notes.filter(n => n.id !==note.id)
                       })
                       setTimeout(() => {
                         this.setState({error: null})
                       }, 5000)
                     })
     }
       }


       else{
    noteService
      .create(noteObject)
      .then(NewHeader => {
        this.setState({

          notes: this.state.notes.concat(NewHeader),
          newHeader: '',
          newText: '',
          newUrl: '',
          like: '',
          notification: `lisättiin '${noteObject.title}'`
        })
        setTimeout(() => {
          this.setState({notification: null})
        }, 5000)
        })
  }
}
includesNote = () => {

  const noter = this.state.notes.map(note => note.title.toLowerCase());

  if (noter.includes(this.state.newHeader.toLowerCase())) {
      return true;
  } else {
      return false;
  }
}

findNote = () => {
  let p = this.state.notes.find(note => note.title.toLowerCase() === this.state.newHeader.toLowerCase())

  if (p) {
      return p;
  } else {
      return false;
  }
}



  deleteNote = (id) => {
    return () => {
        const note = this.state.notes.find(n => n.id === id)

  if(window.confirm("Poistetaanko " +note.title+ "?")) {
      noteService
        .deleteOne(id)
        .then(changedNote => {
            const notes= this.state.notes.filter(n => n.id !== id)
            this.setState({
              notes: notes,
              notification: `blogi kirjoituksen '${note.title}' poisto palvelimelta onnistui`
              })
              setTimeout(() => {
                this.setState({notification: null})
              }, 5000)
        })
        .catch(error => {
          this.setState({
                      error: `blogikirjoitus '${note.title}' on jo  poistettu palvelimelta`,
                      notes: this.state.notes.filter(n => n.id !== id)
                    })
                    setTimeout(() => {
                      this.setState({error: null})
                    }, 5000)
                  })
              }
    }
  }

  handleHeadChange = (event) => {
    console.log(event.target.value)
    this.setState({ newHeader: event.target.value })
  }
  handleTextChange = (event) => {
    console.log(event.target.value)
    this.setState({ newText: event.target.value })
  }
  handleUrlChange = (event) => {
    console.log(event.target.value)
    this.setState({ newUrl: event.target.value })
  }

  handleLikeChange = (event) => {
    console.log(event.target.value)
    this.setState({ like: event.target.value })
  }

  render() {
    const notesToDelete =
    this.state.showAll ?
    this.state.notes :
    this.state.notes.filter(note => note.important === true)

  return (
    <div>
              <h1>Blogi</h1>

              <form onSubmit={this.addNote}>

              <div>
                <h2>Lisää uusi kirjoitus</h2>
                Title:<input value ={this.state.newHeader} onChange={this.handleHeadChange}/>
              </div>

              <div>
                Author:
              <input value ={this.state.newText} onChange={this.handleTextChange}/>
              </div>

              <div>
                Url:
              <input value ={this.state.newUrl} onChange={this.handleUrlChange}/>
              </div>

              <div>
                likes:
              <input value ={this.state.like} onChange={this.handleLikeChange}/>
              </div>

              <div>
                <button type="submit">lisää</button>
              </div>
            </form>


            <h2>Blogi kirjoitukset</h2>
            <Notification message={this.state.error}/>
            <Notification message={this.state.notification}/>

      <ul>
      {notesToDelete.map(note =>
    <Note
      key={note.id}
      note={note}
    deleteNote={this.deleteNote(note.id)}
    />
  )}
   </ul>
  </div>
  )
}
}


// class App extends React.Component {
//   constructor() {
//     super()
//     this.state = {
//       notes: [],
//       newNote: '',
//       showAll: true,
//       error: null
//     }
//   }

//   componentWillMount() {
//     noteService
//       .getAll()
//       .then(notes => {
//         this.setState({ notes })
//       })
//   }

//   toggleVisible = () => {
//     this.setState({ showAll: !this.state.showAll })
//   }

//   addNote = (event) => {
//     event.preventDefault()
//     const noteObject = {
//       content: this.state.newNote,
//       date: new Date(),
//       important: Math.random() > 0.5
//     }

//     noteService
//       .create(noteObject)
//       .then(newNote => {
//         this.setState({
//           notes: this.state.notes.concat(newNote),
//           newNote: ''
//         })
//       })
//   }

//   toggleImportanceOf = (id) => {
//     return () => {
//       const note = this.state.notes.find(n => n.id === id)
//       const changedNote = { ...note, important: !note.important }

//       noteService
//         .update(id, changedNote)
//         .then(changedNote => {
//           this.setState({
//             notes: this.state.notes.map(note => note.id !== id ? note : changedNote)
//           })
//         })
//         .catch(error => {
//           this.setState({
//             error: `muistiinpano '${note.content}' on jo valitettavasti poistettu palvelimelta`,
//             notes: this.state.notes.filter(n => n.id !== id)
//           })
//           setTimeout(() => {
//             this.setState({ error: null })
//           }, 50000)
//         })
//     }
//   }

//   handleNoteChange = (event) => {
//     console.log(event.target.value)
//     this.setState({ newNote: event.target.value })
//   }

//   render() {
//     const notesToShow =
//       this.state.showAll ?
//         this.state.notes :
//         this.state.notes.filter(note => note.important === true)

//     const label = this.state.showAll ? 'vain tärkeät' : 'kaikki'

//     return (
//       <div>
//         <h1>Muistiinpanot</h1>
//         <Notification message={this.state.error} />
//         <div>
//           <button onClick={this.toggleVisible}>
//             näytä {label}
//           </button>
//         </div>
//         <ul>
//           {notesToShow.map(note =>
//             <Note
//               key={note.id}
//               note={note}
//               toggleImportance={this.toggleImportanceOf(note.id)}
//             />)}
//         </ul>
//         <form onSubmit={this.addNote}>
//           <input
//             value={this.state.newNote}
//             onChange={this.handleNoteChange}
//           />
//           <button type="submit">tallenna</button>
//         </form>
//       </div>
//     )
//   }
// }

export default App
