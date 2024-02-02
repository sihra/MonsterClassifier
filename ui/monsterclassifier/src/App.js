import './App.css';
import { Component } from 'react';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Loader, MantineProvider } from '@mantine/core';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      monsterImage: { preview: "", data: "" },
      status: "",
      file: ""
    }
  }

  API_URL = "http://localhost:5038"

  async handleSubmit(e) {
    e.preventDefault()

    const data = new FormData();
    data.append("file", this.state.monsterImage.data)

    this.setState({ status: "... Detecting Monster ..." })

    fetch(this.API_URL + "/classify", {
      method: "POST",
      body: data,
    }).then(res => res.json()).then((result) => {
      this.setState({ status: result })
    })
    console.log("User Image Submitted")
  }

  async handleFileChange(e) {
    console.log("File Change Detected")

    this.setState({
      monsterImage: {
        preview: URL.createObjectURL(e.target.files[0]),
        data: e.target.files[0]
      }
    });
  }

  render() {
    const { monsterImage, status } = this.state
    return (

      <div className="App">

        <MantineProvider withGlobalStyles withNormalizeCSS>
          <style>@import url('https://fonts.cdnfonts.com/css/horror-type');</style>

          <div class="flex_box">

            <div id="header">
              <p><span>Monster Classifier</span></p>
            </div>

            <h3>Built by <a href="https://www.linkedin.com/in/gurdevsihra/">Gurdev Sihra</a></h3>
            <div class="flex_item">
              <p>
                Monster Classifier is a web application that detects where a user uploaded image is a Monster 👹 or Human 👩🏽!
              </p>
            </div>

            <div class="flex_item">
              <p>
               The server side was built with Node.js, Express, and React.js. The machine learning model was built using <a href="https://course.fast.ai/Lessons/lesson1.html">Fast.ai's Practical Deep Learning For Coders</a> Lesson 1.
                I've followed along with the classes by creating <a href="https://www.kaggle.com/gsihra">Kaggle Notebooks</a> to work with the fast.ai library.
              </p>
            </div>

            <div class="flex_item">
              <p>
                Monster Classifier uses fast.ai's 
 
                I built this model by running a Kaggle notebook that fetches 

                I created a <a href="https://docs.fast.ai/data.block.html#datablock">DataBlock</a> which is used to train the model. It helps to prepare the data for the model I built.
              </p>
            </div>

            
            <div class="flex_item">
              <p>Overall, this lesson helped me understand how to use fast.ai's tool to create a model, but a lot of my knowledge behind how it was created and fine tuned is fuzzy.
                As I continue with the course I believe I'll learn
                The documentation is bare bones but I found a lot of help through the forums.
              </p>
            </div>

            <div class="flex_item">
              <p>Due to limited time, the model has only been trained with 90 images retrieved from DuckDuckGo within 5 minutes. The model itself relies on </p>
            </div>

            <div class="flex_item">
              <h4>Please upload an image that you'd like to see classified as a monster or not.</h4>
            </div>

            <div class="center_me">
              {monsterImage.preview && <img src={monsterImage.preview} width='100' height='100' />}
            </div>
            <hr></hr>

            <form onSubmit={(event) => { this.handleSubmit(event) }}>

              <label className={Button.classes}>
                <input type='file' name='file' onChange={(event) => { this.handleFileChange(event); }
                } />
              </label>
              <Button variant="text" type='submit' startIcon={<CloudUploadIcon />}>Submit</Button>
            </form>

            <hr></hr>

          </div>

          <h4>{status}</h4>
        </MantineProvider>
      </div>

    );
  }
}

export default App;


