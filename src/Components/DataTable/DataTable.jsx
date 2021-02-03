import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';

import logo from '../../Assets/images/ether-logo.png';

function DataTable(props) {
    const classes = useStyles();

    const tableBody = []

    const parseDate = (timestamp) => {
        const newDate = new Date(parseInt(timestamp * 1000));
        return newDate.getDate() + '/' + (newDate.getMonth()+1) + '/' + newDate.getFullYear();
    }

    props.data.forEach((row, idx) => {
        tableBody.push(
            <TableRow  key={idx}>
                <TableCell title={row.hash}>{row.hash}</TableCell>
                <TableCell title={row.blockNumber}>
                    <Chip 
                        label={row.blockNumber}
                        className={classes.blockChip}
                    />
                </TableCell>
                <TableCell title={parseDate(row.timeStamp)}>{parseDate(row.timeStamp)}</TableCell>
                <TableCell title={row.from}>{row.from}</TableCell>
                <TableCell title={row.to}>{row.to}</TableCell>
                <TableCell 
                    title={row.value}
                >
                    <div className={classes.etherCell}>
                    {row.value} <img src={logo} alt="Ether" width="20px" height="20px"/>
                    </div>
                </TableCell>
            </TableRow>
        );
    });

    return (
        <TableContainer>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <h4> Transaction Hash</h4>
                        </TableCell>
                        <TableCell>
                            <h4> Block </h4>
                        </TableCell>
                        <TableCell>
                            <h4> Date </h4>
                        </TableCell>
                        <TableCell  >
                            <h4> From </h4>
                        </TableCell>
                        <TableCell>
                            <h4> To </h4>
                        </TableCell>
                        <TableCell>
                            <h4> Value </h4>
                        </TableCell>
                    </TableRow >
                </TableHead>

                <TableBody>
                    {tableBody}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

const useStyles = makeStyles(theme => ({
    table: {
        minWidth: 650,

      '& .MuiTableCell-root': {
            maxWidth: theme.spacing(25),
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
      },
    },
    etherCell: {
        display: 'flex',
        alignItems: 'center',

        '& img': {
            marginLeft: theme.spacing(1),
        },
    },
    blockChip: {
        backgroundColor: '#5f7ae3',
        color: 'white',
    },
}));

export default DataTable;
