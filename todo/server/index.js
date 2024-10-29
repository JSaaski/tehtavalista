import express from 'express';
import cors from 'cors';
import pkg from 'pg';


const port = 3001;
const { Pool } = pkg;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.post('/create',(req,res) => {
    const pool = openDb();

    pool.query('INSERT INTO task (description) VALUES ($1) returning *', 
        [req.body.description],
         (error, result) => {
            if (error) {
                return res.status(500).json({error: error.message});
            }
            return res.status(200).json({id: result.rows[0].id});
        }
    )
})

app.delete('/delete/:id',(req,res) => {
    const pool = openDb();
    const id = parseInt(req.params.id);
    pool.query('DELETE FROM task where id = $1',
    [id],
    (error, result) => {
        if (error) {
            return res.status(500).json({error: error.message});
        }
        return res.status(200).json({id: id});
        }
    )
    })

app.get('/',(req,res) => {
    const pool = openDb();

    pool.query('SELECT * FROM task', (error, result) => {
        if (error) {
            return res.status(500).json({error: error.message});
        }
        return res.status(200).json(result.rows);
    })
})


const openDb = () => {
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'todo',
        password: 'xxxx',
        port: 5432
    })
    return pool
}
app.listen(port);