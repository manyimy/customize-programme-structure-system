import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
// import subjects from '../../constants/subjectList.json'
import axios from 'axios';

const ELECTIVE_LINK = "https://docs.google.com/spreadsheets/d/1MwtIxxwAKNwRmpsKMLed_0zS8sOP6hFm/edit?usp=sharing&ouid=107627496352738110283&rtpof=true&sd=true";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
  },
  cardHeader: {
    padding: theme.spacing(1, 2),
  },
  list: {
    width: 380,
    height: 300,
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
  elecLink: {
    textAlign: "right",
    alignSelf: "end",
  }
}));

export default function TransferList({right, rightCallback, left, leftCallback}) {
  const classes = useStyles();

  const [checked, setChecked] = React.useState([]);

  const not = (a, b) => {
    return a.filter((value) => b.indexOf(value) === -1);
  }
  
  const intersection = (a, b) => {
    return a.filter((value) => b.indexOf(value) !== -1);
  }
  
  const union = (a, b) => {
    return [...a, ...not(b, a)];
  }

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {

    rightCallback(right.concat(leftChecked).sort());
    leftCallback(not(left, leftChecked).sort());
    setChecked(not(checked, leftChecked).sort());
  };

  const handleCheckedLeft = () => {
    leftCallback(left.concat(rightChecked).sort());
    rightCallback(not(right, rightChecked).sort());
    setChecked(not(checked, rightChecked).sort());
  };

  const calcTotalCH = () => {
    let total = 0;
    right.forEach(element => {
      total += Number(element.substr(element.trim().length-3, 1));
    });
    return total;
  }

  const customList = (title, items) => (
    <Card>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
            disabled={items.length === 0}
            inputProps={{ 'aria-label': 'all subjects selected' }}
          />
        }
        title={title}
        subheader={(title === "Subject List") ? `${numberOfChecked(items)}/${items.length} selected` : `${items.length} subject ${calcTotalCH()} CH transferred`}
      />
      <Divider />
      <List className={classes.list} dense component="div" role="list">
        {items.map((value) => {
          // if (value.split(" ", 1)[0].length >= 7) {   // to filter out the general subject types like electives or mpu (eg. E2 Elective #2)
            const labelId = `transfer-list-all-item-${value}-label`;

            return (
              <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
                <ListItemIcon>
                  <Checkbox
                    checked={checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={`${value}`} />
              </ListItem>
            );
          // }
        })}
        <ListItem />
      </List>
    </Card>
  );

  return (
    
    <Grid
      container
      spacing={2}
      style={{justifyContent: 'center', placeItems: 'center'}}
      className={classes.root}
    >
      <Grid item xs className={classes.elecLink}>
        <a href={ELECTIVE_LINK} target="_blank">View Elective Subjects</a>
      </Grid>
      <Grid item>{customList('Subject List', left)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList('Credit Transferred Subjects', right)}</Grid>
      <Grid item xs></Grid>
    </Grid>
  );
}