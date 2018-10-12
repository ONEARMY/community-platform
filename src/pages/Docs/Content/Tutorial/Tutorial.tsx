import * as React from "react";
import { RouteComponentProps } from "react-router";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Slider from "react-slick";
import "./Tutorial.scss";

import { TUTORIALS_MOCK } from "../../../../mocks/tutorials.mock";

export interface IState {
  tutorial: {};
}

const sliderSettings = {
  centerMode: false,
  arrows: true,
  dots: true,
  infinite: true,
  speed: 500,
  customPaging: (i: any) => (
    <div
      style={{
        width: "30px",
        color: "black",
        border: "1px black solid"
      }}
    >
      {i + 1}
    </div>
  )
};

const styles = {
  card: {
    minWidth: 275,
    maxWidth: 600,
    margin: "20px auto"
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
};

class Tutorial extends React.PureComponent<RouteComponentProps<any>, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      tutorial: TUTORIALS_MOCK.filter(
        tutorial => tutorial.slug === this.props.match.params.slug
      )
    };
  }

  public renderSliderContent(step: any) {
    return (
      <Slider {...sliderSettings}>
        {step.images.map((imageUrl: any, index: any) => (
          <div key={index}>
            <img src={imageUrl} />
          </div>
        ))}
      </Slider>
    );
  }

  public renderUniqueImage(url: string) {
    return (
      <div>
        <img src={url} />
      </div>
    );
  }
  public render() {
    return (
      <div>
        <div className="tutorial-infos-container">
          <div className="tutorial-infos-left">
            <div className="content">
              <Typography variant="h5" component="h2">
                {this.state.tutorial[0].title}
              </Typography>
              <Typography component="p">
                <b>workspace : </b>
                {this.state.tutorial[0].workspace_name}
              </Typography>

              <Typography component="p">
                <b>cost : </b>
                {this.state.tutorial[0].cost}
              </Typography>
              <Typography component="p">
                <b>difficulty : </b>
                {this.state.tutorial[0].difficulty_level}
              </Typography>
              <Typography component="p">
                <b>time : </b>
                {this.state.tutorial[0].time}
              </Typography>
              <Button color="primary" variant="outlined">
                Download files
              </Button>
            </div>
          </div>
          <div className="tutorial-infos-right">
            <img src="http://placekitten.com/400/250" alt="tutorial cover" />
          </div>
          {this.state.tutorial[0].steps.map((step: any, index: number) => (
            <div key={index}>
              <Card style={styles.card}>
                <CardContent>
                  <Typography
                    style={styles.title}
                    color="textSecondary"
                    gutterBottom
                  >
                    Step {index + 1}
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {step.title}
                  </Typography>
                  <Typography component="p">{step.text}</Typography>
                  {step.images.length > 1
                    ? this.renderSliderContent(step)
                    : this.renderUniqueImage(step.images[0])}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Tutorial;
