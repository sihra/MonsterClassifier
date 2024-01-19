import './App.css';
import { Component } from 'react';
class App extends Component {


  constructor(props) {
    // Initialize parent constructor as well
    super(props);
    this.state = {
      urls: [],
      monsterImage: { preview: "", data: ""},
      status: "",
    }
  }

  API_URL = "http://localhost:5038"

  componentDidMount() {
    this.refreshPage();
  }

  async handleSubmit(e) {
    //const [count, setCount] = useState(0);
    e.preventDefault()
   
    const data = new FormData();

    const peep = this.status

    //alert({peep})

    //alert("hi");
    
    data.append("file", this.state.monsterImage.data)
    

    this.setState({ status: "... Detecting Monster ..." })

    fetch(this.API_URL + "/postMe", {
      method: "POST",
      body: data,
    }).then(res => res.json()).then((result) => {
      //this.status = (result.statusText)
      this.setState({ status: result.statusText })
      //alert(result);
      //this.refreshPage();
    })
    console.log("Submitted")
  }

  async handleFileChange(e) {
    console.log("File Change")
    // const img = {
    //   preview: URL.createObjectURL(e.target.files[0]),
    //   data: e.target.files[0],
    // }
    // this.setState({ monsterImage: img })



    // this.setState((status) =>{
    //   return "testing fured"
    // });

    const peep = this.status

    //alert({peep} + " hello")

    this.setState({
      monsterImage: {
        //...this.state.monsterImage, 
        preview: URL.createObjectURL(e.target.files[0]), 
        data: e.target.files[0]
        }
    },
    function() {
      console.log("setState completed", this.state)
    });

    
    //this.monsterImage = img
    console.log("File Change")

  }

  async humanClick() {
    var image = document.getElementById("imageUpload").value;
    console.log("Uploading Image " + image)
    const data = new FormData();
    data.append("image", image);
    data.append("classification", "human");

    fetch(this.API_URL + "/postMonster", {
      method: "POST",
      body: data,
    }).then(res => res.json()).then((result) => {
      alert(result);
      this.refreshPage();
    })
  }

  async monsterClick() {
    var image = document.getElementById("imageUpload").value;
    console.log("Uploading Image " + image)
    const data = new FormData();
    data.append("image", image);
    data.append("classification", "monster");

    fetch(this.API_URL + "/postMonster", {
      method: "POST",
      body: data,
    }).then(res => res.json()).then((result) => {
      alert(result);
      this.refreshPage();
    })
  }

  async refreshPage() {
    fetch(this.API_URL + "/Humans").then(response => response.json())
      .then(data => {
        this.setState({ urls: data })
      })
  }
  // imageUpload = File Upload for photo

  render() {
    const { urls, monsterImage, status } = this.state
    return (
      <div className="App">
        <h2>Reformatted Monster Classifier</h2>
        <h1>Upload to server</h1>

        {monsterImage.preview && <img src={monsterImage.preview} width='100' height='100' />}

        <hr></hr>
        <form onSubmit={(event) => {this.handleSubmit(event)} }>
          <input type='file' name='file' onChange={(event) => { this.handleFileChange(event); }
          }></input>

          <button type='submit'>Submit</button>

        </form>
        {status && <h4>{status}</h4>}
        <h4>{status}</h4>

        <h2>Gurdev</h2>

        <h2>Monster Classifier</h2>

        <input id="imageUpload" />&nbsp;
        <button onClick={() => this.humanClick()}>Human</button>
        <button onClick={() => this.monsterClick()}>Monster</button>

        {urls.map(urlm =>
          <p>
            <b>URL: {urlm.image_url}</b>&nbsp;
            <b>Classification: {urlm.classification}</b>
          </p>)
        }
      </div>
    );
  }
}

export default App;
