import * as React from "react";
import { RouteComponentProps } from "react-router";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Slider from "react-slick";
import "./Tutorial.scss";

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
    maxWidth: 900,
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

class Tutorial extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
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
    const { allTutorials } = this.props;
    const tutorial: any = allTutorials.filter(
      (currentTutorial: any) =>
        currentTutorial.values.slug === this.props.match.params.slug
    );

    return (
      <div>
        <div className="tutorial-infos-container">
          <div className="tutorial-infos-left">
            <div className="content">
              <Typography variant="h5" component="h2">
                {tutorial[0].values.tutorial_title}
              </Typography>
              <Typography component="p">
                <b>Workspace : </b>
                {tutorial[0].values.workspace_name}
              </Typography>

              <Typography component="p">
                <b>Steps : </b>
                {tutorial[0].values.steps.length}
              </Typography>
              <Typography component="p">
                <b>Cost : </b>
                {tutorial[0].values.tutorial_cost}
              </Typography>
              <Typography component="p">
                <b>Difficulty : </b>
                {tutorial[0].values.difficulty_level}
              </Typography>
              <Typography component="p">
                <b>Time : </b>
                {tutorial[0].values.tutorial_time}
              </Typography>
              <Button color="primary" variant="outlined">
                Download files
              </Button>
            </div>
          </div>
          <div className="tutorial-infos-right">
            <img
              src={tutorial[0].values.cover_image_url}
              alt="tutorial cover"
            />
          </div>
          {tutorial[0].values.steps.map((step: any, index: number) => (
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
