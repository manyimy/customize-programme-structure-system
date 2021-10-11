import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import "./psTable.css";
import axios from "axios";

require("dotenv").config();

const useStyles = withStyles((theme) => ({
  container: {
    alignItem: "center",
  },
}));
export default useStyles(
  class PSTable extends Component {
    constructor(props) {
      super(props);
      this.state = {
        triMonth: [],
        triYear: [],
        triNum: [],
        Tri1PS: [],
        Tri2PS: [],
        Tri3PS: [],
        Trimesters: [],
        intakeNum: null,
      };
    }

    componentDidMount() {
      this.updateTrimester(this.props.intake, parseInt(this.props.year));
      console.log(process.env.REACT_APP_API_PATH);
      axios
        .get(process.env.REACT_APP_API_PATH + "/tri1PS.json")
        .then((response) => {
          this.setState({
            Tri1PS: response.data,
          });
        });
      axios
        .get(process.env.REACT_APP_API_PATH + "/tri2PS.json")
        .then((response) => {
          this.setState({
            Tri2PS: response.data,
          });
        });
      axios
        .get(process.env.REACT_APP_API_PATH + "/tri3PS.json")
        .then((response) => {
          this.setState({
            Tri3PS: response.data,
          });
        });
      axios
        .get(process.env.REACT_APP_API_PATH + "/trimesters.json")
        .then((response) => {
          this.setState({
            Trimesters: response.data,
          });
        });
    }

    updateTrimester(inputIntake, inputYear) {
      var triName = [];
      // 0 - APRIL
      // 1 - JULY
      // 2 - NOVEMBER
      var initNum = this.state.Trimesters.indexOf(inputIntake);
      this.setState({ intakeNum: initNum });
      for (var i = initNum; triName.length < 9; i++) {
        triName.push(this.state.Trimesters[i]);
        if (i === this.state.Trimesters.length - 1) i = -1;
      }

      var triYear = [];
      for (var j = 0, y = 0; triYear.length < 9; ) {
        triYear.push(inputYear + y);
        j++;
        if (triName[j] === "July") y++;
      }

      var n = 0;
      switch (initNum) {
        // APRIL
        case 2:
          n = 3;
          break;
        // JULY
        case 0:
          n = 1;
          break;
        // NOVEMBER
        case 1:
          n = 2;
          break;
        default:
          n = 1;
          break;
      }
      let triArray = [];
      for (let i = 0; i < 9; i++) {
        triArray.push(n++);
        if (n === 4) n = 1;
      }

      this.setState({
        triMonth: triName,
        triYear: triYear,
        triNum: triArray,
      });
    }

    render() {
      const { classes } = this.props;

      return (
        <div className={classes.container}>
          {/* <div id="demo">{jsonTable()}</div> */}
          <h1>Year 1</h1>
          <table id="ps-table-y1" class="table2excel">
            <tr>
              <th>Category</th>
              <th>Subject Code</th>
              <th>Subject Name</th>
              <th>CH</th>
              <th>Trimester</th>
              <th>Month</th>
            </tr>
            {this.state.intakeNum === 0
              ? this.state.Tri1PS.map((item, index) => {
                  if (item.defaultYear === 1) {
                    return (
                      <tr>
                        <td>{item.type}</td>
                        <td>{item.code}</td>
                        <td>{item.name}</td>
                        <td>{item.ch}</td>
                        <td>{item.defaultTri}</td>
                        <td>{this.state.Trimesters[item.defaultTri - 1]}</td>
                      </tr>
                    );
                  } else {
                    return <></>;
                  }
                })
              : this.state.intakeNum === 1
              ? this.state.Tri2PS.map((item, index) => {
                  if (item.defaultYear === 1) {
                    return (
                      <tr>
                        <td>{item.type}</td>
                        <td>{item.code}</td>
                        <td>{item.name}</td>
                        <td>{item.ch}</td>
                        <td>{item.defaultTri}</td>
                        <td>{this.state.Trimesters[item.defaultTri - 1]}</td>
                      </tr>
                    );
                  } else {
                    return <></>;
                  }
                })
              : this.state.Tri3PS.map((item, index) => {
                  if (item.defaultYear === 1) {
                    return (
                      <tr>
                        <td>{item.type}</td>
                        <td>{item.code}</td>
                        <td>{item.name}</td>
                        <td>{item.ch}</td>
                        <td>{item.defaultTri}</td>
                        <td>{this.state.Trimesters[item.defaultTri - 1]}</td>
                      </tr>
                    );
                  } else {
                    return <></>;
                  }
                })}
          </table>
          <h1>Year 2</h1>
          <table id="ps-table-y2" class="table2excel">
            <tr>
              <th>Category</th>
              <th>Subject Code</th>
              <th>Subject Name</th>
              <th>CH</th>
              <th>Trimester</th>
              <th>Month</th>
            </tr>
            {this.state.intakeNum === 0
              ? this.state.Tri1PS.map((item, index) => {
                  if (item.defaultYear === 2) {
                    return (
                      <tr>
                        <td>{item.type}</td>
                        <td>{item.code}</td>
                        <td>{item.name}</td>
                        <td>{item.ch}</td>
                        <td>{item.defaultTri}</td>
                        <td>{this.state.Trimesters[item.defaultTri - 1]}</td>
                      </tr>
                    );
                  } else {
                    return <></>;
                  }
                })
              : this.state.intakeNum === 1
              ? this.state.Tri2PS.map((item, index) => {
                  if (item.defaultYear === 2) {
                    return (
                      <tr>
                        <td>{item.type}</td>
                        <td>{item.code}</td>
                        <td>{item.name}</td>
                        <td>{item.ch}</td>
                        <td>{item.defaultTri}</td>
                        <td>{this.state.Trimesters[item.defaultTri - 1]}</td>
                      </tr>
                    );
                  } else {
                    return <></>;
                  }
                })
              : this.state.Tri3PS.map((item, index) => {
                  if (item.defaultYear === 2) {
                    return (
                      <tr>
                        <td>{item.type}</td>
                        <td>{item.code}</td>
                        <td>{item.name}</td>
                        <td>{item.ch}</td>
                        <td>{item.defaultTri}</td>
                        <td>{this.state.Trimesters[item.defaultTri - 1]}</td>
                      </tr>
                    );
                  } else {
                    return <></>;
                  }
                })}
          </table>
          <h1>Year 3</h1>
          <table id="ps-table-y3" class="table2excel">
            <tr>
              <th>Category</th>
              <th>Subject Code</th>
              <th>Subject Name</th>
              <th>CH</th>
              <th>Trimester</th>
              <th>Month</th>
            </tr>
            {this.state.intakeNum === 0
              ? this.state.Tri1PS.map((item, index) => {
                  if (item.defaultYear === 3) {
                    return (
                      <tr>
                        <td>{item.type}</td>
                        <td>{item.code}</td>
                        <td>{item.name}</td>
                        <td>{item.ch}</td>
                        <td>{item.defaultTri}</td>
                        <td>{this.state.Trimesters[item.defaultTri - 1]}</td>
                      </tr>
                    );
                  } else {
                    return <></>;
                  }
                })
              : this.state.intakeNum === 1
              ? this.state.Tri2PS.map((item, index) => {
                  if (item.defaultYear === 3) {
                    return (
                      <tr>
                        <td>{item.type}</td>
                        <td>{item.code}</td>
                        <td>{item.name}</td>
                        <td>{item.ch}</td>
                        <td>{item.defaultTri}</td>
                        <td>{this.state.Trimesters[item.defaultTri - 1]}</td>
                      </tr>
                    );
                  } else {
                    return <></>;
                  }
                })
              : this.state.Tri3PS.map((item, index) => {
                  if (item.defaultYear === 3) {
                    return (
                      <tr>
                        <td>{item.type}</td>
                        <td>{item.code}</td>
                        <td>{item.name}</td>
                        <td>{item.ch}</td>
                        <td>{item.defaultTri}</td>
                        <td>{this.state.Trimesters[item.defaultTri - 1]}</td>
                      </tr>
                    );
                  } else {
                    return <></>;
                  }
                })}
          </table>
        </div>
      );
    }
  }
);
