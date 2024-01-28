import './App.css';
import { Component } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { MantineProvider, FileButton, FileInput, createTheme, Group, Text } from '@mantine/core';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});




class App extends Component {

  constructor(props) {
    // Initialize parent constructor as well
    super(props);
    this.state = {
      urls: [],
      monsterImage: { preview: "", data: ""},
      status: "",
      file:""
    }
  }

  API_URL = "http://localhost:5038"

  async handleSubmit(e) {
    //const [count, setCount] = useState(0);
    e.preventDefault()

    alert(e)
   
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
      this.setState({ status: result })
      //this.refreshPage();
    })
    console.log("Submitted")
  }

  async handleFileChange(e) {
    console.log("File Change")
    //alert(JSON.stringify(e))
    // const img = {
    //   preview: URL.createObjectURL(e.target.files[0]),
    //   data: e.target.files[0],
    // }
    // this.setState({ monsterImage: img })


    this.file = "peep";

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
      //this.refreshPage();
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
      //this.refreshPage();
    })
  }

  // async refreshPage() {
  //   fetch(this.API_URL + "/Humans").then(response => response.json())
  //     .then(data => {
  //       this.setState({ urls: data })
  //     })
  // }
  // imageUpload = File Upload for photo

  render() {
    const { monsterImage, status, file } = this.state
    return (
      
      <div className="App">
        <MantineProvider theme={{ colorScheme: "dark" }}>
          <style>@import url('https://fonts.cdnfonts.com/css/horror-type');</style>

          <div class="box">
            
            
            
        <div id="header">
          <p><span>Monster Classifer</span></p>
        </div>
        <h4>This was built using fast.ai...</h4>

        <h4>Please upload an image that you'd like to see classified as a monster or not.</h4>

        <h4>Due to limited time, the model has only been trained for .. with ....</h4>

        {monsterImage.preview && <img src={monsterImage.preview} width='100' height='100' />}

        <hr></hr>

        

       



        <form onSubmit={(event) => {this.handleSubmit(event)} }>

        <label className={Button.classes}>
        <input type='file' name='file' onChange={(event) => { this.handleFileChange(event); }
          }/>
        </label>
          

          <Button variant="text" type='submit' startIcon={<CloudUploadIcon />}>Submit</Button>
          </form>

          <hr></hr>
          <form onSubmit={(event) => {this.handleSubmit(event)} }>
            <FileButton onChange={(event) => { this.handleFileChange(event); }} accept="image/png,image/jpeg">
            {(props) => <Button {...props}>Upload image</Button>}
          </FileButton>

          </form>

          


        <FileInput type='file' name='file' onChange={(event) => { 
          this.handleFileChange(event); 
        }
          }>
 <input type='file' name='file' onChange={(event) => { this.handleFileChange(event); }
          }></input>

          </FileInput>

          </div>

          <hr></hr>

          <Button variant="text" type='submit' startIcon={<CloudUploadIcon />}>Submit</Button>



          <FileButton type='file' name='file' onChange={(event) => { this.handleFileChange(event); }
            } accept="image/png,image/jpeg">
            {(props) => <Button {...props}>Upload image</Button>}
          </FileButton>


      {file && (
        <Text size="sm" ta="center" mt="sm">
          Picked file: {file}
        </Text>
      )}




        



        {status && <h4>{status}</h4>}
        <h4>{status}</h4>
        </MantineProvider>
      </div>
     
    );
  }
}

export default App;
