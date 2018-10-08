import * as React from "react";
import "./TutorialList.css";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardActions,
  CardMedia,
  CardContent,
  Grid,
  Typography
} from "@material-ui/core";
import { theme } from "../../../../themes/app.theme";

import { TUTORIALS_MOCK } from "../../../../mocks/tutorials.mock";

const styles: any = {
  appBar: {
    position: "relative"
  },
  icon: {
    marginRight: theme.spacing.unit * 2
  },
  heroUnit: {
    backgroundColor: theme.palette.background.paper
  },
  heroContent: {
    maxWidth: 600,
    margin: "0 auto",
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`
  },
  heroButtons: {
    marginTop: theme.spacing.unit * 4
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  cardMedia: {
    paddingTop: "56.25%" // 16:9
  },
  cardContent: {
    flexGrow: 1
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 6
  }
};

class TutorialList extends React.Component {
  constructor(props: any) {
    super(props);
  }
  public render() {
    return (
      <React.Fragment>
        <Grid container spacing={40}>
          {TUTORIALS_MOCK.map((card: any, index: number) => (
            <Grid item key={index} sm={6} md={4} lg={3}>
              <Link to={`/docs/${card.slug}`}>
                <Card style={styles.card}>
                  <CardMedia
                    style={styles.cardMedia}
                    image={card.cover_picture_url} // eslint-disable-line max-len
                    title="Image title"
                  />
                  <CardContent style={styles.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {card.title}
                    </Typography>
                    <Typography>{card.description}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      View
                    </Button>
                    <Button size="small" color="primary">
                      Edit
                    </Button>
                  </CardActions>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
        <Link to={`/docs/create`}>
          <Button size="medium" color="primary">
            Create tutorial
          </Button>
        </Link>
      </React.Fragment>
    );
  }
}

export default TutorialList;
