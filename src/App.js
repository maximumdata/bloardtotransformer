import React from 'react';
import './App.css';

const fetchResponse = async ({ key, input }) => {
  try {
    const response = await fetch('https://api.mikedettmer.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key, input })
    });

    if (!response.ok) {
      throw Error(response.status);
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
}

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = { key: '', input: '', response: null, submittedInput: null, inputError: null, apiError: null };
  }

  onSubmit = async (event) => {
    event.preventDefault();
    if (!this.state.key || !this.state.input) {
      this.setState({ inputError: true });
      return;
    }
    if (!this.state.loading) {
      this.setState({ loading: true, submittedInput: this.state.input, response: null });
      try {
        const { text } = await fetchResponse(this.state);
        this.setState({ response: text });
      } catch (error) {
        this.setState({ apiError: error.message });
      } finally {
        this.setState({ loading: false });
      }
    }
  }

  keyChangeHandler = (event) => {
    this.setState({ key: event.target.value.trim(), inputError: false, apiError: false });
  }

  inputChangeHandler = (event) => {
    this.setState({ input: event.target.value, inputError: false });
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-sm-12">
            <div className="centered">
              <h1>Bloard To Transformer</h1>
              <p>
                Type in some stuff and an AI will finish it for you. Y'all already know what it is.
              </p>
            </div>
          </div>
        </div>
        <div className={this.state.loading ? 'loading': ''}></div>
        <div>
          <div className={`row`}>
            <div className="hidden-md-down col-lg-2"></div>
            <div className="col-md-12 col-lg-4">
              <p>
                You'll need the current password for this to work. To get it, say <b>!api</b> in the bloard chat discord, and bloardman will reply with the current day's password.
              </p>
              <p>
                Note: The password resets daily at <b>00:01 UTC</b>, so be sure to grab the latest password every day that you use this.
              </p>
              <p className="money">
                Hey, please keep in mind that this costs me (mike, haunted_shrub on bloard) money every time you use it. It's not a lot of money, but it will add up if you submit this 100 times a day for multiple days, etc.
              </p>
            </div>
            <div className="col-md-12 col-lg-4">
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <label htmlFor="apiKey">Password:</label>
                  <input type="text" className="form-control" id="apiKey" placeholder="Enter password" name="apiKey" onChange={this.keyChangeHandler}/>
                </div>
                <div className="form-group">
                  <label htmlFor="input">Prompt:</label>
                  <textarea type="text" className="form-control" id="input" placeholder="Enter prompt" name="input" onChange={this.inputChangeHandler}/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
              </form>
              {this.state.inputError && 
                <div className="alert alert-danger" role="alert">Make sure you've entered both the password and some input buddy</div>
              }
              {this.state.apiError && this.state.apiError === '401' && 
                <div className="alert alert-danger" role="alert">The server says you have the wrong password. Make sure to say <b>!api</b> in the bloard discord to get the latest one.</div>
              }
              {this.state.apiError && this.state.apiError !== '401' && 
                <div className="alert alert-danger" role="alert">Something bad happened, I'm sorry. Tell mike about this please.</div>
              }
            </div>
            <div className="hidden-md-down col-lg-2"></div>
          </div>
          <div className="row">
            <div className="hidden-md-down col-lg-2"></div>
            <div className="col-md-12 col-lg-8">
              <h2>Completion:</h2>
              <div className="output">
                {!this.state.loading && this.state.response &&
                  <div>
                    <span id="submittedInput">{
                      this.state.submittedInput &&
                      this.state.submittedInput.split("\n").map((i,key, arr) => {
                        if(key && arr[key+1]) {
                          return <div key={key} id={key}>{i}</div>;
                        } else {
                          return i;
                        }
                      })}</span>
                    <span>{
                      this.state.response &&
                      this.state.response.split("\n").map((i,key) => {
                        if(key) {
                          return <p key={key} id={key}>{i}</p>;
                        } else {
                          return i;
                        }
                      })}
                    </span>
                  </div>
                }
              </div>
            </div>
            <div className="hidden-md-down col-lg-2"></div>
          </div>
        </div>
        {/* <div className="footer">
          made with hate and a small brain by your pal, <a href="https://twitter.com/yoitsmiked">mike</a>
        </div> */}
      </div>
    );
  }
}



export default Form;
