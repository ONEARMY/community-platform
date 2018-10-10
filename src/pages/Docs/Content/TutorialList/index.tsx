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
  layout: {
    width: "auto",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    padding: `${theme.spacing.unit * 4}px 0`,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  link: {
    textDecoration: "none"
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
  }
};

class TutorialList extends React.Component {
  constructor(props: any) {
    super(props);
  }
  public render() {
    return (
      <React.Fragment>
        <div style={styles.layout}>
          <Grid container spacing={40}>
            {TUTORIALS_MOCK.map((card: any, index: number) => (
              <Grid item key={index} sm={6} md={4} lg={3}>
                <Link to={`/docs/${card.slug}`} style={styles.link}>
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
        </div>
        <Link to={`/docs/create`} style={styles.link}>
          <Button variant="outlined" color="primary">
            Create tutorial
          </Button>
        </Link>
      </React.Fragment>
    );
  }
}

export default TutorialList;
