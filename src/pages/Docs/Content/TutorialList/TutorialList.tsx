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
  Typography,
  IconButton
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CommentIcon from "@material-ui/icons/Comment";
import TurnedInIcon from "@material-ui/icons/TurnedIn";
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
      <div>
        <Typography
          style={{ margin: "30px auto", display: "table" }}
          variant="h4"
          component="h4"
        >
          Documentation
        </Typography>

        <React.Fragment>
          <div style={styles.layout}>
            <Grid container spacing={40}>
              {TUTORIALS_MOCK.map((card: any, index: number) => (
                <Grid item key={index} xs={4}>
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
                        <Typography>by {card.workspace_name}</Typography>
                      </CardContent>
                      <CardActions>
                        <Typography>PRECIOUS PLASTIC</Typography>
                        <div
                          style={{
                            marginLeft: "auto"
                          }}
                        >
                          <IconButton>
                            <Typography style={{ marginRight: "5px" }}>
                              {Math.trunc(Math.random() * (60 - 4) + 4) + " "}
                            </Typography>
                            <TurnedInIcon />
                          </IconButton>
                          <IconButton>
                            <Typography style={{ marginRight: "5px" }}>
                              {Math.trunc(Math.random() * (60 - 4) + 4) + " "}
                            </Typography>
                            <CommentIcon />
                          </IconButton>
                          <IconButton>
                            <MoreVertIcon />
                          </IconButton>
                        </div>
                      </CardActions>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </div>
          <Link to={`/docs/create`} style={styles.link}>
            <Button
              variant="outlined"
              style={{
                margin: "40px auto",
                position: "relative",
                display: "flex"
              }}
              color="primary"
            >
              Create tutorial
            </Button>
          </Link>
        </React.Fragment>
      </div>
    );
  }
}

export default TutorialList;
