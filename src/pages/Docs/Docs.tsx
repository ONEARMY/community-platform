import * as React from "react";
import "./Docs.scss";
import Content from "./Content";

import logo from "../../assets/images/logo.png";
import { db } from "../../utils/firebase";

class DocsPage extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoaded: false,
      tutorials: []
    };
  }

  public componentDidMount() {
    this.getAllTutorials();
  }

  public getAllTutorials = async () => {
    const ref = await db.collection("tutorials").get();
    const docs: any[] = ref.docs.map(doc => doc.data());
    this.setState({
      isLoaded: true,
      tutorials: docs
    });
    return docs;
  };
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          {" "}
          <img src={logo} className="App-logo" alt="logo" />
          {/* <h1 className="page-title">One army</h1>{" "} */}
        </header>{" "}
        {this.state.isLoaded && <Content allTutorials={this.state.tutorials} />}
      </div>
    );
  }
}

export default DocsPage;
