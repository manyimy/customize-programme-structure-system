import React, { Component } from 'react';
import './psTable.css';
// import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

// const useStyles = makeStyles({
//   table: {
//     minWidth: 650,
//   },
// });

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default class PSTable extends Component {

    render() {           
        return (
            <div>
            {/* <ReactHTMLTableToExcel
                id="test-table-xls-button"
                className="download-table-xls-button"
                table="table-to-xls"
                filename="tablexls"
                sheet="tablexls"
                buttonText="Download as XLS"/> */}
            <table id="table-to-xls">
                <tr>
                    <th colSpan={2} rowSpan={3}></th>
                    <th colSpan={6}>Beta Level</th>
                    <th colSpan={6}>Gamma Level</th>
                    <th colSpan={6}>Delta Level</th>
                </tr>
                <tr>
                    <th colSpan={2}>2021 July</th>
                    <th colSpan={2}>2021 November</th>
                    <th colSpan={2}>2022 April</th>
                    <th colSpan={2}>2022 July</th>
                    <th colSpan={2}>2022 November</th>
                    <th colSpan={2}>2023 April</th>
                    <th colSpan={2}>2023 July</th>
                    <th colSpan={2}>2023 November</th>
                    <th colSpan={2}>2024 April</th>
                </tr>
                <tr>
                    <th>Trimester 1</th>
                    <th>CH</th>
                    <th>Trimester 2</th>
                    <th>CH</th>
                    <th>Trimester 3</th>
                    <th>CH</th>
                    <th>Trimester 1</th>
                    <th>CH</th>
                    <th>Trimester 2</th>
                    <th>CH</th>
                    <th>Trimester 3</th>
                    <th>CH</th>
                    <th>Trimester 1</th>
                    <th>CH</th>
                    <th>Trimester 2</th>
                    <th>CH</th>
                    <th>Trimester 3</th>
                    <th>CH</th>
                </tr>
                <tr>
                    <td colSpan={2} rowSpan={5}>Core</td>
                </tr>
                <tr>
                    <td>TMA1101 Calculus</td>
                    <td>4</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td rowSpan={14}>TPT2201 Industrial Training</td>
                    <td rowSpan={14}>4</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>TCP1201</td>
                    <td>4</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>TSE2101</td>
                    <td>4</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>TPT1101</td>
                    <td>4</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td rowSpan={5}>Specialization</td>
                    <td rowSpan={4}>Core</td>
                </tr>
                <tr>
                    <td>TCP1201</td>
                    <td>4</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>TSE2101</td>
                    <td>4</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>TPT1101</td>
                    <td>4</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>                
                <tr>
                    <td>Elective</td>
                    <td>TPT1101</td>
                    <td>4</td>
                    <td>TPT1101</td>
                    <td>4</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td colSpan={2}>Elective</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td colSpan={2}>Mata Pelajaran Umum</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td colSpan={2}>Compulsory University</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td colSpan={2}>Total Courses</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td colSpan={2}>Total Credits</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                {/* <tr>
                    <td>TMA1101 Calculus</td>
                    <td>4</td>
                </tr>
                <tr>
                    <td>TCP1201</td>
                    <td>4</td>
                </tr>
                <tr>
                    <td>TSE2101</td>
                    <td>4</td>
                </tr>
                <tr>
                    <td>TPT1101</td>
                    <td>4</td>
                </tr> */}
                
            </table>
            </div>
            // <TableContainer style={{margin: 20}} component={Paper}>
            //     <Table style={{minWidth: 700}} size="small" aria-label="a dense table">
            //         <TableHead>
            //         <TableRow>
            //             <TableCell>Dessert (100g serving)</TableCell>
            //             <TableCell align="right">Calories</TableCell>
            //             <TableCell align="right">Fat&nbsp;(g)</TableCell>
            //             <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            //             <TableCell align="right">Protein&nbsp;(g)</TableCell>
            //         </TableRow>
            //         </TableHead>
            //         <TableBody>
            //         {rows.map((row) => (
            //             <TableRow key={row.name}>
            //             <TableCell component="th" scope="row">
            //                 {row.name}
            //             </TableCell>
            //             <TableCell align="right">{row.calories}</TableCell>
            //             <TableCell align="right">{row.fat}</TableCell>
            //             <TableCell align="right">{row.carbs}</TableCell>
            //             <TableCell align="right">{row.protein}</TableCell>
            //             </TableRow>
            //         ))}
            //         </TableBody>
            //     </Table>
            // </TableContainer>
        );
    }
}