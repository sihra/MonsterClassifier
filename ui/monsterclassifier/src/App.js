import './App.css';
import { Component } from 'react';
class App extends Component{

  constructor(props){
    // Initialize parent constructor as well
    super(props);
    this.state={
      urls:[]
    }
  }

  API_URL="http://localhost:5038"

  componentDidMount(){
    this.refreshPage();
  }

  async humanClick(){
    var image = document.getElementById("imageUpload").value;
    console.log("Uploading Image " + image)
    const data = new FormData();
    data.append("image", image);
    data.append("classification", "human");

    fetch(this.API_URL+"/postMonster",{
      method:"POST",
      body: data,
    }).then(res=>res.json()).then((result)=>{
      alert(result);
      this.refreshPage();
    })
  }

  async monsterClick(){
    var image = document.getElementById("imageUpload").value;
    console.log("Uploading Image " + image)
    const data = new FormData();
    data.append("image", image);
    data.append("classification", "monster");

    fetch(this.API_URL+"/postMonster",{
      method:"POST",
      body: data,
    }).then(res=>res.json()).then((result)=>{
      alert(result);
      this.refreshPage();
    })
  }

async refreshPage(){
  fetch(this.API_URL+"/Humans").then(response=>response.json())
  .then(data=>{
    this.setState({urls:data})
  })
}
  // imageUpload = File Upload for photo
  
  render() {
    const{urls}=this.state
    return (
      <div className="App">
        <h2>Monster Classifier</h2>
    
        <input id="imageUpload"/>&nbsp;
        <button onClick={()=>this.humanClick()}>Human</button>
        <button onClick={()=>this.monsterClick()}>Monster</button>

        {urls.map(urlm=>
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
