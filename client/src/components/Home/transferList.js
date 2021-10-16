import React from 'react';
import { withStyles } from '@material-ui/core/styles';
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

const useStyles = withStyles((theme) => ({
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

export default useStyles(class TransferList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      checked: [],
      left: [],
      right: [],
    }
  }

  // set the subjects from json file to the transfer list once this page is load
  componentDidMount(){
    axios.get(process.env.REACT_APP_API_PATH + "/subjectList.json")
      .then((response) => {
        let subject = [];
        response.data.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
          .map((value, index) => {
            return subject.push(value.code + " " + value.name);
          })
        this.setState({left: subject});
      });
    
  }

  render(){
  const { classes } = this.props;   // for the styles
  const leftChecked = intersection(this.state.checked, this.state.left);
  const rightChecked = intersection(this.state.checked, this.state.right);

  function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
  }
  
  function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
  }
  
  function union(a, b) {
    return [...a, ...not(b, a)];
  }

  const handleToggle = (value) => () => {
    const currentIndex = this.state.checked.indexOf(value);
    const newChecked = [...this.state.checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({checked: newChecked});
    // setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(this.state.checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      this.setState({checked: not(this.state.checked, items)})
      // setChecked(not(checked, items));
    } else {
      this.setState({checked: union(this.state.checked, items)})
      // setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    this.setState({right: this.state.right.concat(leftChecked).sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))})
    this.setState({left: not(this.state.left, leftChecked).sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))})
    this.setState({checked: not(this.state.checked, leftChecked)})

    // setRight(right.concat(leftChecked));
    // setLeft(not(left, leftChecked));
    // setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    this.setState({left: this.state.left.concat(rightChecked).sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))})
    this.setState({right: not(this.state.right, rightChecked).sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))})
    this.setState({checked: not(this.state.checked, rightChecked)})

    // setLeft(left.concat(rightChecked));
    // setRight(not(right, rightChecked));
    // setChecked(not(checked, rightChecked));
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
          const labelId = `transfer-list-all-item-${value}-label`;

          return (
            <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
              <ListItemIcon>
                <Checkbox
                  checked={this.state.checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value}`} />
            </ListItem>
          );
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
      <Grid item>{customList('Subject List', this.state.left)}</Grid>
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
      <Grid item>{customList('Credit Transferred Subjects', this.state.right)}</Grid>
    </Grid>
  )};
});