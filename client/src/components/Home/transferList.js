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
}));

export default function TransferList({rightCallback}) {
  const classes = useStyles();

  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState([]);
  const [right, setRight] = React.useState([]);
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     checked: [],
  //     left: [],
  //     right: [],
  //   }
  // }

  // set the subjects from json file to the transfer list once this page is load
  useEffect(() =>{
    axios.get(process.env.REACT_APP_API_PATH + "/subjectList.json")
      .then((response) => {
        let subject = [];
        response.data.sort((a, b) => (a.code > b.code) ? 1 : ((b.code > a.code) ? -1 : 0))
          .map((value, index) => {
            return subject.push(value.code + " " + value.name);
          })
        setLeft(subject);
        // this.setState({left: subject});
      });
  }, []);

  // componentDidMount(){
  //   axios.get(process.env.REACT_APP_API_PATH + "/subjectList.json")
  //     .then((response) => {
  //       let subject = [];
  //       response.data.sort((a, b) => (a.code > b.code) ? 1 : ((b.code > a.code) ? -1 : 0))
  //         .map((value, index) => {
  //           return subject.push(value.code + " " + value.name);
  //         })
  //       this.setState({left: subject});
  //     });
  // }

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

    // this.setState({checked: newChecked});
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

    setRight(right.concat(leftChecked));
    rightCallback(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    // this.setState({left: this.state.left.concat(rightChecked).sort((a, b) => (a.code > b.code) ? 1 : ((b.code > a.code) ? -1 : 0))})
    // this.setState({right: not(this.state.right, rightChecked).sort((a, b) => (a.code > b.code) ? 1 : ((b.code > a.code) ? -1 : 0))})
    // this.setState({checked: not(this.state.checked, rightChecked)})

    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    rightCallback(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

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
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List className={classes.list} dense component="div" role="list">
        {items.map((value) => {
          if (value.split(" ", 1)[0].length >= 7) {   // to filter out the general subject types like electives or mpu (eg. E2 Elective #2)
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
          }
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
    </Grid>
  );
}