import * as React from "react";
import { RouteComponentProps } from "react-router";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import Typography from "@material-ui/core/Typography";
import ImageGallery from "react-image-gallery";
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
    const preloadedImagesForSlider = [];
    for (const image of step.images) {
      const imageObj = new Image();
      imageObj.src = image;
      preloadedImagesForSlider.push({
        original: imageObj.src,
        thumbnail: imageObj.src
      });
    }
    return <ImageGallery items={preloadedImagesForSlider} />;
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
        <div className="tutorial-infos__container">
          <div className="tutorial-infos__left">
            <div className="tutorial-infos__content">
              <Typography variant="h4" component="h4">
                {tutorial[0].values.tutorial_title}
              </Typography>
              <Typography component="p">
                {tutorial[0].values.tutorial_description}
              </Typography>
              <Typography component="p">
                <b>Workspace : {tutorial[0].values.workspace_name}</b>
              </Typography>
              <Typography component="p">
                <b>{tutorial[0].values.steps.length} Steps</b>
              </Typography>
              <Typography component="p">
                <b>Cost : {tutorial[0].values.tutorial_cost}</b>
              </Typography>
              <Typography component="p">
                <b>Difficulty : {tutorial[0].values.difficulty_level}</b>
              </Typography>
              <Typography component="p">
                <b>Time : {tutorial[0].values.tutorial_time}</b>
              </Typography>
              <button className="download-btn">
                <span className="icon-separator">
                  <CloudDownloadIcon />
                </span>
                Download files
              </button>
            </div>
          </div>
          <div className="tutorial-infos__right">
            <img
              src={tutorial[0].values.cover_image_url}
              alt="tutorial cover"
            />
          </div>
        </div>
        {tutorial[0].values.steps.map((step: any, index: number) => (
          <div className="step__container" key={index}>
            <Card style={styles.card} className="step__card">
              <div className="step__header">
                <Typography className="step__number" variant="h5">
                  Step {index + 1}
                </Typography>
              </div>
              <CardContent>
                <Typography className="step__title" variant="h5" component="h2">
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
    );
  }
}

export default Tutorial;
