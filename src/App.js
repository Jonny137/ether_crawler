import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

// Component imports
import DataTable from "./Components/DataTable/DataTable";
import AppSearch from './Components/Search/Search';

function App() {
    const classes = useStyles();
    const [txData, setTxData] = useState([]);
    const [resEnd, setResEnd] = useState(true);
    const [page, setPage] = useState(1);

    return (
        <div className={classes.app}>
            <AppSearch 
                onSearch={data => setTxData(data)}
                onEnd={(value) => setResEnd(value)}
                page={page}
            />
            {
                txData?.length > 0 &&
                <div className={classes.table}>
                    <DataTable data={txData}/>
                    <Button 
                        variant="contained" 
                        color="primary"
                        className={classes.next}
                        disabled={resEnd}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </Button>
                </div>
            }
        </div>
    );
}

const useStyles = makeStyles(theme => ({
    app: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
    },
    table: {
        padding: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100% - 64px);'
    },
    next: {
        width: 'fit-content',
        alignSelf: 'flex-end',
        marginTop: theme.spacing(3),
    },
}));

export default App;
