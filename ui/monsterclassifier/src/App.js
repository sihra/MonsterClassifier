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

  API_URL = "https://monsterclassifier-1.onrender.com"

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
                I've followed along with the classes by creating <a href="https://www.kaggle.com/gsihra">Kaggle Notebooks</a> to work with the Fast.ai library.
              </p>
            </div>

            <div class="flex_item">
              <p>
                Monster Classifier uses Fast.ai's resnet18 neural network model which is integrated with a large collection of data vison models in the world (at the time). This makes it a great pick because it's a general model and can handle a variety of data.


                I created a <a href="https://docs.fast.ai/data.block.html#datablock">DataBlock</a> which inputs data into this model and outlines the type of data we're expecting back (categories).

                A <a href="https://docs.fast.ai/vision.learner.html">Vision Learner</a> was used to combine the model and data that I used to train it with. Then by using the <a href="which deploys my model and returns the probability of the image uploaded being a monster!">predict method</a>, MonsterClassifier is able to return the probability of the image uploaded being a monster!
              </p>
            </div>

            <div class="flex_item">
              <p>Overall, this lesson helped me understand how to use Fast.ai's tool to use and train a model, but a lot of my knowledge behind how it was created and fine tuned is fuzzy.
                As I continue with the course I believe I'll understand the fundamental better.
                The documentation is bare bones but I found a lot of help through the forums.
              </p>
            </div>

            <div class="flex_item">
              <h4>Please upload an image that you'd like to see classified as a monster or not. Submit when you're ready...</h4>
            </div>

            <h4>{status}</h4>

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

          
          &nbsp; 
          &nbsp; 
        </MantineProvider>
      </div>

    );
  }
}

export default App;


